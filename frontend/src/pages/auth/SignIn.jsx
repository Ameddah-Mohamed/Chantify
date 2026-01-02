import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // ✨ Utiliser le hook useAuth pour accéder au context
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour recevoir les cookies
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Connection error');
      }
  
      // ✨ Utiliser login() du context au lieu de navigate manuellement
      // login() va stocker le user ET faire la redirection automatiquement
      login(data);
  
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#f3ae3f] rounded-xl mb-3 shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Chantify</h1>
          <p className="text-sm text-gray-600 mt-1">Construction workforce management</p>
        </div>

        {/* Sign In Form Card */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-600 mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2 shrink-0 mt-0.5" />
              <p className="text-red-700 text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f3ae3f] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e09d2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-[#f3ae3f] font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h3 className="text-xs font-semibold text-gray-900 mb-1.5">
              Important Information
            </h3>
            <ul className="text-xs text-gray-600 space-y-0.5">
              <li>• Workers must wait for admin approval</li>
              <li>• Administrators can sign in immediately</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2025 Chantify. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignIn;