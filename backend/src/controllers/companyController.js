import Company from '../models/Company.js';

export const getCompanies = async (req, res, next) => {
  try {
    const { search, status, sort } = req.query;
    let filter = {};

    if (search) {
      filter.companyName = { $regex: search, $options: 'i' };
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'highest-pending') {
      sortObj = { balance: -1 };
    } else if (sort === 'latest-transaction') {
      sortObj = { updatedAt: -1 };
    }

    const companies = await Company.find(filter).sort(sortObj);

    const summary = {
      totalCompanies: companies.length,
      totalGiven: companies.reduce((sum, c) => sum + c.totalGiven, 0),
      totalReceived: companies.reduce((sum, c) => sum + c.totalReceived, 0),
      pendingBalance: companies.reduce((sum, c) => sum + c.balance, 0)
    };

    res.status(200).json({ success: true, data: companies, summary });
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    res.status(200).json({ success: true, data: { company } });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    const { companyName, totalGiven, notes } = req.body;

    if (!companyName || companyName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: ['Company name is required']
      });
    }

    // Check if company already exists (case-insensitive)
    const existingCompany = await Company.findOne({
      companyName: { $regex: `^${companyName.trim()}$`, $options: 'i' }
    });

    if (existingCompany) {
      // Add to existing company's totalGiven
      if (totalGiven) existingCompany.totalGiven += parseFloat(totalGiven);
      if (notes) existingCompany.notes = notes;

      await existingCompany.save();

      return res.status(200).json({
        success: true,
        message: `Amount added to existing company "${existingCompany.companyName}"`,
        data: existingCompany,
        isExisting: true
      });
    }

    // Create new company
    const company = new Company({
      companyName: companyName.trim(),
      totalGiven: totalGiven || 0,
      notes
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
      isExisting: false
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyName, totalGiven, totalReceived, notes } = req.body;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (companyName) company.companyName = companyName.trim();
    if (totalGiven !== undefined) company.totalGiven = totalGiven;
    if (totalReceived !== undefined) company.totalReceived = totalReceived;
    if (notes !== undefined) company.notes = notes;

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    await Company.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const companies = await Company.find();

    const stats = {
      totalCompanies: companies.length,
      totalGiven: companies.reduce((sum, c) => sum + c.totalGiven, 0),
      totalReceived: companies.reduce((sum, c) => sum + c.totalReceived, 0),
      pendingBalance: companies.reduce((sum, c) => sum + c.balance, 0),
      statusBreakdown: {
        completed: companies.filter(c => c.status === 'Completed').length,
        partial: companies.filter(c => c.status === 'Partial').length,
        pending: companies.filter(c => c.status === 'Pending').length
      }
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export default {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getDashboardStats
};