import React, { useState } from 'react';

const Settings = () => {
  const [formData, setFormData] = useState({
    name: 'Alex Doe',
    email: 'alex.doe@chantify.com',
    phone: '+1 (555) 123-4567',
    companyName: 'CHANTIFY',
    companyLocation: 'New York, USA'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Settings saved:', formData);
  };

  return (
    <div className="flex-1 pt-20 md:pt-8 p-8 bg-white overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[#1e2987] text-4xl font-black mb-2">Settings</h1>
          <p className="text-gray-500 text-base">Manage your profile and company information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-[#1e2987] text-2xl font-bold mb-6">Profile Information</h2>
            
            {/* Profile Image Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-24 h-24" 
                   style={{backgroundImage: 'url("https://cdn.usegalileo.ai/stability/d1c1a415-f87d-4be7-a1e0-d102c1d022e2.png")'}}></div>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1e2987] text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-semibold">
                  <span className="material-symbols-outlined text-lg">upload</span>
                  Upload Photo
                </button>
                <p className="text-gray-500 text-xs">JPG, PNG or GIF, max 5MB</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2987] focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2987] focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2987] focus:border-transparent"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 text-sm font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2987] focus:border-transparent"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="text-gray-700 text-sm font-medium mb-2">Company Location</label>
                <input
                  type="text"
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2987] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button Footer */}
          <div className="flex justify-end p-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-[#1e2987] text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;