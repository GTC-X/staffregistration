# Staff portal

Internal admin app for managing employee profiles and generating QR codes.
When someone scans a QR code, they see a digital business profile. Built with
Next.js (App Router) and MongoDB.

## What's included

- Password-protected `/admin` area (single shared admin password)
- Staff directory: add, edit, delete employee records
- Bulk CSV import
- **QR codes** per employee — view, copy link, download PNG
- **Export Excel + QR** — spreadsheet with staff details and **embedded QR images** (not text paths)
- **Public profile page** at `/card/[id]` — shown when a QR code is scanned
- **Stable QR codes** — each employee gets a permanent `qrId`; editing name/title/contact does not change the QR
- Four built-in profile themes (navy & gold, cream & navy, charcoal & gold,
  white & navy), selectable per employee

## Local setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the env file and fill in your own values:
   ```
   cp .env.local.example .env.local
   ```
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `ADMIN_PASSWORD` — the password typed on `/login`
   - `SESSION_SECRET` — any long random string (signs the login cookie)
   - `NEXT_PUBLIC_APP_URL` — public URL used in QR codes (e.g.
     `http://localhost:3000` locally, your Vercel domain in production)
3. Run it:
   ```
   npm run dev
   ```
4. Open `http://localhost:3000` — it redirects to `/login`, then `/admin`.

## How QR codes work

1. Add employees in `/admin`
2. Open **View QR codes** — each employee has a unique QR
3. Scanning the QR opens `/card/[id]` with their digital profile
4. Use **Export Excel + QR** to download all employees with QR pictures in the file

## MongoDB Atlas setup

1. Create a free cluster at https://cloud.mongodb.com if you don't have one.
2. Under **Database Access**, create a user with a password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) if
   you're deploying to Vercel.
4. Under **Connect > Drivers**, copy the connection string into `MONGODB_URI`.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Import the repo in Vercel.
3. Add environment variables: `MONGODB_URI`, `ADMIN_PASSWORD`,
   `SESSION_SECRET`, and `NEXT_PUBLIC_APP_URL` (your Vercel domain).
4. Deploy.

## CSV import format

Any CSV with a header row works. Recognized columns: Name, Full Name,
Job Title, Company, Department, Phone, Email, Website.
