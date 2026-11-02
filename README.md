# Booking enquiry email setup

The booking form submits to the Vercel serverless endpoint at `/api/send-enquiry`.
The endpoint sends a formatted enquiry to `info@eaglepamexpeditionsandtravel.com`
using Zoho Mail SMTP. The visitor stays on the booking page and can reply directly
to the email address they provided.

Configure one of these sender/password pairs in the Vercel project settings for
each environment (Preview and Production). The booking endpoint accepts either
the `ZOHO_SMTP_*` names or the shared contact-form `ZOHO_*` names:

- `ZOHO_SMTP_USER` or `ZOHO_USER`: the verified Zoho mailbox used as the sender
- `ZOHO_SMTP_APP_PASSWORD` or `ZOHO_PASS`: an app-specific password for that mailbox; never commit it
- `ZOHO_SMTP_HOST`: optional SMTP hostname for the Zoho account's region; defaults to `smtp.zoho.com`
- `ZOHO_SMTP_PORT`: optional; defaults to `465` (use `587` for STARTTLS)
- `ZOHO_HOST`: optional regional SMTP hostname, used if `ZOHO_SMTP_HOST` is unset

After adding or changing environment variables, redeploy the project. The SMTP
password must only exist in Vercel's encrypted environment settings, never in the
browser code or repository.

## Contact page enquiries

The Contact page form posts JSON to `/api/enquiry`; it does not open the visitor's
email application. Nodemailer is already included as a project dependency.

Configure these Vercel environment variables for the Production environment
(and Preview too, if you want contact submissions to work on preview deployments):

- `ZOHO_USER`: the verified Zoho mailbox used to send the enquiry
- `ZOHO_PASS`: that mailbox's Zoho app-specific password
- `ZOHO_HOST`: optional regional SMTP hostname; defaults to `smtp.zoho.com`
- `ENQUIRY_TO`: optional recipient mailbox; defaults to `ZOHO_USER`

The contact API uses Zoho SMTP over secure port 465. Never add SMTP credentials
to client-side code or commit them to the repository. Redeploy after setting or
changing Vercel environment variables.