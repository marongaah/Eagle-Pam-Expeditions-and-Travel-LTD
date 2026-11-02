# Safari booking enquiry email setup

The safari booking form submits to the Vercel serverless endpoint at
`/api/send-enquiry`. The endpoint sends a formatted trip and contact overview to
`info@eaglepamexpeditionsandtravel.com` through the ZeptoMail HTTPS API. Visitors
stay on the booking page; their email address is set as the reply-to address.

Configure these Vercel environment variables for Production (and Preview if
needed):

- `ZEPTOMAIL_API_TOKEN`: ZeptoMail send-mail API token; keep it private
- `ZEPTOMAIL_FROM`: verified sender address in ZeptoMail
- `ENQUIRY_TO`: optional recipient; defaults to `info@eaglepamexpeditionsandtravel.com`

`ZOHO_SMTP_USER` or `ZOHO_USER` can be used as the sender if `ZEPTOMAIL_FROM`
isn't set. The sender must be verified/configured in ZeptoMail. This endpoint
uses HTTPS rather than an SMTP connection.

After adding or changing Vercel environment variables, redeploy the project.
Never put the ZeptoMail token in browser code or commit it to the repository.

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