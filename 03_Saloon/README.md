# 🪒 Sachin Men's Saloon — Full Stack MERN App

> Premium Men's Grooming Web Application | Black + Gold Luxury Theme

---

##  Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)
- npm or yarn

---

## 📁 Project Structure

```
sachin-saloon/
├── server/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── galleryController.js
│   │   └── serviceController.js
│   ├── middleware/
│   │   └── auth.js            # JWT + Admin middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Service.js
│   │   ├── Booking.js
│   │   └── Gallery.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── gallery.js
│   │   └── services.js
│   ├── utils/
│   │   └── seed.js            # Database seeder
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── client/                    # Frontend (React + Vite)
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Spinner.jsx
    │   │   │   └── SectionHeader.jsx
    │   │   └── layout/
    │   │       ├── Navbar.jsx
    │   │       ├── Footer.jsx
    │   │       └── Layout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── About.jsx
    │   │   ├── Services.jsx
    │   │   ├── Pricing.jsx
    │   │   ├── Gallery.jsx
    │   │   ├── Booking.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── User/
    │   │   │   └── Dashboard.jsx
    │   │   └── Admin/
    │   │       └── AdminDashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 2. Configure .env

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sachin-saloon
JWT_SECRET=your_very_long_and_random_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- 12 sample services across all categories
- 8 gallery images
- Admin account: `admin@sachinsaloon.com` / `Admin@123`

### 4. Start Backend

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

### 5. Frontend Setup

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## 🗄️ MongoDB Schema

### User
| Field     | Type   | Notes                |
|-----------|--------|----------------------|
| name      | String | Required             |
| email     | String | Unique, required     |
| password  | String | Bcrypt hashed        |
| phone     | String |                      |
| role      | Enum   | 'user' \| 'admin'    |

### Service
| Field       | Type    | Notes                         |
|-------------|---------|-------------------------------|
| title       | String  | Required                      |
| category    | Enum    | 6 service categories          |
| description | String  | Required                      |
| price       | Number  | In INR                        |
| duration    | Number  | In minutes                    |
| image       | String  | Image URL                     |
| isActive    | Boolean | Soft delete support           |

### Booking
| Field         | Type     | Notes                          |
|---------------|----------|--------------------------------|
| userId        | ObjectId | Ref: User                      |
| serviceId     | ObjectId | Ref: Service                   |
| date          | Date     | Appointment date               |
| timeSlot      | String   | e.g. "10:00 AM"                |
| status        | Enum     | pending/approved/cancelled/completed |
| paymentMethod | Enum     | 'cash' \| 'online'             |
| name          | String   | Customer name                  |
| phone         | String   | Contact number                 |

### Gallery
| Field      | Type   | Notes              |
|------------|--------|--------------------|
| image      | String | Image URL          |
| category   | Enum   | 6 categories       |
| caption    | String | Optional           |

---

## 🔌 API Reference

| Method | Endpoint                        | Auth   | Description            |
|--------|---------------------------------|--------|------------------------|
| POST   | /api/auth/register              | Public | Register user          |
| POST   | /api/auth/login                 | Public | Login                  |
| GET    | /api/auth/me                    | User   | Get profile            |
| PUT    | /api/auth/profile               | User   | Update profile         |
| GET    | /api/services                   | Public | Get all services       |
| POST   | /api/services                   | Admin  | Add service            |
| PUT    | /api/services/:id               | Admin  | Update service         |
| DELETE | /api/services/:id               | Admin  | Delete service         |
| GET    | /api/bookings/slots?date=       | Public | Get available slots    |
| POST   | /api/bookings                   | User   | Create booking         |
| GET    | /api/bookings/user              | User   | My bookings            |
| GET    | /api/bookings/admin             | Admin  | All bookings           |
| GET    | /api/bookings/analytics         | Admin  | Analytics data         |
| PUT    | /api/bookings/:id/status        | Admin  | Update booking status  |
| PUT    | /api/bookings/:id/cancel        | User   | Cancel booking         |
| GET    | /api/gallery                    | Public | Get gallery            |
| POST   | /api/gallery                    | Admin  | Add gallery image      |
| DELETE | /api/gallery/:id                | Admin  | Delete gallery image   |

---

## 🚀 Deployment

### Backend → Render.com

1. Push server/ to GitHub
2. Create new **Web Service** on Render
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables from .env
6. Deploy!

### Frontend → Vercel

1. Push client/ to GitHub
2. Import to Vercel
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env: `VITE_API_URL=https://your-render-url.onrender.com`
6. Update vite.config.js proxy to use `VITE_API_URL` in production

---

## 🎨 Theme Details

| Element    | Value         |
|------------|---------------|
| Primary    | #d4af37 (Gold)|
| Background | #0a0a0a       |
| Surface    | #1a1a1a       |
| Text       | #ffffff        |
| Heading    | Playfair Display (Serif) |
| Body       | Inter (Sans) |

---

## 📱 Features Summary

- ✅ Luxury dark gold theme
- ✅ Fully responsive (mobile-first)
- ✅ Framer Motion animations throughout
- ✅ JWT authentication (user + admin roles)
- ✅ Real-time slot availability check
- ✅ Double-booking prevention
- ✅ Admin dashboard with analytics (Recharts)
- ✅ Service CRUD (Admin)
- ✅ Gallery management (Admin)
- ✅ Booking approval workflow
- ✅ User appointment history & cancellation
- ✅ Toast notifications
- ✅ SEO meta tags
- ✅ Sticky navbar
- ✅ Masonry gallery with lightbox

---

## 🔐 Default Credentials

| Role  | Email                     | Password  |
|-------|---------------------------|-----------|
| Admin | admin@sachinsaloon.com    | Admin@123 |

---

*Built with ❤️ for Sachin Men's Saloon*