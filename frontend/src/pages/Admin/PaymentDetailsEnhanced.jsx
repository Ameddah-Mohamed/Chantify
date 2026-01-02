// frontend/src/pages/Admin/PaymentDetailsEnhanced.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../../API/paymentAPI';

const PaymentDetailsEnhanced = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [allPayments, setAllPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bonus: 0,
    penalties: 0,
    notes: ''
  });

  useEffect(() => {
    fetchWorkerPayments();
  }, [workerId]);

  const fetchWorkerPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/payments/worker/${workerId}`, {
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to fetch payments');

      const data = await response.json();
      setWorker(data.worker);
      setAllPayments(data.payments || []);
      
      if (data.payments && data.payments.length > 0) {
        setSelectedPayment(data.payments[0]);
        fetchPaymentDetails(data.payments[0]);
      }
    } catch (err) {
      console.error('Error fetching worker payments:', err);
      alert('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentDetails = async (payment) => {
    try {
      const response = await paymentAPI.getPaymentDetails(
        payment.userId._id || payment.userId,
        payment.year,
        payment.month
      );
      
      setTimeEntries(response.data.timeEntries || []);
      setFormData({
        bonus: payment.bonus || 0,
        penalties: payment.penalties || 0,
        notes: payment.notes || ''
      });
    } catch (err) {
      console.error('Error fetching payment details:', err);
    }
  };

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
    fetchPaymentDetails(payment);
    setEditing(false);
  };

  const handleUpdate = async () => {
    try {
      await paymentAPI.updatePayment(selectedPayment._id, formData);
      alert('Payment updated successfully!');
      setEditing(false);
      fetchWorkerPayments();
    } catch (err) {
      alert(err.message || 'Failed to update payment');
    }
  };

  const handleToggleStatus = async (paymentId) => {
    try {
      await paymentAPI.togglePaymentStatus(paymentId);
      fetchWorkerPayments();
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
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!worker || allPayments.length === 0) {
    return (
      <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/manager/payments')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Payments
          </button>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            No payment records found for this worker
          </div>
        </div>
      </div>
    );
  }

  const finalAmount = selectedPayment ? 
    selectedPayment.baseSalary + selectedPayment.bonus - selectedPayment.penalties : 0;

  return (
    <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => navigate('/manager/payments')}
            className="text-gray-500 text-sm font-medium hover:text-blue-600 transition"
          >
            ← Payments
          </button>
          <span className="text-gray-400 text-sm">/</span>
          <span className="text-gray-800 text-sm font-medium">
            {worker.personalInfo?.firstName} {worker.personalInfo?.lastName}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {worker.personalInfo?.firstName} {worker.personalInfo?.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              {worker.jobTypeId?.name || 'Worker'} - Payment History
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Payment History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Payment History</h3>
                <p className="text-xs text-gray-600 mt-1">{allPayments.length} month(s)</p>
              </div>
              <div className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
                {allPayments.map((payment) => (
                  <button
                    key={payment._id}
                    onClick={() => handlePaymentSelect(payment)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                      selectedPayment?._id === payment._id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {getMonthName(payment.month)} {payment.year}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {payment.totalHours.toFixed(1)}h worked
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-blue-600 mt-2">
                      {payment.finalAmount.toFixed(2)} DZD
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedPayment && (
              <>
                {/* Summary Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {getMonthName(selectedPayment.month)} {selectedPayment.year}
                      </h2>
                      <p className="text-gray-600 mt-1">Payment Summary</p>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(selectedPayment._id)}
                      className={`px-6 py-2 rounded-lg font-semibold transition ${
                        selectedPayment.status === 'paid'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {selectedPayment.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600">Total Hours</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {selectedPayment.totalHours.toFixed(1)}h
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600">Hourly Rate</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {selectedPayment.hourlyRate.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600">Base Salary</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {selectedPayment.baseSalary.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-xs text-blue-600">Final Amount</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {finalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Adjustments */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Adjustments</h3>
                      {!editing && (
                        <button
                          onClick={() => setEditing(true)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                      )}
                    </div>

                    {editing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Bonus (DZD)</label>
                          <input
                            type="number"
                            value={formData.bonus}
                            onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Penalties (DZD)</label>
                          <input
                            type="number"
                            value={formData.penalties}
                            onChange={(e) => setFormData({ ...formData, penalties: parseFloat(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">Notes</label>
                          <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                          />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                          <button
                            onClick={handleUpdate}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditing(false);
                              setFormData({
                                bonus: selectedPayment.bonus,
                                penalties: selectedPayment.penalties,
                                notes: selectedPayment.notes
                              });
                            }}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Bonus</p>
                          <p className="text-lg font-semibold text-green-600">
                            +{selectedPayment.bonus.toFixed(2)} DZD
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Penalties</p>
                          <p className="text-lg font-semibold text-red-600">
                            -{selectedPayment.penalties.toFixed(2)} DZD
                          </p>
                        </div>
                        {selectedPayment.notes && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-600 mb-1">Notes</p>
                            <p className="text-sm text-gray-900">{selectedPayment.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Entries */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Daily Time Entries</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {timeEntries.length} days worked
                    </p>
                  </div>

                  <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                    {timeEntries.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        No time entries found for this period
                      </div>
                    ) : (
                      timeEntries.map((day, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50">
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
                                <span className="text-gray-600">
                                  {formatTime(entry.clockInTime)} → {formatTime(entry.clockOutTime)}
                                </span>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsEnhanced;