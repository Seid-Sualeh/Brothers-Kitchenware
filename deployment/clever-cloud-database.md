# Clever Cloud MySQL Database Setup

## Prerequisites

- Clever Cloud account (https://console.clever-cloud.com)
- Credit card (required for free tier, but won't be charged)

## Database Setup Steps

### 1. Create MySQL Add-on

1. Go to https://console.clever-cloud.com
2. Click "Create" > "Add-on"
3. Select "MySQL" from the list
4. Choose plan: **DEV** (free tier)
5. Name your database (e.g., `brothers-kitchenware-db`)
6. Select region (choose closest to your users)
7. Click "Create"

### 2. Get Connection Details

After creation:

1. Go to your add-on dashboard
2. Click "Information" tab
3. Copy these details:
   - **Host**: `your-db-host.clever-cloud.com`
   - **Database name**: `your-db-name`
   - **Username**: `your-db-user`
   - **Password**: `your-db-password`
   - **Port**: `3306`

### 3. Database Migration

You don't need to manually import data. The backend's `/api/install` route will automatically:

- Create all database tables
- Populate categories from `catalog.json`
- Insert all products from `catalog.json`

Simply ensure your database is created and accessible - the install route handles the rest.

### 4. Update Backend Environment

Use the connection details in your backend's `.env` file:

```
DB_HOST=your-db-host.clever-cloud.com
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=3306
```

## Free Tier Limits

- 256 MB RAM
- 256 MB storage
- No backup retention
- Connection limits

## Notes

- Clever Cloud provides phpMyAdmin for easy database management
- Database URL format: `mysql://user:password@host:port/database`
- Monitor your usage in the Clever Cloud dashboard
