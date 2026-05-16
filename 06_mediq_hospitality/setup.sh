#!/bin/bash
set -e

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  MedIQ Pro v2.0 – Healthcare Decision Intelligence Platform   ║"
echo "║  TenzorX 2026 · Poonawalla Fincorp National AI Hackathon     ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌  Node.js not found. Install from https://nodejs.org (v18+)"
  exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
[ "$NODE_VER" -lt 16 ] && { echo "❌  Node.js 16+ required. Found: $(node -v)"; exit 1; }
echo "✅  Node.js $(node -v)"

# Root deps (concurrently)
echo "📦  Installing root dependencies..."
npm install --silent

# Backend
echo "📦  Installing backend dependencies..."
cd backend && npm install --silent && cd ..
echo "✅  Backend ready"

# Frontend
echo "📦  Installing frontend dependencies..."
cd frontend && npm install --silent && cd ..
echo "✅  Frontend ready"

# Check MongoDB
if command -v mongod &> /dev/null; then
  echo "✅  MongoDB found locally"
  echo "💡  Seeding database..."
  npm run seed 2>/dev/null && echo "✅  Database seeded" || echo "⚠️  Seed skipped (MongoDB may not be running)"
else
  echo "⚠️  MongoDB not found locally."
  echo "    Options:"
  echo "    1. Install: https://www.mongodb.com/try/download/community"
  echo "    2. Use Atlas (free): https://cloud.mongodb.com"
  echo "    3. Update MONGO_URI in backend/.env"
  echo "    App will run without persistence if MongoDB is unavailable."
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  ✅  Setup complete!                                          ║"
echo "║                                                               ║"
echo "║  START:  npm run dev                                          ║"
echo "║          (starts both backend + frontend)                     ║"
echo "║                                                               ║"
echo "║  Frontend  →  http://localhost:3000                           ║"
echo "║  Backend   →  http://localhost:5000/api/health                ║"
echo "║                                                               ║"
echo "║  Admin:     admin@mediq.ai    / Admin@MedIQ2026               ║"
echo "║  Customer:  rahul@demo.com    / Demo@1234                     ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
