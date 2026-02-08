# 📧 Email Notifications Documentation

## Overview

Automated email notifications are sent to users at key moments in their journey with Cupid's Prank.

## Email Types

### 1. Welcome Email 💖
**Trigger:** User signs up / first login via Google OAuth

**Sent to:** New user's email

**Content:**
- Warm welcome message
- Overview of features (5 templates, customization, tracking)
- Call-to-action button to dashboard
- techxak.com branding in footer

**Subject:** "Welcome to Cupid's Prank! 💖"

### 2. Response Notification Email 
**Trigger:** When receiver clicks Yes or No on valentine page

**Sent to:** Valentine creator's email (logged-in user)

**Content:**
- **For YES response:**
  - Green success banner
  - "💕 They said YES!" message
  - Congratulations note
  - Links to dashboard and valentine page
  
- **For NO response:**
  - Orange/amber notification banner
  - "🤔 They clicked No" message
  - Encouragement message
  - Links to dashboard and valentine page

**Subject:** 
- YES: "💕 YES! {to_name} responded to your Valentine!"
- NO: "🤔 Response {to_name} responded to your Valentine!"

## Email Configuration

### SMTP Settings (Hostinger)
```
Host: smtp.hostinger.com
Port: 587
Security: STARTTLS
```

### Environment Variables
```env
TECHXAK_EMAIL=hello@techxak.com
TECHXAK_EMAIL_PASSWORD=Bitirani@123
```

## Email Templates

### Design Features
- **Responsive HTML** - Works on all devices
- **Gradient headers** - Pink to rose gradient (#FF6B9D to #F43F5E)
- **Professional layout** - Clean, centered, max-width 600px
- **Brand colors** - Matches website theme
- **Call-to-action buttons** - Prominent, rounded, gradient backgrounds
- **Footer branding** - "Created with 💖 by techxak.com"

### Footer
All emails include:
```
Created with 💖 by techxak.com
Building digital experiences that matter
```

## Technical Implementation

### Backend Module: `email_service.py`

**Functions:**
- `send_email(to_email, subject, html_content)` - Core email sender
- `send_welcome_email(user_email, user_name)` - Welcome email
- `send_response_notification(creator_email, creator_name, to_name, response, valentine_id)` - Response notification
- `get_email_footer()` - Consistent footer with techxak.com branding
- `get_welcome_email_template(user_name)` - HTML template for welcome
- `get_response_email_template(creator_name, to_name, response, valentine_link)` - HTML template for responses

### Integration Points

**1. User Signup** (`/api/auth/session`)
```python
if not existing_user:
    await send_welcome_email(data["email"], data["name"])
```

**2. Valentine Response** (`/api/valentines/{valentine_id}/response`)
```python
creator = await db.users.find_one({"user_id": valentine["user_id"]})
await send_response_notification(
    creator_email=creator["email"],
    creator_name=valentine["from_name"],
    to_name=valentine["to_name"],
    response=response_data.response,
    valentine_id=valentine_id
)
```

## Email Flow Diagram

```
User Signs Up (Google OAuth)
        ↓
  Create User in DB
        ↓
Send Welcome Email → hello@techxak.com → User's Gmail
        ↓
User Creates Valentine
        ↓
Receiver Opens Link & Clicks Yes/No
        ↓
Record Response in DB
        ↓
Send Response Email → hello@techxak.com → Creator's Gmail
```

## Testing Emails

### Test Welcome Email
1. Sign up with a new Google account
2. Check email inbox
3. Verify template rendering
4. Click "Go to Dashboard" button

### Test Response Email
1. Create a valentine as logged-in user
2. Complete payment
3. Open valentine link in incognito
4. Click YES or NO
5. Check creator's email inbox
6. Verify correct template (YES vs NO)

## Error Handling

- Emails sent asynchronously (non-blocking)
- Failures logged but don't break user flow
- If email fails, user experience continues normally
- Logger captures all email send attempts

```python
try:
    await send_welcome_email(email, name)
except Exception as e:
    logger.error(f"Failed to send welcome email: {e}")
    # User flow continues
```

## Email Delivery Times

- **Welcome Email:** Sent immediately on signup (< 2 seconds)
- **Response Email:** Sent immediately when response recorded (< 2 seconds)
- **SMTP Delivery:** Usually instant, max 1-2 minutes

## Customization

### Change Email Templates
Edit functions in `email_service.py`:
- `get_welcome_email_template()`
- `get_response_email_template()`

### Update Footer Branding
Edit `get_email_footer()` function

### Add New Email Types
1. Create new template function
2. Create new sender function
3. Add integration point in `server.py`

## Monitoring

Check email logs:
```bash
tail -f /var/log/supervisor/backend.err.log | grep -i email
```

## Common Issues

### Emails Not Sending
- Check SMTP credentials in `.env`
- Verify port 587 is open
- Check Hostinger email account is active
- Review error logs

### Emails in Spam
- Add SPF/DKIM records for techxak.com
- Use consistent "From" address
- Include unsubscribe link (future)

### Template Not Rendering
- Test HTML in email testing tool
- Check for unclosed tags
- Verify inline CSS (some clients strip `<style>`)

## Future Enhancements

- [ ] Email preferences (opt-out option)
- [ ] Digest emails (weekly summary)
- [ ] Reminder emails (valentine not completed)
- [ ] Referral emails
- [ ] Template preview emails

---

Last Updated: 2026-01-05
Built by techxak.com 💖
