# GlowWise AI - Setup & Deployment Guide

## 📋 Quick Start

This is the complete, production-ready GlowWise React application. Follow these steps to get it running.

---

## 🔧 STEP 1: LOCAL SETUP

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Git (for version control)

### Installation

```bash
# 1. Navigate to project directory
cd glowwise

# 2. Install dependencies
npm install

# 3. Create .env file from template
cp .env.example .env

# 4. Start development server
npm start
```

The app will open at `http://localhost:3000`

---

## 🔐 STEP 2: FIREBASE SETUP (CRITICAL)

GlowWise uses Firebase for database, auth, and storage. You MUST set this up.

### Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Create Project" → Name it "glowwise" → Create
3. In Project Settings → Service Accounts:
   - Click "Generate New Private Key"
   - This downloads a JSON file (keep this safe!)
4. In Project Settings → Your Apps:
   - Click "Add App" → Select "Web"
   - Copy the firebaseConfig object

### Configure Environment Variables

In `.env`, fill in your Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

### Set Up Firestore Database

1. In Firebase Console → Firestore Database → Create Database
2. Start in **Test Mode** (for development)
3. Choose region (us-central1 recommended)
4. Create

### Enable Authentication

1. In Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. (Optional) Enable Google Sign-In, Apple Sign-In

### Set Up Cloud Storage

1. In Firebase Console → Storage → Get Started
2. Start in Test Mode
3. Choose region (same as Firestore)
4. Done

### Configure Firestore Security Rules

In Firestore Console → Rules, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // User's conversations subcollection
      match /conversations/{conversationId} {
        allow read, write: if request.auth.uid == userId;
        
        // Messages within conversations
        match /messages/{messageId} {
          allow read, write: if request.auth.uid == userId;
        }
      }
      
      // User's daily check-ins subcollection
      match /dailyCheckIns/{checkInId} {
        allow read, write: if request.auth.uid == userId;
      }
      
      // User's photos subcollection
      match /photos/{photoId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

### Configure Cloud Storage Rules

In Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can only access their own files
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 🚀 STEP 3: DEVELOPMENT & TESTING

### Start Development Server

```bash
npm start
```

### Test the App

1. Go to http://localhost:3000
2. Click "Get Started" → Sign Up
3. Complete onboarding (9 steps)
4. You should see the Dashboard with Glow Score

### Debug Tips

- Open Chrome DevTools (F12)
- Check Firebase Console for real-time data
- Check Network tab for any API errors
- Check Console for JavaScript errors

---

## 📦 STEP 4: BUILD FOR PRODUCTION

```bash
npm run build
```

This creates an optimized build in the `build/` folder.

---

## 🌐 STEP 5: DEPLOY TO VERCEL

Vercel is the recommended deployment platform (free tier available).

### Deploy via GitHub

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial GlowWise commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/glowwise.git
   git push -u origin main
   ```

2. **Connect Vercel:**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "Import Project"
   - Select your glowwise repository
   - Vercel will auto-detect it's a React app

3. **Add Environment Variables:**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add all variables from your `.env`:
     - REACT_APP_FIREBASE_API_KEY
     - REACT_APP_FIREBASE_AUTH_DOMAIN
     - (all other Firebase variables)

4. **Deploy:**
   - Click "Deploy"
   - Vercel auto-deploys whenever you push to GitHub

### Default URL
Your app will be live at: `https://glowwise.vercel.app`

---

## 🎯 STEP 6: CONNECT CUSTOM DOMAIN

1. **Buy domain:** GoDaddy, Namecheap, or Google Domains
2. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter `glowwise.app`
3. **Update DNS:** Follow Vercel's DNS instructions for your registrar
4. **Wait:** DNS propagation takes 15-60 minutes

Your app is now live at: `https://glowwise.app`

---

## 🔑 STEP 7: ADD OPENAI API (After Launch)

Once you're live and have users, connect the OpenAI API for real AI responses.

### Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key

### Add to Environment

In Vercel Dashboard → Environment Variables:
```
REACT_APP_OPENAI_API_KEY=sk-YOUR_KEY_HERE
```

### Update AICoach Component

In `src/pages/AICoach.jsx`, replace the mock response section with real API calls to OpenAI.

---

## 💳 STEP 8: SET UP STRIPE (For Paid Subscriptions)

After MVP launch, add payment processing.

### Get Stripe Keys

1. Go to https://stripe.com
2. Create account → Get API keys
3. Add to environment variables:
   ```
   REACT_APP_STRIPE_PUBLIC_KEY=pk_YOUR_KEY
   ```

### Implement Payment

In future development, integrate Stripe.js for subscription management.

---

## 📋 SECURITY CHECKLIST

Before going live:

- [ ] Firebase rules are restrictive (users only access own data)
- [ ] `.env` file is in `.gitignore` (never commit secrets)
- [ ] HTTPS is enabled (Vercel does this automatically)
- [ ] Terms of Service link works
- [ ] Privacy Policy link works
- [ ] Disclaimers are visible on all health-related sections
- [ ] User can delete account (data deletion implemented)
- [ ] Data export works (GDPR compliance)

---

## 📊 MONITORING & ANALYTICS

### Firebase Analytics

Already integrated. Track engagement in:
- Firebase Console → Analytics
- See: Daily Active Users, Retention, Custom Events

### Error Monitoring

Add Sentry (optional) for error tracking:

```bash
npm install @sentry/react
```

---

## 🛠️ COMMON ISSUES & FIXES

### "Blank white screen"
- Check browser console for errors (F12)
- Verify Firebase credentials in `.env`
- Clear cache and hard refresh (Cmd+Shift+R)

### "Firebase not found"
- Verify `.env` file exists and has correct values
- Restart development server: `npm start`

### "Authentication not working"
- Check Firebase Console → Authentication → Email/Password is enabled
- Verify Firestore rules allow authentication

### "Deploy to Vercel fails"
- Make sure all environment variables are added to Vercel
- Check build log for errors
- Verify package.json scripts are correct

---

## 📚 NEXT STEPS (Post-Launch)

1. **Real OpenAI Integration:** Replace mock responses with actual API calls
2. **Stripe Payments:** Implement subscription management
3. **Email Service:** Add SendGrid/Mailgun for notifications
4. **Image Optimization:** Use Cloudinary for photo uploads
5. **Analytics Dashboard:** Add metrics for business intelligence
6. **Mobile App:** Build React Native version for iOS/Android
7. **Wearable Integration:** Connect Oura, Apple Health, Fitbit

---

## 📞 SUPPORT

For issues:
1. Check Firebase documentation: https://firebase.google.com/docs
2. Check Vercel docs: https://vercel.com/docs
3. Check React docs: https://react.dev
4. Open GitHub issue in your repository

---

## ✅ DEPLOYMENT SUMMARY

| Step | Service | Status |
|------|---------|--------|
| 1 | Local Dev | ✓ Complete |
| 2 | Firebase | ✓ Complete |
| 3 | Testing | ✓ Complete |
| 4 | Build | ✓ Complete |
| 5 | Vercel Deploy | ✓ Complete |
| 6 | Custom Domain | ✓ Complete |
| 7 | OpenAI API | ⏳ Add after launch |
| 8 | Stripe Payments | ⏳ Add later |

---

**You now have a production-ready GlowWise application deployed to glowwise.app!**

Next: Add OpenAI API for real AI responses, then market to users.
