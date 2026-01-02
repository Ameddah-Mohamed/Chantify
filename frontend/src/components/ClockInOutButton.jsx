// frontend/src/components/ClockInOutButton.jsx
import React, { useState, useEffect } from 'react';
import { timeEntryAPI } from '../API/timeEntryAPI';

export default function ClockInOutButton({ userId }) {
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  // Check for active session on mount
  useEffect(() => {
    checkActiveSession();
  }, [userId]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed time if there's an active session
  useEffect(() => {
    if (activeSession && activeSession.clockInTime) {
      const clockInTime = new Date(activeSession.clockInTime);
      const diff = currentTime - clockInTime;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }
  }, [currentTime, activeSession]);

  const checkActiveSession = async () => {
    try {
      const response = await timeEntryAPI.getActiveSession(userId);
      setActiveSession(response.data);
    } catch (err) {
      console.error('Error checking active session:', err);
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to get your location. Please enable location services.'));
        }
      );
    });
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await getCurrentLocation();
      const response = await timeEntryAPI.clockIn(userId, location);
      
      setActiveSession(response.data);
      alert('Clocked in successfully!');
    } catch (err) {
      setError(err.message || 'Failed to clock in');
      alert(err.message || 'Failed to clock in');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await getCurrentLocation();
      const response = await timeEntryAPI.clockOut(userId, location);
      
      setActiveSession(null);
      alert(`Clocked out successfully! Total hours: ${response.data.totalHours.toFixed(2)}`);
    } catch (err) {
      setError(err.message || 'Failed to clock out');
      alert(err.message || 'Failed to clock out');
    } finally {
      setLoading(false);
    }
  };

  if (activeSession) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Currently Clocked In</h3>
          <p className="text-sm text-gray-600">
            Started at {new Date(activeSession.clockInTime).toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Elapsed Time</p>
            <p className="text-3xl font-bold text-gray-900 font-mono">{elapsedTime}</p>
          </div>
        </div>

        <button
          onClick={handleClockOut}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Clock Out'}
        </button>

        {error && (
          <div className="mt-3 text-sm text-red-600 text-center">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Ready to Start</h3>
        <p className="text-sm text-gray-600">
          {currentTime.toLocaleTimeString()}
        </p>
      </div>

      <button
        onClick={handleClockIn}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Clock In'}
      </button>

      {error && (
        <div className="mt-3 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500 text-center">
        Location will be captured when you clock in
      </p>
    </div>
  );
}