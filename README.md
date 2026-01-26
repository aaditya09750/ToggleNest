# ToggleNest - Team Task & Workflow Management Platform

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-FFB300?style=for-the-badge&logo=jsonwebtokens&logoColor=black)
![Drag&Drop](https://img.shields.io/badge/Drag%20%26%20Drop-BeautifulDnD-7952B3?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

A modern, full-stack MERN application for managing team projects, tasks, and workflows with a Kanban board, real-time activity log, and role-based access.

**Author:** Aaditya Gunjal

---

## Core Features

- **Authentication:** JWT-based login, registration, protected routes, role-based access (Admin/Team Member)
- **Project Management:** Create, view, edit, delete projects; assign team members; set deadlines
- **Kanban Task Board:** Drag & drop tasks between To Do, In Progress, Done; auto status update; task CRUD
- **Dashboard:** Project/task stats, completion %, recent activity log
- **Activity Logging:** Tracks all major actions (task/project/user changes)
- **Notifications:** Real-time updates for team members
- **Responsive UI:** Modern Tailwind CSS design, mobile-friendly

---

## Technology Stack

| Technology          | Version | Purpose             |
| ------------------- | ------- | ------------------- |
| React               | 18.x    | Frontend framework  |
| React Router DOM    | 6.x     | Client-side routing |
| React Beautiful DnD | 13.x    | Kanban drag & drop  |
| Tailwind CSS        | 3.x     | Styling             |
| Axios               | 1.x     | HTTP requests       |
| Node.js             | 18.x    | Backend runtime     |
| Express             | 4.x     | Backend framework   |
| MongoDB             | 6.x     | Database            |
| Mongoose            | 7.x     | ODM for MongoDB     |
| JWT                 | 9.x     | Authentication      |
| bcryptjs            | 2.x     | Password hashing    |

---

## Project Structure

```text
ToggleNest/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── Frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   └── index.js
    ├── .env
    ├── package.json
    └── tailwind.config.js
```

---

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd Backend
npm install
# Configure .env (see below)
npm run dev
# Backend: http://localhost:5000
```

**.env Example:**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/togglenest
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend Setup

```bash
cd Frontend
npm install
# Configure .env (see below)
npm start
# Frontend: http://localhost:3000
```

**.env Example:**

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Usage Flow

1. **Register/Login** - Create an account or login
2. **Dashboard** - View overview statistics
3. **Create Project** - Admin creates a project and assigns team members
4. **Task Board** - Click on a project to access its Kanban board
5. **Manage Tasks** - Create tasks and drag them between columns
6. **Track Activity** - View all activities in the activity log

---

## UI & Design

- Clean, modern Tailwind CSS design
- Responsive layout for all devices
- Smooth transitions and hover effects
- Intuitive drag-and-drop Kanban board
- Real-time activity logging and notifications

---

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Role-based authorization
- Token verification middleware

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `GET /api/auth/users` - Get all users (Protected)

### Projects

- `GET /api/projects` - Get all projects (Protected)
- `GET /api/projects/:id` - Get single project (Protected)
- `POST /api/projects` - Create project (Protected)
- `PUT /api/projects/:id` - Update project (Protected, Admin only)
- `DELETE /api/projects/:id` - Delete project (Protected, Admin only)

### Tasks

- `GET /api/tasks?project=projectId` - Get tasks (Protected)
- `GET /api/tasks/:id` - Get single task (Protected)
- `POST /api/tasks` - Create task (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

### Activities

- `GET /api/activities?project=projectId` - Get activity logs (Protected)

---

## Default Test Users

Register users through the app. First user can be Admin.

```json
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "Admin"
}
```

---

## Troubleshooting

**MongoDB Connection Error:**

- Ensure MongoDB is running
- Check MONGO_URI in .env file

**CORS Error:**

- Backend has CORS enabled by default
- Check if ports match in .env files

**Token Error:**

- Clear localStorage in browser
- Re-login to get new token

---

## NPM Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

---

## Contact & Support

![Email](https://img.shields.io/badge/Email-aadigunjal0975%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)
![LinkedIn](https://img.shields.io/badge/LinkedIn-aadityagunjal0975-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Contact-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

**Get In Touch**

- **Email:** [aadigunjal0975@gmail.com](mailto:aadigunjal0975@gmail.com)
- **Phone:** +91 84335 09521
- **LinkedIn:** [aadityagunjal0975](https://www.linkedin.com/in/aadityagunjal0975/)
- **Location:** Dombivli, Maharashtra, India

**Professional Inquiries Welcome** - Open to freelance projects, collaboration opportunities, and full-time positions.

---

## License

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=opensourceinitiative&logoColor=white)

This project is created for portfolio and educational purposes.

```
MIT License

Copyright (c) 2026 Aaditya Gunjal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---
