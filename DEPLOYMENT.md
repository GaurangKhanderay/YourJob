# 🚀 Deployment Guide - Google Cloud Platform

This guide will help you deploy your YourJob application to Google Cloud Platform.

## Prerequisites

1. **Google Cloud Account** - Sign up at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud SDK** - Install from [cloud.google.com/sdk](https://cloud.google.com/sdk)
3. **Docker** - For containerized deployment
4. **Convex Account** - Sign up at [convex.dev](https://convex.dev)

## Step 1: Set Up Convex Backend

1. **Create a new Convex project:**
   ```bash
   npx convex dev
   ```

2. **Copy your Convex URL** from the terminal output

3. **Update environment variables:**
   ```bash
   # Update .env.local with your Convex URL
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
   ```

4. **Deploy Convex functions:**
   ```bash
   npx convex deploy
   ```

## Step 2: Set Up Google OAuth

1. **Go to Google Cloud Console:**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-app-name.appspot.com/api/auth/callback/google` (for production)

4. **Copy your Client ID and Client Secret**

## Step 3: Configure Environment Variables

Create a `.env.production` file:

```env
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
CONVEX_DEPLOYMENT=your-convex-deployment-url

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=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

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyDeURe5yb85lZRazbZLHHK4zpbPoeMHZVU

# Next.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=https://your-app-name.appspot.com

# Production URLs
NEXT_PUBLIC_APP_URL=https://your-app-name.appspot.com
NEXT_PUBLIC_API_URL=https://your-app-name.appspot.com/api
```

## Step 4: Deploy to Google Cloud

### Option A: App Engine (Recommended)

1. **Install Google Cloud SDK:**
   ```bash
   # Download and install from cloud.google.com/sdk
   gcloud init
   ```

2. **Deploy to App Engine:**
   ```bash
   # Build the application
   npm run build
   
   # Deploy to App Engine
   gcloud app deploy
   ```

3. **Your app will be available at:**
   ```
   https://your-project-id.appspot.com
   ```

### Option B: Cloud Run (Containerized)

1. **Build and push Docker image:**
   ```bash
   # Build the image
   docker build -t gcr.io/your-project-id/yourjob .
   
   # Push to Google Container Registry
   docker push gcr.io/your-project-id/yourjob
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy yourjob \
     --image gcr.io/your-project-id/yourjob \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## Step 5: Configure Custom Domain (Optional)

1. **Go to App Engine > Settings:**
   - Click "Add custom domain"
   - Follow the verification process

2. **Update DNS records:**
   - Add CNAME record pointing to your App Engine URL

## Step 6: Set Up Monitoring

1. **Enable Cloud Monitoring:**
   - Go to "Monitoring" in Google Cloud Console
   - Set up alerts for errors and performance

2. **Configure logging:**
   - View logs in "Logging" section
   - Set up log-based metrics

## Step 7: Database Seeding

After deployment, seed your database:

```bash
# Run the setup script
npm run setup

# Or manually seed
npx convex run seed:seedUsers
npx convex run seed:seedJobs
```

## Environment-Specific Configurations

### Development
```bash
npm run dev
# Runs on http://localhost:3000
```

### Production
```bash
npm run build
npm start
# Runs on configured port
```

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use Google Cloud Secret Manager for sensitive data

2. **API Keys:**
   - Rotate API keys regularly
   - Use least privilege access

3. **HTTPS:**
   - App Engine provides HTTPS by default
   - Configure security headers in `next.config.js`

## Performance Optimization

1. **Enable CDN:**
   - Use Google Cloud CDN for static assets
   - Configure caching headers

2. **Database Optimization:**
   - Use Convex indexes for better query performance
   - Implement pagination for large datasets

3. **Image Optimization:**
   - Use Next.js Image component
   - Configure image domains in `next.config.js`

## Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **Environment Variables:**
   - Check that all required variables are set
   - Verify variable names match exactly

3. **Convex Connection:**
   - Ensure Convex URL is correct
   - Check if Convex functions are deployed

4. **OAuth Issues:**
   - Verify redirect URIs match exactly
   - Check client ID and secret

### Logs

View application logs:
```bash
# App Engine logs
gcloud app logs tail

# Cloud Run logs
gcloud run services logs tail yourjob
```

## Scaling

### Automatic Scaling
- App Engine automatically scales based on traffic
- Configure min/max instances in `app.yaml`

### Manual Scaling
```bash
# Scale App Engine
gcloud app versions set-traffic default --splits=1.0

# Scale Cloud Run
gcloud run services update yourjob --concurrency=1000 --max-instances=10
```

## Backup and Recovery

1. **Database Backups:**
   - Convex provides automatic backups
   - Export data regularly for additional safety

2. **Code Backups:**
   - Use Git for version control
   - Tag releases for easy rollback

## Cost Optimization

1. **App Engine:**
   - Use automatic scaling
   - Set appropriate min instances

2. **Cloud Run:**
   - Configure concurrency limits
   - Use preemptible instances for non-critical workloads

3. **Monitoring:**
   - Set up billing alerts
   - Monitor resource usage

## Support

- **Google Cloud Documentation:** [cloud.google.com/docs](https://cloud.google.com/docs)
- **Convex Documentation:** [docs.convex.dev](https://docs.convex.dev)
- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)

---

**Your YourJob application is now ready for production! 🎉**
