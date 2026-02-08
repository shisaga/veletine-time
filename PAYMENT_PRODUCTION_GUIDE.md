# 💳 Payment Gateway Production Integration Guide

## 🔷 RAZORPAY PRODUCTION SETUP

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com
2. Click "Sign Up" and complete registration
3. Verify your email and phone number
4. Complete KYC (Know Your Customer) verification
   - Business PAN card
   - Business registration documents
   - Bank account details
   - GST certificate (if applicable)

### Step 2: Get Production API Keys
1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate Live Keys**
4. You'll get:
   - `Live Key ID` (starts with `rzp_live_`)
   - `Live Key Secret` (keep this SECRET!)

### Step 3: Configure Webhooks
1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Click **Create New Webhook**
3. Enter webhook URL:
   ```
   https://your-domain.com/api/payment/razorpay-webhook
   ```
4. Select events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
5. Copy the **Webhook Secret** (starts with `whsec_`)

### Step 4: Update Backend Environment Variables

**Production .env:**
```env
# Razorpay Production Keys
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET_KEY
RAZORPAY_WEBHOOK_SECRET=whsec_XXXXXXXXXX
```

### Step 5: Update Frontend Environment Variables

**Production .env:**
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

### Step 6: Enable Payment Methods
1. In Razorpay Dashboard → **Settings** → **Payment Methods**
2. Enable methods you want:
   - ✅ Cards (Visa, Mastercard, Amex, RuPay)
   - ✅ UPI (Google Pay, PhonePe, Paytm)
   - ✅ Netbanking
   - ✅ Wallets (Paytm, PayZapp, etc.)
   - ✅ EMI options

### Step 7: Set Settlement Schedule
1. Go to **Settings** → **Settlements**
2. Choose settlement schedule:
   - Daily (T+3 days) - Recommended
   - Weekly
   - Custom
3. Add bank account for settlements

### Step 8: Configure Business Details
1. **Settings** → **Business Settings**
2. Fill in:
   - Legal business name
   - Business address
   - Customer support email/phone
   - Website URL
   - Business logo

### Step 9: Test in Production
```bash
# Use real card (small amount like ₹1)
# Test cards won't work in production
```

---

## 💳 STRIPE PRODUCTION SETUP

### Step 1: Create Stripe Account
1. Go to https://stripe.com
2. Click "Sign Up"
3. Complete registration with:
   - Email address
   - Business name
   - Country (India/USA/etc.)

### Step 2: Activate Stripe Account
1. Complete business verification:
   - Business type
   - Business address
   - Tax ID (PAN for India)
   - Bank account details
   - Personal ID (Aadhaar/Passport for India)
2. Wait for approval (usually 24-48 hours)

### Step 3: Get Production API Keys
1. Login to Stripe Dashboard
2. Toggle **Test mode** OFF (top right)
3. Go to **Developers** → **API Keys**
4. You'll see:
   - `Publishable key` (starts with `pk_live_`)
   - `Secret key` (starts with `sk_live_`)

### Step 4: Configure Webhooks
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter webhook URL:
   ```
   https://your-domain.com/api/payment/stripe-webhook
   ```
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.failed`
   - `charge.refunded`
5. Copy **Signing secret** (starts with `whsec_`)

### Step 5: Update Backend Environment Variables

**Production .env:**
```env
# Stripe Production Keys
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXX
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXX
```

### Step 6: Update Frontend Environment Variables

**Production .env:**
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXX
```

### Step 7: Enable Payment Methods
1. In Stripe Dashboard → **Settings** → **Payment methods**
2. Enable:
   - ✅ Cards
   - ✅ Apple Pay
   - ✅ Google Pay
   - ✅ Link
   - ✅ UPI (for India)
   - ✅ Wallets

