import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Building2, Briefcase, Wrench, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'worker',
    companyName: '',
    companyEmail: '',
    jobTypeId: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingJobTypes, setLoadingJobTypes] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [jobTypes, setJobTypes] = useState([]);

  // Fetch job types when worker enters company email
  useEffect(() => {
    const fetchJobTypes = async () => {
      if (formData.role === 'worker' && formData.companyEmail) {
        setLoadingJobTypes(true);
        try {
          const response = await fetch(
            `http://localhost:8000/api/jobtypes/by-company?companyEmail=${formData.companyEmail}`
          );
          
          if (response.ok) {
            const data = await response.json();
            setJobTypes(data);
            setError('');
          } else {
            const errorData = await response.json();
            setJobTypes([]);
            setError(errorData.error || 'Company not found');
          }
        } catch (err) {
          setJobTypes([]);
          setError('Failed to fetch job types');
        } finally {
          setLoadingJobTypes(false);
        }
      } else {
        setJobTypes([]);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchJobTypes, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.companyEmail, formData.role]);

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
    setSuccess('');

    // Validation for worker
    if (formData.role === 'worker' && !formData.jobTypeId) {
      setError('Please select a job type');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // ✅ SI ADMIN : Rediriger immédiatement
      if (data.role === 'admin') {
        login(data);
      } 
      // ✅ SI WORKER : Rediriger vers page d'attente d'approbation
      else {
        login({
          ...data,
          applicationStatus: 'pending'
        });
      }

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

        {/* Sign Up Form Card */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-600 mt-1">Join Chantify today</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-700 text-xs">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-800 text-sm font-semibold mb-1">Application Submitted!</p>
                  <p className="text-green-700 text-xs">{success}</p>
                  <Link 
                    to="/signin" 
                    className="inline-block mt-3 text-sm text-green-700 font-semibold hover:underline"
                  >
                    Go to Sign In →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'worker', jobTypeId: '' })}
                  className={`p-2.5 rounded-lg border-2 transition-all ${
                    formData.role === 'worker'
                      ? 'border-[#f3ae3f] bg-[#f3ae3f]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">Worker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'admin', jobTypeId: '' })}
                  className={`p-2.5 rounded-lg border-2 transition-all ${
                    formData.role === 'admin'
                      ? 'border-[#f3ae3f] bg-[#f3ae3f]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Briefcase className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs font-medium">Administrator</span>
                </button>
              </div>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent transition-all"
                    placeholder="Mohamed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent transition-all"
                    placeholder="Ameddah"
                  />
                </div>
              </div>
            </div>

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
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent transition-all"
                  placeholder="+213 555 123 456"
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
                  minLength={6}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            {/* Conditional Fields Based on Role */}
            {formData.role === 'admin' ? (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent transition-all"
                    placeholder="Construction ABC"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  8 default job types will be created for your company
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Company Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent transition-all"
                      placeholder="company@example.com"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the company email to apply
                  </p>
                </div>

                {/* Job Type Selection - Only show when company email is entered */}
                {formData.companyEmail && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Job Type
                    </label>
                    {loadingJobTypes ? (
                      <div className="w-full p-3 text-sm text-gray-500 border border-gray-300 rounded-lg text-center">
                        Loading job types...
                      </div>
                    ) : jobTypes.length > 0 ? (
                      <div className="relative">
                        <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          name="jobTypeId"
                          value={formData.jobTypeId}
                          onChange={handleChange}
                          required
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent transition-all appearance-none bg-white"
                        >
                          <option value="">Select your job type</option>
                          {jobTypes.map((jobType) => (
                            <option key={jobType._id} value={jobType._id}>
                              {jobType.name} - {jobType.hourlyRate} DZD/hour
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="w-full p-3 text-sm text-gray-500 border border-gray-300 rounded-lg text-center">
                        No job types available for this company
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f3ae3f] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e09d2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-[#f3ae3f] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
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

export default SignUp;