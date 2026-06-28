import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Layout from '../components/Layout/Layout.jsx';
import SummaryCards from '../components/Dashboard/SummaryCards.jsx';
import CompanyGrid from '../components/Dashboard/CompanyGrid.jsx';
import GivenVsReceived from '../components/Charts/GivenVsReceived.jsx';
import PendingCompanies from '../components/Charts/PendingCompanies.jsx';
import MonthlyTransactions from '../components/Charts/MonthlyTransactions.jsx';
import Button from '../components/Common/Button.jsx';
import Input from '../components/Common/Input.jsx';
import Card from '../components/Common/Card.jsx';
import { companyApi } from '../api/companyApi.js';
import { FILTER_OPTIONS, SORT_OPTIONS } from '../utils/constants.js';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => { loadCompanies(); }, [search, status, sort]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyApi.getAll(search, status, sort);
      if (response.success) {
        setCompanies(response.data);
        setSummary(response.summary);
      }
    } catch {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Track and manage company receivables</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/company/new')} className="mt-4 sm:mt-0">
          <Plus size={18} className="mr-2" /> Add Company
        </Button>
      </div>

      <SummaryCards summary={summary} />

      {/* Filters */}
      <Card className="p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="lg:col-span-2"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
            {FILTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </Card>

      {error && (
        <Card className="bg-red-50 border border-red-200 p-4 mb-8">
          <p className="text-red-700">{error}</p>
        </Card>
      )}

      {/* Companies */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Companies ({companies.length})</h2>
        <CompanyGrid companies={companies} loading={loading} />
      </div>

      {/* Charts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GivenVsReceived companies={companies} />
          <PendingCompanies companies={companies} />
        </div>
        <MonthlyTransactions companies={companies} />
      </div>
    </Layout>
  );
};

export default Dashboard;