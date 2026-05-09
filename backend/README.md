# Bug Tracker — Backend

## Tech Stack
- **Node.js** + **Express** — REST API
- **MongoDB** + **Mongoose** — Database & ODM
- **JWT** — Authentication
- **bcryptjs** — Password hashing

---

## Folder Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, login, profile
│   ├── bugController.js       # Full CRUD + comments + stats
│   ├── projectController.js   # Projects + member management
│   └── userController.js      # User management
├── middleware/
│   └── authMiddleware.js      # JWT protect + role authorize
├── models/
│   ├── Bug.js                 # Bug schema (auto-increment bugId)
│   ├── Counter.js             # Counter for bugId sequence
│   ├── Project.js             # Project + members schema
│   └── User.js                # User schema + password hashing
├── routes/
│   ├── authRoutes.js
│   ├── bugRoutes.js
│   ├── projectRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── generateToken.js       # JWT token helper
│   └── seed.js                # Demo data seeder
├── .env.example
├── package.json
└── server.js                  # Entry point
```

---

## Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
```

### 3. Start MongoDB
Make sure MongoDB is running locally, or use a MongoDB Atlas connection string.

### 4. Seed demo data (optional)
```bash
npm run seed
```
Creates 3 demo users:
| Email | Password | Role |
|---|---|---|
| admin@bugtracker.com | password123 | admin |
| alice@bugtracker.com | password123 | tester |
| bob@bugtracker.com | password123 | developer |

### 5. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs on **http://localhost:5000**

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | Private | Get logged-in user |
| PUT | `/password` | Private | Update password |

### Users — `/api/users`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Admin | List all users |
| GET | `/developers` | Private | List all developers |
| GET | `/:id` | Admin | Get user by ID |
| PUT | `/profile` | Private | Update own profile |
| DELETE | `/:id` | Admin | Delete user |

### Projects — `/api/projects`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Private | List projects (filtered by role) |
| POST | `/` | Admin | Create project |
| GET | `/:id` | Private | Get project |
| PUT | `/:id` | Admin | Update project |
| DELETE | `/:id` | Admin | Delete project |
| POST | `/:id/members` | Admin | Add member |
| DELETE | `/:id/members/:userId` | Admin | Remove member |

### Bugs — `/api/bugs`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Private | List bugs (filtered by role) |
| POST | `/` | Tester/Admin | Create bug |
| GET | `/stats` | Private | Bug counts by status/priority |
| GET | `/:id` | Private | Get bug detail |
| PUT | `/:id` | Private | Update bug |
| DELETE | `/:id` | Private | Delete bug |
| POST | `/:id/comments` | Private | Add comment |
| DELETE | `/:id/comments/:commentId` | Private | Delete comment |

---

## Role Permissions

| Action | Admin | Developer | Tester |
|---|---|---|---|
| Create bug | ✅ | ❌ | ✅ |
| View all bugs | ✅ | assigned only | own only |
| Update bug status | ✅ | ✅ | ❌ |
| Assign bug | ✅ | ✅ | ❌ |
| Manage projects | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |

---

## Sending Requests

All protected routes require the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

Example login with curl:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@bugtracker.com","password":"password123"}'
```
