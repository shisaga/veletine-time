# ✅ Production Payment Integration Checklist

## 🔷 RAZORPAY - Quick Setup (India)

### Your Action Items:

**1. Sign Up & KYC (1-2 days)**
```
→ Go to https://razorpay.com/signup
→ Complete registration
→ Upload documents:
  ✓ PAN card
  ✓ Business registration
  ✓ Bank account proof
  ✓ GST certificate
```

**2. Get API Keys (Instant after KYC)**
```
→ Login to dashboard
→ Settings → API Keys
→ Click "Generate Live Keys"
→ Copy & save securely:
  • Key ID: rzp_live_XXXXX
  • Key Secret: XXXXX
```

**3. Configure in Your App**
```bash
# Backend .env
RAZORPAY_KEY_ID=rzp_live_XXXXX
RAZORPAY_KEY_SECRET=your_secret

# Frontend .env  
REACT_APP_RAZORPAY_KEY_ID=rzp_live_XXXXX
```

**4. Set Up Webhook**
```
→ Dashboard → Webhooks
→ URL: https://your-domain.com/api/payment/verify
→ Events: payment.authorized, payment.captured
→ Copy webhook secret
```

**5. Test with Real Payment**
```
→ Use ₹1 amount
→ Pay with your card/UPI
→ Verify in dashboard
→ Check bank settlement (T+3 days)
```

---

## 💳 STRIPE - Quick Setup (Global)

### Your Action Items:

**1. Sign Up & Verification (24-48 hours)**
```
→ Go to https://stripe.com/register
→ Complete registration
→ Upload documents:
  ✓ Business details
  ✓ Tax ID (PAN for India)
  ✓ Bank account
  ✓ ID proof
→ Wait for approval email
```

**2. Get API Keys (After approval)**
```
→ Login to dashboard
→ Turn OFF test mode (top right)
→ Developers → API Keys
→ Copy & save:
  • Publishable: pk_live_XXXXX
  • Secret: sk_live_XXXXX
```

**3. Install & Configure**
```bash
# Install Stripe
cd /app/backend
pip install stripe

# Backend .env
STRIPE_SECRET_KEY=sk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX

# Frontend .env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXX
```

**4. Set Up Webhook**
```
→ Dashboard → Webhooks
→ URL: https://your-domain.com/api/payment/stripe-webhook
→ Events: payment_intent.succeeded, payment_intent.failed
→ Copy signing secret
```

**5. Test with Real Payment**
```
→ Use $0.50 or ₹10 amount
→ Pay with your card
→ Verify in dashboard
→ Check payout schedule
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Update Environment Variables
```bash
# Production server
cd /app/backend
nano .env
# Add live keys (see above)

cd /app/frontend  
nano .env
# Add live publishable keys
```

### Step 2: Restart Services
```bash
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Step 3: Test Payment Flow
```
1. Create valentine
2. Select bundle
3. Complete payment
4. Verify success
5. Check email received
6. Verify dashboard updates
```

---

## 📋 DOCUMENT REQUIREMENTS

### For Razorpay (India):
- ✓ PAN card (mandatory)
- ✓ Business registration certificate
- ✓ Cancelled cheque / bank statement
- ✓ GST certificate (if turnover > ₹20 lakh)
- ✓ Address proof
- ✓ Director's ID proof (Aadhaar/Passport)

### For Stripe (India):
- ✓ PAN card
- ✓ Business registration
- ✓ Bank account details
- ✓ Director's ID (Aadhaar/Passport)
- ✓ Business address proof

### For Stripe (USA/Global):
- ✓ EIN or SSN
- ✓ Business license (if applicable)
- ✓ Bank account details
- ✓ Government ID
- ✓ Business address

---

## 💰 COST COMPARISON

| Feature | Razorpay | Stripe |
|---------|----------|--------|
| **Setup Fee** | ₹0 | $0 |
| **Annual Fee** | ₹0 | $0 |
| **Domestic Cards (India)** | 2% | 2.9% + ₹2 |
| **International Cards** | 3% | 3.9% + ₹2 |
| **UPI** | 2% | 2% |
| **Settlement** | T+3 days | 2-7 days |
| **Support** | Email + Chat | Chat + Email |
| **Best For** | India market | Global market |

---

## 🎯 RECOMMENDED APPROACH

### Phase 1: Start with Razorpay (Week 1)
```
✓ Easier KYC for Indian businesses
✓ Lower fees for Indian cards
✓ Faster settlement (T+3)
✓ Better UPI support
✓ Already integrated in code
```

### Phase 2: Add Stripe Later (Week 2-3)
```
✓ For international customers
✓ Better for USD/EUR payments
✓ Advanced fraud prevention
✓ Global payment methods
```

---

## ⚠️ CRITICAL SECURITY RULES

```
🚫 NEVER commit API keys to GitHub
🚫 NEVER share secret keys publicly
🚫 NEVER use test keys in production
✅ ALWAYS use HTTPS in production
✅ ALWAYS verify webhooks
✅ ALWAYS log payment attempts
```

---

## 📞 QUICK SUPPORT

### Need Help?
**Razorpay:**
- Chat: dashboard.razorpay.com (bottom right)
- Email: support@razorpay.com
- Phone: +91 76668 77788

**Stripe:**
- Chat: dashboard.stripe.com (instant)
- Email: support@stripe.com
- Docs: stripe.com/docs

---

## 🔍 VERIFY EVERYTHING WORKS

### Test Checklist:
```
□ Small payment (₹1 / $0.50) completes
□ Webhook received and processed
□ Valentine status updates to "completed"
□ User gets shareable link
□ Email notification sent
□ Dashboard shows payment
□ Settlement scheduled correctly
□ Refund works (test if needed)
```

---

## 🎉 YOU'RE READY TO LAUNCH!

Once all checkboxes are ✅, you're production-ready!

**Estimated Timeline:**
- Razorpay KYC: 1-2 days
- Stripe verification: 1-3 days
- Code integration: Already done ✅
- Testing: 1-2 hours

**Total: 2-5 days from starting KYC**

---

Need help? Check PAYMENT_PRODUCTION_GUIDE.md for detailed instructions!
