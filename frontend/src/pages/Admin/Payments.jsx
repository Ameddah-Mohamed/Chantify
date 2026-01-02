// frontend/src/pages/Admin/Payments.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../../API/paymentAPI';

const Payments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalPaid: 0,
    totalUnpaid: 0,
    totalWorkers: 0
  });
  
  const [filters, setFilters] = useState({
    status: 'all',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const queryFilters = {};
      
      if (filters.status !== 'all') {
        queryFilters.status = filters.status;
      }
      if (filters.month) {
        queryFilters.month = filters.month;
      }
      if (filters.year) {
        queryFilters.year = filters.year;
      }

      const response = await paymentAPI.getCompanyPayments(queryFilters);
      setPayments(response.data || []);
      setSummary(response.summary || { totalPaid: 0, totalUnpaid: 0, totalWorkers: 0 });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch payments');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePayments = async () => {
    if (!window.confirm(`Generate payments for ${getMonthName(filters.month)} ${filters.year}?`)) {
      return;
    }

    try {
      setGenerating(true);
      await paymentAPI.generateMonthlyPayments(filters.year, filters.month);
      alert('Payments generated successfully!');
      fetchPayments();
    } catch (err) {
      alert(err.message || 'Failed to generate payments');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStatus = async (paymentId) => {
    try {
      await paymentAPI.togglePaymentStatus(paymentId);
      fetchPayments();
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    }
  };

  const handleViewDetails = (payment) => {
    const workerId = payment.userId?._id || payment.userId;
    navigate(`/manager/payments/details/${workerId}`);
  };

  const getMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  const getStatusClass = (status) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage worker payments and salaries
          </p>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6">
          <div className="flex flex-col gap-2 rounded-xl p-4 md:p-6 bg-white border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-xs md:text-sm font-medium">Total Paid</p>
            <p className="text-green-600 text-xl md:text-3xl font-bold break-words">
              {summary.totalPaid.toFixed(2)} DZD
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-4 md:p-6 bg-white border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-xs md:text-sm font-medium">Total Unpaid</p>
            <p className="text-red-600 text-xl md:text-3xl font-bold break-words">
              {summary.totalUnpaid.toFixed(2)} DZD
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-4 md:p-6 bg-white border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-gray-600 text-xs md:text-sm font-medium">Total Workers</p>
            <p className="text-gray-900 text-xl md:text-3xl font-bold">
              {summary.totalWorkers}
            </p>
          </div>
        </section>

        {/* Filters & Actions */}
        <section className="mb-4 p-3 md:p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="flex-1 px-3 md:px-4 py-2 rounded-lg border border-gray-300 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>

              {/* Month Filter */}
              <select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
                className="flex-1 px-3 md:px-4 py-2 rounded-lg border border-gray-300 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                  <option key={m} value={m}>{getMonthName(m)}</option>
                ))}
              </select>

              {/* Year Filter */}
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
                className="flex-1 px-3 md:px-4 py-2 rounded-lg border border-gray-300 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[2024, 2025, 2026].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGeneratePayments}
              disabled={generating}
              className="w-full px-4 md:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-xs md:text-sm font-semibold"
            >
              {generating ? 'Generating...' : 'Generate Payments'}
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-xs md:text-sm">{error}</p>
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Worker</th>
                  <th className="px-4 py-3 font-semibold">Job Type</th>
                  <th className="px-4 py-3 font-semibold text-right">Real Hours</th>
                  <th className="px-4 py-3 font-semibold text-right">Estimated Hours</th>
                  <th className="px-4 py-3 font-semibold text-right">Hourly Rate</th>
                  <th className="px-4 py-3 font-semibold text-right">Base Salary</th>
                  <th className="px-4 py-3 font-semibold text-right">Bonus</th>
                  <th className="px-4 py-3 font-semibold text-right">Penalties</th>
                  <th className="px-4 py-3 font-semibold text-right">Total</th>
                  <th className="px-4 py-3 font-semibold text-center">Status</th>
                  <th className="px-4 py-3 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-4 py-8 text-center text-gray-500">
                      No payments found. Click "Generate Payments" to create them.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id} className="bg-white hover:bg-gray-50 transition">
                      <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {payment.userId?.personalInfo?.firstName} {payment.userId?.personalInfo?.lastName}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {payment.userId?.jobTypeId?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-blue-600">
                        {payment.actualHours.toFixed(1)}h
                      </td>
                      <td className="px-4 py-4 text-right text-gray-600">
                        {payment.estimatedHours.toFixed(1)}h
                      </td>
                      <td className="px-4 py-4 text-right text-gray-900">
                        {payment.hourlyRate.toFixed(2)} DZD/h
                      </td>
                      <td className="px-4 py-4 text-right text-gray-900">
                        {payment.baseSalary.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right text-green-600">
                        +{payment.bonus.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right text-red-600">
                        -{payment.penalties.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">
                        {payment.finalAmount.toFixed(2)} DZD
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`${getStatusClass(payment.status)} text-xs font-medium px-2.5 py-1 rounded-full`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleViewDetails(payment)}
                            className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleToggleStatus(payment._id)}
                            className={`px-3 py-1 text-xs font-medium rounded transition ${
                              payment.status === 'paid'
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {payment.status === 'paid' ? 'Unpay' : 'Pay'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {payments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center text-gray-500 text-sm">
              No payments found. Click "Generate Payments" to create them.
            </div>
          ) : (
            payments.map((payment) => (
              <div key={payment._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {payment.userId?.personalInfo?.firstName} {payment.userId?.personalInfo?.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{payment.userId?.jobTypeId?.name || 'N/A'}</p>
                  </div>
                  <span className={`${getStatusClass(payment.status)} text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap`}>
                    {payment.status}
                  </span>
                </div>

                {/* Hours */}
                <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Real Hours</p>
                    <p className="font-semibold text-blue-600 text-sm">{payment.actualHours.toFixed(1)}h</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Est. Hours</p>
                    <p className="font-semibold text-gray-900 text-sm">{payment.estimatedHours.toFixed(1)}h</p>
                  </div>
                </div>

                {/* Salary Details */}
                <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Hourly Rate</p>
                    <p className="font-semibold text-gray-900 text-sm">{payment.hourlyRate.toFixed(2)} DZD/h</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Base Salary</p>
                    <p className="font-semibold text-gray-900 text-sm">{payment.baseSalary.toFixed(2)}</p>
                  </div>
                </div>

                {/* Adjustments */}
                <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Bonus</p>
                    <p className="font-semibold text-green-600 text-sm">+{payment.bonus.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Penalties</p>
                    <p className="font-semibold text-red-600 text-sm">-{payment.penalties.toFixed(2)}</p>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 rounded-lg p-2 mb-3">
                  <p className="text-xs text-gray-600">Total Amount</p>
                  <p className="font-bold text-gray-900 text-lg">{payment.finalAmount.toFixed(2)} DZD</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(payment)}
                    className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleToggleStatus(payment._id)}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition ${
                      payment.status === 'paid'
                        ? 'text-red-600 bg-red-50 hover:bg-red-100'
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {payment.status === 'paid' ? 'Unpay' : 'Pay'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;