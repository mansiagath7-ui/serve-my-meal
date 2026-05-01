# 🍽️ FoodieZone — Food Ordering App

React 19 + Vite 7 + Tailwind CSS v4

## ⚡ Tech Stack

| Tool | Version |
|------|---------|
| React | 19.2 |
| Vite | 7.3 |
| Tailwind CSS | 4.2 |
| React Router | 7.x |
| Lucide React | 0.577 |

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:5173
```

## 📁 Folder Structure

```
src/
├── components/
│   ├── Sidebar.jsx        # Top header (desktop) + Bottom nav (mobile)
│   ├── ProductCard.jsx    # Food card with cart controls
│   └── CategoryPage.jsx  # Reusable category listing
├── context/
│   └── CartContext.jsx   # Global cart state
├── data/
│   └── products.js       # 48 products × 6 categories
└── pages/
    ├── Home.jsx           # Search, banner, bestsellers
    ├── Categories.jsx     # All 6 food categories
    ├── Cart.jsx           # Cart + bill details
    ├── Payment.jsx        # UPI / Card / COD
    ├── Login.jsx          # Login + Register
    ├── Profile.jsx        # Profile with 7 sub-pages
    └── Orders.jsx         # Order history
```

## 📱 Responsive Layout

- **Mobile**: Top logo bar + Bottom nav (Home, Cart, Orders, Profile, More)
- **Desktop**: Full top header with logo, Menu dropdown, nav links, cart badge

## 🎨 Tailwind v4 Notes

No `tailwind.config.js` needed! Just `@import "tailwindcss"` in CSS.
The `@tailwindcss/vite` plugin handles everything automatically.
