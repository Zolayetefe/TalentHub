# TalentHub

TalentHub is a role-based job platform with a Node.js/Express backend and a React/TypeScript/Vite frontend. It supports Applicants, Employers, and Admins, with features for job posting, applications, and resume management. The backend uses MongoDB for persistence and cookie-based JWT authentication, while the frontend provides a responsive UI with role-based access control.

## Table of Contents
- [Backend](#backend)
  - [Tech Stack](#backend-tech-stack)
  - [Getting Started](#backend-getting-started)
  - [Authentication API](#authentication-api)
  - [Job API](#job-api)
  - [Application API](#application-api)
  - [Error Handling](#error-handling)
  - [Development Notes](#backend-development-notes)
- [Frontend](#frontend)
  - [Tech Stack](#frontend-tech-stack)
  - [Features](#features)
  - [Getting Started](#frontend-getting-started)
  - [Scripts](#scripts)
  - [Project Structure](#project-structure)
  - [API Contracts](#api-contracts)
  - [UX Details](#ux-details)

## Backend

### Backend Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express
- **Database**: MongoDB + Mongoose
- **Authentication**: Cookie-based JWT
- **File Uploads**: Cloudinary (for resumes)

### Backend Getting Started

#### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

#### Installation
```bash
cd backend
npm install
```

#### Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/talenthub
JWT_SECRET=supersecret
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_EMAIL=
```

#### Running the Server
```bash
npm run dev   # Development (with nodemon)
npm start     # Production
```

### Authentication API

#### Register User
**Endpoint**: `POST /api/auth/register`  
**Roles**: Applicant | Employer  
**Description**: Creates a new user account.

**Request Body**:
```json
{
  "name": "Alice Doe",
  "email": "alice@example.com",
  "password": "password123",
  "role": "applicant"
}
```

**Responses**:
- **201 Created**  
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64fd7f2d1234567890abcd12",
    "name": "Alice Doe",
    "email": "alice@example.com",
    "role": "applicant"
  }
}
```
- **400 Bad Request** – User already exists  
- **400 Validation Error**  
```json
{
  "errors": [
    { "message": "Password is required" },
    { "message": "Password must be at least 6 characters long" }
  ]
}
```
- **500 Internal Server Error**  
```json
{ "message": "Error message" }
```

#### Login User
**Endpoint**: `POST /api/auth/login`  
**Description**: Authenticates a user and sets a cookie.

**Request Body**:
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Responses**:
- **200 OK**  
```json
{
  "message": "Login successful",
  "user": {
    "_id": "64fd7f2d1234567890abcd12",
    "name": "Alice Doe",
    "email": "alice@example.com",
    "role": "applicant"
  }
}
```
- **401 Unauthorized**  
```json
{ "message": "Invalid credentials" }
```
- **400 Validation Error**  
```json
{ "errors": [{ "message": "Password is required" }] }
```
- **500 Server Error**  
```json
{ "message": "Error message" }
```

#### Get Current User
**Endpoint**: `GET /api/auth/me`  
**Authentication**: Cookie-based JWT  

**Response (200 OK)**:
```json
{
  "user": {
    "_id": "64fd7f2d1234567890abcd12",
    "name": "Alice Doe",
    "email": "alice@example.com",
    "role": "applicant"
  }
}
```
- **401 Unauthorized**  
```json
{ "message": "Not authenticated" }
```

#### Logout
**Endpoint**: `GET /api/auth/logout`  
**Description**: Clears the authentication cookie.

**Response (200 OK)**:
```json
{ "message": "Logged out successfully" }
```

### Job API

#### Create Job
**Endpoint**: `POST /api/jobs`  
**Roles**: Employer / Admin  

**Request Body**:
```json
{
  "title": "Frontend Developer",
  "description": "Build modern UIs",
  "jobType": "FULL_TIME",
  "jobSite": "REMOTE",
  "location": { "city": "Berlin", "country": "Germany" },
  "skills": ["React", "TypeScript"],
  "sector": "Software",
  "experienceLevel": "JUNIOR",
  "deadline": "2025-12-31T00:00:00.000Z",
  "status": "OPEN"
}
```

**Responses**:
- **201 Created**  
```json
{
  "message": "Job created successfully",
  "job": {
    "_id": "64fd7f2d1234567890abcd34",
    "title": "Frontend Developer",
    "description": "Build modern UIs",
    "jobType": "FULL_TIME",
    "jobSite": "REMOTE",
    "location": { "city": "Berlin", "country": "Germany" },
    "skills": ["React", "TypeScript"],
    "sector": "Software",
    "experienceLevel": "JUNIOR",
    "deadline": "2025-12-31T00:00:00.000Z",
    "status": "OPEN"
  }
}
```
- **400 Validation Error**  
```json
{ "errors": [{ "message": "Job type must be one of: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE" }] }
```
- **500 Server Error**

#### Get All Jobs
**Endpoint**: `GET /api/jobs`  
**Public**

**Response (200 OK)**:
```json
[
  {
    "_id": "68a8deae056edde73c0e40f4",
    "title": "Backend Developer",
    "description": "We are seeking a skilled Backend Developer...",
    "jobType": "FULL_TIME",
    "jobSite": "REMOTE",
    "skills": ["Node.js", "MongoDB", "REST API", "Express.js"],
    "sector": "Information Technology",
    "experienceLevel": "MID",
    "deadline": "2025-10-01T00:00:00.000Z",
    "createdBy": { "_id": "68a8c1f7ac44647a41851fe0", "name": "employer", "email": "employer@gmail.com" },
    "status": "OPEN",
    "location": { "city": "NAIROBI", "country": "KENYA" },
    "createdAt": "2025-08-22T21:18:39.020Z",
    "updatedAt": "2025-08-26T09:48:10.703Z"
  }
]
```

#### Update Job Status
**Endpoint**: `PATCH /api/jobs/:jobId`  
**Roles**: Employer / Admin  

**Request Body**:
```json
{ "status": "CLOSED" }
```

**Responses**:
- **200 OK**  
```json
{
  "message": "Job status updated",
  "job": { ...job object... }
}
```
- **404 Not Found**  
```json
{ "message": "Job not found" }
```

#### Delete Job
**Endpoint**: `DELETE /api/jobs/:id`  
**Roles**: Employer / Admin  

**Responses**:
- **200 OK**  
```json
{ "message": "Job deleted successfully" }
```
- **404 Not Found**  
```json
{ "message": "Job not found" }
```

### Application API

#### Apply to Job
**Endpoint**: `POST /api/applications`  
**Roles**: Applicant only  
**Form-data**: Includes file upload (resume)  

**Fields**:
- `jobId` (required): ObjectId
- `coverLetter` (optional): String
- `resume` (required if resumeUrl not provided): File
- `resumeUrl` (optional): String (URL)

**Response (201 Created)**:
```json
{
  "message": "Application submitted successfully",
  "application": {
    "_id": "64fd7f2d1234567890abcd56",
    "jobId": "64fd7f2d1234567890abcd34",
    "status": "applied",
    "coverLetter": "Optional cover letter text",
    "resumeUrl": "https://res.cloudinary.com/.../resume.pdf"
  }
}
```

#### Get My Applications
**Endpoint**: `GET /api/applications/user`  
**Roles**: Applicant / Admin  

**Response (200 OK)**:
```json
[
  {
    "_id": "68a8ef04327d8391216e393e",
    "jobId": { ...job object... },
    "userId": { "_id": "68a8bb55a88392dbacfde08f", "name": "Zelalem Tefera", "email": "zedeyetefe@gmail.com" },
    "resumeUrl": "https://example.com/resume.pdf",
    "coverLetter": "Sample cover letter",
    "status": "shortlisted",
    "createdAt": "2025-08-22T22:28:20.177Z",
    "updatedAt": "2025-08-26T07:25:13.254Z"
  }
]
```

#### Update Application Status
**Endpoint**: `PATCH /api/applications/:applicationId`  
**Roles**: Employer / Admin  

**Request Body**:
```json
{ "status": "shortlisted" }
```

**Responses**:
- **200 OK**  
```json
{
  "message": "Application status updated successfully",
  "data": { ...application object... }
}
```
- **404 Not Found**  
```json
{ "message": "Application not found" }
```

### Error Handling
| Status Code | Description |
|-------------|-------------|
| 400         | Bad Request – Validation errors |
| 401         | Unauthorized – Missing or invalid cookie |
| 403         | Forbidden – Insufficient role permissions |
| 404         | Not Found – Resource missing |
| 500         | Internal Server Error – Unexpected errors |

**Example Validation Error**:
```json
{ "errors": [{ "msg": "Invalid email format" }] }
```

### Backend Development Notes
- Auth middleware sets `req.user` with `_id` and `role`
- Employers can manage only their own jobs
- Resumes are uploaded to Cloudinary before saving URL
- Admin has full access to all jobs and applications

## Frontend

### Frontend Tech Stack
- React, TypeScript, Vite
- React Router
- Tailwind CSS
- Axios
- react-hot-toast

### Features
- **Authentication**
  - Login, Register, Logout
  - Session restore via `/auth/me`
  - Redirect back to intended page after login
- **Role-based access control**
  - Guarded routes with `ProtectedRoute`
  - Applicant, Employer, Admin experiences
- **Jobs**
  - Public: browse jobs, job detail
  - Applicant: inline Jobs tab + My Applications tab (search/filters)
  - Employer: post jobs, view applicants, close/reopen jobs
  - Admin: view/filter all jobs, close/reopen/delete
- **Applications**
  - Applicant: apply with PDF upload (multipart) and/or URL, see status timeline
  - Employer/Admin: view applicants per job, shortlist/reject, inline resume preview (iframe)

### Frontend Getting Started

#### Prerequisites
- Node.js >= 18

#### Install
```bash
cd frontend
npm install
```

#### Environment
Create `.env` in the `frontend` directory:
```bash
VITE_API_URL=http://localhost:5000
```

#### Run Dev Server
```bash
npm run dev
```

#### Build
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

### Scripts
- `dev` – start Vite dev server
- `build` – type-check + production build
- `preview` – preview the production build
- `lint` – run ESLint

### Project Structure
```
src/
  components/        # Login, Register, LogoutButton, JobCard, etc.
  contexts/          # AuthContext (user, isAuthenticated, login, register, logout)
  pages/
    Home.tsx
    Jobs.tsx
    JobDetail.tsx
    applicant/       # ApplicantDashboard (Jobs + My Applications)
    employer/        # EmployerDashboard, JobApplications, PostJob
    admin/           # AdminDashboard
  routes/            # AppRoutes (protected routes)
  services/          # api.ts, authService.ts, jobService.ts, applicationService.ts
  types/             # Role, User, Job, Application
```

### API Contracts
- **Auth**
  - `POST /auth/login` → `{ user }`
  - `POST /auth/register` → `{ user }`
  - `GET /auth/me` → `{ user }`
  - `POST /auth/logout`
- **Jobs**
  - `GET /jobs` → `Job[]`
  - `GET /jobs/:id` → `Job`
  - `GET /jobs/employer/:employerId` → `Job[]`
  - `POST /jobs` → `Job`
  - `PATCH /jobs/:id` → `{ message, data: Job }`
  - `DELETE /jobs/:id`
- **Applications**
  - `POST /applications` (multipart or JSON) → `Application`
  - `GET /applications/user` → `Application[]`
  - `GET /applications/job/:jobId` → `Application[]`
  - `PATCH /applications/:id` → `Application`

**Notes**:
- `Application.jobId` and `Application.userId` may be a string id, a populated object, or null; UI helpers handle all cases.
- Axios client (`src/services/api.ts`) uses `withCredentials: true` for cookie-based auth.

### UX Details
- Login/Register pages show success/error toasts
- After login, user is redirected to the intended page (e.g., a specific job)
- Applicants see tabs for Jobs and My Applications with search/filters:
  - Search: title, description, location, sector, skills
  - Filters: jobType, jobSite, experienceLevel
- Employers/Admins can update application status (shortlist/reject)
- Resume preview is embedded via `<iframe>` with a fallback link