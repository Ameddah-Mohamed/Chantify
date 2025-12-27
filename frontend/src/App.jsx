import { Link } from 'react-router-dom';
import { Building2, Users, ClipboardCheck, CheckCircle, ArrowRight, Zap, Shield } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f5] via-white to-[#fff5e6]">
      {/* Navbar */}
      <nav className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#f3ae3f] rounded-xl flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900">Chantify</span>
          </div>
          <Link
            to="/signin"
            className="text-sm md:text-base px-4 md:px-6 py-2 md:py-2.5 text-gray-700 hover:text-[#f3ae3f] font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f3ae3f]/10 border border-[#f3ae3f]/20 rounded-full mb-6 md:mb-8">
            <Zap className="w-4 h-4 text-[#f3ae3f]" />
            <span className="text-sm font-medium text-[#f3ae3f]">Construction Workforce Management</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 md:mb-6 leading-tight">
            Manage Your Team,
            <br />
            <span className="text-[#f3ae3f]">Effortlessly</span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            Track tasks, manage workers, and streamline your construction projects all in one powerful platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-[#f3ae3f] text-white rounded-xl font-semibold hover:bg-[#e09d2f] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/signin"
              className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:border-[#f3ae3f] hover:text-[#f3ae3f] transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Secure & reliable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Everything you need to manage your team
          </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed specifically for construction workforce management
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="group bg-white p-6 md:p-8 rounded-2xl border border-gray-200 hover:border-[#f3ae3f] hover:shadow-xl transition-all">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#f3ae3f]/10 rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:bg-[#f3ae3f] transition-colors">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-[#f3ae3f] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Team Management</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Easily manage workers, track attendance, and optimize your workforce efficiency.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white p-6 md:p-8 rounded-2xl border border-gray-200 hover:border-[#f3ae3f] hover:shadow-xl transition-all">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#f3ae3f]/10 rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:bg-[#f3ae3f] transition-colors">
              <ClipboardCheck className="w-6 h-6 md:w-7 md:h-7 text-[#f3ae3f] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Task Tracking</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Assign tasks, monitor real-time progress, and ensure timely project completion.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white p-6 md:p-8 rounded-2xl border border-gray-200 hover:border-[#f3ae3f] hover:shadow-xl transition-all sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#f3ae3f]/10 rounded-xl flex items-center justify-center mb-4 md:mb-5 group-hover:bg-[#f3ae3f] transition-colors">
              <Building2 className="w-6 h-6 md:w-7 md:h-7 text-[#f3ae3f] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Project Oversight</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Get complete visibility into your construction projects, budgets, and timelines.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#f3ae3f] to-[#e09d2f] rounded-3xl p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            Ready to get started?
          </h2>
          <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of construction companies managing their workforce with Chantify.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-[#f3ae3f] rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Create Your Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#f3ae3f] rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Chantify</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Chantify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;