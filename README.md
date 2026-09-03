# 🏥 Smart Healthcare — Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-9-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-78%20E2E%20tests-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-Docker-009639?style=for-the-badge&logo=nginx&logoColor=white)

The web client for the **Smart Healthcare Appointment System** — a role-aware dashboard where
admins manage the clinic, doctors run their schedule and write prescriptions, and patients book
visits and read their own medical record.

Built with **React 19**, **TypeScript**, **MUI v9** and **SCSS Modules**, protected by
**JWT route guards**, and covered end to end by **78 Playwright tests** that all run in parallel.

**Backend API:** [Smart-Healthcare-Appointment-System](https://github.com/khdour17/Smart-Healthcare-Appointment-System) — Spring Boot 4, MySQL + MongoDB, JWT.

</div>

---

## 📑 Table of Contents

- [Screens](#-screens)
- [Features by Role](#-features-by-role)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Routing & Guards](#-routing--guards)
- [Authentication & Session](#-authentication--session)
- [Talking to the API](#-talking-to-the-api)
- [What Each Screen Calls](#-what-each-screen-calls)
- [Dashboards & Analytics](#-dashboards--analytics)
- [Design System](#-design-system)
- [Styling Rules](#-styling-rules)
- [Reusable Components](#-reusable-components)
- [State & Data Loading](#-state--data-loading)
- [Accessibility](#-accessibility)
- [Performance](#-performance)
- [End-to-End Tests](#-end-to-end-tests)
- [Screenshot Script](#-screenshot-script)
- [Setup & Installation](#-setup--installation)
- [Docker](#-docker)
- [npm Scripts](#-npm-scripts)
- [Code Conventions](#-code-conventions)
- [Troubleshooting](#-troubleshooting)
- [Demo Accounts](#-demo-accounts)

---

## 📸 Screens

<div align="center">

### Sign in
![Login](smart-healthcare-frontend/screenshots/01-login.png)

### Admin dashboard
![Admin dashboard](smart-healthcare-frontend/screenshots/03-admin-dashboard.png)

### Doctor schedule — week calendar
![Doctor schedule](smart-healthcare-frontend/screenshots/31-doctor-schedule-calendar.png)

### Patient books a visit
![Book appointment](smart-healthcare-frontend/screenshots/13-patient-book-appointment.png)

### A patient's medical record
![Medical record](smart-healthcare-frontend/screenshots/20-patient-medical-record.png)

</div>

<details>
<summary><b>All 44 screens (click to open)</b></summary>

| # | Screen | File |
|---|--------|------|
| 01 | Login | `smart-healthcare-frontend/screenshots/01-login.png` |
| 02 | Login — wrong password | `smart-healthcare-frontend/screenshots/02-login-error.png` |
| 03 | Admin dashboard | `smart-healthcare-frontend/screenshots/03-admin-dashboard.png` |
| 04 | Admin — doctors | `smart-healthcare-frontend/screenshots/04-admin-doctors.png` |
| 05 | Admin — add doctor | `smart-healthcare-frontend/screenshots/05-admin-add-doctor.png` |
| 06 | Admin — rows selected | `smart-healthcare-frontend/screenshots/06-admin-selected-rows.png` |
| 07 | Admin — delete dialog | `smart-healthcare-frontend/screenshots/07-admin-delete-dialog.png` |
| 08 | Admin — patients | `smart-healthcare-frontend/screenshots/08-admin-patients.png` |
| 09 | Admin — admins | `smart-healthcare-frontend/screenshots/09-admin-admins.png` |
| 10 | Admin — profile (read only) | `smart-healthcare-frontend/screenshots/10-admin-profile.png` |
| 11 | Toast after booking | `smart-healthcare-frontend/screenshots/11-toast-after-booking.png` |
| 12 | Patient — appointments calendar | `smart-healthcare-frontend/screenshots/12-patient-appointments-calendar.png` |
| 13 | Patient — book appointment | `smart-healthcare-frontend/screenshots/13-patient-book-appointment.png` |
| 14 | Patient — appointments list | `smart-healthcare-frontend/screenshots/14-patient-appointments-list.png` |
| 15 | Patient — cancel dialog | `smart-healthcare-frontend/screenshots/15-patient-cancel-dialog.png` |
| 16 | Patient dashboard | `smart-healthcare-frontend/screenshots/16-patient-dashboard.png` |
| 17 | Patient — appointment details | `smart-healthcare-frontend/screenshots/17-patient-appointment-details.png` |
| 18 | Patient — prescriptions | `smart-healthcare-frontend/screenshots/18-patient-prescriptions.png` |
| 19 | Patient — prescription details | `smart-healthcare-frontend/screenshots/19-patient-prescription-details.png` |
| 20 | Patient — medical record | `smart-healthcare-frontend/screenshots/20-patient-medical-record.png` |
| 21 | Patient — record filtered | `smart-healthcare-frontend/screenshots/21-patient-record-filtered.png` |
| 22 | Patient — profile | `smart-healthcare-frontend/screenshots/22-patient-profile.png` |
| 23 | Patient — edit profile | `smart-healthcare-frontend/screenshots/23-patient-edit-profile.png` |
| 24 | Settings | `smart-healthcare-frontend/screenshots/24-settings.png` |
| 25 | Collapsed side menu | `smart-healthcare-frontend/screenshots/25-collapsed-menu.png` |
| 26 | User menu | `smart-healthcare-frontend/screenshots/26-user-menu.png` |
| 27 | Not found | `smart-healthcare-frontend/screenshots/27-not-found.png` |
| 28 | Mobile dashboard | `smart-healthcare-frontend/screenshots/28-mobile-dashboard.png` |
| 29 | Mobile menu | `smart-healthcare-frontend/screenshots/29-mobile-menu.png` |
| 30 | Doctor dashboard | `smart-healthcare-frontend/screenshots/30-doctor-dashboard.png` |
| 31 | Doctor — schedule calendar | `smart-healthcare-frontend/screenshots/31-doctor-schedule-calendar.png` |
| 32 | Doctor — schedule list | `smart-healthcare-frontend/screenshots/32-doctor-schedule-list.png` |
| 33 | Doctor — complete a visit | `smart-healthcare-frontend/screenshots/33-doctor-complete-appointment.png` |
| 34 | Doctor — add prescription | `smart-healthcare-frontend/screenshots/34-doctor-add-prescription.png` |
| 35 | Doctor — appointment details | `smart-healthcare-frontend/screenshots/35-doctor-appointment-details.png` |
| 36 | Doctor — work hours calendar | `smart-healthcare-frontend/screenshots/36-doctor-work-hours-calendar.png` |
| 37 | Doctor — work hours list | `smart-healthcare-frontend/screenshots/37-doctor-work-hours-list.png` |
| 38 | Doctor — add work hours | `smart-healthcare-frontend/screenshots/38-doctor-add-work-hours.png` |
| 39 | Doctor — prescriptions | `smart-healthcare-frontend/screenshots/39-doctor-prescriptions.png` |
| 40 | Doctor — edit prescription | `smart-healthcare-frontend/screenshots/40-doctor-edit-prescription.png` |
| 41 | Doctor — prescription details | `smart-healthcare-frontend/screenshots/41-doctor-prescription-details.png` |
| 42 | Doctor — medical records | `smart-healthcare-frontend/screenshots/42-doctor-medical-records.png` |
| 43 | Doctor — add record entry | `smart-healthcare-frontend/screenshots/43-doctor-add-record-entry.png` |
| 44 | Doctor — profile | `smart-healthcare-frontend/screenshots/44-doctor-profile.png` |

</details>

---

## 👥 Features by Role

The left menu, the routes and the API calls all follow the role in the JWT.

### 🛡 Admin

| Feature | Where |
|---------|-------|
| Clinic overview — counts, appointments by status, last 7 days, doctors per specialty | `/dashboard` |
| List, add and delete doctors | `/dashboard/doctors` |
| List, add and delete patients | `/dashboard/patients` |
| List, add and delete admins (never yourself) | `/dashboard/admins` |
| Delete several rows at once, with a confirm dialog that names the count | every list page |
| Read-only profile — an admin is changed by another admin | `/dashboard/profile` |

### 🩺 Doctor

| Feature | Where |
|---------|-------|
| Personal overview — today, upcoming, patients seen, hours per weekday | `/dashboard` |
| Week calendar or list of every appointment booked with him | `/dashboard/schedule` |
| Complete a visit and write the notes | `/dashboard/schedule` |
| Write, edit and delete a prescription for a completed visit | `/dashboard/schedule`, `/dashboard/prescribed` |
| Set the working days, hours and slot length | `/dashboard/availability` |
| Open any patient's record and add, edit or delete entries | `/dashboard/records` |
| Edit his own name and specialty | `/dashboard/profile` |

### 🙋 Patient

| Feature | Where |
|---------|-------|
| Personal overview — upcoming, completed, prescriptions, next visit | `/dashboard` |
| Book a visit: filter by specialty, pick a doctor, a date and a free slot | `/dashboard/appointments` |
| Week calendar or list of his own appointments | `/dashboard/appointments` |
| Cancel a scheduled visit, delete a cancelled one | `/dashboard/appointments` |
| Read every prescription written for him | `/dashboard/prescriptions` |
| Read his own medical record — visits, prescriptions and doctor notes on one timeline | `/dashboard/medical-record` |
| Edit his own name, date of birth, phone and address | `/dashboard/profile` |

### Shared by everyone

- **Profile** and **Settings** pages
- **Collapsible side menu** that remembers the choice
- **Calendar / list toggle** that remembers the choice per page
- **Toast notifications** on every create, update, cancel and delete
- **Responsive layout** — the side menu turns into a drawer under 900px

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| UI library | **React 19** | Function components and hooks only |
| Language | **TypeScript 6** (strict) | No `any`, no unused locals |
| Build | **Vite 8** | Fast dev server, hashed production assets |
| Components | **MUI v9** | Accessible primitives, no hand-rolled widgets |
| Styling | **SCSS Modules** + a small mixin library | Scoped class names, zero inline styles |
| Routing | **React Router 7** | Nested routes with guard elements |
| HTTP | **Axios** | One client with token and 401 interceptors |
| Auth | **jwt-decode** | Reads role and expiry out of the token |
| Testing | **Playwright** | 78 end-to-end tests, 4 workers |
| Serving | **nginx** (Docker) | Static files + `/api` proxy to the backend |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                           Browser                            │
│                                                              │
│    AppRouter ─► RequireAuth ─► RequireRole ─► MainLayout     │
│                              │                               │
│                  Header · LeftMenu · Outlet                  │
│                              │                               │
│              pages · shared views · components               │
│                                                              │
└────────────────────────────────┬─────────────────────────────┘
                                 │  axios (httpClient)
                                 │  Authorization: Bearer <jwt>
                                 ▼
                        nginx  /api  ──►  Spring Boot :8080
                                              │
                                    MySQL ────┴──── MongoDB
```

**The rules the codebase follows**

1. **A page never calls axios directly.** Every request lives in `src/api/<domain>/<Domain>API.ts`.
2. **A page never holds styling.** No inline `style`, no `sx` — every class lives in a `.module.scss` next to the component.
3. **A component is only shared when three pages need it.** MUI covers the rest.
4. **Anything repeated in two places moves into `src/utils` or a SCSS mixin.**

---

## 📁 Project Structure

```
src/
├── analytics/                 Pure functions that turn API data into chart points
│   ├── adminAnalytics.ts          busiest doctors, doctors per specialty
│   ├── appointmentAnalytics.ts    status share, last 7 days, upcoming
│   ├── doctorAnalytics.ts         weekly working hours
│   └── patientAnalytics.ts        visits per doctor
│
├── api/                       One file per backend domain, axios only lives here
│   ├── admin/AdminAPI.ts
│   ├── appointments/AppointmentsAPI.ts
│   ├── auth/LoginAPI.ts · RegisterAPI.ts
│   ├── availability/AvailabilityAPI.ts
│   ├── doctors/DoctorsAPI.ts
│   ├── medicalRecords/MedicalRecordsAPI.ts
│   ├── patients/PatientsAPI.ts
│   └── prescriptions/PrescriptionsAPI.ts
│
├── components/                Reusable UI, each with its own .module.scss
│   ├── BarChart/              Bar chart built from divs, no chart library
│   ├── CalendarToolbar/       Week navigation + calendar/list toggle
│   ├── ConfirmDialog/         Confirm before a destructive action
│   ├── DataTable/             Table with optional row selection
│   ├── Drawer/                Right-hand drawer that every form opens in
│   ├── PageHeader/            Title, subtitle and the page actions
│   ├── ShareBar/              Proportional bar with a legend
│   ├── StatTiles/             Row of labelled numbers
│   └── WeekCalendar/          Week grid that places items by real start time
│
├── contexts/                  AuthContext (user + token) and ToastContext
├── routes/                    AppRouter and the RequireAuth / RequireRole guards
├── styles/                    _variables, _mixins, _common, global
├── theme/                     MUI dark theme — only truly global overrides
├── types/                     Shared unions (AppointmentStatus, DayOfWeek)
│
├── utils/
│   ├── appointmentTone.ts     Appointment status → calendar colour
│   ├── authStorage.ts         Token in localStorage, session expiry
│   ├── byNewestFirst.ts · bySoonestFirst.ts   Sort helpers
│   ├── classNames.ts          Joins class names, skips falsy ones
│   ├── formatTime.ts · todayIso.ts · weekDates.ts
│   ├── getInitials.ts         Avatar initials
│   ├── httpClient.ts          The axios instance and its interceptors
│   ├── openNativePicker.ts    Opens the native date picker on click
│   ├── preferences.ts         Menu and per-page view choices
│   ├── useLatestCall.ts       Drops a response a newer call already replaced
│   ├── useLoadedData.ts       load / isLoading / error / reload in one hook
│   └── useToast.ts            Shortcut into ToastContext
│
└── views/
    ├── layouts/MainLayout/    Header, LeftMenu, mobile drawer, Outlet
    ├── pages/
    │   ├── Admin/             DashboardPage, DoctorsPage, PatientsPage, AdminsPage
    │   ├── Doctor/            DashboardPage, SchedulePage, WorkHoursPage,
    │   │                      PrescriptionsPage, MedicalRecordsPage
    │   ├── Patient/           DashboardPage, AppointmentsPage,
    │   │                      PrescriptionsPage, MedicalRecordsPage
    │   ├── LoginPage/
    │   └── NotFoundPage/
    └── shared/                Views more than one role renders
        ├── AppointmentDetails/    Visit + its prescription
        ├── AppointmentStatusChip/ Scheduled · Completed · Cancelled
        ├── PatientRecord/         Summary + filterable timeline
        ├── PrescriptionDetails/   Diagnosis, medicines, instructions
        ├── PrescriptionForm/      Create and edit a prescription
        ├── ProfilePage/           Profile for all three roles
        ├── SettingsPage/          Session details and the menu preference
        └── UserListPage/          The list page behind doctors/patients/admins
```

---

## 🧭 Routing & Guards

Every page is lazy loaded, so a role only downloads the screens it can open.

| Path | Who | Page |
|------|-----|------|
| `/login` | everyone | Sign in |
| `/dashboard` | any signed-in user | Admin, Doctor or Patient dashboard by role |
| `/dashboard/profile` | any signed-in user | Profile |
| `/dashboard/settings` | any signed-in user | Settings |
| `/dashboard/doctors` | `ADMIN` | Doctors |
| `/dashboard/patients` | `ADMIN` | Patients |
| `/dashboard/admins` | `ADMIN` | Admins |
| `/dashboard/schedule` | `DOCTOR` | Appointments booked with him |
| `/dashboard/availability` | `DOCTOR` | Work hours |
| `/dashboard/prescribed` | `DOCTOR` | Prescriptions he wrote |
| `/dashboard/records` | `DOCTOR` | Any patient's record |
| `/dashboard/appointments` | `PATIENT` | His appointments |
| `/dashboard/prescriptions` | `PATIENT` | His prescriptions |
| `/dashboard/medical-record` | `PATIENT` | His record |
| anything else | everyone | 404 |

**`RequireAuth`** sends a visitor with no valid token to `/login`.
**`RequireRole`** sends a signed-in user who opens someone else's page back to `/dashboard` —
so typing an admin URL as a patient never shows admin data, not even for a frame.

---

## 🔑 Authentication & Session

### Signing in

```
LoginPage ──► POST /api/auth/login
                    │
                    ▼
   { token, id, username, email, role, roleEntityId }
                    │
        saveSession(token, user)  ──► localStorage
                    │
        AuthContext.setUser(user)
                    │
                    ▼
        Navigate to /dashboard
```

`AuthContextProvider` reads `localStorage` once on start-up, so a reload keeps you signed in.
It checks the expiry before trusting what it finds:

```ts
function getInitialUser(): AuthUser | null {
  const token = getToken();
  const storedUser = getStoredUser();
  if (token && storedUser && !isTokenExpired(token)) {
    return storedUser;
  }
  clearSession();
  return null;
}
```

### What is stored

| Key | Value | Why |
|-----|-------|-----|
| `token` | The raw JWT | Sent on every request by the axios interceptor |
| `user` | `id`, `username`, `email`, `role`, `roleEntityId` | Avoids decoding the token on every render |
| `menuCollapsed` | `true` / `false` | The side-menu preference |
| `pageView.<page>` | `calendar` / `list` | The view each page opens in |

`roleEntityId` is the doctor or patient row behind the account. It is what turns "me" into
`/api/appointments/patient/12` without an extra lookup.

### Signing out

Three things end a session, and all of them land on `/login`:

| Trigger | What happens |
|---------|--------------|
| **Logout** in the user menu | `clearSession()`, `setUser(null)`, navigate to `/login` |
| **A 401 from any call** except login | The interceptor drops the token and redirects — this is how an expired token is caught mid-session |
| **An expired token found on start-up** | `AuthContextProvider` clears it before rendering anything |

The Settings page reads the expiry straight out of the token, so a user can see when the session
ends:

```ts
const expiry = getSessionExpiry(token);   // jwtDecode(token).exp * 1000
```

---

## 🔌 Talking to the API

`src/utils/httpClient.ts` is the only axios instance in the app.

```ts
const api = axios.create({ baseURL: '/api' });

// Every request carries the token
api.interceptors.request.use((config) => { /* Authorization: Bearer <token> */ });

// A 401 on anything except the login call means the session died:
// drop the token and go back to /login
api.interceptors.response.use(response => response, (error) => { /* ... */ });
```

`baseURL` is a relative `/api`, so the same build works in every environment:

- **`npm run dev`** — Vite proxies `/api` to `http://localhost:8080`
- **Docker** — nginx proxies `/api` to `http://healthcare-app:8080/api/`

Each domain file exports typed request and response models plus the calls, for example:

```ts
export async function getAvailableSlots(doctorId: number, date: string): Promise<AvailableSlotResponse[]>
export async function bookAppointment(patientId: number, request: AppointmentRequest): Promise<AppointmentResponse>
export async function cancelAppointment(appointmentId: number): Promise<void>
```

---

## 🗺 What Each Screen Calls

Useful when tracing a bug: every screen and the endpoints behind it.

| Screen | Calls |
|--------|-------|
| Login | `POST /auth/login` |
| Admin dashboard | `GET /doctors` · `GET /patients` · `GET /admin` · `GET /appointments` |
| Doctor dashboard | `GET /appointments/doctor/{id}` · `GET /availability/doctor/{id}` · `GET /prescriptions/doctor/{id}` |
| Patient dashboard | `GET /appointments/patient/{id}` · `GET /prescriptions/patient/{id}` |
| Admin → Doctors | `GET /doctors` · `POST /auth/register/doctor` · `DELETE /doctors` |
| Admin → Patients | `GET /patients` · `POST /auth/register/patient` · `DELETE /patients` |
| Admin → Admins | `GET /admin` · `POST /auth/register/admin` · `DELETE /admin` |
| Doctor → Appointments | `GET /appointments/doctor/{id}` · `GET /prescriptions/doctor/{id}` · `PATCH /appointments/{id}/complete` · `POST /prescriptions` |
| Doctor → Work Hours | `GET /availability/doctor/{id}` · `POST /availability/doctor/{id}` · `DELETE /availability/{id}` |
| Doctor → Prescriptions | `GET /prescriptions/doctor/{id}` · `PUT /prescriptions/{id}` · `DELETE /prescriptions/{id}` |
| Doctor → Medical Records | `GET /patients` · `GET /medical-records/patient/{id}` · `POST` · `PUT` · `DELETE /medical-records/{id}` |
| Patient → Appointments | `GET /appointments/patient/{id}` · `GET /doctors` · `GET /appointments/available-slots` · `POST /appointments/patient/{id}` · `PATCH /appointments/{id}/cancel` · `DELETE /appointments/{id}` |
| Patient → Prescriptions | `GET /prescriptions/patient/{id}` |
| Patient → Medical Record | `GET /medical-records/patient/{id}` |
| Profile | `GET /doctors/search` · `GET /patients/search` · `GET /admin/search` · `PUT /doctors/{id}` · `PUT /patients/{id}` |
| Settings | none — it reads the token |

### The rules the UI mirrors

The API is the authority, but the UI does not offer an action the API would reject:

| Rule | How the screen shows it |
|------|-------------------------|
| A slot must be free | The Time field only lists slots from `available-slots` |
| A day the doctor does not work has none | The Time field stays disabled and reads *"Doctor not available on SUNDAY"* |
| Only a scheduled visit can be cancelled | The cancel icon appears on scheduled rows only |
| Only a cancelled visit can be deleted | The delete icon appears on cancelled rows only |
| Only a completed visit can be prescribed for | The prescription icon appears on completed rows without one |
| A prescription needs at least one medicine | Save stays disabled until a medicine chip exists |
| An admin cannot edit his own profile | The profile page has no Edit button and says why |

When the API refuses anyway — a duplicate username, a slot taken between loading and submitting —
the message comes back in an `Alert` inside the drawer or the dialog, and the form stays open with
what was typed.

---

## 📊 Dashboards & Analytics

Every chart is a pure function over the API response, kept in `src/analytics/` so it can be read
and changed without touching a component.

| Function | Feeds |
|----------|-------|
| `countBySpecialty(doctors)` | Admin → doctors per specialty |
| `busiestDoctors(doctors, appointments)` | Admin → who is booked most |
| `lastSevenDays(appointments)` | Admin and doctor → appointments per day |
| `appointmentShare(appointments)` | All three → the scheduled / completed / cancelled bar |
| `countByStatus(appointments, status)` | All three → the stat tiles |
| `upcomingAppointments(appointments)` | Doctor and patient → next visit, upcoming count |
| `weeklyHours(availability)` | Doctor → hours per weekday |
| `visitsPerDoctor(appointments)` | Patient → who he sees most |

The charts themselves are plain divs — `BarChart` and `ShareBar` are a few dozen lines of flexbox
and CSS variables each. No chart library is installed, which keeps the bundle small and the dark
theme consistent.

| Dashboard | Tiles | Charts |
|-----------|-------|--------|
| **Admin** | Doctors · Patients · Admins · Appointments · Specialties | Status share · last 7 days · doctors per specialty · busiest doctors |
| **Doctor** | Today · Upcoming · Completed · Patients seen · Prescriptions · Next appointment | Status share · last 7 days · hours per weekday |
| **Patient** | Upcoming · Completed visits · Cancelled · Prescriptions · Last visit · Next appointment | Status share · visits per doctor |

---

## 🎨 Design System

A single dark theme, defined once in `src/styles/_variables.scss` and consumed by every module.

### Palette

| Token | Value | Used for |
|-------|-------|----------|
| `$color-background` | `#0a0e14` | The page behind everything |
| `$color-surface-1` | `#0f141c` | Inputs, table heads, the side menu |
| `$color-surface-2` | `#141b25` | Cards, drawers, tables |
| `$color-surface-3` | `#1b2431` | Raised blocks — summaries, the selection bar |
| `$color-surface-hover` | `#202b3a` | Row hover |
| `$color-border` | `#232f3e` | Every default border |
| `$color-border-strong` | `#2f3d50` | Hover and focus borders |
| `$color-primary` | `#3987e5` | Actions, the active menu item, scheduled visits |
| `$color-success` | `#34d399` | Completed visits |
| `$color-warning` | `#fbbf24` | Warnings |
| `$color-error` | `#f87171` | Destructive actions and errors |
| `$color-text-primary` | `#eef2f8` | Headings and values |
| `$color-text-secondary` | `#93a3b8` | Labels and help text |
| `$color-text-muted` | `#6b7a8f` | Disabled and placeholder |

Charts use three fixed series colours (`#3987e5`, `#d95926`, `#199e70`) so a bar keeps its meaning
across dashboards.

### Shape, depth and type

| Token | Value |
|-------|-------|
| `$radius-small` / `$radius-base` / `$radius-large` | `8px` / `12px` / `16px` |
| `$shadow-card` | `0 1px 2px rgba(0,0,0,.32), 0 10px 28px rgba(0,0,0,.24)` |
| `$shadow-raised` | `0 2px 6px rgba(0,0,0,.36), 0 18px 44px rgba(0,0,0,.32)` |
| Font | **Inter**, bundled through `@fontsource/inter` — no network request |

### Breakpoints

| Token | Width | What changes |
|-------|-------|--------------|
| `$breakpoint-tablet` | `600px` | Page padding grows from 16 to 24 |
| `$breakpoint-menu` | `900px` | The side menu becomes permanent; below it, a drawer behind the hamburger |
| `$breakpoint-wide` | `1280px` | Page padding grows to 28/32 |

### Feedback

Every create, update, cancel and delete ends in a toast — one `Snackbar` in `ToastContextProvider`,
bottom-right, 3.2 seconds, reached from anywhere through `useToast()`:

```ts
const showToast = useToast();
showToast('Appointment booked.');
```

Errors do not use the toast. They stay next to the thing that failed — an `Alert` inside the drawer
or the confirm dialog — so the user can fix the input without losing it.

---

## 🎨 Styling Rules

- **No inline styles and no `sx` prop.** Every rule lives in the `.module.scss` beside the component.
- **`:global()`** is used to reach MUI internals from a scoped module.
- **`src/styles/_variables.scss`** holds the palette, radii, shadows and breakpoints.
- **`src/styles/_mixins.scss`** holds the patterns that repeat across pages, so a rule is written once:

| Mixin | What it lays out |
|-------|------------------|
| `page-column` | The vertical page stack every screen uses |
| `panel-section` | A raised card section |
| `drawer-form` / `tall-drawer-form` | The form and the actions row inside a drawer |
| `details-panel` | The shared appointment / prescription details layout |
| `row-actions` | The icon buttons at the end of a table row |
| `selection-bar` | The bar that replaces the page action while rows are selected |
| `charts-grid` | The responsive dashboard chart grid |
| `danger-action` / `quiet-danger-action` | Destructive icon buttons |
| `summary-card`, `fill-height-field`, `centered-message`, `page-message` | Smaller repeats |

Only genuinely app-wide defaults live in `src/theme/theme.ts` (the dark palette, button shape,
input borders, table head styling) — everything single-use stays in its own module.

---

## 🧩 Reusable Components

A component earns its place only when several unrelated pages need it. Everything else is MUI.

| Component | Used by |
|-----------|---------|
| `DataTable` | every list screen — admin lists, appointments, prescriptions, work hours |
| `Drawer` | every create / edit / details panel |
| `ConfirmDialog` | every destructive action |
| `PageHeader` | every page, including the three dashboards |
| `WeekCalendar` | doctor schedule, doctor work hours, patient appointments |
| `CalendarToolbar` | the three pages above |
| `StatTiles` | three dashboards, profile, settings, record summary |
| `BarChart`, `ShareBar` | the three dashboards |

---

## 🔄 State & Data Loading

There is no state library. Data lives in the page that shows it, and two small hooks remove the
repetition that used to sit in five pages:

**`useLoadedData(load, errorMessage)`** returns `{ data, isLoading, error, reload }`. It replaces
the `useState` + `useCallback` + `useEffect` + `catch` + `finally` block each page used to repeat.

**`useLatestCall()`** guards against out-of-order responses. A page can have two loads in flight
at once — the one that runs on mount and the one that runs after a create or a delete. Without a
guard the slower first response lands last and puts the stale list back on screen, so a doctor
you just added disappears until you reload. `useLatestCall` hands out a token per call and the
page only applies the response that is still the newest.

```ts
const startRowsCall = useLatestCall();

const refreshRows = useCallback(() => {
  const isLatestCall = startRowsCall();
  loadAll().then((loaded) => {
    if (isLatestCall()) setRows(loaded);
  });
}, [loadAll, startRowsCall]);
```

Two small preferences are kept in `localStorage` through `src/utils/preferences.ts`: whether the
side menu stays collapsed, and whether a page opens in calendar or list view.

---

## ♿ Accessibility

The app leans on MUI's primitives rather than rebuilding them, so roles, focus traps and keyboard
handling come for free: the drawer and the dialog trap focus and close on `Escape`, the selects are
real listboxes reachable with the arrow keys, and the tables are real `<table>` markup.

On top of that:

- **Every icon button has an accessible name.** Most come from the MUI `Tooltip` that already
  labels them (`Delete selected`, `View details`, `Complete appointment`), and the ones without a
  tooltip carry an explicit `aria-label` — `Open the user menu`, `Open the menu`, `Close`,
  `Calendar view`, `List view`, `Previous week`, `Next week`, `Collapse the menu`, `Expand the menu`.
- **The menu toggle says what it will do**, not what it is: `Expand the menu` when collapsed,
  `Collapse the menu` when open.
- **Required fields are real `required` inputs**, so the browser blocks the submit and points at
  the field rather than the app inventing its own validation.
- **Colour is never the only signal.** A status is a chip with a word in it, not a coloured dot.

This is also what makes the test suite readable: a test clicks *"Delete selected"*, not
`.MuiIconButton-root:nth-child(2)`. If a name changes, the test fails for the right reason.

---

## ⚡ Performance

**Every route is lazy.** `AppRouter` wraps each page in `lazy(() => import(...))`, so a patient
never downloads the admin screens:

```ts
const AdminsPage = lazy(() => import('../views/pages/Admin/AdminsPage/AdminsPage'));
```

Vite splits the result into a shared chunk plus one per page and per heavy MUI part:

| Chunk | Size | Gzipped |
|-------|------|---------|
| `index` (React, router, theme, layout) | 257 kB | **83 kB** |
| MUI palette internals | 86 kB | 30 kB |
| `httpClient` (axios + the API layer) | 45 kB | 17 kB |
| `TextField`, `Tooltip`, `Autocomplete`, `DataTable`, `Drawer`… | 10–45 kB each | loaded on demand |

Other things that keep it quick:

- **No chart library.** `BarChart` and `ShareBar` are divs and CSS.
- **`useLatestCall`** stops a stale response from repainting a list.
- **`useMemo` on the loader** in `useLoadedData`, so a re-render never refetches.
- **Fonts are bundled**, not fetched from a CDN.
- **nginx serves hashed assets** and only falls back to `index.html` for real routes, so a missing
  asset is a `404` rather than an HTML page pretending to be JavaScript.

---

## 🧪 End-to-End Tests

**78 Playwright tests, all green, running on 4 workers in about 3.5 minutes.**

```
tests/
├── config/
│   ├── app.config.ts        BASE_URL and every route
│   └── messages.ts          Every button, label, toast and error text
├── fixtures/testFixtures.ts adminPage · commonPage · doctorPage · loginPage · patientPage
├── pages/
│   ├── CommonPage.ts        Generic verbs: clickOnItem, fillForm, verifyToast, verifyAlert…
│   ├── AdminPage.ts         addUser, deleteRows, removeCreatedUsers
│   ├── DoctorPage.ts        addWorkHours, completeAppointment, fillPrescription, addRecordEntry…
│   ├── PatientPage.ts       bookAppointment, cancelAppointment, removeAppointment…
│   └── LoginPage.ts         login, loginAs
├── selectors/               Every selector, never inline in a spec
├── testData/
│   ├── common.data.ts       Users, people, menus per role, uniqueText
│   ├── admin.data.ts        newDoctor, newPatient, newAdmin
│   ├── doctor.data.ts       Work hours, prescriptions, record entries
│   └── patient.data.ts      Booking dates, reasons, profile values
├── screenshots/             The screenshot script (not part of the suite)
└── specs/
    ├── login.spec.ts        TC-001…TC-016   sign in, sign out, session, menu per role
    ├── admin.spec.ts        TC-017…TC-034   doctors, patients, admins, bulk delete
    ├── doctor.spec.ts       TC-035…TC-052   work hours, schedule, records, prescriptions
    ├── patient.spec.ts      TC-053…TC-070   booking, cancelling, record, profile
    ├── shared.spec.ts       TC-071…TC-077   dashboards, profile, settings, menu
    └── journey.spec.ts      TC-078          one visit across all three roles
```

### How the suite is built

- **Pre-defined logins.** `admin`, `dr_smith` and `john_doe` already exist; a test never creates
  the user it signs in as.
- **Every test is a full cycle.** It creates what it needs, verifies it, and removes it — which is
  what makes running them in parallel safe.
- **Nothing is left behind.** Users a test creates are deleted in an `after` step, so the cleanup
  still runs when the test fails halfway. A run leaves the database exactly as it found it.
- **Parallel safety by ownership, not luck.** The work-hours tests own Saturday and Sunday, each
  booking test owns its own Monday weeks ahead and takes the first free slot, and every created
  row carries a unique title, reason or diagnosis.
- **Everything goes through the UI.** There is no API helper that reaches around the app.
- **Selectors live in `tests/selectors`,** never inside a spec, and every alert is asserted by its
  message, not just by "an alert appeared".

### The journey test

`journey.spec.ts` follows a single visit across all three roles: the admin adds a patient, that
patient books, the doctor completes the visit and writes a prescription, the patient reads it in
his list and on his record timeline, then the doctor edits the diagnosis and deletes it. Because a
completed visit cannot be undone, the test makes its own patient and the `after` step deletes him —
which takes the appointment with him and leaves nothing behind.

### Running them

```bash
# Against the Docker stack (recommended)
BASE_URL=http://localhost:5173 npm run test:e2e

# Against a dev server Playwright starts for you
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Open the HTML report of the last run
npm run test:e2e:report
```

Inside Docker:

```bash
docker compose run --rm tests      # one run, exits 0 or 1
docker compose up -d tests-ui      # http://localhost:9323
```

The full list of cases, with prerequisites, steps, data and expected results, is in
[`test-cases/test-cases.xlsx`](smart-healthcare-frontend/test-cases/test-cases.xlsx).

---

## 📷 Screenshot Script

Every image in this README is produced by a script, so they never drift from the app.

```bash
BASE_URL=http://localhost:5173 npm run screenshots
```

It signs in as each role and walks the whole app with the same page objects the tests use,
writing 44 PNGs into `screenshots/`. It captures at 1440×900 on a 2× device scale, grows the
viewport to fit pages that scroll, and moves the pointer away first so no tooltip is left hanging.

Like the test suite it cleans up after itself: the admin creates one patient, that patient books
the visits the calendars need, and the `after` step deletes him again.

---

## ⚙ Setup & Installation

### Prerequisites

- **Node.js 22+** and npm
- The **backend** running on `http://localhost:8080` —
  see [Smart-Healthcare-Appointment-System](https://github.com/khdour17/Smart-Healthcare-Appointment-System)

### Install and run

```bash
git clone https://github.com/khdour17/smart-healthcare-frontend.git
cd smart-healthcare-frontend/smart-healthcare-frontend
npm install
npm run dev
```

The app opens on `http://localhost:5173`. Vite proxies `/api` to the backend on port 8080.

### Install the browsers Playwright needs (first time only)

```bash
npx playwright install --with-deps chromium
```

---

## 🐳 Docker

The frontend image is a two-stage build: Node compiles the app, then nginx serves the static files
and proxies `/api` to the backend container. The final image is around 80 MB and contains no source.

> **Start the backend stack first.** It creates the `healthcare-network` this compose file joins.

```bash
# 1. Backend (from the backend repository)
docker compose up -d --build

# 2. Frontend (from this repository)
docker compose up -d --build web
```

| Container | Image | Port |
|-----------|-------|------|
| `healthcare-web` | built from `Dockerfile` (node → nginx) | `5173 → 80` |
| `healthcare-tests` | built from `Dockerfile.tests` | runs the suite once |
| `healthcare-tests-ui` | built from `Dockerfile.tests` | `9323 → 9323` |

| URL | What |
|-----|------|
| `http://localhost:5173` | The app |
| `http://localhost:8080/api` | The backend API |
| `http://localhost:9323` | Playwright UI mode |

```bash
docker compose down          # stop
docker compose up -d --build web   # rebuild after a code change
```

---

## 📜 npm Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Vite dev server on port 5173 with `/api` proxied to 8080 |
| `npm run build` | Type-checks the app and builds into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | ESLint over the whole repository |
| `npm run typecheck:tests` | Type-checks the Playwright project |
| `npm run test:e2e` | Runs the 78 end-to-end tests |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:report` | Opens the HTML report of the last run |
| `npm run screenshots` | Regenerates every image in `smart-healthcare-frontend/screenshots/` |

---

## 📐 Code Conventions

The rules this codebase is held to, and the reasoning behind each:

| Rule | Why |
|------|-----|
| **No axios outside `src/api/`** | One place knows the endpoint shapes, so a backend change is one file |
| **No inline `style`, no `sx`** | Styling stays in `.module.scss`, so a page reads as structure and a rule can be found by name |
| **A component must be needed by three pages** | Otherwise it is a page's own markup, or MUI already has it |
| **No comments that restate the code** | A name that needs a comment is a name that should change; the comments that stay explain *why* |
| **A repeated block moves to `src/utils/` or a SCSS mixin** | The second copy is a bug waiting to be fixed once |
| **`strict` TypeScript, no `any`, no unused locals** | `npm run build` fails on a dead variable |
| **Selectors never live inside a spec** | A renamed label is one edit in `tests/selectors/` |

`npm run lint` and `npm run build` both have to pass before anything is committed, and
`npm run typecheck:tests` covers the Playwright project separately, since it has its own tsconfig.

---

## 🔧 Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Every call returns `401` and the app bounces to `/login` | The token expired — it lasts 24 hours | Sign in again |
| The app loads but every list is empty | The backend is not running, or nginx cannot reach it | `docker compose ps` — `healthcare-app` must be up on 8080 |
| `docker compose up web` fails on the network | The frontend joins the backend's network | Start the backend stack first |
| A record entry is refused as *"dated in the future"* | The containers were on UTC while you are not | Fixed by `TZ` in the backend compose — rebuild that stack |
| The tests fail on login timeouts | Four workers logging in at once saturate BCrypt on a small machine | Run with fewer workers: `npx playwright test --workers=2` |
| The tests fail with a strict-mode violation | A selector matches more than one element | Scope it, or use `firstMatch()` from `tests/selectors` |
| `npm run dev` says the port is taken | The Docker container already owns 5173 | Stop it, or test against it with `BASE_URL=http://localhost:5173` |
| Screenshots come out sparse | The database has no upcoming appointments | The script books its own — check the backend is reachable |

---

## 🔑 Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Doctor | `dr_smith` | `doctor123` |
| Patient | `john_doe` | `patient123` |

The admin is seeded by the backend on first start. Doctors and patients are created from the
admin screens.

---

<div align="center">

**Frontend for the [Smart Healthcare Appointment System](https://github.com/khdour17/Smart-Healthcare-Appointment-System)**

</div>
