import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging

logger = logging.getLogger(__name__)

# Email configuration
EMAIL_HOST = "smtp.hostinger.com"
EMAIL_PORT = 587
EMAIL_USER = os.environ.get("TECHXAK_EMAIL", "hello@techxak.com")
EMAIL_PASSWORD = os.environ.get("TECHXAK_EMAIL_PASSWORD", "")

def get_email_footer():
    """Get email footer with techxak.com branding"""
    return """
    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #FFE4E6; text-align: center;">
        <p style="color: #666; font-size: 12px; margin: 0;">
            Created with 💖 by <a href="https://techxak.com" style="color: #FF6B9D; text-decoration: none; font-weight: bold;">techxak.com</a>
        </p>
        <p style="color: #999; font-size: 11px; margin-top: 5px;">
            Building digital experiences that matter
        </p>
    </div>
    """

def get_welcome_email_template(user_name):
    """Welcome email template"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #FFF5F7;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FF6B9D 0%, #F43F5E 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                    💖 Welcome to Cupid's Prank!
                </h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #2D1B4E; font-size: 24px; margin-bottom: 20px;">
                    Hey {user_name}! 🎉
                </h2>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    We're so excited to have you here! You've just unlocked the most fun way to ask "Will you be my Valentine?" 
                </p>
                
                <div style="background-color: #FFE5EC; border-left: 4px solid #FF6B9D; padding: 20px; border-radius: 10px; margin: 30px 0;">
                    <h3 style="color: #FF6B9D; margin-top: 0; font-size: 18px;">🎭 What you can do:</h3>
                    <ul style="color: #666; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;">Choose from 5 hilarious interactive templates</li>
                        <li style="margin-bottom: 10px;">Customize with your personal message</li>
                        <li style="margin-bottom: 10px;">Get instant shareable links</li>
                        <li style="margin-bottom: 10px;">Track responses in your dashboard</li>
                    </ul>
                </div>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    Ready to create some Valentine magic? Head to your dashboard and let's make someone smile! 😊
                </p>
                
                <div style="text-align: center;">
                    <a href="https://heartlinks-2.preview.emergentagent.com/dashboard" 
                       style="display: inline-block; background: linear-gradient(135deg, #FF6B9D 0%, #F43F5E 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
                        Go to Dashboard
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            {get_email_footer()}
        </div>
    </body>
    </html>
    """

def get_response_email_template(creator_name, to_name, response, valentine_link):
    """Email template for valentine response notification"""
    response_emoji = "💕" if response == "yes" else "🤔"
    response_text = "said YES!" if response == "yes" else "clicked No (but don't worry, they might change their mind! 😉)"
    background_color = "#E8F5E9" if response == "yes" else "#FFF3E0"
    accent_color = "#4CAF50" if response == "yes" else "#FF9800"
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #FFF5F7;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #FF6B9D 0%, #F43F5E 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                    {response_emoji} You Got a Response!
                </h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #2D1B4E; font-size: 24px; margin-bottom: 20px;">
                    Hey {creator_name}! 🎉
                </h2>
                
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    Great news! <strong>{to_name}</strong> just responded to your Valentine surprise!
                </p>
                
                <!-- Response Box -->
                <div style="background-color: {background_color}; border-left: 4px solid {accent_color}; padding: 25px; border-radius: 10px; margin: 30px 0; text-align: center;">
                    <p style="font-size: 48px; margin: 0 0 15px 0;">{response_emoji}</p>
                    <h3 style="color: {accent_color}; margin: 0; font-size: 24px; font-weight: bold;">
                        {to_name} {response_text}
                    </h3>
                </div>
                
                {'''
                <div style="background-color: #E8F5E9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p style="color: #2E7D32; margin: 0; font-size: 16px; text-align: center;">
                        🎊 Congratulations! Time to plan that special moment! 🎊
                    </p>
                </div>
                ''' if response == "yes" else '''
                <div style="background-color: #FFF3E0; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <p style="color: #E65100; margin: 0; font-size: 16px; text-align: center;">
                        💪 Don't give up! Try another template or send a sweet follow-up message!
                    </p>
                </div>
                '''}
                
                <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 30px 0 20px 0;">
                    Want to check all your valentines and responses?
                </p>
                
                <div style="text-align: center;">
                    <a href="https://heartlinks-2.preview.emergentagent.com/dashboard" 
                       style="display: inline-block; background: linear-gradient(135deg, #FF6B9D 0%, #F43F5E 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; margin-right: 10px;">
                        View Dashboard
                    </a>
                    <a href="{valentine_link}" 
                       style="display: inline-block; background: #ffffff; color: #FF6B9D; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; border: 2px solid #FF6B9D;">
                        View Valentine
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            {get_email_footer()}
        </div>
    </body>
    </html>
    """

async def send_email(to_email: str, subject: str, html_content: str):
    """Send email using aiosmtplib"""
    try:
        message = MIMEMultipart("alternative")
        message["From"] = f"Cupid's Prank <{EMAIL_USER}>"
        message["To"] = to_email
        message["Subject"] = subject
        
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)
        
        await aiosmtplib.send(
            message,
            hostname=EMAIL_HOST,
            port=EMAIL_PORT,
            username=EMAIL_USER,
            password=EMAIL_PASSWORD,
            start_tls=True,
            validate_certs=False
        )
        
        logger.info(f"Email sent successfully to {to_email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

async def send_welcome_email(user_email: str, user_name: str):
    """Send welcome email to new user"""
    subject = "Welcome to Cupid's Prank! 💖"
    html_content = get_welcome_email_template(user_name)
    return await send_email(user_email, subject, html_content)

async def send_response_notification(creator_email: str, creator_name: str, to_name: str, response: str, valentine_id: str):
    """Send email notification when someone responds to valentine"""
    valentine_link = f"https://heartlinks-2.preview.emergentagent.com/v/{valentine_id}"
    subject = f"{'💕 YES!' if response == 'yes' else '🤔 Response'} {to_name} responded to your Valentine!"
    html_content = get_response_email_template(creator_name, to_name, response, valentine_link)
    return await send_email(creator_email, subject, html_content)
