import React, { useState, useEffect, useRef } from 'react';
import { userAPI } from '../API/userAPI';

export default function UserSearchSelect({ selectedUsers, onUsersChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUsers(searchTerm);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      onUsersChange(selectedUsers.filter(id => id !== userId));
    } else {
      onUsersChange([...selectedUsers, userId]);
    }
  };

  const getSelectedUserNames = () => {
    const selected = users.filter(u => selectedUsers.includes(u._id));
    if (selected.length === 0) return 'Select workers to assign task';
    if (selected.length === 1) {
      const user = selected[0];
      const jobType = user.jobTypeId?.name || 'N/A';
      return `${user.personalInfo.firstName} ${user.personalInfo.lastName} (${jobType})`;
    }
    return `${selected.length} workers selected`;
  };

  const getUserInitials = (user) => {
    const first = user.personalInfo.firstName.charAt(0);
    const last = user.personalInfo.lastName.charAt(0);
    return `${first}${last}`.toUpperCase();
  };

  const getAvatarUrl = (user) => {
    const name = `${user.personalInfo.firstName}+${user.personalInfo.lastName}`;
    return `https://ui-avatars.com/api/?name=${name}&background=f3ae3f&color=fff&bold=true`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block pb-2 font-medium text-gray-700">Assign to Workers</label>
      
      {/* Selected users chips */}
      {selectedUsers.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {users
            .filter(u => selectedUsers.includes(u._id))
            .map(user => (
              <div
                key={user._id}
                className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-3 py-1"
              >
                <img
                  src={getAvatarUrl(user)}
                  alt={`${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm text-blue-900">
                  {user.personalInfo.firstName} {user.personalInfo.lastName}
                </span>
                <button
                  type="button"
                  onClick={() => toggleUser(user._id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition flex items-center justify-between"
      >
        <span className={selectedUsers.length === 0 ? 'text-gray-400' : 'text-gray-900'}>
          {getSelectedUserNames()}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search workers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* User list */}
          <div className="overflow-y-auto max-h-60">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : users.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No workers found</div>
            ) : (
              users.map(user => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => toggleUser(user._id)}
                  className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-200"
                  />
                  <img
                    src={getAvatarUrl(user)}
                    alt={`${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.personalInfo.firstName} {user.personalInfo.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    {user.jobTypeId && (
                      <p className="text-xs text-blue-600 font-medium">
                        {user.jobTypeId.name} • {user.jobTypeId.hourlyRate} DH/hour
                      </p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
