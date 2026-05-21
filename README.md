# TaskFlow

TaskFlow is a React task management app built with Vite. It includes authentication, task CRUD, search and filtering, task statistics, light and dark themes, and a responsive mobile modal for creating tasks.

## Features

- Email and password authentication
- Create, edit, delete, and update tasks
- Status tracking for `To Do`, `In Progress`, and `Done`
- Search and status filtering
- Dark mode with persisted theme preference
- Responsive layout with a mobile task modal
- Backend-powered task and auth requests using axios
- Form validation with Formik and Yup

## Tech Stack

- React 19
- Vite
- axios
- Formik
- Yup

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root if you want to override the default API URLs:

```env
VITE_TASKS_API_URL=https://your-backend.example.com/tasks
VITE_AUTH_API_URL=https://your-backend.example.com
```

3. Start the development server:

```bash
npm run dev
```

## Scripts

- `npm run dev` - start the local development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

## Backend Contract

TaskFlow expects a backend that supports these routes:

- `POST /register`
- `POST /login`
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

Tasks should use one of these status values:

- `To Do`
- `In Progress`
- `Done`

## Project Structure

- `src/pages` - top-level screens
- `src/components` - reusable UI pieces
- `src/context` - auth and theme providers
- `src/hooks` - task data logic
- `src/global.css` - app-wide styling

## Notes

- The app stores the logged-in user and theme preference in local storage.
- If the backend returns older task status values, the app normalizes them to the current enum.
