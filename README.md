# Cloud Web Drive – Frontend

## Overview
Cloud Web Drive is a **Google Drive–style web application** that allows users to securely upload, organize, and manage files and folders. The frontend focuses on usability, accessibility, and clear feedback for all user actions.

> **Prototype Notice**: Storage limits are intentionally restricted to prevent abuse. The UI reflects real-world cloud storage behavior.

---

## Technologies Used

- **React (Vite)** – Frontend framework
- **Tailwind CSS** – Utility-first styling
- **Axios** – HTTP client
- **React Router** – Client-side routing
- **react-toastify** – Toast notifications
- **lucide-react** – Icon library

---

## Core Features

### Authentication
- Login and registration
- Email-based account activation
- Forgot password and reset password flow
- Strong password validation aligned with backend rules
- Password visibility toggle (eye icon)

### Dashboard
- Google Drive–like layout
- List and grid views
- Breadcrumb navigation
- Sidebar folder navigation
- Real-time storage usage display

### File & Folder Operations
- Create folders
- Upload files and folders via drag & drop
- Folder structure preserved during upload
- Download owned files
- Keyboard support (Enter key to create folders)

---

## User Experience Enhancements

- Clear success and error notifications
- Backend-provided error reasons surfaced in UI
- Optimistic updates with rollback on failure
- Responsive design (desktop & mobile)

---

## Edge Cases Handled

- Upload exceeding remaining storage
- Duplicate file names in the same folder
- Partial upload failures with per-file feedback
- Unauthorized API responses
- Expired password reset links
- Invalid activation links

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Running the Frontend

### Development Mode

```bash
npm install
npm run dev
```

- Starts the Vite development server
- Hot module replacement enabled
- Intended for local development

---

### Production Build

```bash
npm install
npm run build
```

- Generates an optimized production build in the `dist/` directory

---

### Production Run (Preview)

```bash
npm run preview
```

- Serves the production build locally
- Used to verify production output before deployment


---

## Links

- GitHub: https://github.com/sulaimanh7877
- LinkedIn: https://www.linkedin.com/in/sulaiman-h

---

## Notes for Reviewers

- This is a **full-stack prototype**, not a production system
- AWS S3 stores actual file data
- MongoDB Atlas stores metadata and user information
- Storage limits are intentionally low for safety

---

## License

This project is intended for **educational, academic, and portfolio use**.
