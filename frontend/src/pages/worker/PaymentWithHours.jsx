import React, { useState, useEffect } from 'react';
import { Clock, MapPin, AlertCircle, CheckCircle, Loader, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PaymentWithHours = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPaymentData();
  }, [selectedMonth, selectedYear]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch payment details
      const paymentResponse = await fetch(
        `http://localhost:8000/api/payments/${user._id}/${selectedYear}/${selectedMonth}`,
        { credentials: 'include' }
      );

      if (!paymentResponse.ok) {
        throw new Error('Failed to fetch payment data');
      }

      const paymentData = await paymentResponse.json();

      // Fetch time entries for the month
      const timeResponse = await fetch(
        `http://localhost:8000/api/time-entries/monthly/${user._id}?year=${selectedYear}&month=${selectedMonth}`,
        { credentials: 'include' }
      );

      if (timeResponse.ok) {
        const timeData = await timeResponse.json();
        // Combine data
        setPayments({
          ...paymentData,
          actualHours: timeData.data.summary.totalHours,
          workDays: timeData.data.summary.workDays,
          dailyBreakdown: timeData.data.dailyEntries
        });
      } else {
        setPayments(paymentData);
      }
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError(err.message || 'Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: 'DZD'
    }).format(amount);
  };

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getHoursDifference = () => {
    if (!payments.estimatedHours || !payments.actualHours) return 0;
    return payments.actualHours - payments.estimatedHours;
  };

  const getDifferenceColor = (diff) => {
    if (diff > 0) return 'text-green-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 text-[#f3ae3f] animate-spin" />
          <span className="text-gray-600">Loading payment data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment & Hours Report</h1>
          <p className="text-gray-600 mt-2">View your estimated vs actual working hours</p>
        </div>

        {/* Month/Year Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {new Date(2020, m - 1).toLocaleString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f3ae3f] focus:border-transparent"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Main Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Estimated Hours */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Estimated Hours</h3>
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {formatHours(payments.estimatedHours || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Expected hours this month
            </p>
          </div>

          {/* Actual Hours */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Actual Hours</h3>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {formatHours(payments.actualHours || 0)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Hours worked via clock in/out
            </p>
          </div>

          {/* Difference */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Difference</h3>
              <TrendingUp className="w-6 h-6 text-[#f3ae3f]" />
            </div>
            <p className={`text-3xl font-bold ${getDifferenceColor(getHoursDifference())}`}>
              {getHoursDifference() > 0 ? '+' : ''}{formatHours(Math.abs(getHoursDifference()))}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {getHoursDifference() > 0 ? 'More hours worked' : 'Hours remaining'}
            </p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Breakdown</h2>

          <div className="space-y-4">
            {/* Base Salary */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Base Salary</p>
                <p className="text-sm text-gray-600">
                  Actual hours × Hourly rate ({payments.hourlyRate} DZD/hour)
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(payments.baseSalary || 0)}
              </p>
            </div>

            {/* Bonus */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Bonus</p>
                <p className="text-sm text-gray-600">Additional payment by admin</p>
              </div>
              <p className={`text-lg font-semibold ${payments.bonus > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                {payments.bonus > 0 ? '+' : ''}{formatCurrency(payments.bonus || 0)}
              </p>
            </div>

            {/* Penalties */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Penalties</p>
                <p className="text-sm text-gray-600">Deductions by admin</p>
              </div>
              <p className={`text-lg font-semibold ${payments.penalties > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                {payments.penalties > 0 ? '-' : ''}{formatCurrency(payments.penalties || 0)}
              </p>
            </div>

            {/* Final Amount */}
            <div className="flex justify-between items-center pt-4 bg-[#f3ae3f]/10 px-4 py-3 rounded-lg">
              <p className="font-semibold text-gray-900 text-lg">Total Amount</p>
              <p className="text-2xl font-bold text-[#f3ae3f]">
                {formatCurrency(payments.finalAmount || 0)}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Payment Status</p>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                payments.status === 'paid'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {payments.status === 'paid' ? 'Paid' : 'Unpaid'}
              </span>
            </div>
            {payments.status === 'paid' && payments.paidAt && (
              <p className="text-sm text-gray-600 mt-2">
                Paid on {new Date(payments.paidAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Daily Breakdown */}
        {payments.dailyBreakdown && payments.dailyBreakdown.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Daily Breakdown</h2>

            <div className="space-y-3">
              {payments.dailyBreakdown.map((day, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {day.entries.length} session{day.entries.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-[#f3ae3f]">
                    {formatHours(day.totalHours)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentWithHours;
