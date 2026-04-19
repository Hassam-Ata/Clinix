# AI-Powered Hospital Appointment System – Frontend Plan

## 1. Overview
This document outlines the frontend architecture, technology stack, folder structure, and core integration strategies for the Clinix Healthcare Platform. The frontend will communicate seamlessly with the backend REST APIs, supporting three primary actor roles: **Patient**, **Doctor**, and **Admin**.

## 2. Technology Stack
- **Framework**: React.js (via Vite or Next.js)
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui (radix-ui under the hood)
- **Data Fetching & Caching**: `@tanstack/react-query` (React Query)
- **Routing**: React Router DOM (or Next.js App Router)
- **Form Management**: `react-hook-form` + `zod` for request validation
- **State Management**: React Context / Zustand (for Auth state like tokens and current user role)
- **Icons**: Lucide React

## 3. Core Dependencies & Shadcn Components
### Shadcn Components to Install
\`\`\`bash
npx shadcn-ui@latest add button card dialog dropdown-menu input label sheet table tabs toast avatar form select date-picker badge skeleton
\`\`\`

### Other Libraries
- `axios`: For configuring interceptors (adding Bearer tokens to all requests).
- `@stripe/react-stripe-js`: For handling the payment stripe integration.
- `date-fns`: For formatting appointment times and dates.

## 4. Application Routing & Layouts
The application will use role-based layouts to protect routes.

### Public Routes
- `/` - Landing Page
- `/auth/login` - Login Page (handles all roles)
- `/auth/register` - Registration Page (PATIENT or DOCTOR)

### Patient Routes (Wrapped in `<PatientLayout>`)
- `/patient/dashboard` - Overview (Summary, Spending)
- `/patient/doctors` - Browse & Search all approved doctors
- `/patient/ai-assistant` - Chat interface for AI symptom checker
- `/patient/appointments` - Upcoming and History
- `/patient/payments` - Payments history

### Doctor Routes (Wrapped in `<DoctorLayout>`)
- `/doctor/onboard` - Onboarding form (Documents, Specialization, Fees)
- `/doctor/dashboard` - Dashboard (Summary, Today, Upcoming, Earnings)
- `/doctor/appointments` - Manage appointment requests (Accept/Reject/Complete)
- `/doctor/availability` - Manage Weekly Schedule slots
- `/doctor/profile` - Edit profile info

### Admin Routes (Wrapped in `<AdminLayout>`)
- `/admin/dashboard` - Global platform analytics (Overview, Revenue)
- `/admin/doctors` - List doctors (Pending/Approved) & Approve Doctor action
- `/admin/appointments` - View all platform appointments
- `/admin/payments` - View all platform payments

## 5. React Query Configuration & Hooks

We will use a centralized API client (e.g., `axios` instance) that automatically attaches the JWT token from local storage. 
React Query will be used to generate custom hooks for clean component layers.

### Authentication Hooks
- `useLogin()`: `POST /auth/login` (On success: store token, redirect based on role)
- `useRegister()`: `POST /auth/register`

### Patient Hooks
- `usePatientDashboard()`: Parallel queries for `/patient/dashboard/summary`, `upcoming`, `history`, `payments`, `spending`
- `useBookAppointment()`: `POST /appointment`
- `useCancelAppointment()`: `PATCH /appointment/:id/cancel`
- `useCreatePaymentSession()`: `POST /payment/create-session`

### Doctor Hooks
- `useDoctorProfile()`: `GET /doctor/me`
- `useUpdateProfile()`: `PATCH /doctor/me`
- `useDoctorOnboard()`: `POST /doctor/onboard`
- `useDoctorDashboard()`: Queries for `summary`, `today`, `upcoming`, `completed`, `earnings`
- `useDoctorAvailability()`: `GET /doctor/availability/me`
- `useAddAvailability()`: `POST /doctor/availability`
- `useDeleteAvailability()`: `DELETE /doctor/availability/:id`
- `useDoctorAppointments()`: `GET /appointment/doctor`
- `useUpdateAppointmentStatus()`: `PATCH /appointment/:id/status` (Accept/Reject)
- `useCompleteAppointment()`: `PATCH /appointment/:id/complete`

### Admin Hooks
- `useAdminDashboard()`: Queries for `/admin/dashboard/*` endpoints.
- `useApproveDoctor()`: `PATCH /doctor/approve/:id`
- `useGetAllDoctors()`: `GET /doctor/all`

## 6. Core Features Implementation

### 6.1 Authentication Flow
1. User logs in.
2. The server returns a JWT token containing `id` and `role`.
3. The frontend stores this token (in LocalStorage/Zustand), updates the global auth state, and router redirects users based on their role (`PATIENT` -> `/patient/dashboard`, `DOCTOR` -> `/doctor/dashboard`, `ADMIN` -> `/admin/dashboard`).

### 6.2 Doctor Onboarding Flow
1. Upon first login, if the Doctor's status is `PENDING_APPROVAL` or uncompleted, redirect to `/doctor/onboard`.
2. Form collects: Specialization (Select Component), Fees (Input), Document URL (Upload interface).
3. Wait for Admin approval. The dashboard displays a "Pending Admin Approval" skeleton/banner until the status changes.

### 6.3 Patient AI Symptom Assistant
1. Patient interacts with an AI Chat UI (`/patient/ai-assistant`).
2. Input is passed to a backend endpoint (or frontend directly, depending on API key security) that connects to Gemini API.
3. Once Gemini returns a specialization (e.g., "Cardiology"), React Query fetches `GET /doctor/all` and filters by the returned specialization.
4. Patient is shown a list of relevant doctors and can book immediately.

### 6.4 Booking & Payment Flow
1. Patient picks a doctor and an available slot.
2. `useBookAppointment` is triggered.
3. Patient sees the appointment as `PENDING`.
4. Doctor accepts the appointment (triggering `status: ACCEPTED`).
5. Patient is notified and clicks "Pay".
6. `useCreatePaymentSession` triggers Stripe Checkout.
7. Upon successful payment, zoom link becomes active.

## 7. Next Steps
1. Initialize the Vite/Next.js project.
2. Configure Tailwind CSS and initialize shadcn.
3. Setup React Router.
4. Create the global Axios instance (with auth interceptors) and `QueryClientProvider` wrapper.
5. Scaffold out high-level layout components (Sidebars, Navbars for different roles).
