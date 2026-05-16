# 📸 The Lightroom Photography – MERN Stack

Premium Photography Studio Web Application

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Configure Environment
Edit `server/config.env` with your credentials:
- MongoDB Atlas URI
- JWT Secret
- Cloudinary credentials
- Razorpay keys
- Email (SMTP) config

### 3. Create Admin User
Run `node server/utils/createAdmin.js` after starting the server once.

### 4. Start Development
```bash
npm run dev
```
- **Client:** http://localhost:3000
- **Server:** http://localhost:5000

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + httpOnly cookies |
| Media | Cloudinary |
| Payments | Razorpay |
| Deploy | Vercel (client) + Render (server) + MongoDB Atlas |

## 📂 Structure
```
the-lightroom-photography/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/   # Navbar, Footer, UI components
│   │   ├── pages/        # All pages
│   │   ├── context/      # Auth context
│   │   └── services/     # Axios API
├── server/          # Express backend
│   ├── controllers/ # Business logic
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── middleware/  # Auth, role guards
│   └── utils/       # Cloudinary, email, upload
└── package.json
```

## 🌐 API Endpoints

### Auth
- `POST /api/auth/register` – Register client
- `POST /api/auth/login` – Login
- `GET /api/auth/me` – Get current user

### Bookings
- `POST /api/bookings` – Create booking (public)
- `GET /api/bookings` – All bookings (admin)
- `GET /api/bookings/my` – My bookings (client)
- `PATCH /api/bookings/:id/status` – Update status (admin)

### Gallery
- `GET /api/gallery/public` – Public galleries
- `GET /api/gallery/my` – Client's private galleries
- `POST /api/gallery` – Create gallery (admin)

### Blog
- `GET /api/blog` – All published posts
- `GET /api/blog/:slug` – Single post

### Payments
- `POST /api/payment/create-order` – Razorpay order
- `POST /api/payment/verify` – Verify payment

## 🔐 Roles
- **client** – Book sessions, view gallery, sign contracts, download images
- **admin** – Full access to all bookings, galleries, clients, blog, revenue

## 🚀 Deploy
```bash
# Build client
cd client && npm run build

# Set environment variables on Render (server) and Vercel (client)
```
