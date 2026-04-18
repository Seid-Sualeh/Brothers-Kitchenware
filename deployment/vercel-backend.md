# Vercel Deployment for Backend

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub repository

## Deployment Steps

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy Backend

```bash
cd server
vercel --prod
```

Or connect via Vercel dashboard:

1. Go to https://vercel.com/dashboard
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure project:
   - **Root Directory**: `server`
   - **Build Command**: `npm run build` (if needed)
   - **Output Directory**: (leave empty for Node.js)
   - **Install Command**: `npm install`

### 3. Environment Variables

Set these in Vercel dashboard (Project Settings > Environment Variables):

```
NODE_ENV=production
PORT=3000
DB_HOST=your-clever-cloud-db-host
DB_USER=your-clever-cloud-db-user
DB_PASSWORD=your-clever-cloud-db-password
DB_NAME=your-clever-cloud-db-name
DB_PORT=3306
JWT_SECRET=your-secure-jwt-secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
MAIL_FROM=your-verified-sender@domain.com
```

### 4. Database Connection

- Use Clever Cloud MySQL connection details
- Ensure your server code handles the DATABASE_URL if provided

### 5. Deploy

- Vercel will provide a URL like `https://your-project.vercel.app`
- Update your frontend's `VITE_API_BASE_URL` with this URL

## Notes

- Vercel supports WebSocket connections
- Free tier: 100GB bandwidth, serverless functions
- Automatic scaling and HTTPS
