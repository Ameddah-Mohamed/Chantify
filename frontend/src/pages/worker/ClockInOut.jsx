import React, { useState, useEffect } from 'react';
import { Clock, MapPin, AlertCircle, CheckCircle, Loader, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ClockInOut = () => {
  const { user } = useAuth();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [todayStats, setTodayStats] = useState({
    totalHours: 0,
    sessions: []
  });
  const [isWithinLocation, setIsWithinLocation] = useState(null);

  // Get user's current location
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation is not supported by your browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          resolve({ latitude, longitude });
        },
        (error) => {
          let message = 'Unable to get your location';
          if (error.code === error.PERMISSION_DENIED) {
            message = 'Location permission denied. Please enable location access.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'Location information is unavailable.';
          } else if (error.code === error.TIMEOUT) {
            message = 'The request to get user location timed out.';
          }
          setLocationError(message);
          reject(message);
        }
      );
    });
  };

  // Check if user is within company location
  const isWithinCompanyLocation = (userLat, userLon, companyLat, companyLon, radiusMeters = 500) => {
    const toRad = (degrees) => degrees * (Math.PI / 180);
    const R = 6371000; // Earth's radius in meters

    const lat1 = toRad(userLat);
    const lat2 = toRad(companyLat);
    const deltaLat = toRad(companyLat - userLat);
    const deltaLon = toRad(companyLon - userLon);

    const a = Math.sin(deltaLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusMeters;
  };

  // Clock In
  const handleClockIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
      setLocationError('');

      // Get location
      const loc = await getLocation();

      // Call clock-in API
      const response = await fetch('http://localhost:8000/api/time-entries/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          latitude: loc.latitude,
          longitude: loc.longitude,
          address: ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clock in');
      }

      setIsClockedIn(true);
      setSuccess('Clocked in successfully!');
      fetchTodayStats();

      // Check if within location
      if (data.data.companyLocation) {
        const within = isWithinCompanyLocation(
          loc.latitude,
          loc.longitude,
          data.data.companyLocation.latitude,
          data.data.companyLocation.longitude,
          data.data.companyLocation.radius
        );
        setIsWithinLocation(within);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Clock Out
  const handleClockOut = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Get location
      const loc = await getLocation();

      // Call clock-out API
      const response = await fetch('http://localhost:8000/api/time-entries/clock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          latitude: loc.latitude,
          longitude: loc.longitude,
          address: ''
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clock out');
      }

      setIsClockedIn(false);
      setSuccess(`Clocked out successfully! Hours worked: ${data.data.totalHours.toFixed(2)}`);
      setElapsedTime(0);
      fetchTodayStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch today's stats
  const fetchTodayStats = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');

      const response = await fetch(
        `http://localhost:8000/api/time-entries/daily/${user._id}/${year}-${month}-${day}`,
        { credentials: 'include' }
      );

      if (response.ok) {
        const data = await response.json();
        setTodayStats(data);
      }
    } catch (err) {
      console.error('Error fetching today stats:', err);
    }
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch today's stats on mount
  useEffect(() => {
    fetchTodayStats();
  }, []);

  // Auto-refresh stats every 10 seconds
  useEffect(() => {
    if (isClockedIn) {
      const interval = setInterval(fetchTodayStats, 10000);
      return () => clearInterval(interval);
    }
  }, [isClockedIn]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Clock In/Out</h1>
          <p className="text-gray-600 mt-2">Track your working hours and location</p>
        </div>

        {/* Current Time Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="text-center">
            <Clock className="w-12 h-12 text-[#f3ae3f] mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Current Time</p>
            <p className="text-5xl font-bold text-gray-900">{formatTime(currentTime)}</p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {locationError && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-700 text-sm">{locationError}</p>
          </div>
        )}

        {/* Location Status */}
        {location && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <p className="font-medium text-blue-900">Your Location</p>
            </div>
            <p className="text-blue-700 text-sm">
              Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
            </p>
            {isWithinLocation !== null && (
              <p className={`text-sm mt-2 ${isWithinLocation ? 'text-green-700' : 'text-red-700'}`}>
                {isWithinLocation 
                  ? '✓ You are within company location' 
                  : '✗ You are outside company location'}
              </p>
            )}
          </div>
        )}

        {/* Clock In/Out Button */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <button
            onClick={isClockedIn ? handleClockOut : handleClockIn}
            disabled={isLoading}
            className={`w-full py-4 rounded-lg font-semibold transition-all text-white text-lg flex items-center justify-center gap-2 ${
              isClockedIn
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-gray-400'
                : 'bg-green-600 hover:bg-green-700 disabled:bg-gray-400'
            }`}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {isClockedIn ? 'Clocking Out...' : 'Clocking In...'}
              </>
            ) : (
              <>
                {isClockedIn ? (
                  <>
                    <LogOut className="w-5 h-5" />
                    Clock Out
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5" />
                    Clock In
                  </>
                )}
              </>
            )}
          </button>

          {isClockedIn && (
            <p className="text-center text-gray-600 mt-3 text-sm">
              You are currently clocked in
            </p>
          )}
        </div>

        {/* Today's Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h2>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Total Hours Worked</p>
              <p className="text-2xl font-bold text-[#f3ae3f]">
                {formatHours(todayStats.totalHours)}
              </p>
            </div>
          </div>

          {todayStats.sessions && todayStats.sessions.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium text-gray-900 mb-3">Sessions</h3>
              <div className="space-y-3">
                {todayStats.sessions.map((session, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-900">Session {index + 1}</p>
                      <p className="text-sm text-[#f3ae3f] font-semibold">
                        {formatHours(session.totalHours)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      {new Date(session.clockInTime).toLocaleTimeString()} -
                      {session.clockOutTime 
                        ? new Date(session.clockOutTime).toLocaleTimeString()
                        : 'In Progress'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!todayStats.sessions || todayStats.sessions.length === 0) && (
            <p className="text-center text-gray-500 py-4">
              No clock-in sessions today
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClockInOut;