### Step 8: Configure Business Details
1. **Settings** → **Business settings**
2. Fill in:
   - Support email
   - Support phone
   - Business address
   - Statement descriptor (shows on customer's bank statement)

### Step 9: Set Up Bank Payout
1. **Settings** → **Bank accounts and scheduling**
2. Add your bank account
3. Choose payout schedule:
   - Daily (recommended)
   - Weekly
   - Monthly

---

## 🔧 CODE CHANGES FOR PRODUCTION

### Backend Changes Required

**1. Update server.py - Add Stripe Support**

```python
import stripe

# Initialize Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

# Razorpay client (already exists)
razorpay_client = razorpay.Client(auth=(
    os.environ.get('RAZORPAY_KEY_ID', ''),
    os.environ.get('RAZORPAY_KEY_SECRET', '')
))

# Add Stripe payment endpoint
@api_router.post("/payment/create-stripe-payment")
async def create_stripe_payment(payment_data: PaymentCreate):
    """Create Stripe payment intent"""
    try:
        pricing = get_regional_pricing_by_timezone(payment_data.timezone)
        price_map = {
            "single": pricing["single"],
            "bundle_3": pricing["bundle_3"],
            "bundle_5": pricing["bundle_5"]
        }
        
        amount = price_map.get(payment_data.bundle_type, pricing["single"])
        currency = pricing["currency"].lower()  # USD or INR
        
        # Stripe expects amount in smallest currency unit
        stripe_amount = int(amount * 100)
        
        payment_intent = stripe.PaymentIntent.create(
            amount=stripe_amount,
            currency=currency,
            metadata={
                'valentine_id': payment_data.valentine_id,
                'bundle_type': payment_data.bundle_type
            }
        )
        
        return {
            "client_secret": payment_intent.client_secret,
            "payment_intent_id": payment_intent.id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Add Stripe webhook handler
@api_router.post("/payment/stripe-webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        valentine_id = payment_intent['metadata']['valentine_id']
        
        # Update valentine payment status
        await db.valentines.update_one(
            {"valentine_id": valentine_id},
            {"$set": {
                "payment_status": "completed",
                "payment_id": payment_intent['id']
            }}
        )
    
    return {"status": "success"}
```

**2. Install Stripe Package**
```bash
cd /app/backend
pip install stripe
pip freeze > requirements.txt
```

### Frontend Changes Required

**1. Add Stripe.js to public/index.html**
```html
<script src="https://js.stripe.com/v3/"></script>
```

**2. Create Stripe Payment Component**

File: `frontend/src/components/StripePayment.jsx`
```javascript
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      console.error(error);
    } else {
      onSuccess();
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || processing}>
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function StripePayment({ clientSecret, onSuccess }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
}
```

---

## 🔒 SECURITY CHECKLIST

### ✅ Must Do:
- [ ] Never commit API keys to Git
- [ ] Use environment variables for all keys
- [ ] Enable webhook signature verification
- [ ] Use HTTPS in production (SSL certificate)
- [ ] Verify payment on backend, not just frontend
- [ ] Log all payment attempts
- [ ] Set up monitoring/alerts for failed payments
- [ ] Implement retry logic for webhook failures

### ✅ Razorpay Specific:
- [ ] Enable 2FA for Razorpay account
- [ ] Restrict API key IP addresses (if static IP)
- [ ] Monitor daily settlement reports
- [ ] Set up email alerts for large transactions

### ✅ Stripe Specific:
- [ ] Enable Radar (fraud prevention)
- [ ] Set up email alerts for disputes
- [ ] Configure 3D Secure (SCA compliance)
- [ ] Monitor dashboard for unusual activity

---

## 💰 PRICING & FEES

### Razorpay Fees (India)
- **Domestic Cards:** 2% per transaction
- **International Cards:** 3% per transaction
- **UPI:** 2% per transaction
- **Netbanking:** 2% per transaction
- **Settlement Time:** T+3 days (3 business days)
- **No setup fee, no annual fee**

### Stripe Fees
- **India (INR):**
  - Domestic cards: 2.9% + ₹2 per transaction
  - International cards: 3.9% + ₹2 per transaction
  - UPI: 2% (capped at ₹15,000)

- **USA (USD):**
  - 2.9% + $0.30 per transaction
  - No additional fees for most cards

- **Settlement Time:** 2-7 days (varies by country)

---

## 🧪 TESTING PRODUCTION

### Razorpay Test Flow
```bash
# 1. Use small amount (₹1)
# 2. Use real card or UPI
# 3. Check payment in dashboard
# 4. Verify webhook received
# 5. Check settlement schedule
```

### Stripe Test Flow
```bash
# 1. Use small amount ($0.50 or ₹10)
# 2. Use real card
# 3. Check payment in dashboard
# 4. Verify webhook received
# 5. Check payout schedule
```

---

## 📊 MONITORING & ANALYTICS

### Key Metrics to Track:
- Payment success rate
- Failed payment reasons
- Average transaction value
- Payment method preferences
- Refund rate
- Settlement delays

### Tools:
- **Razorpay Dashboard:** Real-time analytics
- **Stripe Dashboard:** Advanced analytics
- **Google Analytics:** Funnel tracking
- **Sentry/LogRocket:** Error monitoring

---

## 🚨 COMMON PRODUCTION ISSUES

### Issue 1: Payments Failing
**Causes:**
- Insufficient funds
- Card declined by bank
- 3D Secure failure
- Expired card

**Solution:**
- Provide clear error messages
- Suggest alternative payment methods
- Offer customer support contact

### Issue 2: Webhooks Not Received
**Causes:**
- Incorrect webhook URL
- Server timeout
- Firewall blocking

**Solution:**
- Test webhook URL manually
- Check server logs
- Verify webhook secret
- Add retry logic

### Issue 3: Settlements Delayed
**Causes:**
- KYC not completed
- Bank holiday
- Suspicious activity flagged

**Solution:**
- Complete all KYC documents
- Contact support
- Monitor email for alerts

---

## 📞 SUPPORT CONTACTS

### Razorpay Support
- Email: support@razorpay.com
- Phone: +91 76668 77788
- Dashboard chat support
- Response time: 24-48 hours

### Stripe Support
- Email: support@stripe.com
- Dashboard chat support (instant)
- Documentation: https://stripe.com/docs
- Response time: 1-24 hours

---

## 🎯 LAUNCH CHECKLIST

### Before Going Live:
- [ ] KYC verification completed (both gateways)
- [ ] Production API keys configured
- [ ] Webhook endpoints set up and tested
- [ ] SSL certificate installed
- [ ] Payment flow tested end-to-end
- [ ] Error handling implemented
- [ ] Email notifications working
- [ ] Refund policy documented
- [ ] Terms & conditions updated
- [ ] Customer support ready
- [ ] Monitoring/alerting configured
- [ ] Backup payment gateway ready

### Post-Launch:
- [ ] Monitor first 100 transactions closely
- [ ] Check webhook delivery success rate
- [ ] Verify settlements arriving on time
- [ ] Review customer feedback
- [ ] Optimize based on payment method preferences

---

**Remember:** Start with one payment gateway (Razorpay for India, Stripe for International), test thoroughly, then add the second one.

Last Updated: 2026-01-05
