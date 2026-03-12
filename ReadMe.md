# Project Management System

A robust, full-stack task and project management solution designed for teams to organize workflows, track progress, and manage project health with strict role-based access control.

## Technical Architecture

### Backend Infrastructure
* **Core:** Node.js with Express 5.
* **Database:** MongoDB managed via Mongoose.
* **Security:** * `bcryptjs` for secure password hashing.
    * `jsonwebtoken` for stateless authentication with defined expiration.
    * `helmet` for securing HTTP headers.
    * `cors` and `dotenv` for secure environment management.

### Frontend Infrastructure
* **Framework:** React 19 with Vite.
* **State Management:** Redux Toolkit for complex global state.
* **Form Management:** React Hook Form combined with Yup for schema-based validation.
* **Styling:** Tailwind CSS (v4) for a responsive, utility-first design.
* **Data Fetching:** Axios service layer for centralized API communication.

---

## API Documentation

### Authentication
* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Authenticate and receive a JWT.

### Users
* `GET /api/users` - Retrieve all users (Admin only).

### Projects
* `POST /api/projects` - Create a new project.
* `GET /api/projects` - List projects (Users see their own, Admins see all).
* `GET /api/projects/:id` - Fetch specific project details.

### Tasks (Protected Routes)
* `POST /api/tasks` - Create a new task.
* `GET /api/tasks` - Get all tasks (can filter by `?projectId=`).
* `PATCH /api/tasks/:id` - Update task status.
* `PUT /api/tasks/:id` - Update full task details.
* `DELETE /api/tasks/:id` - Remove a task.

---

## User Flows

### 1. Authentication & Security
* Users register or log in to obtain a JWT.
* Protected routes ensure only authenticated users can access the Dashboard or specific project pages.
* Role-based permissions enforce strict data access.

### 2. Dashboard
* Provides a centralized list of all accessible projects.
* Includes visual summaries of project health: Total Tasks, Completed Tasks, and Pending Tasks.

### 3. Task Lifecycle
* **Task Management:** Create, update, and remove tasks based on authorization rules.
* **Filtering:** Dynamic filtering by status (Pending, In Progress, On Hold, Completed) to manage task flow.
* **Assignments:** Ability to assign tasks to specific team members.

---

## Setup Instructions

### Prerequisites
* Node.js (v20+)
* MongoDB Instance (Local or Atlas)
* npm

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a `.env` file with: `MONGO_URI`, `JWT_SECRET`, and `PORT`.
3. Install dependencies: `npm install`
4. Run server: `npm start` (utilizes `nodemon` for auto-reloading).
5. Seed initial data (optional): `npm run seed`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`