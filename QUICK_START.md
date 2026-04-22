# ⚡ GlowWise Quick Start (5 Minutes)

## 🎯 Goal
Get GlowWise running locally in 5 minutes

---

## ✅ Step 1: Prerequisites (1 min)

Make sure you have:
- ✅ Node.js 16+ installed ([nodejs.org](https://nodejs.org))
- ✅ npm (comes with Node)
- ✅ A Firebase account (free tier) - [firebase.google.com](https://firebase.google.com)

Check versions:
```bash
node --version    # Should be v16 or higher
npm --version     # Should be v8 or higher
```

---

## ✅ Step 2: Clone/Download Project (30 sec)

### Option A: Via GitHub (if already pushed)
```bash
git clone https://github.com/YOUR_USERNAME/glowwise.git
cd glowwise
```

### Option B: Manual Download
1. Download the `glowwise/` folder
2. Open terminal in that folder
3. Continue to Step 3

---

## ✅ Step 3: Install Dependencies (2 min)

```bash
npm install
```

This downloads all packages. Takes 1-2 minutes.

---

## ✅ Step 4: Set Up Firebase (1 min 30 sec)

### Get Firebase Credentials

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create Project" → Name it "glowwise"
3. Once created, go to **Project Settings** (gear icon)
4. Click **Your Apps** → Click **Web App**
5. Copy the `firebaseConfig` object

### Add to .env

1. In project folder, open (or create) `.env` file
2. Copy this template and fill in your Firebase values:

```env
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
```

3. Save the file

### Enable Firestore

Back in Firebase Console:
1. Go to **Firestore Database**
2. Click **Create Database**
3. Start in **Test Mode** (for development)
4. Choose region → **us-central1**
5. Click **Create**

### Enable Authentication

In Firebase Console:
1. Go to **Authentication**
2. Click **Sign-in method**
3. Enable **Email/Password**
4. Click **Save**

---

## ✅ Step 5: Start Development Server (1 min)

```bash
npm start
```

The app opens automatically at **http://localhost:3000**

---

## 🎉 You're Done!

You should see:
- ✅ GlowWise landing page
- ✅ "Get Started" button
- ✅ Fully functional app

---

## 🧪 Quick Test

1. Click **"Get Started"**
2. Sign up with test email (e.g., `test@example.com`)
3. Complete the 9-step onboarding
4. You should see the Dashboard with **Glow Score**

---

## 📱 What You Can Do Now

✅ Sign up & login  
✅ Complete onboarding  
✅ View dashboard  
✅ Take daily check-ins  
✅ Chat with AI Coach (mock responses)  
✅ View insights & charts  
✅ Adjust settings  

---

## ⏭️ Next Steps

After confirming it works locally:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial GlowWise"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub
   - Add `.env` variables
   - Deploy

3. **Add Your Domain:**
   - Buy `glowwise.app` domain
   - Point to Vercel
   - Done! Live at glowwise.app

---

## 🆘 Troubleshooting

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Firebase not found"
- Check `.env` file exists
- Check values are correct (copy-paste from Firebase)
- Restart server: `npm start`

### "Blank white screen"
- Open DevTools (F12) → Console
- Look for red errors
- Check Firebase credentials

### "Can't sign up"
- Did you enable Email/Password in Firebase?
- Check Firestore exists

---

## 📞 Need Help?

1. Check **SETUP_AND_DEPLOYMENT.md** (detailed guide)
2. Check **README.md** (project overview)
3. Check Firebase docs: https://firebase.google.com/docs
4. Check React docs: https://react.dev

---

## ✨ You Now Have a Wellness App!

**Total setup time: ~5 minutes**

From here:
- Test all features locally
- Add your OpenAI API key when ready
- Deploy to production
- Launch to users

---

**Built with 💚 for wellness**
