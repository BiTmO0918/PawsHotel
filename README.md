# PawsHotel

A full-stack web application for managing a pet hotel, allowing customers to book accommodations for their pets and giving administrators a central dashboard to manage reservations, users, and pricing.

---

## What is PawsHotel?

PawsHotel is a pet hotel management system built with **Angular** (frontend) and **Node.js + Express** (backend), backed by **MongoDB**. It covers the full lifecycle of a pet hotel booking:

- Customers register, log in, and create reservations for their pets, uploading photos and vaccination records.
- Admins manage all reservations, users, help requests, and pricing plans through a protected admin panel.

---

## Features

### For Customers
| Feature | Description |
|---|---|
| Register / Login | Create an account and authenticate with email and password |
| Create Reservation | Book a stay for a pet, including species, breed, dates, and uploaded documents |
| View & Edit Reservations | Manage existing bookings |
| Contact / Help Requests | Submit questions or support requests |
| Profile Management | Update personal information |

### For Admins
| Feature | Description |
|---|---|
| User Management | View all users, activate or deactivate accounts |
| Reservation Overview | See and manage reservations across all customers |
| Help Request Management | View and close customer support requests |
| Price Plan Management | Set prices for Comfort, Pro, and VIP accommodation tiers |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17, TypeScript, PrimeNG, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (via Mongoose) |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| File Uploads | Multer / express-fileupload |

---

## Project Structure

```
PawsHotel/
├── backend/
│   ├── app.js                  # Express app entry point
│   ├── authconfig.js           # JWT secret & admin email
│   ├── controllers/            # Business logic
│   ├── models/                 # Mongoose schemas (User, Reservation, HelpRequest)
│   ├── routes/                 # API route definitions
│   └── uploads/                # Stored pet photos & vaccination records
└── frontend/
    └── src/app/
        ├── components/         # Angular pages (home, login, reservations, admin, …)
        ├── services/           # HTTP services & shared state
        └── guards/             # Route protection (auth guard)
```

---

## Data Models

### User
```
firstName, lastName, email, phone, address, password (hashed), active
```

### Reservation
```
owner (email), localization, startDate, endDate,
animalName, animalSpecie, animalBreed,
photoURL, vaccinationCardURL, obs, discountCode, price, status
```

### HelpRequest
```
fullName, email, phone, subject, message, active
```

---

## API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login and receive JWT | Public |
| GET | `/auth/profile` | Get current user's profile | Authenticated |
| GET | `/reservations/list` | List own reservations | Authenticated |
| POST | `/reservations/create-reservation` | Create a reservation | Authenticated |
| PUT | `/reservations/update/:id` | Update a reservation | Authenticated |
| GET | `/reservations/list-all` | List all reservations | Admin |
| GET | `/users/all-users` | List all users | Admin |
| POST | `/users/inactive/:id` | Deactivate a user | Admin |
| POST | `/users/active/:id` | Activate a user | Admin |
| GET | `/price-plans/plans` | Get pricing tiers | Public |
| POST | `/price-plans/plans` | Update pricing tiers | Admin |
| POST | `/users/create-request` | Submit help request | Public |
| GET | `/users/all-requests` | View all help requests | Admin |

---

## Getting Started

### Prerequisites
- Node.js v14+
- Angular CLI (`npm install -g @angular/cli`)
- A MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/BiTmO0918/PawsHotel.git
cd PawsHotel
```

### 2. Backend setup
```bash
cd backend
npm install
npm start
# API available at http://localhost:3000
```

### 3. Frontend setup
```bash
cd frontend
npm install
ng serve
# App available at http://localhost:4200
```

> The frontend expects the backend to be running on `http://localhost:3000`. CORS is already configured for `http://localhost:4200`.

---

## Configuration

| Setting | Location | Default |
|---|---|---|
| MongoDB connection string | `backend/app.js` | MongoDB Atlas |
| JWT secret | `backend/authconfig.js` | `"doghotel"` |
| Admin email | `backend/authconfig.js` | `me@estg.ipp.pt` |
| Backend port | `backend/bin/www` | `3000` |
| Max file upload size | `backend/app.js` | `1 MB` |

To change the admin account, update the `adminEmail` value in `backend/authconfig.js`. Any user who logs in with that email address will receive admin privileges.

---

## Available Pricing Tiers

| Plan | Price/night |
|---|---|
| Comfort | €12 |
| Pro | €17 |
| VIP | €29 |

Prices are stored in `backend/uploads/pricePlans.json` and can be updated by an admin through the interface.

---

## Application Routes

| URL | Page | Access |
|---|---|---|
| `/` | Home (pricing & info) | Public |
| `/about-us` | About the hotel | Public |
| `/contact-us` | Contact form | Public |
| `/terms-of-service` | Terms | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/profile` | User profile | Authenticated |
| `/create-reservation` | New reservation | Authenticated |
| `/list-reservations` | My reservations | Authenticated |
| `/edit-reservation/:id` | Edit reservation | Authenticated |
| `/plans` | Manage price plans | Admin |
| `/list-users` | Manage users | Admin |
| `/list-requests` | Manage help requests | Admin |

---

## License

This project is for educational purposes.
