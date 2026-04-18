# Netlify Deployment for Frontend

## Prerequisites

- Netlify account (https://netlify.com)
- GitHub repository

## Deployment Steps

### 1. Connect Repository

1. Go to https://app.netlify.com
2. Click "Add new site" > "Import an existing project"
3. Connect your GitHub repository

### 2. Build Settings

- **Base directory**: `client`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 3. Environment Variables

Add these in Netlify dashboard (Site settings > Environment variables):

```
NODE_ENV=production
VITE_API_URL=https://your-backend-url.vercel.app
```

### 4. Deploy

- Netlify will auto-deploy on git push
- Your site will be available at `https://your-site-name.netlify.app`

## Custom Domain (Optional)

- Go to Site settings > Domain management
- Add custom domain or use Netlify subdomain

## Notes

- Free tier: 100GB bandwidth/month
- Automatic HTTPS included
- Form handling available if needed
