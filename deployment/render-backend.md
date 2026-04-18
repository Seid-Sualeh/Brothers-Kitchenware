# Render Deployment for Backend

## Prerequisites

- Render account (https://render.com)
- GitHub repository
- Clever Cloud database (already configured)

## Deployment Steps

### 1. Create Render Account

1. Go to https://render.com
2. Sign up or log in

### 2. Connect Repository

1. Click "New" > "Web Service"
2. Connect your GitHub repository
3. Select the repository

### 3. Configure Service

- **Name**: `brothers-kitchenware-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your deployment branch)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Environment Variables

Add these in the Environment section:

```
DB_HOST=byk61gbrzvbtehe2ghi6-mysql.services.clever-cloud.com
DB_USER=uz9awptewyhjefsx
DB_PASSWORD=IEFMjzL003w9fZ4RfEoV
DB_NAME=byk61gbrzvbtehe2ghi6
DB_PORT=3306
JWT_SECRET=change_this_secret
DB_CONNECTION_LIMIT=10
USE_MEMORY=false
NODE_ENV=production
```

### 5. Advanced Settings

- **Health Check Path**: `/api/install` (optional)
- **Auto-Deploy**: Enable for automatic deployments on git push

### 6. Deploy

- Click "Create Web Service"
- Render will build and deploy your backend
- Your backend will be available at `https://your-service-name.onrender.com`

## Notes

- **Free tier**: 750 hours/month, sleeps after 15 minutes of inactivity
- **WebSockets**: Fully supported for real-time features
- **Database**: Connected to your Clever Cloud MySQL database
- **Scaling**: Can upgrade to paid plans for more resources

## Updating Environment Variables

If you need to change environment variables after deployment:

1. Go to your service dashboard
2. Click "Environment"
3. Update variables
4. Redeploy manually or push a commit to trigger auto-deploy

## Troubleshooting

- Check logs in the Render dashboard
- Ensure database credentials are correct
- Verify Clever Cloud database is accessible from external connections</content>
  <parameter name="filePath">c:\Users\pc\Desktop\Brothers-Kitchenware\deployment\render-backend.md
