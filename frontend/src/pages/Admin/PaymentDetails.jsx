// frontend/src/pages/PaymentDetails.jsx
import React, { useState, useEffect } from 'react';
import { paymentAPI } from '../../API/paymentAPI';

const PaymentDetails = ({ payment: initialPayment, onBack }) => {
  const [payment, setPayment] = useState(initialPayment);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bonus: initialPayment.bonus || 0,
    penalties: initialPayment.penalties || 0,
    notes: initialPayment.notes || ''
  });

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getPaymentDetails(
        payment.userId._id,
        payment.year,
        payment.month
      );
      
      setPayment(response.data.payment);
      setTimeEntries(response.data.timeEntries || []);
      setFormData({
        bonus: response.data.payment.bonus || 0,
        penalties: response.data.payment.penalties || 0,
        notes: response.data.payment.notes || ''
      });
    } catch (err) {
      console.error('Error fetching payment details:', err);
      alert('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await paymentAPI.updatePayment(payment._id, formData);
      alert('Payment updated successfully!');
      setEditing(false);
      fetchPaymentDetails();
    } catch (err) {
      alert(err.message || 'Failed to update payment');
    }
  };

  const handleToggleStatus = async () => {
    try {
      await paymentAPI.togglePaymentStatus(payment._id);
      fetchPaymentDetails();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  const worker = payment.userId;
  const finalAmount = payment.baseSalary + payment.bonus - payment.penalties;

  return (
    <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={onBack}
            className="text-gray-500 text-sm font-medium hover:text-blue-600 transition"
          >
            ← Payments
          </button>
          <span className="text-gray-400 text-sm">/</span>
          <span className="text-gray-800 text-sm font-medium">
            {worker.personalInfo.firstName} {worker.personalInfo.lastName}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {worker.personalInfo.firstName} {worker.personalInfo.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              {getMonthName(payment.month)} {payment.year} - {worker.jobTypeId?.name || 'Worker'}
            </p>
          </div>
          <button
            onClick={handleToggleStatus}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              payment.status === 'paid'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {payment.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Summary Cards */}
          <div className="space-y-4">
            {/* Worker Info */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">Worker Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{worker.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {worker.personalInfo.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hourly Rate</p>
                  <p className="text-sm font-medium text-gray-900">
                    {payment.hourlyRate.toFixed(2)} DZD/hour
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Hours</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {payment.totalHours.toFixed(1)}h
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Salary</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {payment.baseSalary.toFixed(2)} DZD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-600">Bonus</span>
                  <span className="text-sm font-semibold text-green-600">
                    +{payment.bonus.toFixed(2)} DZD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-red-600">Penalties</span>
                  <span className="text-sm font-semibold text-red-600">
                    -{payment.penalties.toFixed(2)} DZD
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between">
                  <span className="text-base font-bold text-gray-900">Final Amount</span>
                  <span className="text-base font-bold text-blue-600">
                    {finalAmount.toFixed(2)} DZD
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  payment.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {payment.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Edit Adjustments */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-600 uppercase">Adjustments</h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Bonus (DZD)</label>
                    <input
                      type="number"
                      value={formData.bonus}
                      onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Penalties (DZD)</label>
                    <input
                      type="number"
                      value={formData.penalties}
                      onChange={(e) => setFormData({ ...formData, penalties: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          bonus: payment.bonus,
                          penalties: payment.penalties,
                          notes: payment.notes
                        });
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm text-gray-600">
                  {payment.notes ? (
                    <p>{payment.notes}</p>
                  ) : (
                    <p className="italic">No notes added</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Time Entries */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Daily Time Entries</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {timeEntries.length} days worked
                </p>
              </div>

              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {timeEntries.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No time entries found for this period
                  </div>
                ) : (
                  timeEntries.map((day, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{formatDate(day.date)}</p>
                          <p className="text-xs text-gray-500">{day.entries.length} session(s)</p>
                        </div>
                        <span className="text-sm font-bold text-blue-600">
                          {day.totalHours.toFixed(1)}h
                        </span>
                      </div>

                      <div className="space-y-2">
                        {day.entries.map((entry) => (
                          <div key={entry._id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                {formatTime(entry.clockInTime)} → {formatTime(entry.clockOutTime)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {entry.totalHours.toFixed(1)}h
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;