# Hospital Management System

A web-based hospital management system with role-based access for different staff members.

## Features

- **Admin**: Dashboard and staff management
- **Doctor**: View appointments and medicines  
- **Receptionist**: Manage patients, appointments, and billing
- **Pharmacist**: Manage medicine inventory

## Installation

1. Install dependencies:
   ```bash
   npm install express cors jsonwebtoken bcryptjs
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. Open `index.html` in your browser

## Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Doctor | doctor | doctor123 |
| Receptionist | receptionist | recept123 |
| Pharmacist | pharmacist | pharm123 |

## Tech Stack

- **Backend**: Node.js, Express.js, JWT authentication
- **Frontend**: HTML, CSS, JavaScript
- **Storage**: In-memory (demo purposes)

## Main Functions

- Patient registration and management
- Appointment scheduling with doctors
- Medicine inventory with stock tracking
- Billing system with automatic tax calculation
- Dashboard analytics for admins

## Key Files

- `server.js` - Backend API server
- `index.html` - Frontend application

## Notes

- Sample data exists
- Data resets when server restarts
- Responsive design for mobile and desktop
