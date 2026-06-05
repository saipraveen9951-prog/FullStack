# Todo Manager Client (Frontend)

A modern, production-ready SaaS-style Todo Manager dashboard frontend built with **React (Vite)**, **Tailwind CSS v4**, and **Axios**. The interface matches top-tier software portals (like Notion, Linear, or Asana) focusing on professional typography, rounded layout structures, and animated states.

---

## 🚀 Key Features

*   **Premium SaaS Aesthetics**: High-fidelity dashboard featuring curated light themes, HSL colors, soft shadow containers (`rounded-2xl`, `shadow-premium`), and smooth hover animations.
*   **Real-time Filters & Search**: Real-time task searching with built-in **debouncing** to optimize rendering, alongside category filters (All, Pending, Completed) displaying dynamic inline badge counts.
*   **Inline Editing**: Focus-locked inline inputs allowing users to rename tasks, with support for keyboard hotkeys (`Enter` to save, `Escape` to cancel).
*   **Validation safeguards**: Prevents empty fields or duplicate pending task titles on both the creation and inline-edit layers, raising shook micro-alerts on validation failure.
*   **Stacked Toast System**: Built-in Toast Notification Center reporting operations status (Success, Error, Warning, Info) with custom styling and auto-fades.
*   **Graceful API Fallback**: Detects if the backend server goes offline, raises a toast, and switches to **Local Storage fallback mode** transparently to keep the client fully functional.
*   **Accessible Overlays**: Overlay dialog boxes to confirm destructive actions (like task deletions) while locking body scrolls and responding to click-aways.

---

## 🛠️ Tech Stack

*   **React 18** (Functional components, hooks, custom state hooks, `useMemo` optimizations)
*   **Vite** (Rapid development server and asset bundling)
*   **Tailwind CSS v4** (CSS-first engine with `@tailwindcss/vite` integration)
*   **Axios** (Configured API client with custom connection timeouts)
*   **Lucide React** (Premium, uniform icon pack)

---

## 📂 Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Dashboard title and connection status
│   │   ├── Statistics.jsx     # Four-panel metrics display with progress bar
│   │   ├── TodoForm.jsx       # Entry form with inline validation
│   │   ├── SearchBar.jsx      # Input with clear buttons
│   │   ├── FilterBar.jsx      # Capsule navigation tab filters
│   │   ├── TodoList.jsx       # List container (handles loading/empty views)
│   │   ├── TodoItem.jsx       # Card listing actions, statuses, and inline editing
│   │   ├── ConfirmDialog.jsx  # Accessible deletion warning modal
│   │   ├── Loader.jsx         # Shimmer skeleton cards and spinners
│   │   └── EmptyState.jsx     # Illustration for empty collections
│   ├── services/
│   │   └── todoService.js     # Axios client mappings
│   ├── hooks/
│   │   └── useTodos.js        # State, debounces, and local storage fallback hook
│   ├── utils/
│   │   └── constants.js       # App filters, messages, and config constants
│   ├── App.jsx                # Layout shell and Toast wrapper
│   ├── main.jsx               # React mount root
│   ├── index.css              # Custom font faces, animations, and Tailwind directives
│   └── App.css                # Style reset file
├── index.html
├── vite.config.js
└── package.json
```

---

## 💻 Running the App

### 1. Installation
Navigate to the frontend directory and install node modules:
```bash
cd frontend
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
The app will open locally at [http://localhost:5173/](http://localhost:5173/).

### 3. Production Build
Compile and optimize client bundles:
```bash
npm run build
```
Compiled bundles are outputted to the `dist/` directory.
