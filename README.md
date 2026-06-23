# Promptarium

A community-driven AI prompt sharing and marketplace platform where users can discover, share, bookmark, and monetize AI prompts for tools like ChatGPT, Gemini, Claude, Midjourney, and more.

## 🔗 Live Links

- **Client:** https://ai-prompt-hub-client.vercel.app
- **Server:** https://ai-prompt-hub-server-1.onrender.com

## 👤 Admin Credentials

- **Email:** azizulline11@gmail.com
- **Password:** RA7389

## 🔗 Repositories

- **Client:** https://github.com/golamrabbi73/ai-prompt-hub-client
- **Server:** https://github.com/golamrabbi73/ai-prompt-hub-server

## ✨ Key Features

### Authentication
- Email/password and Google login via Firebase
- JWT-based session management
- Role-based access control (User / Creator / Admin)

### Public Pages
- Home with Banner, Featured Prompts (MongoDB limit), Top Creators, Reviews, and extra sections
- All Prompts with server-side search, filter, sort, and pagination
- Prompt Details with full content or premium lock based on subscription

### User Dashboard
- Add, edit, delete own prompts (free users limited to 3)
- View prompt analytics (copies, status, category)
- Bookmark and manage saved prompts
- Submit and delete reviews
- Profile page with subscription status and stats
- One-time $5 Stripe payment to upgrade to Premium

### Creator Dashboard
- Stats overview — total prompts, approved, total copies, total bookmarks, average rating

### Admin Dashboard
- Analytics with MongoDB aggregation (bar charts, pie charts via Recharts)
- Manage all users — change roles, delete users
- Manage all prompts — approve, reject, delete
- View all payments and revenue summary
- Handle reported prompts — dismiss, warn creator, remove prompt

### Premium System
- Private prompts locked with blur overlay for free users
- One-time $5 Stripe payment unlocks all premium content
- Copy and review locked for non-premium users on private prompts

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS + DaisyUI
- Framer Motion
- TanStack Query (React Query v5)
- React Hook Form
- Stripe.js + React Stripe Elements
- Firebase Authentication
- Axios
- Recharts
- React Toastify
- React Icons
- React Router DOM

### Backend
- Node.js + Express
- MongoDB (native driver)
- JSON Web Token (jsonwebtoken)
- Stripe Node SDK
- dotenv, cors

## 📦 NPM Packages Used

### Client
```
react, react-dom, react-router-dom
@tanstack/react-query
firebase
axios
@stripe/stripe-js, @stripe/react-stripe-js
framer-motion
react-hook-form
react-toastify
react-icons
recharts
tailwindcss, daisyui
```

### Server
```
express
cors
dotenv
mongodb
jsonwebtoken
stripe
nodemon
```

## 🚀 Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project
- Stripe account
- imgbb API key

### Client Setup
```bash
git clone https://github.com/golamrabbi73/ai-prompt-hub-client
cd ai-prompt-hub-client
npm install
```

Create `.env.local`:
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
VITE_IMGBB_API_KEY=your_key
```

```bash
npm run dev
```

### Server Setup
```bash
git clone https://github.com/golamrabbi73/ai-prompt-hub-server
cd ai-prompt-hub-server
npm install
```

Create `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_key
```

```bash
npm run dev
```

## 🔐 Security

- All sensitive keys stored in `.env` / `.env.local`
- `.gitignore` excludes all environment files
- JWT middleware protects all sensitive API routes
- Admin middleware adds role-based protection on top of JWT
- Stripe secret key only on server, publishable key on client

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | azizulline11@gmail.com | RA7389 |

> Stripe test card: `4242 4242 4242 4242` — any future date (e.g. 12/34), any CVC (e.g. 123)

## 📁 Folder Structure

```
client/
├── src/
│   ├── components/
│   │   ├── dashboard/    # Sidebar, StatCard, ChartCard
│   │   ├── home/         # Banner, FeaturedPrompts, TopCreators, etc.
│   │   ├── prompts/      # ReviewForm, ReviewList, ReportModal
│   │   └── shared/       # Navbar, Footer, SocialLogin
│   ├── hooks/            # useAuth, useAxiosSecure, useUserRole, usePremium
│   ├── layouts/          # MainLayout, DashboardLayout
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   │   ├── Admin/    # Analytics, AllUsers, AllPrompts, AllPayments, ReportedPrompts
│   │   │   ├── Creator/  # CreatorHome
│   │   │   └── User/     # AddPrompt, MyPrompts, SavedPrompts, MyReviews, Profile
│   │   ├── Home/
│   │   ├── AllPrompts/
│   │   ├── Payment/
│   │   └── PromptDetails/
│   ├── providers/        # AuthProvider
│   └── routes/           # PrivateRoute, AdminRoute, CreatorRoute
```