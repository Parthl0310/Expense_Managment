// Mock data for development and testing

export const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'ADMIN' as const,
    isActive: true,
    companyId: {
      _id: 'company1',
      name: 'Acme Corp',
      currency: 'INR',
      country: 'INDIA'
    }
  },
  {
    _id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'MANAGER' as const,
    isActive: true,
    managerId: '1',
    companyId: {
      _id: 'company1',
      name: 'Acme Corp',
      currency: 'INR',
      country: 'INDIA'
    }
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'EMPLOYEE' as const,
    isActive: true,
    managerId: '2',
    companyId: {
      _id: 'company1',
      name: 'Acme Corp',
      currency: 'INR',
      country: 'INDIA'
    }
  },
  {
    _id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'EMPLOYEE' as const,
    isActive: true,
    managerId: '2',
    companyId: {
      _id: 'company1',
      name: 'Acme Corp',
      currency: 'INR',
      country: 'INDIA'
    }
  }
];

export const mockExpenses = [
  {
    _id: 'exp1',
    description: 'Business lunch with client',
    category: 'Meals',
    totalAmount: '50.00 USD',
    amountInCompanyCurrency: 4150.0,
    originalCurrency: 'USD',
    exchangeRate: 83.0,
    expenseDate: '2024-01-15T00:00:00.000Z',
    status: 'DRAFT',
    receipts: ['https://cloudinary.com/receipt1.jpg'],
    userId: {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    paidBy: {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    companyId: {
      _id: 'company1',
      name: 'Acme Corp',
      currency: 'INR'
    },
    createdAt: '2024-01-15T09:00:00.000Z'
  },
  {
    _id: 'exp2',
    description: 'Taxi fare to client meeting',
    category: 'Transport',
    totalAmount: '25.00 USD',
    amountInCompanyCurrency: 2075.0,
    originalCurrency: 'USD',
    exchangeRate: 83.0,
    expenseDate: '2024-01-14T00:00:00.000Z',
    status: 'WAITING_APPROVAL',
    receipts: ['https://cloudinary.com/receipt2.jpg'],
    userId: {
      _id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com'
    },
    paidBy: {
      _id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com'
    },
    companyId: {
      _id: 'company1',
      name: 'Acme Corp',
      currency: 'INR'
    },
    createdAt: '2024-01-14T14:30:00.000Z'
  },
  {
    _id: 'exp3',
    description: 'Office supplies',
    category: 'Supplies',
    totalAmount: '100.00 USD',
    amountInCompanyCurrency: 8300.0,
    originalCurrency: 'USD',
    exchangeRate: 83.0,
    expenseDate: '2024-01-13T00:00:00.000Z',
    status: 'APPROVED',
    receipts: ['https://cloudinary.com/receipt3.jpg'],
    userId: {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    paidBy: {
      _id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    companyId: {
      _id: 'company1',
      name: 'Acme Corp',
      currency: 'INR'
    },
    createdAt: '2024-01-13T10:15:00.000Z'
  }
];

export const mockApprovalRequests = [
  {
    _id: 'req1',
    expenseId: {
      _id: 'exp2',
      description: 'Taxi fare to client meeting',
      totalAmount: '25.00 USD',
      amountInCompanyCurrency: 2075.0,
      category: 'Transport',
      expenseDate: '2024-01-14T00:00:00.000Z',
      userId: {
        _id: '4',
        name: 'Emily Davis',
        email: 'emily@example.com'
      }
    },
    approvalRuleId: {
      _id: 'rule1',
      name: 'Standard Approval',
      description: 'Standard approval process'
    },
    currentApproverId: '2',
    overallStatus: 'PENDING',
    approvalFlow: [
      {
        approverId: '2',
        order: 1,
        status: 'PENDING',
        isRequired: true,
        isManager: true
      }
    ],
    createdAt: '2024-01-14T14:30:00.000Z'
  }
];

export const mockApprovalRules = [
  {
    _id: 'rule1',
    name: 'High Value Expense Approval',
    description: 'Approval rule for expenses above $1000',
    conditions: {
      amountThreshold: 1000,
      categories: ['Travel', 'Equipment']
    },
    approvalFlow: {
      type: 'SEQUENTIAL',
      approvers: [
        {
          userId: '2',
          order: 1,
          isRequired: true
        },
        {
          userId: '1',
          order: 2,
          isRequired: true
        }
      ]
    },
    conditionalRules: {
      percentageApproval: 60,
      specificApprovers: ['1'],
      logic: 'PERCENTAGE_OR_SPECIFIC'
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

export const mockCompany = {
  _id: 'company1',
  name: 'Acme Corp',
  country: 'INDIA',
  currency: 'INR',
  adminId: {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'ADMIN'
  },
  settings: {
    approvalThreshold: 1000,
    requireManagerApproval: true,
    autoApprovalLimit: 100
  },
  createdAt: '2024-01-01T00:00:00.000Z'
};

export const mockCurrencyRates = {
  base: 'INR',
  date: '2024-01-15',
  rates: {
    'USD': 0.012,
    'EUR': 0.011,
    'GBP': 0.0095,
    'JPY': 1.78,
    'CAD': 0.016,
    'AUD': 0.018
  }
};

export const mockCountries = [
  { name: { common: 'India' }, currencies: { INR: { name: 'Indian Rupee', symbol: '₹' } } },
  { name: { common: 'United States' }, currencies: { USD: { name: 'US Dollar', symbol: '$' } } },
  { name: { common: 'United Kingdom' }, currencies: { GBP: { name: 'British Pound', symbol: '£' } } },
  { name: { common: 'Canada' }, currencies: { CAD: { name: 'Canadian Dollar', symbol: 'C$' } } },
  { name: { common: 'Australia' }, currencies: { AUD: { name: 'Australian Dollar', symbol: 'A$' } } },
  { name: { common: 'Germany' }, currencies: { EUR: { name: 'Euro', symbol: '€' } } },
  { name: { common: 'Japan' }, currencies: { JPY: { name: 'Japanese Yen', symbol: '¥' } } },
  { name: { common: 'Singapore' }, currencies: { SGD: { name: 'Singapore Dollar', symbol: 'S$' } } }
];

export const expenseCategories = [
  'Meals',
  'Transport',
  'Accommodation',
  'Supplies',
  'Equipment',
  'Travel',
  'Entertainment',
  'Communication',
  'Other'
];

export const expenseStatuses = [
  'DRAFT',
  'WAITING_APPROVAL',
  'APPROVED',
  'REJECTED'
];

export const userRoles = [
  'ADMIN',
  'MANAGER',
  'EMPLOYEE'
];
