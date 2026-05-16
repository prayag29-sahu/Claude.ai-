# MedIQ Pro — Production Healthcare Decision Intelligence Platform

> **TenzorX 2026 · Poonawalla Fincorp National AI Hackathon**  
> Full-stack production system with authentication, admin panel, customer accounts, and **real government data**

---

## 🚀 Quick Start

```bash
# 1. Install all dependencies
npm run setup

# 2. Seed the database (start MongoDB first OR use Atlas)
npm run seed

# 3. Start everything
npm run dev
```

| Service  | URL                                      |
|----------|------------------------------------------|
| Frontend | http://localhost:3000                    |
| Backend  | http://localhost:5000                    |
| Health   | http://localhost:5000/api/health         |

---

## 🔑 Login Credentials

| Role     | Email                 | Password         |
|----------|-----------------------|------------------|
| Admin    | admin@mediq.ai        | Admin@MedIQ2026  |
| Customer | rahul@demo.com        | Demo@1234        |
| Customer | priya@demo.com        | Demo@1234        |

> Admin gets `/admin` panel. Customers get `/dashboard`.

---

## 📊 Real Data Sources Used

### 1. PM-JAY Health Benefit Package 2.2 (NHA, Govt. of India)
- **Source:** https://nha.gov.in/img/resources/HBP-2.2-manual.pdf
- **Used for:**
  - Government benchmark rates per procedure (1,949 packages)
  - PM-JAY package codes (C2001, O0001, N0001, etc.)
  - Private hospital empanelled rates
  - Baseline for cost estimation engine

### 2. NABH Accreditation Portal
- **Source:** https://portal.nabh.co / https://nabh.co
- **Used for:**
  - Hospital accreditation status (1,299 NABH hospitals as of 2024)
  - Quality scoring signals
  - Trust indicator in ranking algorithm

### 3. CGHS Rate Zones (Central Government Health Scheme)
- **Source:** Ministry of Health & Family Welfare
- **Used for:**
  - City-tier pricing multipliers (Z1=Metro, Z2=Tier-2, Z3=Tier-3)
  - Geographic cost normalization across 20 cities

### 4. ICD-10 & SNOMED CT
- **Source:** WHO ICD-10 / NCI SNOMED CT
- **Used for:**
  - Clinical code mapping per procedure
  - NLP query → medical concept mapping

### 5. Open Government Data (data.gov.in)
- **Source:** https://www.data.gov.in
- **Used for:**
  - State/UT-wise NABH hospital count
  - Infrastructure statistics

---

## 🏗️ Architecture

```
mediq-pro/
├── backend/
│   ├── server.js                    # Express app entry point
│   ├── .env                         # Environment configuration
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js                  # Customer & admin accounts
│   │   ├── Hospital.js              # Hospital schema (PM-JAY aligned)
│   │   ├── Procedure.js             # Procedure + HBP rates
│   │   └── index.js                 # Estimate, ChatSession, AuditLog
│   ├── middleware/
│   │   └── auth.js                  # JWT + RBAC + cookie auth
│   ├── controllers/
│   │   ├── authController.js        # Register, login, logout, profile
│   │   ├── hospitalController.js    # CRUD + multi-signal ranking
│   │   ├── costController.js        # PM-JAY aligned cost engine
│   │   ├── chatController.js        # NLP intent parser + AI response
│   │   └── adminController.js       # Dashboard, users, analytics
│   ├── routes/
│   │   └── index.js                 # All route definitions
│   └── scripts/
│       └── seed.js                  # Real data seeder (16 hospitals, 13 procedures)
│
└── frontend/
    └── src/
        ├── App.jsx                  # Routing + auth guards
        ├── store/index.js           # Zustand: auth, hospital, chat, cost, admin
        ├── utils/api.js             # Axios + interceptors + auto token refresh
        ├── components/
        │   └── layout/
        │       ├── CustomerLayout.jsx   # Customer sidebar
        │       └── AdminLayout.jsx      # Admin sidebar (purple theme)
        └── pages/
            ├── auth/
            │   └── LoginPage.jsx    # Login + Register (one file)
            ├── customer/
            │   └── index.jsx        # Dashboard, Chat, Hospitals, HospitalDetail,
            │                        # CostEstimator, Profile, Saved (all pages)
            └── admin/
                └── index.jsx        # AdminDashboard, Hospitals, Users,
                                     # Procedures, Analytics (all pages)
```

---

## 🔒 Authentication & Authorization

