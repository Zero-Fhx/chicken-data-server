CREATE TYPE public.process_status_enum AS ENUM (
    'Completed',
    'Cancelled'
);

CREATE TYPE public.status_enum AS ENUM (
    'Active',
    'Inactive'
);