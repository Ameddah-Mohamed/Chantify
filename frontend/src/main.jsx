import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SignUp from './pages/auth/SignUp.jsx';
import SignIn from './pages/auth/SignIn.jsx';
import Profile from './pages/Profile.jsx';
import Layout from './components/Layout.jsx';
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes WITHOUT Navbar (Auth pages) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Routes WITH Navbar (Protected pages) */}
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add more protected routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)