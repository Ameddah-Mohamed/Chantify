import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Mail, Phone, AlertCircle } from 'lucide-react';

const PendingApproval = () => {
  const { user, logout, checkAuth } = useAuth();
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  // Check approval status every 2 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      setChecking(true);
      try {
        await checkAuth();
      } catch (err) {
        console.error('Error checking auth:', err);
      } finally {
        setChecking(false);
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [checkAuth]);

  // Redirect if user status changes
  useEffect(() => {
    if (user?.applicationStatus === 'approved') {
      navigate('/worker/weekly', { replace: true });
    } else if (user?.applicationStatus === 'rejected') {
      navigate('/signin', { replace: true });
    }
  }, [user?.applicationStatus, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f5] to-[#fff5e6] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all ${
            checking ? 'bg-blue-100' : 'bg-yellow-100'
          }`}>
            <Clock className={`w-10 h-10 ${checking ? 'text-blue-600 animate-spin' : 'text-yellow-600'}`} />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Application Pending
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Thank you for registering, <strong>{user?.personalInfo?.firstName}</strong>! 
            Your application is currently under review by the company administrator.
          </p>

          {/* Info Box */}
          <div className="bg-[#f8f7f5] rounded-xl p-6 mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#f3ae3f]" />
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#f3ae3f] mt-1">1.</span>
                <span>The administrator will review your application</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f3ae3f] mt-1">2.</span>
                <span>You'll receive an email notification once approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#f3ae3f] mt-1">3.</span>
                <span>After approval, you can sign in and access your tasks</span>
              </li>
            </ul>
          </div>

          {/* User Info */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Your Application Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email:
                </span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone:
                </span>
                <span className="font-medium">{user?.personalInfo?.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Job Type:</span>
                <span className="font-medium">{user?.jobTypeId?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  Pending
                </span>
              </div>
            </div>
          </div>

          {/* Notice Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> You'll be automatically redirected once your application is approved. This page auto-refreshes every 2 minutes.
            </p>
          </div>

          {/* Auto-refresh indicator */}
          <p className="text-xs text-gray-500 mb-6">
            {checking ? 'Checking approval status...' : 'Auto-refreshing every 2 minutes'}
          </p>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Chantify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PendingApproval;