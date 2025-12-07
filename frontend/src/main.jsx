import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SignUp from './pages/auth/SignUp.jsx'
import SignIn from './pages/auth/SignIn.jsx'
import Profile from './pages/Profile.jsx'
import Layout from './components/Layout.jsx'
import WeeklyWorkerPage from './pages/worker/WeeklyTaskPage.jsx'
import TaskWeeklyPage from './pages/Task/WeeklyTaskPage.jsx'
import TaskDetailsPage from './pages/Task/TaskDetailsPage.jsx'
import ProjectManagementPage from './pages/Admin/projects_Management.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes WITHOUT Navbar (Auth pages) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Routes WITH Sidebar and Navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/worker/weekly" element={<WeeklyWorkerPage />} />
          <Route path="/tasks" element={<TaskWeeklyPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/admin/projects" element={<ProjectManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
