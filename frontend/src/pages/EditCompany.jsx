import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout/Layout.jsx';
import Card from '../components/Common/Card.jsx';
import Button from '../components/Common/Button.jsx';
import Input from '../components/Common/Input.jsx';
import { companyApi } from '../api/companyApi.js';

export const EditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ companyName: '', totalGiven: '', notes: '' });

  useEffect(() => { loadCompany(); }, [id]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const response = await companyApi.getById(id);
      if (response.success) {
        const c = response.data.company;
        setFormData({ companyName: c.companyName, totalGiven: c.totalGiven, notes: c.notes || '' });
      }
    } catch {
      setErrors({ submit: 'Failed to load company' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      setErrors({ companyName: 'Company name is required' }); return;
    }
    try {
      setSubmitting(true);
      const response = await companyApi.update(id, {
        companyName: formData.companyName.trim(),
        totalGiven: parseFloat(formData.totalGiven) || 0,
        notes: formData.notes
      });
      if (response.success) navigate(`/company/${id}`);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to update company' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><p className="text-center text-gray-500">Loading...</p></Layout>;

  return (
    <Layout>
      <div className="mb-8">
        <button onClick={() => navigate(`/company/${id}`)} className="flex items-center text-green-700 hover:text-green-800 mb-4">
          <ArrowLeft size={20} className="mr-2" /> Back to Company
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Company</h1>
        <p className="text-gray-500 mt-1">Update company details</p>
      </div>

      <Card className="max-w-xl mx-auto p-8">
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
            label="Initial Amount Given (₹)"
            type="number"
            name="totalGiven"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.totalGiven}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add notes..."
              className="input-field"
              rows="4"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="primary" loading={submitting} className="flex-1">
              Update Company
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate(`/company/${id}`)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
};

export default EditCompany;