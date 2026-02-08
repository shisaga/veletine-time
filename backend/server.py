from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
import httpx
from datetime import datetime, timezone, timedelta
import razorpay
import hmac
import hashlib
from email_service import send_welcome_email, send_response_notification

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client
razorpay_client = razorpay.Client(auth=(os.environ.get('RAZORPAY_KEY_ID', ''), os.environ.get('RAZORPAY_KEY_SECRET', '')))

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime

class ValentineTemplate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    template_id: str
    name: str
    description: str
    interaction_type: str

class Valentine(BaseModel):
    model_config = ConfigDict(extra="ignore")
    valentine_id: str
    user_id: str
    template_id: str
    from_name: str
    to_name: str
    message: str
    emoji_style: str
    background_theme: str
    unique_link: str
    payment_status: str
    payment_id: Optional[str] = None
    response: Optional[str] = None
    response_at: Optional[datetime] = None
    created_at: datetime

class ValentineCreate(BaseModel):
    template_id: str
    from_name: str
    to_name: str
    message: str
    emoji_style: str = "cute"
    background_theme: str = "pink"

class PaymentCreate(BaseModel):
    valentine_id: str
    amount: int
    currency: str
    bundle_type: Optional[str] = "single"  # single, bundle_3, bundle_5

class PaymentVerify(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    valentine_id: str

class ValentineResponse(BaseModel):
    response: str

# Helper function to get pricing based on timezone
def get_regional_pricing_by_timezone(timezone_str: str) -> dict:
    """Get pricing based on timezone"""
    # India and neighboring countries timezones
    south_asian_timezones = [
        "Asia/Kolkata", "Asia/Calcutta",  # India
        "Asia/Karachi",  # Pakistan
        "Asia/Dhaka",  # Bangladesh
        "Asia/Colombo",  # Sri Lanka
        "Asia/Kathmandu",  # Nepal
        "Asia/Thimphu",  # Bhutan
        "Indian/Maldives",  # Maldives
        "Asia/Kabul"  # Afghanistan
    ]
    
    if timezone_str in south_asian_timezones:
        return {
            "currency": "INR",
            "symbol": "₹",
            "region": "South Asia",
            "single": 9.99,
            "bundle_3": 24.99,  # ₹8.33/link - Save 16%
            "bundle_5": 34.99   # ₹7/link - Save 30%
        }
    else:
        return {
            "currency": "USD",
            "symbol": "$",
            "region": "International",
            "single": 2.99,
            "bundle_3": 7.49,   # $2.50/link - Save 16%
            "bundle_5": 10.49   # $2.10/link - Save 30%
        }

# Helper function to get user from session token
async def get_user_from_token(token: Optional[str]) -> Optional[Dict]:
    if not token:
        return None
    
    session_doc = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session_doc:
        return None
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one({"user_id": session_doc["user_id"]}, {"_id": 0})
    return user_doc

# Auth routes
@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange session_id for user data and session_token"""
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="X-Session-ID header required")
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        data = resp.json()
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    existing_user = await db.users.find_one({"email": data["email"]}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": data["name"],
                "picture": data.get("picture"),
            }}
        )
    else:
        user_doc = {
            "user_id": user_id,
            "email": data["email"],
            "name": data["name"],
            "picture": data.get("picture"),
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(user_doc)
    
    session_token = data["session_token"]
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return user_doc

@api_router.get("/auth/me")
async def get_current_user(
    session_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = None
):
    """Get current user from session token"""
    token = session_token
    if not token and authorization:
        token = authorization.replace("Bearer ", "")
    
    user = await get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return user

@api_router.post("/auth/logout")
async def logout(response: Response, session_token: Optional[str] = Cookie(None)):
    """Logout user"""
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}

# Template routes
@api_router.get("/templates")
async def get_templates():
    """Get all valentine templates"""
    templates = [
        {
            "template_id": "runaway_no",
            "name": "The Runaway No",
            "description": "The No button runs away from the cursor!",
            "interaction_type": "runaway"
        },
        {
            "template_id": "emotional_damage",
            "name": "Emotional Damage",
            "description": "Sad messages and dimming screen when hovering No",
            "interaction_type": "emotional"
        },
        {
            "template_id": "guilt_trip",
            "name": "Guilt Trip Deluxe",
            "description": "Each No click makes Yes bigger and messages more dramatic",
            "interaction_type": "guilt"
        },
        {
            "template_id": "puppy_eyes",
            "name": "Puppy Eyes Mode",
            "description": "Cute puppy appears with big watery eyes",
            "interaction_type": "puppy"
        },
        {
            "template_id": "destiny_mode",
            "name": "Destiny Mode",
            "description": "Loading screen shows you're meant to say YES",
            "interaction_type": "destiny"
        }
    ]
    return templates

# Valentine routes
@api_router.post("/valentines", response_model=Valentine)
async def create_valentine(
    valentine_data: ValentineCreate,
    session_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = None
):
    """Create a new valentine (requires auth)"""
    token = session_token or (authorization.replace("Bearer ", "") if authorization else None)
    user = await get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    valentine_id = f"val_{uuid.uuid4().hex[:12]}"
    unique_link = f"{valentine_id}"
    
    valentine_doc = {
        "valentine_id": valentine_id,
        "user_id": user["user_id"],
        "template_id": valentine_data.template_id,
        "from_name": valentine_data.from_name,
        "to_name": valentine_data.to_name,
        "message": valentine_data.message,
        "emoji_style": valentine_data.emoji_style,
        "background_theme": valentine_data.background_theme,
        "unique_link": unique_link,
        "payment_status": "pending",
        "payment_id": None,
        "response": None,
        "response_at": None,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.valentines.insert_one(valentine_doc)
    valentine = await db.valentines.find_one({"valentine_id": valentine_id}, {"_id": 0})
    
    if valentine and isinstance(valentine['created_at'], str):
        valentine['created_at'] = datetime.fromisoformat(valentine['created_at'])
    
    return valentine

@api_router.get("/valentines", response_model=List[Valentine])
async def get_user_valentines(
    session_token: Optional[str] = Cookie(None),
    authorization: Optional[str] = None
):
    """Get all valentines created by the user"""
    token = session_token or (authorization.replace("Bearer ", "") if authorization else None)
    user = await get_user_from_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    valentines = await db.valentines.find({"user_id": user["user_id"]}, {"_id": 0}).to_list(1000)
    
    for valentine in valentines:
        if isinstance(valentine['created_at'], str):
            valentine['created_at'] = datetime.fromisoformat(valentine['created_at'])
        if valentine.get('response_at') and isinstance(valentine['response_at'], str):
            valentine['response_at'] = datetime.fromisoformat(valentine['response_at'])
    
    return valentines

@api_router.get("/valentines/{valentine_id}")
async def get_valentine_by_id(valentine_id: str):
    """Get a specific valentine by ID (public route for receivers)"""
    # Handle demo valentine
    if valentine_id == "demo":
        return {
            "valentine_id": "demo",
            "user_id": "demo_user",
            "template_id": "runaway_no",
            "from_name": "Alex",
            "to_name": "You",
            "message": "I've been wanting to ask you this for so long... Will you be my Valentine? 💕",
            "emoji_style": "cute",
            "background_theme": "pink",
            "unique_link": "demo",
            "payment_status": "completed",
            "payment_id": "demo_payment",
            "response": None,
            "response_at": None,
            "created_at": datetime.now(timezone.utc)
        }
    
    valentine = await db.valentines.find_one({"valentine_id": valentine_id}, {"_id": 0})
    if not valentine:
        raise HTTPException(status_code=404, detail="Valentine not found")
    
    if isinstance(valentine['created_at'], str):
        valentine['created_at'] = datetime.fromisoformat(valentine['created_at'])
    if valentine.get('response_at') and isinstance(valentine['response_at'], str):
        valentine['response_at'] = datetime.fromisoformat(valentine['response_at'])
    
    return valentine

@api_router.post("/valentines/{valentine_id}/response")
async def record_valentine_response(valentine_id: str, response_data: ValentineResponse):
    """Record receiver's response to valentine"""
    valentine = await db.valentines.find_one({"valentine_id": valentine_id}, {"_id": 0})
    if not valentine:
        raise HTTPException(status_code=404, detail="Valentine not found")
    
    await db.valentines.update_one(
        {"valentine_id": valentine_id},
        {"$set": {
            "response": response_data.response,
            "response_at": datetime.now(timezone.utc)
        }}
    )
    
    return {"message": "Response recorded"}

# Payment routes
@api_router.post("/payment/pricing")
async def get_pricing(request: Request):
    """Get regional pricing based on user's timezone"""
    try:
        body = await request.json()
        timezone = body.get("timezone", "UTC")
    except:
        timezone = "UTC"
    
    pricing = get_regional_pricing_by_timezone(timezone)
    
    return {
        "timezone": timezone,
        "region": pricing["region"],
        "currency": pricing["currency"],
        "symbol": pricing["symbol"],
        "prices": {
            "single": pricing["single"],
            "bundle_3": pricing["bundle_3"],
            "bundle_5": pricing["bundle_5"]
        }
    }

@api_router.post("/payment/create-order")
async def create_payment_order(payment_data: PaymentCreate, request: Request):
    """Create Razorpay order with regional pricing"""
    try:
        # Get timezone from request body or headers
        try:
            body = await request.json()
            timezone = body.get("timezone", "UTC")
        except:
            timezone = "UTC"
        
        pricing = get_regional_pricing_by_timezone(timezone)
        
        # Get price based on bundle type
        price_map = {
            "single": pricing["single"],
            "bundle_3": pricing["bundle_3"],
            "bundle_5": pricing["bundle_5"]
        }
        
        amount = price_map.get(payment_data.bundle_type, pricing["single"])
        currency = pricing["currency"]
        
        # Razorpay expects amount in smallest currency unit (paise for INR, cents for USD)
        razorpay_amount = int(amount * 100)
        
        order_data = {
            "amount": razorpay_amount,
            "currency": currency,
            "receipt": payment_data.valentine_id,
            "notes": {
                "bundle_type": payment_data.bundle_type,
                "timezone": timezone
            }
        }
        order = razorpay_client.order.create(data=order_data)
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "bundle_type": payment_data.bundle_type,
            "display_amount": amount
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/payment/verify")
async def verify_payment(payment_data: PaymentVerify):
    """Verify Razorpay payment and update valentine status"""
    try:
        generated_signature = hmac.new(
            os.environ.get('RAZORPAY_KEY_SECRET', '').encode(),
            f"{payment_data.razorpay_order_id}|{payment_data.razorpay_payment_id}".encode(),
            hashlib.sha256
        ).hexdigest()
        
        if generated_signature != payment_data.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        await db.valentines.update_one(
            {"valentine_id": payment_data.valentine_id},
            {"$set": {
                "payment_status": "completed",
                "payment_id": payment_data.razorpay_payment_id
            }}
        )
        
        return {"message": "Payment verified successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
