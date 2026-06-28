import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
      maxlength: 100
    },
    totalGiven: {
      type: Number,
      default: 0,
      min: 0
    },
    totalReceived: {
      type: Number,
      default: 0,
      min: 0
    },
    balance: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Partial', 'Completed'],
      default: 'Pending'
    },
    notes: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

CompanySchema.pre('save', function (next) {
  this.balance = this.totalGiven - this.totalReceived;

  if (this.balance === 0 && this.totalGiven > 0) {
    this.status = 'Completed';
  } else if (this.totalReceived > 0) {
    this.status = 'Partial';
  } else {
    this.status = 'Pending';
  }

  next();
});

CompanySchema.methods.getReceivablePercentage = function () {
  if (this.totalGiven === 0) return 0;
  return (this.totalReceived / this.totalGiven) * 100;
};

CompanySchema.methods.updateBalance = function () {
  this.balance = this.totalGiven - this.totalReceived;
  return this.save();
};

const Company = mongoose.model('Company', CompanySchema);

export default Company;