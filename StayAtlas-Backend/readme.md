# StayAtlas Backend (MERN Stack)

A complete backend API for a villa rental/booking platform, built with Node.js, Express, and MongoDB. Users can explore, book, and list properties, while roles and access are managed via JWT and middleware.

---

##  Folder Structure

```
stayatlas-backend/
├── config/              # MongoDB connection
├── controllers/         # Route logic (auth, villas, bookings, users)
├── middleware/          # Auth and role-based access
├── models/              # Mongoose models (User, Villa, Booking)
├── routes/              # API route handlers
├── utils/               # Utility functions (OTP, price calc)
├── uploads/             # Image uploads (via multer)
├── .env                 # Environment config
├── server.js            # Main entry point
└── package.json         # Dependencies and scripts
```

---

##  How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/stayatlas-backend.git
cd stayatlas-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up your `.env`
```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### 4. Create uploads folder
```bash
mkdir uploads
```

### 5. Run the server
```bash
npm run dev
```

You should see:
```
 MongoDB connected: ...
 Server running on http://localhost:5000
```

---

##  API Overview

###  Auth Routes
| Method | Endpoint             | Description           |
|--------|----------------------|------------------------|
| POST   | /api/auth/register   | Register a user        |
| POST   | /api/auth/login      | Login and get token    |
| GET    | /api/auth/profile    | Get current user info  |

###  Villa Routes
| Method | Endpoint             | Description                 |
|--------|----------------------|-----------------------------|
| POST   | /api/villas          | Create new villa listing     |
| GET    | /api/villas/explore | Get all accepted villas      |
| GET    | /api/villas/my      | Get user's own listings      |
| PUT    | /api/villas/status/:id | Admin approves/rejects     |

###  Booking Routes
| Method | Endpoint               | Description               |
|--------|------------------------|----------------------------|
| POST   | /api/bookings/:villaId | Book a villa               |
| GET    | /api/bookings/my       | Get current user's bookings|
| GET    | /api/bookings/admin/all| Admin gets all bookings    |

###  User Routes
| Method | Endpoint                       | Description                    |
|--------|--------------------------------|--------------------------------|
| POST   | /api/users/favourites/:villaId | Add villa to favourites        |
| DELETE | /api/users/favourites/:villaId | Remove from favourites         |
| GET    | /api/users/favourites          | Get all favourited villas      |

---

##  Role Management

| Role  | Description                                 |
|-------|---------------------------------------------|
| user  | Default role, can browse/book villas        |
| owner | Promoted after listing first villa          |
| admin | Can approve/reject villas, see all bookings |

Automatic Role Promotion:
- All users register as `user`
- After their first villa listing → backend promotes them to `owner`

---

##  Technologies Used
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- multer for image uploads
- dotenv, cors, cookie-parser

---

##  Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/awesome`
3. Commit your changes: `git commit -m 'add something cool'`
4. Push to branch: `git push origin feature/awesome`
5. Open a pull request

---