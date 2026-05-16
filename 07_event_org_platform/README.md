# 👑 VisionVivaah — Premium Event Management Platform

A full-stack production-grade web application for event management services including Tent House, DJ, Catering, Decoration, and Full Event Management.

---

## 🎯 Features

### User Side
- 🔐 JWT Authentication (Register / Login)
- 🎪 Browse & search services with filters
- 📋 Multi-step booking system
- 📊 User dashboard with booking tracking
- 💳 Mock payment integration
- 📱 Fully responsive luxury UI

### Admin Side
- 📈 Dashboard with stats and analytics
- ✏️ Full CRUD for services (with image upload)
- 📋 Manage all bookings & update status
- 👥 User management & activation control

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcryptjs |
| Image Upload | Cloudinary (optional) / local storage |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
event-platform/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Navbar, Footer, ServiceCard, etc.
│   │   │   └── admin/         # AdminLayout
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── ServiceDetailPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── BookingDetailPage.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminServices.jsx
│   │   │       ├── AdminBookings.jsx
│   │   │       └── AdminUsers.jsx
│   │   ├── context/           # AuthContext
│   │   ├── services/          # Axios API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/                    # Node.js Backend
    ├── config/
    │   ├── db.js              # MongoDB connection
    │   ├── cloudinary.js      # Image upload config
    │   └── seed.js            # Database seeder
    ├── controllers/
    │   ├── authController.js
    │   ├── serviceController.js
    │   ├── bookingController.js
    │   └── userController.js
    ├── middleware/
    │   ├── auth.js            # JWT middleware
    │   └── errorHandler.js
    ├── models/
    │   ├── User.js
    │   ├── Service.js
    │   └── Booking.js
    ├── routes/
    │   ├── auth.js
    │   ├── services.js
    │   ├── bookings.js
    │   └── users.js
    └── server.js
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

---

### Step 1: Clone & Install

```bash
# Install all dependencies
npm run install:all

# OR manually:
cd server && npm install
cd ../client && npm install
```

---

### Step 2: Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_platform
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### Step 3: Seed the Database

```bash
npm run seed
```

This creates:
- ✅ Admin user: `admin@eventplatform.com` / `Admin@123`
- ✅ Test user: `rajesh@example.com` / `User@123`
- ✅ 8 sample services (Tent, DJ, Catering, etc.)

---

### Step 4: Run the Application

```bash
# Run both frontend & backend simultaneously
npm run dev
```

Or separately:
```bash
npm run dev:server   # Backend: http://localhost:5000
npm run dev:client   # Frontend: http://localhost:5173
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| PUT | `/api/auth/profile` | Private |

### Services
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/services` | Public |
| GET | `/api/services/:id` | Public |
| GET | `/api/services/categories` | Public |
| POST | `/api/services` | Admin |
| PUT | `/api/services/:id` | Admin |
| DELETE | `/api/services/:id` | Admin |

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/bookings` | Private |
| GET | `/api/bookings/user` | Private |
| GET | `/api/bookings` | Admin |
| GET | `/api/bookings/:id` | Private |
| PUT | `/api/bookings/:id/status` | Admin |
| PUT | `/api/bookings/:id/cancel` | Private |
| POST | `/api/bookings/:id/pay` | Private |

### Users (Admin)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Admin |
| GET | `/api/users/stats` | Admin |
| PUT | `/api/users/:id/toggle` | Admin |

---

## 🎨 Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, services preview, testimonials |
| `/services` | All services with search & filters |
| `/services/:id` | Service detail + booking sidebar |
| `/book/:serviceId` | Multi-step booking form |
| `/login` | Login with demo credentials |
| `/register` | Registration with password strength |
| `/dashboard` | User's bookings dashboard |
| `/bookings/:id` | Booking detail + payment + tracking |
| `/admin` | Admin dashboard with stats |
| `/admin/services` | Manage services (CRUD + image upload) |
| `/admin/bookings` | All bookings + status update |
| `/admin/users` | User management |

---

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication with expiry
- Protected routes (frontend + backend)
- Admin-only route guards
- Input validation with express-validator
- CORS configured for specific origin
- Mongoose schema validation

---

## 💰 Mock Payment Flow

1. User books a service → Booking created with `paymentStatus: unpaid`
2. User goes to booking detail → Clicks "Pay Advance"
3. Selects payment method → System generates mock payment ID
4. Booking updated to `paymentStatus: partial` or `paid`
5. Admin can update to `paid` manually from admin panel

---

## 🌟 Bonus Features Implemented

- ✅ Image upload support (Cloudinary + local fallback)
- ✅ Mock payment integration with transaction ID
- ✅ Advanced search & filter (category, price range, sort)
- ✅ Booking status tracking with visual progress bar
- ✅ Password strength meter on registration
- ✅ Hero image slideshow on homepage
- ✅ Skeleton loading states throughout
- ✅ Responsive mobile-first design
- ✅ Admin notes visible to clients

---

## 📝 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@eventplatform.com | Admin@123 |
| User | rajesh@example.com | User@123 |
| User | priya@example.com | User@123 |

> Demo credentials are also shown on the Login page for convenience.
