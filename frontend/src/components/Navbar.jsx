import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Users,
  CheckSquare,
  FileText,
  Settings,
  Clock,
  DollarSign,
  Play,
  StopCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import timeEntryAPI from '../API/timeEntryAPI';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Clock in/out state
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [clockError, setClockError] = useState('');

  const isActive = (path) => location.pathname === path;

  // Initialize clock-in state from localStorage and backend
  useEffect(() => {
    if (user?.role === 'worker') {
      checkClockStatus();
      // Refresh status every 30 seconds
      const interval = setInterval(checkClockStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Timer for elapsed time
  useEffect(() => {
    if (!isClockedIn) return;

    const timer = setInterval(() => {
      const stored = localStorage.getItem('clockInTime');
      if (stored) {
        const clockInTime = new Date(stored);
        const now = new Date();
        const diffMs = now - clockInTime;
        setElapsedTime(Math.floor(diffMs / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isClockedIn]);

  const checkClockStatus = async () => {
    try {
      const response = await timeEntryAPI.getActiveSession(user._id);
      if (response.data) {
        setIsClockedIn(true);
        localStorage.setItem('clockInTime', response.data.clockInTime);
      } else {
        setIsClockedIn(false);
        localStorage.removeItem('clockInTime');
        setElapsedTime(0);
      }
    } catch (error) {
      // 401 Unauthorized or other errors - user not clocked in
      setIsClockedIn(false);
      localStorage.removeItem('clockInTime');
      setElapsedTime(0);
      
      // Silently fail - don't show error on initial check
      console.debug('Clock status check:', error.message);
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
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
          reject('Location permission denied');
        }
      );
    });
  };

  const handleClockIn = async () => {
    try {
      setIsLoading(true);
      setClockError('');

      const location = await getLocation();

      const response = await timeEntryAPI.clockIn(user._id, location);

      if (response.success) {
        setIsClockedIn(true);
        localStorage.setItem('clockInTime', response.data.clockInTime);
        setElapsedTime(0);
      }
    } catch (error) {
      const errorMsg = error.message || 'Clock in failed';
      setClockError(errorMsg);
      
      // If stuck session error, offer to clear it
      if (errorMsg.includes('already have an active clock-in session')) {
        const shouldClear = window.confirm(
          `${errorMsg}\n\n` +
          `Click OK to clear the stuck session and try again.\n` +
          `This will NOT record any hours.`
        );
        if (shouldClear) {
          await handleEmergencyClockOut();
          // Try to clock in again after clearing
          setTimeout(() => {
            setClockError('Stuck session cleared! Please click Clock In again.');
          }, 500);
        }
      } else {
        alert('❌ ' + errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setIsLoading(true);
      setClockError('');

      const location = await getLocation();

      const response = await timeEntryAPI.clockOut(user._id, location);

      if (response.success) {
        setIsClockedIn(false);
        localStorage.removeItem('clockInTime');
        setElapsedTime(0);
      }
    } catch (error) {
      setClockError(error.message || 'Clock out failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyClockOut = async () => {
    try {
      setIsLoading(true);
      setClockError('');

      const response = await fetch(`http://localhost:8000/api/time-entries/force-clock-out/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear session');
      }

      setIsClockedIn(false);
      localStorage.removeItem('clockInTime');
      setElapsedTime(0);
      return true; // Success
    } catch (error) {
      const errorMsg = error.message || 'Failed to clear stuck session';
      setClockError(errorMsg);
      alert('❌ ' + errorMsg);
      return false; // Failure
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { path: '/manager/workers', label: 'Team', icon: Users },
        { path: '/manager/task-approval', label: 'Applications', icon: FileText },
        { path: '/tasks', label: 'Tasks', icon: CheckSquare },
        { path: '/profile', label: 'Profile', icon: User },
      ];
    } else {
      return [
        { path: '/worker/weekly', label: 'My Tasks', icon: CheckSquare },
        { path: '/profile', label: 'Profile', icon: User },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Hide text on very small screens */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-[#f3ae3f] rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="hidden sm:block text-lg md:text-xl font-bold text-gray-900">Chantify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-[#f3ae3f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Clock-in/out button and timer for workers */}
            {user?.role === 'worker' && (
              <div className="flex items-center gap-2 lg:gap-3 border-r border-gray-300 pr-3 lg:pr-4">
                {/* Timer Display */}
                <div className="bg-gray-100 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-mono text-xs lg:text-sm font-bold text-gray-700">
                  {formatTime(elapsedTime)}
                </div>

                {/* Clock In/Out Button */}
                {isClockedIn ? (
                  <div className="flex items-center gap-1 lg:gap-2">
                    <button
                      onClick={handleClockOut}
                      disabled={isLoading}
                      className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 whitespace-nowrap"
                    >
                      <StopCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="hidden lg:inline">Clock Out</span>
                      <span className="lg:hidden">Out</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Clear stuck session? This will delete any active clock-in without recording hours.')) {
                          handleEmergencyClockOut();
                        }
                      }}
                      disabled={isLoading}
                      title="Clear stuck session without recording hours"
                      className="flex items-center gap-1 px-2 py-1.5 lg:px-3 lg:py-2 rounded-lg text-xs lg:text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                    >
                      <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="hidden lg:inline">Emergency</span>
                      <span className="lg:hidden">Emg</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleClockIn}
                    disabled={isLoading}
                    className="flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                  >
                    <Play className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="hidden lg:inline">Clock In</span>
                    <span className="lg:hidden">In</span>
                  </button>
                )}

                {clockError && (
                  <div className="text-xs text-red-600 hidden lg:block">{clockError}</div>
                )}
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs lg:text-sm font-medium text-gray-900">
                  {user?.personalInfo?.firstName}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin' ? 'Admin' : 'Worker'}
                </p>
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-[#f3ae3f] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs md:text-sm">
                  {user?.personalInfo?.firstName?.[0]}{user?.personalInfo?.lastName?.[0]}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-1 px-2 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200"
              title="Logout"
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {user?.role === 'worker' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100"
                title="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Clock In/Out Section for Workers */}
            {user?.role === 'worker' && (
              <div className="bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                {/* Timer Display */}
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Elapsed Time</p>
                  <div className="font-mono text-2xl font-bold text-gray-900">
                    {formatTime(elapsedTime)}
                  </div>
                </div>

                {/* Clock In/Out Buttons */}
                {isClockedIn ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleClockOut();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      <StopCircle className="w-4 h-4" />
                      Clock Out
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Clear stuck session? This will delete any active clock-in without recording hours.')) {
                          handleEmergencyClockOut();
                          setMobileMenuOpen(false);
                        }
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Emergency
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleClockIn();
                      setMobileMenuOpen(false);
                    }}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    Clock In
                  </button>
                )}

                {clockError && (
                  <div className="text-xs text-red-600 text-center bg-red-50 p-2 rounded">
                    {clockError}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Links */}
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-[#f3ae3f] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile User Section */}
            <div className="border-t border-gray-200 mt-3 pt-3">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-9 h-9 bg-[#f3ae3f] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.personalInfo?.firstName?.[0]}{user?.personalInfo?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.personalInfo?.firstName} {user?.personalInfo?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'admin' ? 'Administrator' : 'Worker'}
                  </p>
                </div>
              </div>

              {user?.role === 'admin' && (
                <Link
                  to="/manager/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;