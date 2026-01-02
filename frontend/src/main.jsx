// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SignUp from './pages/auth/SignUp.jsx'
import SignIn from './pages/auth/SignIn.jsx'
import Profile from './pages/Profile.jsx'
import WorkerLayout from './components/WorkerLayout.jsx'  
import AdminLayout from './components/AdminLayout.jsx'    
import WeeklyWorkerPage from './pages/worker/WeeklyTaskPage.jsx'
import TaskWeeklyPage from './pages/Task/WeeklyTaskPage.jsx'
import TaskDetailsPage from './pages/Task/TaskDetailsPage.jsx'
import ProjectManagementPage from './pages/Admin/projects_Management.jsx'
import Dashboard from './pages/Admin/Dashboard'
import Workers from './pages/Admin/Workers'
import TaskApproval from './pages/Admin/TaskApproval'
import JobTypes from './pages/Admin/JobTypes'
import Payments from './pages/Admin/Payments'
import PaymentDetails from './pages/Admin/PaymentDetails'
import Settings from './pages/Admin/Settings'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import CreateTask from './pages/Admin/CreateTask.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/signin" 
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <App />
              </PublicRoute>
            } 
          />

          {/* ========================================= */}
          {/* WORKER ROUTES (avec Navbar)              */}
          {/* ========================================= */}
          <Route 
            element={
              <ProtectedRoute requiredRole="worker">
                <WorkerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/profile" element={<Profile />} />
            <Route path="/worker/weekly" element={<WeeklyWorkerPage />} />
            <Route path="/worker/task/:taskId" element={<TaskDetailsPage />} />
            <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          </Route>

          {/* ========================================= */}
          {/* ADMIN ROUTES (avec Sidebar)              */}
          {/* ========================================= */}
          <Route 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/manager/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskWeeklyPage />} />
            <Route path="/manager/create-task" element={<CreateTask />} />
            <Route path="/manager/workers" element={<Workers />} />
            <Route path="/manager/task-approval" element={<TaskApproval />} />
            <Route path="/manager/job-types" element={<JobTypes />} />
            <Route path="/manager/payments" element={<Payments />} />
            <Route path="/manager/payments/:workerId" element={<PaymentDetails />} />
            <Route path="/manager/settings" element={<Settings />} />
            <Route path="/admin/projects" element={<ProjectManagementPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)