| Feature               | Detail                                           |
|-----------------------|--------------------------------------------------|
| JWT tokens            | Access token (7d) + Refresh token (30d)          |
| HttpOnly cookies      | Secure token storage                             |
| RBAC                  | `customer` / `admin` / `superadmin` roles        |
| Route guards          | `RequireAuth`, `RequireAdmin` components         |
| Auto token refresh    | Axios interceptor silently refreshes on 401      |
| Password hashing      | bcrypt with salt rounds = 12                     |
| Audit logging         | All admin actions logged to `AuditLog` collection|

---

## 🧠 Intelligence Pipeline

```
User Query (NLP)
      ↓
parseIntent() — extracts: procedure, city, budget, age, comorbidities, severity
      ↓
ICD-10 + SNOMED CT mapping from Procedure collection
      ↓
Hospital ranking — 4-signal algorithm:
  Clinical (35%): procedure capability, accreditation, volume
  Reputation (30%): rating, reviews, NLP sentiment
  Accessibility (20%): bed count, ICU, distance
  Affordability (15%): tier-based scoring
      ↓
Cost estimation — 6 components × 5 multipliers:
  Components: Procedure + Doctor + Stay + Diagnostics + Medicines + Contingency
  Multipliers: Geographic (CGHS) × Severity × Comorbidity × Age × Hospital Tier
      ↓
Confidence Score (0–1) + Risk Flags + Disclaimer
      ↓
Chat response with ICD-10 chips, hospital cards, cost breakdown tabs
```

---

## 💊 PM-JAY Procedure Rates (Seeded Data)

| Procedure              | ICD-10   | PM-JAY Code | Govt Rate  | Private Rate |
|------------------------|----------|-------------|------------|--------------|
| Angioplasty (PCI)      | Z95.5    | C2001       | ₹40,000    | ₹1,50,000    |
| Bypass Surgery (CABG)  | Z95.1    | C2002       | ₹1,30,000  | ₹3,00,000    |
| Knee Replacement       | Z96.651  | O0001       | ₹80,000    | ₹1,50,000    |
| Hip Replacement        | Z96.641  | O0002       | ₹90,000    | ₹1,60,000    |
| Hemodialysis (session) | Z49.1    | N0001       | ₹1,500     | ₹2,500       |
| Chemotherapy (cycle)   | Z51.11   | M0001       | ₹15,000    | ₹40,000      |
| Neurosurgery           | G35      | B0001       | ₹1,20,000  | ₹2,50,000    |
| Coronary Angiography   | Z01.89   | C2003       | ₹8,000     | ₹18,000      |
| Kidney Transplant      | Z94.0    | N0010       | ₹2,50,000  | ₹5,00,000    |
| Cataract Surgery       | H26.9    | E0001       | ₹6,000     | ₹12,000      |
| Appendectomy           | K37      | G0001       | ₹15,000    | ₹30,000      |
| Normal Delivery        | O80      | O0101       | ₹9,000     | ₹15,000      |
| C-Section              | O82      | O0102       | ₹18,000    | ₹30,000      |

---

## 🏥 Seeded Hospitals (Real Names — NABH/PM-JAY Verified)

| Hospital                            | City       | Tier         | NABH | PM-JAY |
|-------------------------------------|------------|--------------|------|--------|
| CARE CHL Hospital                   | Nagpur     | Premium      | ✅   | ✅     |
| Orange City Hospital                | Nagpur     | Premium      | ✅   | ✅     |
| GMCH Nagpur (Govt)                  | Nagpur     | Government   | ✅   | ✅     |
| Kokilaben Ambani Hospital           | Mumbai     | Super Premium| ✅   | ❌     |
| Hinduja Hospital                    | Mumbai     | Premium      | ✅   | ❌     |
| KEM Hospital (Govt)                 | Mumbai     | Government   | ✅   | ✅     |
| AIIMS New Delhi (Govt)              | Delhi      | Government   | ✅   | ✅     |
| Fortis Escorts Heart Institute      | Delhi      | Premium      | ✅   | ❌     |
| Narayana Hrudayalaya                | Bangalore  | Mid          | ✅   | ✅     |
| Manipal Hospital                    | Bangalore  | Premium      | ✅   | ❌     |
| KIMS Hospitals                      | Hyderabad  | Mid          | ✅   | ✅     |
| Apollo Hospitals Jubilee Hills      | Hyderabad  | Premium      | ✅   | ❌     |
| Ruby Hall Clinic                    | Pune       | Premium      | ✅   | ✅     |
| Apollo Hospitals Chennai            | Chennai    | Super Premium| ✅   | ❌     |
| SMS Medical College (Govt)          | Jaipur     | Government   | ✅   | ✅     |
| Mahatma Gandhi Medical College      | Jaipur     | Mid          | ✅   | ✅     |

---

