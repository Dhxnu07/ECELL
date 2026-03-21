from celery import shared_task
import time

@shared_task
def generate_qr_code_for_ticket(ticket_id):
    # Dummy implementation for generating a QR code
    print(f"Generating QR Code for Ticket {ticket_id}...")
    time.sleep(2)
    # Normally we would use qrcode library, save to io.BytesIO(), 
    # and save to the ticket instance's ImageField
    return f"QR Code generated for {ticket_id}"

@shared_task
def send_automated_email(user_email, subject, body):
    # Dummy implementation for sending an email
    print(f"Sending email to {user_email} with subject '{subject}'...")
    time.sleep(1)
    # Normally we would use django.core.mail.send_mail
    return f"Email sent to {user_email}"
