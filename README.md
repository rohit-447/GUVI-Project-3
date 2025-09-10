# Event Booking Platform : EventBooker (MERN Stack)

A **full-stack web platform** where users can browse events, book tickets, and receive unique QR codes for entry.  
Event organizers can create and manage events, track bookings, and validate tickets by scanning QR codes.  

Built with the **MERN stack (MongoDB, Express, React, Node.js)**, this project covers authentication, CRUD operations, QR code integration, and optional features like email confirmations and payment gateway support.

---

## Table of Contents  

- [Features](#Features)  
- [Tech Stack](#Tech Stack)  
- [Project Structure](#Project Structure)  
- [Installation](#Installation)  
- [Environment Variables](#Environment Variables)  
- [Usage](#Usage)  
- [API Endpoints](#API Endpoints)  
- [Database Schema](#Database Schema)  
- [Available Scripts](#Available Scripts)  
- [Deployment on Vercel](#Deployment on Vercel)  
- [Future Enhancements](#Future Enhancements)  
- [Contributing](#Contributing)  
- [License](#License) 
---

##  Features

###  User Features  
- Register/Login with JWT or Google OAuth  
- Browse upcoming events with details  
- Book tickets with unique **QR codes**  
- View/manage booked tickets in dashboard  
- Reset forgotten password  
- Responsive UI with smooth navigation  

###  Organizer Features  
- Create, edit, and delete events  
- Manage event capacity and ticket types  
- Track ticket bookings in real-time  
- Validate tickets via QR code scanning  

###  Extra Features  
- Email confirmations   
- Payment gateway integration *(Stripe/Rozerpay)*  
- Role-based authentication (admin, organizer, user)  
- Tailwind CSS for modern responsive UI  

---

##  Tech Stack  

**Frontend**  
- React.js (Hooks, Context API, React Router)  
- Tailwind CSS  

**Backend**  
- Node.js + Express.js  
- MongoDB + Mongoose  
- JWT & Passport.js (Google OAuth)  

**Other Tools**  
- QR Code Generation  
- Stripe/PayPal (optional)  
- Nodemailer (optional)  

---

##  Project Structure  

```
event-booking-platform/
│── frontend/               # React client
│   ├── src/
│   │   ├── api/            # API service calls
│   │   ├── components/     # Reusable UI + feature-based components
│   │   ├── context/        # Context API (Auth, Alerts)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Pages (Login, Register, Events, Tickets, Dashboard)
│   │   ├── utils/          # Helpers (formatters, token manager)
│   │   └── App.js, index.js (etc.)
│   ├── .env                # Environment Variables
│   └── tailwind.config.js
│
│── backend/                # Express server
│   ├── src/
│   │   ├── config/         # Config (DB, Passport, env)
│   │   ├── controllers/    # Controllers (Auth, Events, Tickets, Payments)
│   │   ├── middleware/     # Auth & Admin middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # Express routes
│   │   ├── utils/          # Utilities
│   │   ├── app.js          # Express app
│   │   └── server.js       # Entry point
│   ├── .env                # Environment Variables
│   └── package.json
│
│── README.md
└── .gitignore

```

---

## Installation  

### 1️. Clone the repository  
```bash
git clone https://github.com/rohit-447/GUVI-Project-3.git
```

### 2️. Install dependencies  
- Frontend  
  ```bash
  cd frontend && npm install
  ```
- Backend  
  ```bash
  cd ../backend && npm install
  ```

### 3. Run the project  
- Start backend  
  ```bash
  cd backend && npm run dev
  ```
- Start frontend  
  ```bash
  cd frontend && npm start
  ```

---

## Environment Variables  

### Backend `.env`  
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret   
EMAIL_USER=your_email_user             
EMAIL_PASS=your_email_password
```

### Frontend `.env`  
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

---

##  Usage  

- Frontend runs at: **http://localhost:3000**  
- Backend API runs at: **http://localhost:5000**  
- Register/login, browse events, and book tickets  
- Organizers can create/manage events & validate tickets  

---

##  API Endpoints  

### Auth (`/api/auth`)  
- `POST /register` – Register new user  
- `POST /login` – Login user  
- `GET /profile` – Get logged-in user info  
- `POST /google` – Google OAuth login  

### Events (`/api/events`)  
- `GET /` – List all events  
- `POST /` – Create event *(admin only)*  
- `PUT /:id` – Update event *(admin only)*  
- `DELETE /:id` – Delete event *(admin only)*  

### Tickets (`/api/tickets`)  
- `POST /book` – Book ticket  
- `GET /my-tickets` – Get user’s tickets  
- `POST /validate` – Validate QR code *(organizer)*  

### Payments (`/api/payments`)  
- `POST /checkout` – Process payment  

---

##  Database Schema  

The database is structured with **MongoDB + Mongoose models**.  

### **User Schema** (`User.js`)  
- `name` *(String, required)* – User’s full name  
- `email` *(String, unique, required)* – Login email  
- `password` *(String)* – Hashed password  
- `googleId` *(String)* – Google OAuth ID  
- `avatar` *(String)* – Profile picture  
- `role` *(enum: user/admin)* – Access control  
- `createdAt` *(Date, default: now)*  
- Passwords are hashed using **bcrypt** before saving.  

### **Event Schema** (`Event.js`)  
- `title` *(String, required)* – Event title  
- `description` *(String, required)* – Event details  
- `image` *(String)* – Cover image  Url
- `location` *(String, required)* – Venue/Online link  
- `startDate` & `endDate` *(Date, required)* – Event duration  
- `organizer` *(ObjectId → User)* – Reference to event creator  
- `ticketTypes` *(Array)* – Available ticket categories  
- `status` *(draft/published/cancelled)*  
- `tags` *(Array of Strings)*  
- `createdAt` *(Date, default: now)*  

### **Ticket Schema** (`Ticket.js`)  
- `event` *(ObjectId → Event, required)*  
- `user` *(ObjectId → User, required)*  
- `ticketType` *(String, required)*  
- `quantity` *(Number, default: 1)*  
- `unitPrice` *(Number, required)*  
- `totalAmount` *(Number, required)*  
- `paymentId` *(String)*  
- `paymentStatus` *(pending/completed/failed/refunded)*  
- `qrCode` *(String)*  
- `ticketNumber` *(String, unique)* – Auto-generated unique ticket ID  
- `isCheckedIn` *(Boolean, default: false)*  
- `purchasedAt` *(Date, default: now)*  

Ticket numbers are generated automatically in the format:  
`TKT-{timestamp}-{random}`  


---

##  Available Scripts  

**Frontend**  
- `npm start` – Run dev server  
- `npm run build` – Production build  
- `npm test` – Run tests  

**Backend**  
- `npm run dev` – Start server with nodemon  
- `npm start` – Start server in production  

---

##  Deployment on Vercel  

### Frontend (React)  
1. Push code to GitHub.  
2. Go to [Vercel Dashboard](https://vercel.com).  
3. Import frontend repo and deploy.  
4. Add **Environment Variables** in Vercel → Project Settings → Environment Variables.  
5. Every push to `main` auto-deploys.  

### Backend (Express + MongoDB)  
1. Push backend code to GitHub.  
2. In Vercel, import backend repo.  
3. Use **Serverless Functions** (`api/` folder) or deploy using [Vercel Node.js support](https://vercel.com/docs/concepts/functions/serverless-functions).  
4. Add backend environment variables (`MONGO_URI`, `JWT_SECRET`, etc.) in Vercel.  
5. For MongoDB, use **MongoDB Atlas** (cloud-hosted DB).  
6. Update frontend `.env`:  
   ```env
   REACT_APP_API_URL=https://your-vercel-backend.vercel.app/api
   ```
7. Update `Backend/src -> app.js cors`:  
   ```env
   origin: ["http://localhost:3000", "http://10.22.7.56:3000", "https://Eventbooker.vercel.app", "Vercel Url Frontend"],
   ```
 Now your project runs fully on **Vercel (frontend + backend)** with MongoDB Atlas as the database.  

---

##  Future Enhancements  

- Real-time updates with WebSockets  
- Multi-role access (Super Admin, Organizer, User)  
- Analytics dashboard for event organizers  
- Mobile app integration  

---

##  Contributing  

Contributions are welcome! Fork the repo, create a feature branch, and submit a PR.  

---

##  License  

This project is licensed under the **MIT License**.  
