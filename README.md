# Attendance Management

Initial MERN scaffold for role-based sign in, OTP verification, and password change flows.

## Structure

- `client`: React + Vite frontend with login, OTP, dashboard, profile, and admin registration pages.
- `server`: Express + MongoDB API with role-based auth, OTP challenge handling, and user registration.

## Default admin

- Username: `admin`
- Password: `Admin@00`

## Setup

1. Copy `server/.env.example` to `server/.env` and set your MongoDB URI and JWT secret.
2. Install dependencies from the repository root with `npm install`.
3. Seed or reset the admin account with `npm run seed:admin`.
4. Start both apps with `npm run dev`.

## Notes

- Email OTP delivery uses SMTP when `SMTP_*` variables are configured; otherwise it falls back to server logging.
- Phone OTP delivery is still a stub and needs an SMS provider such as Twilio before it can send real messages.
- HR users can view employees through the API. Admin users can register both HR and employees from the dashboard.