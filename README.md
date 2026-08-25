# GATE Previous Year Questions (PYQ) Platform

A production-grade MERN stack web platform for GATE exam preparation with a three-tier hierarchy: **Branch → Subject → Year → Question**.

## Project Structure

```
c:\Gate pyq website\
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   │   └── questionController.js  # API route handlers
│   ├── middleware/
│   │   │   └── auth.js           # Admin API key auth
│   ├── models/
│   │   │   └── Question.js       # Mongoose schema & indexes
│   ├── routes/
│   │   │   └── questionRoutes.js # Express routes
│   ├── scripts/
│   │   │   └── uploadPYQs.js     # Bulk JSON upload script
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express entry point
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── store.js          # Redux store config
│   │   │   └── slices/
│   │   │       ├── filterSlice.js    # Branch/Subject/Year state
│   │   │       └── testSlice.js      # Test state & scoring
│   │   ├── components/
│   │   │   ├── LatexRenderer.jsx     # KaTeX LaTeX rendering
│   │   │   ├── QuestionViewer.jsx    # Question display & interaction
│   │   │   ├── QuestionPalette.jsx   # Navigation sidebar
│   │   │   └── ExamInterface.jsx     # Main exam UI
│   │   ├── pages/
│   │   │   └── ExamPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── pyq_data.json                 # Sample question data
└── README.md
```

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas or local MongoDB instance
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd "c:\Gate pyq website\backend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:
   ```bash
   copy .env.example .env
   ```

4. Update `.env` with your MongoDB URI and admin API key:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gate_pyq
   ADMIN_API_KEY=your-secure-admin-api-key-here
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd "c:\Gate pyq website\frontend"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser.

### Bulk Upload Questions

1. Prepare your `pyq_data.json` file in the project root with an array of question objects.

2. Run the upload script from the backend directory:
   ```bash
   npm run seed
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/branches` | Get distinct branches |
| GET | `/api/v1/subjects?branch=XYZ` | Get subjects for a branch |
| GET | `/api/v1/years?branch=XYZ&subject=ABC` | Get years for branch+subject |
| GET | `/api/v1/questions?branch=XYZ&subject=ABC&year=YYYY` | Get filtered questions |
| POST | `/api/v1/admin/bulk-upload` | Bulk upload questions (protected) |

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React 18, Redux Toolkit, Tailwind CSS, Vite
- **LaTeX:** react-katex
- **State Management:** Redux Toolkit slices

## Key Features

- Three-tier hierarchy navigation (Branch → Subject → Year)
- Distraction-free exam interface with question palette
- Support for MCQ, MSQ, and NAT question types
- LaTeX rendering for mathematical formulas
- Timer with auto-submit
- Mark for review functionality
- Score calculation with partial marking for MSQ
- Bulk upload utility with validation
- Compound MongoDB indexes for fast queries