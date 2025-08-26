# TalentHub Frontend (React + TypeScript + Vite)

Role‑based job platform UI for Applicants, Employers, and Admins.

## Tech Stack
- React, TypeScript, Vite
- React Router
- Tailwind CSS
- Axios
- react-hot-toast

## Features
- Authentication
  - Login, Register, Logout
  - Session restore via `/auth/me`
  - Redirect back to intended page after login
- Role-based access control
  - Guarded routes with `ProtectedRoute`
  - Applicant, Employer, Admin experiences
- Jobs
  - Public: browse jobs, job detail
  - Applicant: inline Jobs tab + My Applications tab (search/filters)
  - Employer: post jobs, view applicants, close/reopen jobs
  - Admin: view/filter all jobs, close/reopen/delete
- Applications
  - Applicant: apply with PDF upload (multipart) and/or URL, see status timeline
  - Employer/Admin: view applicants per job, shortlist/reject, inline resume preview (iframe)

## Getting Started

### Prerequisites
- Node.js >= 18

### Install
```bash
npm install
```

### Environment
Create `.env` in project root:
```bash
VITE_API_URL=http://localhost:5000
```

### Run Dev Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Scripts
- `dev` – start Vite dev server
- `build` – type-check + production build
- `preview` – preview the production build
- `lint` – run ESLint

## Project Structure
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

## API Contracts (expected)
- Auth
  - `POST /auth/login` → `{ user }`
  - `POST /auth/register` → `{ user }`
  - `GET /auth/me` → `{ user }`
  - `POST /auth/logout`
- Jobs
  - `GET /jobs` → `Job[]`
  - `GET /jobs/:id` → `Job`
  - `GET /jobs/employer/:employerId` → `Job[]`
  - `POST /jobs` → `Job`
  - `PATCH /jobs/:id` → `{ message, data: Job }`
  - `DELETE /jobs/:id`
- Applications
  - `POST /applications` (multipart or JSON) → `Application`
  - `GET /applications/user` → `Application[]`
  - `GET /applications/job/:jobId` → `Application[]`
  - `PATCH /applications/:id` → `Application`

Notes:
- `Application.jobId` and `Application.userId` may be a string id, a populated object, or null; UI helpers handle all cases.
- Axios client (`src/services/api.ts`) uses `withCredentials: true` for cookie-based auth.

## UX Details
- Login/Register pages show success/error toasts
- After login, user is redirected to the intended page (e.g., a specific job)
- Applicants see tabs for Jobs and My Applications with search/filters:
  - Search: title, description, location, sector, skills
  - Filters: jobType, jobSite, experienceLevel
- Employers/Admins can update application status (shortlist/reject)
- Resume preview is embedded via `<iframe>` with a fallback link

## Troubleshooting
- Type import errors with `verbatimModuleSyntax`:
  - Ensure type-only imports, e.g. `import type { User } from "../types/types";`
- IDE shows module not found but `npm run build` succeeds:
  - Restart TS server / Reload window; the compiler is the source of truth
- CORS/auth issues:
  - Verify backend CORS allows credentials and same-site cookie settings

## License
MIT (adjust as needed)
