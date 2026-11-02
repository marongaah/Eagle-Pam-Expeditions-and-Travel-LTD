# Safari booking enquiries

The safari booking form opens the visitor's default email app with a formatted
trip and contact overview addressed to `info@eaglepamexpeditionsandtravel.com`.
The visitor reviews the draft and presses Send in their email app. No Zoho or
ZeptoMail server credentials are needed for this booking form.

## Contact page enquiries

The Contact page form posts JSON to `/api/enquiry`; it does not open the visitor's
email application. That separate endpoint continues to use Zoho SMTP.

Configure these Vercel environment variables for the Production environment
(and Preview too, if you want contact submissions to work on preview deployments):

- `ZOHO_USER`: the verified Zoho mailbox used to send the enquiry
- `ZOHO_PASS`: that mailbox's Zoho app-specific password
- `ZOHO_HOST`: optional regional SMTP hostname; defaults to `smtp.zoho.com`
- `ENQUIRY_TO`: optional recipient mailbox; defaults to `ZOHO_USER`

The contact API uses Zoho SMTP over secure port 465. Never add SMTP credentials
to client-side code or commit them to the repository. Redeploy after setting or
changing Vercel environment variables.