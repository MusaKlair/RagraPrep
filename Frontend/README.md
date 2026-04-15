# Ragra-Prep Frontend

This folder contains the complete Next.js frontend setup and UI components for the Ragra-Prep application. It has been successfully separated into an independent directory to provide an isolated environment where all screens and features function independently of the main repository layout.

## 🚀 Functionalities

- **User Authentication**: Secure login and signup with role-based access control.
- **Dashboard**: Activity overview and actionable widgets.
- **Task Management**: Create, track, and manage study tasks with deadlines.
- **Question Bank**: Upload and manage questions; perform AI-powered semantic searches.
- **Notes & Quiz**: Interactive utilities for reading/writing rich-text notes and self-assessment.
- **Admin Panel**: Dedicated dashboards to manage users and modify system settings.

## 🛠️ Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## ⚙️ How to Run the Frontend

This instance contains its own configuration and behaves like a standalone application.

1. **Install dependencies**:
   Navigate into the `Frontend` directory and install local dependencies:
   ```bash
   cd Frontend
   npm install
   ```

2. **Start the Development Server**:
   Once packages are installed, spin up the server:
   ```bash
   npm run dev
   ```

The isolated frontend will boot up and be accessible locally at [http://localhost:3000](http://localhost:3000). Every screen and UI component will function exactly identically to the main application.