# TalentLink

TalentLink is a comprehensive recruitment and candidate management platform designed to streamline the hiring process using modern web technologies and AI integration.

## 🚀 Project Overview

The project is structured into two main components:

- **Backend:** A robust API server built with Node.js, Express, and Prisma ORM. It manages authentication, candidate data, and provides specialized services for AI coaching.
- **Frontend:** A dynamic and responsive user interface built with Next.js, React, and Tailwind CSS. It offers a seamless experience for recruiters and candidates alike.

## 🛠️ Tech Stack

### Backend

- **Framework:** [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Passport.js](https://www.passportjs.org/) (Google & GitHub OAuth), JSON Web Tokens (JWT)
- **File Handling:** [Multer](https://github.com/expressjs/multer)
- **Utilities:** Axios, Bcryptjs, Nodemailer

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts:** [Chart.js](https://www.chartjs.org/)

## 📂 Project Structure

```text
talentLink/
├── backend/            # Express API server
│   ├── prisma/         # Database schema and migrations
│   ├── services/       # Micro-services (auth, ai-coach, candidate)
│   └── src/            # Core backend logic
├── frontend/           # Next.js application
│   ├── src/            # React components and pages
│   └── public/         # Static assets
└── README.md           # This file
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL database (for Prisma)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables in a `.env` file (see `.env.example` if available).
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🌟 Key Features

- **Centralized Authentication:** Secure login using Google and GitHub.
- **AI-Powered Coaching:** Integrated AI tools to assist candidates.
- **Candidate Management:** Comprehensive dashboard for managing candidate profiles and applications.
- **Real-time Analytics:** Visual data representation using Chart.js.

---

Developed by [Your Name/Team]
