# Frontend Deployment Guide

## Environment Variables Configuration

### For Netlify Deployment

You need to set the following environment variables in your Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add the following variables:

```
VITE_API_BASE_URL=https://fixfinder-backend-zrn7.onrender.com/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_TIMEOUT=60000
VITE_NODE_ENV=production
```

**⚠️ IMPORTANT**: `VITE_API_TIMEOUT=60000` (60 seconds) is required for Render free tier deployments. Render's free tier has cold starts that can take 30-60 seconds. If you set it lower (e.g., 10000), you'll get timeout errors.

### For Local Development

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_TIMEOUT=30000
VITE_NODE_ENV=development
```

**Note**: For local development, 30 seconds is usually sufficient. For production on Render free tier, use 60000 (60 seconds).

## Backend Environment Variables

### For Render Deployment

Set these environment variables in your Render dashboard:

```
CORS_ORIGIN=https://fix-frontend.netlify.app
FRONTEND_URL=https://fix-frontend.netlify.app
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

## Google Maps API Configuration

### ⚠️ CRITICAL: Fix "PERMISSION_DENIED" Error in Production

**Error Message**: `PERMISSION_DENIED: Error in searchByText: Requests from referer https://fix-frontend.netlify.app/ are blocked.`

**Cause**: Your Google Maps API key has HTTP referrer restrictions that don't include your production domain.

**Solution**: Add your production domain to the API key restrictions in Google Cloud Console.

### Setting up Google Maps API for Production

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Go to **"APIs & Services"** → **"Credentials"**
   - Find and click on your API key (the one you're using in production)
   - Click **"EDIT API KEY"** (pencil icon)

2. **Configure HTTP Referrer Restrictions** (REQUIRED):
   - Under **"Application restrictions"**, select **"HTTP referrers (web sites)"**
   - Click **"ADD AN ITEM"** for each referrer
   - Add these referrers (one per line):
     ```
     https://fix-frontend.netlify.app/*
     https://fix-frontend.netlify.app
     http://localhost:*
     https://localhost:*
     http://localhost:5173/*
     http://localhost:8080/*
     ```
   - **Important**: Include both `https://fix-frontend.netlify.app/*` (with wildcard) and `https://fix-frontend.netlify.app` (without wildcard)

3. **Configure API Restrictions**:
   - Under **"API restrictions"**, select **"Restrict key"**
   - Check the following APIs (REQUIRED for Places search):
     - ✅ **Maps JavaScript API** (required)
     - ✅ **Places API** (required for `searchByText` - this is what's failing!)
     - ✅ **Geocoding API** (optional but recommended)

4. **Save Changes**:
   - Click **"SAVE"** at the bottom
   - **Note**: Changes may take a few minutes to propagate (usually 1-5 minutes)

5. **Verify**:
   - Wait 2-5 minutes after saving
   - Refresh your production site
   - Try using the location search again
   - Check browser console - the error should be gone

## Troubleshooting

### Common Issues

1. **API Timeout Errors** ⚠️ **CRITICAL FOR RENDER FREE TIER**:
   - **Error**: `timeout of 10000ms exceeded` or `ECONNABORTED`
   - **Cause**: Render free tier has cold starts (30-60 seconds). 10 second timeout is too short.
   - **Solution**: 
     1. Go to Netlify dashboard → Site settings → Environment variables
     2. Set `VITE_API_TIMEOUT=60000` (60 seconds)
     3. Redeploy your site
   - **Why**: Render free tier services spin down after inactivity and take 30-60 seconds to wake up. The first request after inactivity will be slow.

2. **Google Maps API "PERMISSION_DENIED" Error** ⚠️ **MOST COMMON**:
   - **Error**: `PERMISSION_DENIED: Error in searchByText: Requests from referer https://fix-frontend.netlify.app/ are blocked.`
   - **Solution**: 
     1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
     2. Edit your API key
     3. Under "Application restrictions", add `https://fix-frontend.netlify.app/*` and `https://fix-frontend.netlify.app`
     4. Under "API restrictions", ensure **Places API** is enabled
     5. Save and wait 2-5 minutes
   - **See**: "Google Maps API Configuration" section above for detailed steps

3. **CORS Errors**: Make sure your frontend URL is included in the backend's CORS configuration

4. **Environment Variables**: Ensure all required environment variables are set in both frontend and backend

5. **API Base URL**: Verify that the API base URL points to your deployed backend

6. **WebSocket Connection Errors**: These are usually harmless warnings. The app will fall back to polling if WebSocket fails.

7. **Cloudflare Turnstile Errors** ⚠️ **SIGNUP ISSUES**:
   - **Error**: `[Cloudflare Turnstile] Error: 106010` or `400 Bad Request` from `challenges.cloudflare.com`
   - **Cause**: Content Security Policy (CSP) is blocking Cloudflare Turnstile scripts used by Clerk for bot protection
   - **Solution**: 
     1. The `_headers` file has been updated to allow Cloudflare domains
     2. Rebuild and redeploy your site: `npm run build` then redeploy to Netlify
     3. Verify the CSP includes: `https://challenges.cloudflare.com` and `https://*.cloudflare.com` in `script-src`, `connect-src`, and `frame-src`
   - **Alternative**: If issues persist, check your Clerk dashboard to ensure your domain (`https://fix-frontend.netlify.app`) is properly configured

8. **Twilio Voice WebSocket Errors** ⚠️ **CALLING ISSUES**:
   - **Error**: `[TwilioVoice][WSTransport] WebSocket received error` or `ConnectionDisconnected (53001)`
   - **Cause**: Content Security Policy (CSP) is blocking Twilio WebSocket connections needed for voice calls
   - **Solution**: 
     1. The `_headers` file has been updated to allow Twilio domains
     2. Rebuild and redeploy your site: `npm run build` then redeploy to Netlify
     3. Verify the CSP includes: `https://*.twilio.com`, `wss://*.twilio.com`, and `https://media.twilio.com` in `connect-src`
     4. Also ensure `https://*.twilio.com` is in `script-src` if Twilio loads any scripts
   - **Note**: Twilio Voice SDK requires WebSocket connections (wss://) to Twilio's signaling servers for call setup

### Debug Steps

1. Check browser console for API configuration logs
2. Verify network requests in browser dev tools
3. Check backend logs for authentication and CORS issues
4. Test API endpoints directly using Postman or curl

## Testing API Endpoints

You can test your API endpoints using Postman:

```
GET https://fixfinder-backend-zrn7.onrender.com/api/bookings/my
Headers:
  X-User-ID: your_user_id
  X-User-Type: client
  Content-Type: application/json
```
