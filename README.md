# Brothers Home Goods E-commerce Platform

Full-stack e-commerce app with React (`client`) and Express/MySQL (`server`) for a broader Brothers Home Goods store.

## Implemented Features

### Core Storefront

- Product browsing, wider home-goods category pages, shop search/filter, product detail, add to cart
- User sign up/sign in and protected customer routes
- Checkout flow and order history
- Contact, About, and Services pages

### Admin & Staff

- Admin/employee authentication with role-based access
- Inventory, product CRUD, add employee, dashboard, and reports
- Notifications center with unread tracking

### Requested Advanced Features (Implemented)

- **Payment integration (Telebirr + M-Pesa + Simple Checkout)**: dropdown-driven checkout with mobile-wallet form fields, simulated phone confirmation, and admin-confirmed simple checkout
- **WebSocket notifications**: real-time order events (`order:processing`, `order:completed`) to customer/admin views
- **Product reviews**: per-product customer rating/comment with aggregate product rating updates
- **Inventory alerts**: auto notification to staff when stock becomes low after checkout
- **Multi-language support (i18n)**: language context, EN/AM switcher, persisted language, translated header/admin labels
- **Analytics dashboard**: advanced summary + trend reporting including monthly trend data and status distribution
- **Email notifications**: order processing, order completion, employee welcome, and marketing send flow

## Tech Stack

### Frontend

- React 19, Vite, React Router
- Bootstrap, TailwindCSS, MUI
- Axios, Socket.IO client

### Backend

- Node.js, Express
- MySQL2
- JWT auth, bcryptjs
- Socket.IO server
- Nodemailer

## Project Structure

```text
brothers-kitchenware/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sql/
│   │   └── utils/
│   ├── data/
│   └── package.json
└── README.md
```

## Setup

## Prerequisites

- Node.js 18+ recommended
- MySQL 8+

## Install

```bash
# backend
cd server
npm install

# frontend
cd ../client
npm install
```

## Server Environment (`server/.env`)

```env
PORT=5000
JWT_SECRET=change_this_secret

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=brothers_kitchenware
DB_CONNECTION_LIMIT=10
USE_MEMORY=false

# SMTP (optional; if not set, email service uses console fallback)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=no-reply@brotherskitchenware.com

# Optional payment simulation URLs
TELEBIRR_SIMULATED_URL=https://telebirr.example/checkout
CARD_SIMULATED_URL=https://payments.example/checkout
```

## Database Initialization

Run one of the following:

1. API installer route (recommended)

- Start backend then open `GET /install` or call `POST /install`

2. SQL directly

```bash
mysql -u <user> -p <db_name> < server/src/sql/initial-queries.sql
```

## Run

```bash
# terminal 1
cd server
npm run dev

# terminal 2
cd client
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## API Highlights

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/admin/auth/login`

### Checkout + Orders + Payment

- `POST /api/orders/checkout`
- `GET /api/orders/my`
- `PATCH /api/orders/:id/mobile-confirm`
- `PATCH /api/admin/orders/:id/confirm`
- `PATCH /api/admin/orders/:id/cancel`

### Reviews

- `GET /api/products/:id/reviews`
- `POST /api/products/:id/reviews`

### Notifications

- `GET /api/me/notifications`
- `PATCH /api/me/notifications/:id/read`
- `GET /api/admin/notifications`
- `PATCH /api/admin/notifications/:id/read`

### Analytics

- `GET /api/admin/analytics/summary`
- `GET /api/admin/analytics/trends`
- `GET /api/admin/dashboard/recent-sales?period=all|today|week|month|year`
- `GET /api/admin/dashboard/top-products`
- `GET /api/admin/dashboard/low-stock`

### Marketing

- `POST /api/admin/marketing/send`

## Feature Verification Checklist

Use this quick QA flow to confirm everything works:

1. **Payment (Telebirr/M-Pesa/Simple Checkout)**
   - Login as customer
   - Add product to cart and open payment page
   - Checkout with `telebirr` or `mpesa`, fill phone/full name/PIN, then confirm on the simulated phone step
   - Checkout with `Simple Checkout` and verify the order remains `processing` until admin confirmation
   - Verify payment reference/provider and final status behavior for each flow

2. **WebSocket Notifications**
   - Keep customer orders page and admin dashboard open
   - Place checkout -> admin topbar receives new notification
   - Confirm order in admin -> customer orders page auto-refreshes with completion state

3. **Product Reviews**
   - Open product detail
   - Submit rating/comment as signed-in customer
   - Verify review appears and product rating/review count updates

4. **Inventory Alerts**
   - Reduce stock of a product close to low threshold
   - Checkout that product
   - Verify admin notification for low stock and low-stock list update

5. **Multi-language (i18n)**
   - Use header language switcher (EN/AM)
   - Verify translated navbar/common/admin labels update immediately
   - Refresh page and confirm selection persists

6. **Analytics Dashboard**
   - Open admin dashboard/reports
   - Verify summary cards, monthly trends, status distribution, and top products load from DB

7. **Email Notifications**
   - Configure SMTP in `.env` (or use fallback logs)
   - Checkout and confirm order
   - Verify processing/completed emails (or fallback logs) and marketing send endpoint behavior

## Notes

- Mobile-wallet payment prompts are simulated adapters (safe placeholders) with real integration extension points.
- If MySQL is unavailable and `USE_MEMORY=true`, storefront data falls back to `server/data/catalog.json`; admin/reporting features require DB.