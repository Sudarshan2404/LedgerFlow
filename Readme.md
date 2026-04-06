# 💰 Finance Tracker API

A **Node.js + Express + Prisma** based backend for managing personal finance records with authentication and role-based access control.

---

## 🚀 Features

- 🔐 JWT Authentication (Login/Register)
- 👥 Role-based Access Control (ADMIN, ANALYST, USER)
- 📊 Dashboard with analytics
- 🧾 CRUD operations for financial records
- 🍪 Secure cookie-based authentication
- 🛡️ Middleware for auth & roles

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** Prisma ORM
- **Auth:** JWT + Cookies
- **Validation:** Zod
- **Hashing:** bcrypt

---

## 📁 Project Structure

```
src/
│
├── controllers/
│   ├── authControllers.ts
│   ├── crudControllers.ts
│
├── middleware/
│   ├── authmiddleware.ts
│   ├── RoleMiddleware.ts
│
├── routes/
│   ├── Authroutes.ts
│   ├── firecords.ts
│
├── config/
│   └── prisma.ts
│
├── services/
│   └── generateToken.ts
│
└── server.ts
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create `.env` file:

```env
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
SALT_ROUNDS=10
DEVLOPMENT=Development
```

---

### 4. Prisma setup

```bash
npx prisma generate
npx prisma migrate dev
```

---

### 5. Run the server

```bash
npm run dev
```

Server runs on:

```
http://localhost:3000
```

---

## 🔐 Authentication Routes

### Register

```
POST /api/auth/register
```

**Body:**

```json
{
  "email": "test@example.com",
  "name": "sudarshan",
  "password": "Password@123"
}
```

---

### Login

```
POST /api/auth/login
```

---

### Update Role (Admin only)

```
PATCH /api/auth/updaterole/:id
```

---

## 💸 Finance Routes

### Get All Records

```
GET /api/finance/records
```

---

### Get Record by ID

```
GET /api/finance/getrecord/:id
```

---

### Add Record

```
POST /api/finance/addrecords
```

**Roles:** ADMIN, ANALYST

```json
{
  "amount": 1000,
  "type": "income",
  "category": "salary",
  "notes": "monthly income"
}
```

---

### Update Record

```
PATCH /api/finance/updaterecord
```

---

### Delete Record

```
DELETE /api/finance/deleterecord
```

---

### Dashboard

```
GET /api/finance/dashboard
```

Returns:

- Total Income
- Total Expense
- Net Balance
- Category Breakdown
- Recent Transactions

---

## 🛡️ Middleware

### Authmiddleware

- Verifies JWT
- Attaches `userId` to request

---

### RoleMiddleware

- `AdminRole` → Only ADMIN
- `AnalystRole` → Only ANALYST
- `allowRoles(...roles)` → Flexible role control

---

## ⚠️ Notes / Improvements

- `req.userId` is used but not typed properly → fix in global types
- Duplicate CRUD controller files detected → clean up duplicates
- Add input validation for finance routes (currently minimal)
- Add pagination for records
- Add refresh tokens for production

---

## 📌 Example Flow

1. Register user
2. Login → get cookie token
3. Admin updates role
4. User adds records
5. View dashboard

---

## 🧠 Future Enhancements

- 📈 Charts (frontend integration)
- 🧾 Export reports (PDF/CSV)
- 🔔 Notifications
- 📱 Mobile app support

---

## 👨‍💻 Author

**Sudarshan Kulkarni**

---

## ⭐ If you like this project

Give it a star ⭐ and build something crazy with it 🚀
