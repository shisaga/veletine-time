# 🎯 Project Setup & Configuration Guide

## 📋 Environment Variables

### Backend (.env)
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
RAZORPAY_KEY_ID=rzp_test_S7C3hQkIXJcYit
RAZORPAY_KEY_SECRET=eYzk5tTnqw4HybC40pILfPuu
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://heartlinks-2.preview.emergentagent.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
REACT_APP_RAZORPAY_KEY_ID=rzp_test_S7C3hQkIXJcYit
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup
```bash
cd frontend
yarn install
yarn start
```

### MongoDB
Ensure MongoDB is running on localhost:27017

## 🗂️ Project Structure

```
/app/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # React page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateValentine.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── SuccessPage.jsx
│   │   │   └── ValentinePage.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── templates/    # Interactive prank templates
│   │   │   │   ├── RunawayNo.jsx
│   │   │   │   ├── EmotionalDamage.jsx
│   │   │   │   ├── GuiltTrip.jsx
│   │   │   │   ├── PuppyEyes.jsx
│   │   │   │   └── DestinyMode.jsx
│   │   │   │
│   │   │   ├── ui/           # Shadcn UI components
│   │   │   ├── AuthCallback.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── public/
│   │   └── index.html
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
├── design_guidelines.json     # Design system from design agent
├── auth_testing.md           # Auth testing playbook
└── README.md
```

## 🎨 Design System

- **Fonts:** Fredoka (headings), Nunito (body), Caveat (accent)
- **Colors:** 
  - Primary: #FF6B9D (pink)
  - Accent: #FFC2D1
  - Background: #FFF5F7
  - Foreground: #2D1B4E (dark purple)
- **Theme:** Cartoon-style with playful animations
- **Border Style:** 4px solid with shadow (cartoon-border class)

## 🔐 Authentication Flow

1. User clicks "Sign In" → Redirected to Emergent Auth
2. Google OAuth flow
3. Callback returns session_id in URL hash
4. Frontend extracts session_id, sends to backend
5. Backend exchanges session_id for user data
6. Session token stored in httpOnly cookie
7. User redirected to dashboard

## 💳 Payment Flow

1. User creates valentine
2. Selects bundle (single, 3-link, or 5-link)
3. Timezone detected automatically
4. Regional pricing applied
5. Razorpay order created
6. Payment modal opens
7. On success, payment verified via webhook
8. Valentine status updated to "completed"
9. User gets shareable link

## 🌍 Regional Pricing Logic

**Timezone Detection:**
- Frontend: `Intl.DateTimeFormat().resolvedOptions().timeZone`
- Sent to backend with every pricing request

**South Asian Timezones:**
- Asia/Kolkata, Asia/Karachi, Asia/Dhaka, Asia/Colombo, Asia/Kathmandu, Asia/Thimphu, Indian/Maldives, Asia/Kabul
- Pricing: ₹9.99, ₹24.99, ₹34.99

**All Other Timezones:**
- Pricing: $2.99, $7.49, $10.49

## 📊 Database Schema

### Collections

**users**
```javascript
{
  user_id: String,
  email: String,
  name: String,
  picture: String,
  created_at: DateTime
}
```

**user_sessions**
```javascript
{
  user_id: String,
  session_token: String,
  expires_at: DateTime,
  created_at: DateTime
}
```

**valentines**
```javascript
{
  valentine_id: String,
  user_id: String,
  template_id: String,
  from_name: String,
  to_name: String,
  message: String,
  emoji_style: String,
  background_theme: String,
  unique_link: String,
  payment_status: String,
  payment_id: String,
  response: String,
  response_at: DateTime,
  created_at: DateTime
}
```

## 🎭 Interactive Templates

1. **Runaway No** - Button moves away on hover/click
2. **Emotional Damage** - Screen dims, sad messages appear
3. **Guilt Trip** - Yes button grows, No shrinks with each click
4. **Puppy Eyes** - Cute puppy image appears on No hover
5. **Destiny Mode** - Loading screen shows "You're meant to say YES"

## 🚦 API Endpoints

### Auth
- POST `/api/auth/session` - Exchange session_id for user data
- GET `/api/auth/me` - Get current user
- POST `/api/auth/logout` - Logout user

### Templates
- GET `/api/templates` - Get all valentine templates

### Valentines
- POST `/api/valentines` - Create valentine (auth required)
- GET `/api/valentines` - Get user's valentines (auth required)
- GET `/api/valentines/{valentine_id}` - Get valentine by ID (public)
- POST `/api/valentines/{valentine_id}/response` - Record response (public)

### Payment
- POST `/api/payment/pricing` - Get regional pricing based on timezone
- POST `/api/payment/create-order` - Create Razorpay order
- POST `/api/payment/verify` - Verify payment signature

## 🐛 Common Issues & Solutions

### Button Text Not Visible
- Ensure `text-white` class on primary buttons
- Ensure `text-foreground` class on outline buttons

### Auth Not Working
- Check cookie settings (httpOnly, secure, sameSite)
- Verify session_token in database
- Check expires_at timestamp

### Payment Fails
- Verify Razorpay keys are correct
- Check amount is in smallest unit (paise/cents)
- Verify signature calculation

### Wrong Pricing Shown
- Check timezone detection in browser console
- Verify timezone sent to backend
- Check backend pricing logic

## 🎯 Testing

### Demo Valentine
- URL: `/v/demo`
- Shows Runaway No template
- No payment required

### Manual Testing
1. Create valentine
2. Select bundle
3. Complete payment (use test card)
4. Copy link
5. Open in incognito window
6. Test interactive template
7. Click Yes/No
8. Verify response recorded

### Test Cards (Razorpay)
- Success: 4111 1111 1111 1111
- Failure: 4000 0000 0000 0002

## 📈 Future Enhancements

- Email notifications when receiver responds
- Dashboard analytics (views, response rate)
- More template options
- Video/audio messages
- Social sharing buttons
- Referral program
- Bundle link management (for multi-link bundles)

## 🔒 Security Notes

- Session tokens in httpOnly cookies
- CORS properly configured
- Payment signatures verified
- MongoDB ObjectId excluded from responses
- No sensitive data in frontend
- Environment variables for all secrets

---

Last Updated: 2026-01-05
