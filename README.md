# Safari booking and bank-transfer flow

Safari package pages collect a booking request, then staff confirm availability
and the final quote. Staff send the client bank transfer instructions for a 30%
deposit. No payment is taken online or when a client first submits a request.
The booking is marked deposit-paid only after a staff member checks the transfer
and records it in the staff portal.

## Staff booking portal

The private portal is at `/admin.html`. It uses Supabase email sign-in and only
authorizes addresses listed in `STAFF_EMAILS`; this defaults to the staff inbox.

1. Create a Supabase project and run [`supabase/schema.sql`](./supabase/schema.sql)
   in its SQL editor.
2. In Supabase Auth, invite `info@eaglepamexpeditionsandtravel.com` (and any other
   approved team members) as users. Disable public sign-ups.
3. Add the production and preview portal URLs (for example,
   `https://your-domain.example/admin.html`) to Supabase's allowed redirect URLs.
4. Configure these Vercel environment variables for the deployments that need
   the portal:
   - `SUPABASE_URL`: project URL
   - `SUPABASE_ANON_KEY`: project public/anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: server-only service role key
   - `STAFF_EMAILS`: optional comma-separated allowlist override; defaults to
     `info@eaglepamexpeditionsandtravel.com`

Never expose or commit `SUPABASE_SERVICE_ROLE_KEY`. Row-level security is enabled
on booking records; browser clients do not have direct table access.

## Staff workflow

1. A client submits the booking request; it appears in the portal and staff are
   emailed when SMTP is configured.
2. Staff check availability, enter the final amount and currency, and provide
   the correct bank transfer instructions. The portal calculates the 30%
   deposit and emails the confirmed quote and payment instructions to the client.
3. After checking the bank statement, staff click **Mark 30% deposit received**.
   The portal records the staff member and timestamp with the paid status and
   sends a confirmation email to the client when SMTP is available.

The portal does not verify bank transfers automatically. Staff must check the
incoming funds before using the paid action. Bank details are entered by staff
when confirming a quote; no account details are hard-coded into the website.

## Enquiry email

Booking requests are saved to the staff portal and emailed to
`info@eaglepamexpeditionsandtravel.com`. The Contact page also posts to
`/api/enquiry`. Configure these Vercel variables for email notifications:

- `ZOHO_USER`: verified Zoho mailbox used to send the enquiry
- `ZOHO_PASS`: that mailbox's Zoho app-specific password
- `ZOHO_HOST`: optional regional SMTP hostname; defaults to `smtp.zoho.com`
- `ENQUIRY_TO`: optional recipient override; defaults to
  `info@eaglepamexpeditionsandtravel.com`

Zoho SMTP uses secure port 465. If booking email notifications are temporarily
unavailable, saved requests remain visible in the staff portal. Redeploy after
changing Vercel environment variables.
