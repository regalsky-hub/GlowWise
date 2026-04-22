# 🌿 GlowWise AI - Personal Wellness Companion

![Status](https://img.shields.io/badge/status-MVP%20Ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 What is GlowWise?

GlowWise is a **privacy-first, AI-powered wellness platform** that helps users understand their body's signals and get personalized health guidance.

**Target Users:** Anyone 18+ seeking wellness clarity (Primary: Women 25–45)

**Core Features:**
- 💬 **AI Wellness Coach** - Chat with a personalized AI coach
- 📊 **Pattern Detection** - Discover correlations in your wellness data
- 📷 **Photo Tracking** - Visual before/after progress
- ✅ **Daily Check-in** - 2-minute wellness snapshot
- 🧠 **8+ Health Domains** - Hormones, fertility, hair, skin, brain, gut, energy, stress
- 🗑️ **Message Deletion** - Delete any message anytime (unique feature for privacy)

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Tailwind CSS |
| **Hosting** | Vercel |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth |
| **Storage** | Firebase Cloud Storage |
| **AI Integration** | OpenAI API (ready for integration) |
| **Charts** | Recharts |
| **Icons** | Lucide React |

### Project Structure

```
glowwise/
├── src/
│   ├── context/           # Auth & UserData contexts
│   ├── pages/             # Main pages (Landing, Dashboard, etc.)
│   ├── config/            # Firebase configuration
│   ├── App.jsx            # Router & main component
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── public/
│   ├── index.html         # HTML template
│   └── manifest.json      # PWA manifest
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind config
├── postcss.config.js      # PostCSS config
└── SETUP_AND_DEPLOYMENT.md # Setup instructions
```

---

## 📱 Page Overview

### Public Pages
- **Landing** (`/`) - Hero, features, pricing, FAQ
- **Signup** (`/signup`) - Email/password registration
- **Login** (`/login`) - Email/password login

### Protected Pages
- **Onboarding** (`/onboarding`) - 9-step setup wizard (displayed if not completed)
- **Dashboard** (`/dashboard`) - Glow Score, Today's Actions, quick stats
- **Daily Check-in** (`/checkin`) - 2-minute wellness assessment
- **AI Coach** (`/ai-coach`) - Chat interface with message deletion
- **Insights** (`/insights`) - Pattern detection & charts
- **Settings** (`/settings`) - Profile, notifications, privacy, data export

---

## 🎨 Design System

### Colour Palette (Sage Green Aesthetic)
```css
Primary:
- Sage Green: #6B9E7F (buttons, highlights)
- Deep Slate: #2C3E50 (headings, navigation)
- Soft Cream: #F5F3F0 (main background)

Secondary:
- Light Sage: #D4E8DD (cards, soft sections)
- Warm Taupe: #A89968 (subtle accents)
- Charcoal: #3D4A52 (body text)
```

### Typography
- **Headings:** Poppins 600-700 weight
- **Body:** Inter 400-500 weight
- **Sizing:** Follows size scale (H1: 40px, Body: 15px)

### Components
- Card-based layout with soft shadows
- Border radius: 12-16px
- Generous spacing (breathable)
- Subtle animations (150-200ms)
- WCAG 2.1 AA accessibility compliance

---

## 🔐 Security & Privacy

### Data Encryption
- All data encrypted at rest (Firebase)
- HTTPS everywhere
- User authentication required

### User Control
- Users can delete any message anytime (hard delete)
- Users can export all their data (GDPR compliance)
- Users can delete their entire account
- No third-party data sharing

### Compliance
- **GDPR:** Full EU user data compliance
- **CCPA:** Full California user data compliance
- **Non-Medical:** Clear disclaimers on all health content

---

## 📊 Database Schema

### Firestore Structure

```
users/{userId}
  ├── email
  ├── wellness_priorities[]
  ├── glowType
  ├── glowScore
  ├── notification_preferences
  ├── subscription_tier (free/wellness)
  └── onboarding_completed

  ├── conversations/{conversationId}
  │   ├── messages[]
  │   ├── created_at
  │   └── topic

  ├── dailyCheckIns/{checkInId}
  │   ├── date
  │   ├── energy (1-10)
  │   ├── sleep_hours
  │   ├── stress_level (1-10)
  │   ├── mood (1-10)
  │   └── symptoms[]

  └── photos/{photoId}
      ├── photo_url
      ├── uploaded_at
      └── ai_analysis
```

---

## 🚀 Getting Started

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up .env with Firebase credentials
cp .env.example .env
# Then fill in your Firebase config

# 3. Start dev server
npm start
```

The app runs at `http://localhost:3000`

### Production Deployment

```bash
# 1. Build for production
npm run build

# 2. Deploy to Vercel
# (See SETUP_AND_DEPLOYMENT.md for detailed instructions)
```

**Full setup guide:** See `SETUP_AND_DEPLOYMENT.md`

---

## 🔄 User Flow

### New User Journey

1. **Landing Page** - Learn about GlowWise
2. **Sign Up** - Create account with email/password
3. **Onboarding** (9 steps)
   - Welcome + disclaimer
   - Select wellness priorities
   - Describe body signals
   - Sleep & energy assessment
   - Stress & mood assessment
   - Nutrition details
   - Lifestyle habits
   - Health context (optional)
   - Notifications & optional photo
4. **Dashboard** - View Glow Score, Today's Actions
5. **Daily Check-in** - Complete 2-min wellness assessment
6. **AI Coach** - Chat with personalized coach
7. **Insights** - View patterns and trends

---

## 💡 Key Features in Detail

### Glow Score
- Calculated from: Sleep, Energy, Stress, Consistency
- Range: 0-100
- Updates daily based on check-in data
- Shows weekly trends

### Today's Actions
- Personalized 1-3 daily recommendations
- Based on user data and latest check-in
- Example: "Improve Sleep Tonight" if sleep < 7h

### Message Deletion (Unique Feature)
- Every message has a delete button
- Delete any user or AI message anytime
- Permanent hard delete from database
- Zero traces left
- **Privacy-first positioning:** "The wellness AI where you control your data"

### Pattern Detection
- Identifies correlations: Low sleep + high stress = fatigue
- Visual line charts showing trends
- Personalized insights
- Actionable recommendations

---

## 🔧 Configuration

### Environment Variables

Create `.env` file with:

```env
# Firebase
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...

# Optional (add after launch)
REACT_APP_OPENAI_API_KEY=...
```

### Tailwind Configuration

Customized in `tailwind.config.js` with:
- GlowWise color palette
- Custom font families
- Border radius utilities
- Animation definitions

---

## 📈 Metrics & Analytics

### Firebase Analytics (Built-in)
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Custom events:
  - `check_in_completed`
  - `ai_coach_message`
  - `message_deleted`
  - `photo_uploaded`

### Target Metrics (MVP)
- **Month 1:** 100 users, 5% paid conversion
- **Month 3:** 500 users, 8% paid conversion
- **Month 6:** 2,000 users, 10% paid conversion
- **Year 1:** 10,000+ users, £60k MRR

---

## 🎯 Pricing Model

| Plan | Price | Features |
|------|-------|----------|
| **Free** | £0 | 2 AI questions/day, daily check-in, read-only chat history |
| **Wellness Coach** | £4.99/month | Unlimited questions, photo uploads, full features |

---

## 🛣️ Roadmap

### Phase 1 (MVP - Complete)
- ✅ Landing page
- ✅ Authentication (email/password)
- ✅ 9-step onboarding
- ✅ Dashboard with Glow Score
- ✅ Daily check-in habit loop
- ✅ AI Coach (with mock responses)
- ✅ Message deletion (unique feature)
- ✅ Insights with pattern detection
- ✅ Settings & data management
- ✅ Mobile responsive design
- ✅ Accessibility (WCAG 2.1 AA)

### Phase 2 (Post-Launch)
- ⏳ Real OpenAI API integration
- ⏳ Photo uploads & AI analysis
- ⏳ Stripe subscription payments
- ⏳ Email notifications (SendGrid)
- ⏳ Push notifications (Firebase)
- ⏳ Advanced analytics dashboard

### Phase 3 (Future)
- ⏳ Wearable integrations (Oura, Apple Health)
- ⏳ Community features (optional)
- ⏳ Wellness courses
- ⏳ Premium reports
- ⏳ Mobile app (React Native)

---

## 🤝 Contributing

This is a private project. If you're working on GlowWise:

1. Create feature branches: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push: `git push origin feature/your-feature`
4. Create pull request for review

---

## 📄 Legal

### Compliance
- Non-medical disclaimer on all health content
- GDPR compliant (EU users)
- CCPA compliant (CA users)
- No third-party data sharing

### Disclaimer Template
```
GlowWise provides wellness guidance, not medical advice. 
It is not a substitute for professional medical advice, diagnosis, or treatment. 
Always consult a qualified healthcare provider for medical concerns.
```

---

## 📞 Support & Contact

For issues or questions:
- Check `SETUP_AND_DEPLOYMENT.md` for setup help
- Review Firebase documentation
- Check React and Vercel docs
- Create GitHub issue for bugs

---

## 📜 License

MIT License - Feel free to use for your wellness project.

---

## 🙏 Acknowledgments

- Design inspiration: Calm, Headspace, Oura
- Tech stack: React, Firebase, Vercel
- Community: React and open-source developers

---

**Built with 💚 for your wellness journey**

*Last updated: April 2026*
*Status: MVP Ready for Launch*
