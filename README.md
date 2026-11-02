# Booking enquiry email setup

The booking form submits to the Vercel serverless endpoint at `/api/send-enquiry`.
The endpoint sends a formatted enquiry to `info@eaglepamexpeditionsandtravel.com`
using Zoho Mail SMTP. The visitor stays on the booking page and can reply directly
to the email address they provided.

Configure these environment variables in the Vercel project settings for each
environment (Preview and Production):

- `ZOHO_SMTP_USER`: the verified Zoho mailbox used as the sender
- `ZOHO_SMTP_APP_PASSWORD`: an app-specific password for that mailbox; never commit it
- `ZOHO_SMTP_HOST`: optional SMTP hostname for the Zoho account's region; defaults to `smtp.zoho.com`
- `ZOHO_SMTP_PORT`: optional; defaults to `465` (use `587` for STARTTLS)

After adding or changing environment variables, redeploy the project. The SMTP
password must only exist in Vercel's encrypted environment settings, never in the
browser code or repository.