## 🗺️ CGHS City Pricing Multipliers

| City        | Multiplier | CGHS Zone |
|-------------|------------|-----------|
| Mumbai      | 1.00×      | Z1        |
| Delhi       | 0.96×      | Z1        |
| Bangalore   | 0.93×      | Z2        |
| Chennai     | 0.88×      | Z2        |
| Hyderabad   | 0.84×      | Z2        |
| Pune        | 0.88×      | Z2        |
| Nagpur      | 0.78×      | Z3        |
| Jaipur      | 0.74×      | Z3        |
| Patna       | 0.62×      | Z4        |

---

## 🌐 API Reference

### Auth
```
POST   /api/auth/register         Register new customer
POST   /api/auth/login            Login (returns JWT)
POST   /api/auth/logout           Logout + clear cookie
GET    /api/auth/me               Get current user + saved hospitals
PUT    /api/auth/profile          Update profile
PUT    /api/auth/change-password  Change password
POST   /api/auth/saved/:id        Toggle save hospital
```

### Hospitals
```
GET    /api/hospitals             List/search/filter/rank hospitals
GET    /api/hospitals/cities      Available cities + pricing index
GET    /api/hospitals/:id         Hospital detail with doctors & reviews
POST   /api/hospitals             [Admin] Create hospital
PUT    /api/hospitals/:id         [Admin] Update hospital
DELETE /api/hospitals/:id         [Admin] Soft delete
POST   /api/hospitals/:id/review  Add verified patient review
```

### Cost Estimation
```
POST   /api/costs/estimate        Full 6-component estimate
POST   /api/costs/compare         Compare across hospitals
GET    /api/costs/history         User's estimate history
```

### Chat / NLP
```
POST   /api/chat/message          NLP query → clinical mapping + results
GET    /api/chat/session/:id      Retrieve session
GET    /api/chat/suggestions      Pre-built query examples
```

### Procedures
```
GET    /api/procedures            List all procedures (PM-JAY HBP aligned)
GET    /api/procedures/:key       Single procedure detail
```

### Admin
```
GET    /api/admin/dashboard       Stats, charts, recent activity
GET    /api/admin/users           User list with filters
PUT    /api/admin/users/:id       Activate/deactivate users
GET    /api/admin/analytics       Hospital & procedure analytics
GET    /api/admin/audit           Admin audit log
```

---

## ⚙️ Environment Variables

```env
# backend/.env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/mediq_pro
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/mediq_pro

# JWT
JWT_SECRET=change_this_in_production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=change_this_too
JWT_REFRESH_EXPIRES_IN=30d

# Admin
ADMIN_EMAIL=admin@mediq.ai
ADMIN_PASSWORD=Admin@MedIQ2026

# CORS
FRONTEND_URL=http://localhost:3000
```

---

## 🔧 MongoDB Setup Options

### Option A — Local MongoDB
```bash
# macOS
brew install mongodb-community && brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

### Option B — MongoDB Atlas (Free tier)
1. Create account at https://cloud.mongodb.com
2. Create free cluster → Get connection string
3. Update `MONGO_URI` in `backend/.env`

> **No MongoDB?** The app still runs with in-memory data (no persistence, seeding skipped). Good for demo.

---

## 🎯 Hackathon Demo Script

1. **Login page** → Click "Customer Demo" → auto-fills credentials → Sign In
2. **Dashboard** → Show pipeline, stats (real hospital counts), data source banner
3. **AI Chat** → Type: `"Angioplasty in Nagpur under ₹3 lakh, age 58, diabetic"`
   - See: ICD-10 Z95.5 chip, PM-JAY C2001, Nagpur tag, confidence score
   - Hospitals tab: 3 ranked hospitals with scores
   - Cost tab: ₹2.1L–₹3.9L with 6-component breakdown
   - Pathway tab: 5-step clinical pathway
4. **Hospitals** → Filter: Angioplasty + Nagpur → ranked cards with PM-JAY badge
5. **Hospital Detail** → Click any → Tabs: Overview / Doctors / Cost / Reviews
6. **Cost Estimator** → Angioplasty, Nagpur, 58yr, Diabetic → charts + risk flags
7. **Log out** → Login as Admin → `/admin`
8. **Admin Dashboard** → Stats, user growth chart, city distribution
9. **Admin Hospitals** → Edit/create hospital with form
10. **Admin Users** → Activate/deactivate accounts
11. **Admin Procedures** → Show PM-JAY HBP rates table
12. **Admin Analytics** → Radar, bar charts, PM-JAY govt vs private rates

---

*MedIQ Pro v2.0 · Team Nexus AI · TenzorX 2026 · "Kayak for Healthcare"*
