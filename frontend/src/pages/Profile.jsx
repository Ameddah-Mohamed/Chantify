import { useState, useEffect } from 'react';
import { User, Building2, Mail, Phone, Clock, Shield, Save, X, Edit2, Briefcase } from 'lucide-react';
import WorkerNavbar from '../components/WorkerNavbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editCompanyMode, setEditCompanyMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // User form data
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Company form data (for admin)
  const [companyForm, setCompanyForm] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/profile', {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setUser(data);
      
      // Initialize form with user data
      setUserForm({
        firstName: data.personalInfo?.firstName || '',
        lastName: data.personalInfo?.lastName || '',
        phone: data.personalInfo?.phone || ''
      });

      // Initialize company form if admin
      if (data.role === 'admin' && data.companyId) {
        setCompanyForm({
          name: data.companyId.name || '',
          email: data.companyId.contact?.email || '',
          phone: data.companyId.contact?.phone || '',
          street: data.companyId.contact?.address?.street || '',
          city: data.companyId.contact?.address?.city || ''
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserFormChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleCompanyFormChange = (e) => {
    setCompanyForm({
      ...companyForm,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userForm)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to update profile');

      setUser(data.user);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: companyForm.name,
          contact: {
            email: companyForm.email,
            phone: companyForm.phone,
            address: {
              street: companyForm.street,
              city: companyForm.city,
              country: 'Algeria'
            }
          }
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to update company');

      setSuccess('Company information updated successfully!');
      setEditCompanyMode(false);
      fetchProfile(); // Refresh data
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setUserForm({
      firstName: user.personalInfo?.firstName || '',
      lastName: user.personalInfo?.lastName || '',
      phone: user.personalInfo?.phone || ''
    });
    setError('');
    setSuccess('');
  };

  const cancelCompanyEdit = () => {
    setEditCompanyMode(false);
    setCompanyForm({
      name: user.companyId?.name || '',
      email: user.companyId?.contact?.email || '',
      phone: user.companyId?.contact?.phone || '',
      street: user.companyId?.contact?.address?.street || '',
      city: user.companyId?.contact?.address?.city || ''
    });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3ae3f]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerNavbar title="Profile Settings" />
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your account information</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f3ae3f] rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-500">Your personal details</p>
              </div>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#f3ae3f] hover:bg-[#f3ae3f]/5 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={userForm.firstName}
                    onChange={handleUserFormChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={userForm.lastName}
                    onChange={handleUserFormChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userForm.phone}
                  onChange={handleUserFormChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#f3ae3f] text-white text-sm font-medium rounded-lg hover:bg-[#e09d2f] transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    First Name
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {user.personalInfo?.firstName || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Last Name
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {user.personalInfo?.lastName || 'Not set'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">
                    {user.personalInfo?.phone || 'Not set'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Role
                </label>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrator' : 'Worker'}
                  </span>
                </div>
              </div>

              {user.role === 'worker' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Hourly Rate
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {user.hourlyRate} DZD/hour
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Company Information Card (Admin Only) */}
        {user.role === 'admin' && user.companyId && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f3ae3f] rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
                  <p className="text-xs text-gray-500">Manage your company details</p>
                </div>
              </div>
              {!editCompanyMode && (
                <button
                  onClick={() => setEditCompanyMode(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#f3ae3f] hover:bg-[#f3ae3f]/5 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            {editCompanyMode ? (
              <form onSubmit={handleUpdateCompany} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={companyForm.name}
                    onChange={handleCompanyFormChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Company Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={companyForm.email}
                      onChange={handleCompanyFormChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Company Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={companyForm.phone}
                      onChange={handleCompanyFormChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={companyForm.street}
                      onChange={handleCompanyFormChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={companyForm.city}
                      onChange={handleCompanyFormChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f3ae3f] text-white text-sm font-medium rounded-lg hover:bg-[#e09d2f] transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelCompanyEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Company Name
                  </label>
                  <p className="text-sm font-medium text-gray-900">{user.companyId.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Company Email
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {user.companyId.contact?.email || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Company Phone
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      {user.companyId.contact?.phone || 'Not set'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Address
                  </label>
                  <p className="text-sm font-medium text-gray-900">
                    {user.companyId.contact?.address?.street || ''}{' '}
                    {user.companyId.contact?.address?.city || ''}
                    {!user.companyId.contact?.address?.street && 
                     !user.companyId.contact?.address?.city && 'Not set'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account Status Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#f3ae3f] rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Account Status</h2>
              <p className="text-xs text-gray-500">Your account information</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Account Status
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.isActive ? 'Active' : 'Pending Approval'}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Application Status
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.applicationStatus === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : user.applicationStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.applicationStatus.charAt(0).toUpperCase() + user.applicationStatus.slice(1)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Member Since
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;