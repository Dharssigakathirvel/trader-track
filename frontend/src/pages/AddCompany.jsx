import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout/Layout.jsx';
import Card from '../components/Common/Card.jsx';
import Button from '../components/Common/Button.jsx';
import Input from '../components/Common/Input.jsx';
import { companyApi } from '../api/companyApi.js';

export const AddCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ companyName: '', totalGiven: '', notes: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (formData.totalGiven && isNaN(parseFloat(formData.totalGiven)))
      newErrors.totalGiven = 'Please enter a valid amount';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const response = await companyApi.create({
        companyName: formData.companyName.trim(),
        totalGiven: formData.totalGiven ? parseFloat(formData.totalGiven) : 0,
        notes: formData.notes
      });

      if (response.success) {
        if (response.isExisting) {
          // Show a brief notice then redirect
          setErrors({
            info: `"${response.data.companyName}" already exists — ₹${parseFloat(formData.totalGiven || 0).toLocaleString('en-IN')} added to their total.`
          });
          setTimeout(() => navigate(`/company/${response.data._id}`), 2000);
        } else {
          navigate(`/company/${response.data._id}`);
        }
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to create company' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="flex items-center text-green-700 hover:text-green-800 mb-4">
          <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add Company</h1>
        <p className="text-gray-500 mt-1">Creates new or adds amount to existing company</p>
      </div>

      <Card className="max-w-xl mx-auto p-8">

        {/* Info notice (existing company found) */}
        {errors.info && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-2">
            <span className="text-blue-600 text-lg">ℹ️</span>
            <p className="text-blue-800 text-sm">{errors.info} Redirecting...</p>
          </div>
        )}

        {/* Error notice */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Company Name"
            name="companyName"
            placeholder="Enter company name"
            value={formData.companyName}
            onChange={handleChange}
            error={errors.companyName}
            required
          />

          <Input
            label="Amount Given (₹)"
            type="number"
            name="totalGiven"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.totalGiven}
            onChange={handleChange}
            error={errors.totalGiven}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes"
              className="input-field"
              rows="4"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="primary" loading={loading} className="flex-1">
              {loading ? 'Checking...' : 'Submit'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/')} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
};

export default AddCompany;