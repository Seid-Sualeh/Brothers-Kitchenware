# Brothers Kitchenware Deployment Guide

This guide covers deploying the Brothers Kitchenware e-commerce platform using:

- **Frontend**: Netlify
- **Backend**: Vercel
- **Database**: Clever Cloud MySQL

## 🚀 Quick Deployment Overview

### 1. Database Setup (Clever Cloud)

- Create MySQL database on Clever Cloud
- Import schema and initial data
- Note connection details

### 2. Backend Deployment (Vercel)

- Deploy Node.js/Express server to Vercel
- Configure environment variables with database connection
- **After deployment**: Call `GET https://your-backend.vercel.app/api/install` to initialize database tables and populate data
- Get backend URL

### 3. Frontend Deployment (Netlify)

- Deploy React app to Netlify
- Configure API base URL to point to Vercel backend
- Set up custom domain (optional)

## 📋 Detailed Instructions

See individual guides:

- [Frontend (Netlify)](netlify-frontend.md)
- [Backend (Vercel)](vercel-backend.md)
- [Database (Clever Cloud)](clever-cloud-database.md)

## 🔧 Environment Variables Summary

### Frontend (.env)

```
VITE_API_BASE_URL=https://your-backend.vercel.app
```

### Backend (.env)

```
NODE_ENV=production
DB_HOST=your-clever-cloud-host
DB_USER=your-clever-cloud-user
DB_PASSWORD=your-clever-cloud-password
DB_NAME=your-clever-cloud-db
DB_PORT=3306
JWT_SECRET=your-secure-random-secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
MAIL_FROM=noreply@yourdomain.com
```

## ⚠️ Important Notes

- **Order matters**: Set up database first, then backend, then frontend
- **CORS**: Update backend CORS settings for your Netlify domain
- **WebSocket**: Vercel supports WebSocket connections for real-time features
- **Free tiers**: Monitor usage limits on all platforms
- **Security**: Never commit secrets to git, use environment variables

## 🧪 Testing Deployment

After deployment:

1. Test frontend loads correctly
2. Test user registration/login
3. Test product browsing and cart
4. Test admin dashboard
5. Test payment flow (if implemented)
6. Test email notifications

## 🆘 Troubleshooting

- **Database connection issues**: Verify Clever Cloud credentials
- **API calls failing**: Check CORS settings and API URLs
- **Build failures**: Check build logs on respective platforms
- **WebSocket not working**: Ensure Vercel configuration supports WebSockets

## 📞 Support

- Netlify: https://docs.netlify.com
- Vercel: https://vercel.com/docs
- Clever Cloud: https://docs.clever-cloud.com
