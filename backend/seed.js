import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './src/models/Company.js';

dotenv.config();

const seedData = [
  { companyName: 'Murugan Textiles',     totalGiven: 150000, notes: 'Salem wholesale supplier' },
  { companyName: 'Kavitha Exports',      totalGiven: 280000, notes: 'Coimbatore garments export' },
  { companyName: 'Sri Balaji Traders',   totalGiven: 95000,  notes: 'Erode fabric dealer' },
  { companyName: 'Annamalai Silk House', totalGiven: 320000, notes: 'Kanchipuram silk goods' },
  { companyName: 'Vel Tech Industries',  totalGiven: 175000, notes: 'Chennai auto parts' },
  { companyName: 'Mahalakshmi Rice Mill',totalGiven: 210000, notes: 'Thanjavur rice supplier' },
  { companyName: 'Pandian Constructions',totalGiven: 480000, notes: 'Madurai civil works' },
  { companyName: 'Saravana Stores',      totalGiven: 125000, notes: 'Tirupur retail chain' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Company.deleteMany({});
    console.log('Cleared existing companies');

    // Add partial received amounts to some companies
    const companies = seedData.map((c, i) => ({
      ...c,
      totalReceived: i % 3 === 0 ? c.totalGiven : i % 3 === 1 ? Math.floor(c.totalGiven * 0.5) : 0
    }));

    await Company.insertMany(companies);
    console.log(`Seeded ${companies.length} companies`);

    // Re-save each to trigger pre-save hook (balance + status calc)
    const saved = await Company.find();
    for (const company of saved) {
      await company.save();
    }
    console.log('Balance and status calculated for all companies');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();