create extension if not exists pgcrypto;

create table if not exists public.booking_requests (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    confirmed_at timestamptz,
    confirmed_by text,
    paid_at timestamptz,
    paid_recorded_by text,
    status text not null default 'pending'
        check (status in ('pending', 'awaiting_payment', 'deposit_paid', 'cancelled')),
    payment_status text not null default 'not_started'
        check (payment_status in ('not_started', 'awaiting_bank_transfer', 'paid')),
    traveller_name text not null,
    email text not null,
    phone text not null,
    country text not null default '',
    safari text not null,
    departure_date date,
    package_option text not null default '',
    guide_language text not null default '',
    traveller_count integer not null check (traveller_count between 1 and 100),
    requested_currency text not null,
    estimated_total numeric(12, 2),
    notes text not null default '',
    final_total numeric(12, 2),
    payment_currency text,
    deposit_amount numeric(12, 2),
    payment_instructions text,
    payment_method text not null default 'bank_transfer'
        check (payment_method = 'bank_transfer')
);

create index if not exists booking_requests_created_at_idx
    on public.booking_requests (created_at desc);
create index if not exists booking_requests_status_idx
    on public.booking_requests (status);

alter table public.booking_requests enable row level security;

revoke all on public.booking_requests from anon, authenticated;
grant all on public.booking_requests to service_role;
