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
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f3ae3f] rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Chantify</span>
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
          <div className="hidden md:flex items-center gap-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.personalInfo?.firstName} {user?.personalInfo?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'admin' ? 'Administrator' : 'Worker'}
                </p>
              </div>
              <div className="w-9 h-9 bg-[#f3ae3f] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.personalInfo?.firstName?.[0]}{user?.personalInfo?.lastName?.[0]}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
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