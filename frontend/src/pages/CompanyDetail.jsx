import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Plus, Download, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Layout from '../components/Layout/Layout.jsx';
import Card from '../components/Common/Card.jsx';
import Button from '../components/Common/Button.jsx';
import StatusBadge from '../components/Common/StatusBadge.jsx';
import Modal from '../components/Common/Modal.jsx';
import { companyApi } from '../api/companyApi.js';
import { exportCompanyReport } from '../utils/exporters.js';
import { formatCurrency, calculateBalancePercentage } from '../utils/formatters.js';

export const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('RECEIVED');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadCompanyData(); }, [id]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const response = await companyApi.getById(id);
      if (response.success) {
        setCompany(response.data.company);
      }
    } catch {
      console.error('Failed to load company');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setTransactionType(type);
    setAmount('');
    setShowModal(true);
  };

  const handleTransaction = async (e) => {
  e.preventDefault();
  const parsed = parseFloat(amount);
  if (!parsed || parsed <= 0) { alert('Enter a valid amount'); return; }

  try {
    setSubmitting(true);

    const updatedData = transactionType === 'RECEIVED'
      ? { totalReceived: (company.totalReceived || 0) + parsed }
      : { totalGiven: (company.totalGiven || 0) + parsed };

    console.log('Sending update:', updatedData); // debug — remove later

    const response = await companyApi.update(id, updatedData);
    if (response.success) {
      setShowModal(false);
      setAmount('');
      await loadCompanyData(); // reload fresh from DB
    }
  } catch (err) {
    console.error('Update failed:', err);
    alert('Failed to update. Check console for details.');
  } finally {
    setSubmitting(false);
  }
};

  const handleDeleteCompany = async () => {
    if (!confirm('Delete this company? This cannot be undone.')) return;
    try {
      const response = await companyApi.delete(id);
      if (response.success) navigate('/');
    } catch {
      alert('Failed to delete company');
    }
  };

  if (loading) return <Layout><p className="text-center text-gray-500 py-12">Loading...</p></Layout>;
  if (!company) return <Layout><p className="text-center text-gray-500 py-12">Company not found</p></Layout>;

  const percentage = calculateBalancePercentage(company.totalReceived, company.totalGiven);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="flex items-center text-green-700 hover:text-green-800 mb-4">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.companyName}</h1>
            <div className="mt-2"><StatusBadge status={company.status} /></div>
          </div>
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="secondary" size="sm" onClick={() => navigate(`/company/${id}/edit`)}>
              <Edit2 size={16} className="mr-1" /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteCompany}>
              <Trash2 size={16} className="mr-1" /> Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-gray-500 text-sm">Total Given</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(company.totalGiven)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm">Total Received</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(company.totalReceived)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-gray-500 text-sm">Pending Balance</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(company.balance)}</p>
        </Card>
      </div>

      {/* Progress */}
      <Card className="p-6 mb-8">
        <p className="text-sm font-medium text-gray-600 mb-3">
          Payment Progress ({percentage.toFixed(0)}%)
        </p>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="progress-bar" style={{ width: `${Math.min(percentage, 100)}%` }} />
        </div>
      </Card>

      {/* Notes */}
      {company.notes && (
        <Card className="p-6 mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-2">Notes</h2>
          <p className="text-gray-600">{company.notes}</p>
        </Card>
      )}

      {/* Transaction Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-lg font-bold text-gray-900">Transactions</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => exportCompanyReport(company, [])}
          >
            <Download size={16} className="mr-1" /> Export Report
          </Button>
        </div>

        {/* Two action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Money Received */}
          <button
            onClick={() => openModal('RECEIVED')}
            className="flex items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all"
            style={{
              borderColor: '#15803d',
              background: '#f0fdf4',
              color: '#15803d'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
            onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
          >
            <div className="p-2 rounded-full" style={{ background: '#dcfce7' }}>
              <ArrowDownLeft size={22} style={{ color: '#15803d' }} />
            </div>
            <div className="text-left">
              <p className="font-bold text-base">Money Received</p>
              <p className="text-sm opacity-70">Record an incoming payment</p>
            </div>
          </button>

          {/* Money Given */}
          <button
            onClick={() => openModal('GIVEN')}
            className="flex items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all"
            style={{
              borderColor: '#1d4ed8',
              background: '#eff6ff',
              color: '#1d4ed8'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
            onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}
          >
            <div className="p-2 rounded-full" style={{ background: '#dbeafe' }}>
              <ArrowUpRight size={22} style={{ color: '#1d4ed8' }} />
            </div>
            <div className="text-left">
              <p className="font-bold text-base">Money Given</p>
              <p className="text-sm opacity-70">Record an outgoing payment</p>
            </div>
          </button>
        </div>

        {/* Running totals summary */}
        <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Total Given</span>
            <span className="font-semibold text-gray-900">{formatCurrency(company.totalGiven)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Received</span>
            <span className="font-semibold text-green-700">{formatCurrency(company.totalReceived)}</span>
          </div>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={transactionType === 'RECEIVED' ? 'Record Payment Received' : 'Record Money Given'}
        size="sm"
      >
        <form onSubmit={handleTransaction} className="space-y-4">
          <div
            className="flex items-center gap-3 p-4 rounded-lg"
            style={{
              background: transactionType === 'RECEIVED' ? '#f0fdf4' : '#eff6ff',
              color: transactionType === 'RECEIVED' ? '#15803d' : '#1d4ed8'
            }}
          >
            {transactionType === 'RECEIVED'
              ? <ArrowDownLeft size={20} />
              : <ArrowUpRight size={20} />
            }
            <p className="text-sm font-medium">
              {transactionType === 'RECEIVED'
                ? `Recording payment from ${company.companyName}`
                : `Recording amount given to ${company.companyName}`
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input-field"
              placeholder="0.00"
              autoFocus
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="flex-1"
              style={{
                background: transactionType === 'RECEIVED' ? '#15803d' : '#1d4ed8'
              }}
            >
              Confirm
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default CompanyDetail;