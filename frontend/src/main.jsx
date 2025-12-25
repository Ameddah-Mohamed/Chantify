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
import Dashboard from './pages/manager/Dashboard';
import Workers from './pages/manager/Workers';
import TaskApproval from './pages/manager/TaskApproval';
import JobTypes from './pages/manager/JobTypes';
import Payments from './pages/manager/Payments';
import PaymentDetails from './pages/manager/PaymentDetails';
import Settings from './pages/manager/Settings';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes WITHOUT Navbar (Auth pages) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<App />} />

        {/* Routes WITH Sidebar and Navbar */}
        
         
          <Route element={<Layout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/worker/weekly" element={<WeeklyWorkerPage />} />
          <Route path="/tasks" element={<TaskWeeklyPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/admin/projects" element={<ProjectManagementPage />} />
        </Route>

        {/* Manager Routes WITHOUT Navbar (has its own Sidebar) */}
        <Route path="/manager/dashboard" element={<Dashboard />} />
        <Route path="/manager/workers" element={<Workers />} />
        <Route path="/manager/task-approval" element={<TaskApproval />} />
        <Route path="/manager/job-types" element={<JobTypes />} />
        <Route path="/manager/payments" element={<Payments />} />
        <Route path="/manager/payments/:workerId" element={<PaymentDetails />} />
        <Route path="/manager/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
