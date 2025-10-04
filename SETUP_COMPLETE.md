# 🚀 Expense Management System - Complete Setup Guide

## 📋 Project Overview

This is a comprehensive **Expense Management and Approval System** built with the MERN stack, designed for hackathon submission. The system features multi-role access, OCR receipt processing, real-time currency conversion, and complex approval workflows.

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with refresh mechanism
- **File Upload**: Cloudinary integration
- **OCR**: Tesseract.js for receipt processing
- **Currency**: Real-time exchange rate APIs

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **UI Library**: Shadcn/ui with Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Fetch API with custom service layer

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18.0.0 or higher
- **MongoDB**: 5.0 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended

### 1. Clone the Repository
```bash
git clone <repository-url>
cd odoo_g
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure `.env` file:**
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/expense_management
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**Start MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Start Backend Server:**
```bash
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api-docs

## 👥 User Roles & Access

### Admin (First User)
- **Access**: Full system control
- **Features**: User management, approval rules, company settings
- **Registration**: Can create company during signup

### Manager
- **Access**: Approval workflow, team management
- **Features**: Review expenses, approve/reject requests
- **Registration**: Created by admin

### Employee
- **Access**: Expense submission, personal dashboard
- **Features**: Create expenses, upload receipts, track status
- **Registration**: Created by admin

## 🔧 Configuration Guide

### Backend Configuration

#### Database Setup
1. **MongoDB Installation**:
   - Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS
   - Start MongoDB service

2. **Database Connection**:
   - Update `MONGODB_URI` in `.env` file
   - Default: `mongodb://localhost:27017/expense_management`

#### Cloudinary Setup (File Upload)
1. **Create Account**: Sign up at [Cloudinary](https://cloudinary.com)
2. **Get Credentials**: Dashboard → Settings → API Keys
3. **Update .env**: Add your Cloudinary credentials

#### JWT Configuration
1. **Generate Secrets**: Use strong, random strings
2. **Update .env**: Set JWT_SECRET and JWT_REFRESH_SECRET
3. **Expiration**: Configure token expiration times

### Frontend Configuration

#### API Endpoints
- **Base URL**: `http://localhost:8000/api/v1`
- **Update**: Modify in `src/services/api.ts` if needed

#### Environment Variables
Create `.env` file in Frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=ExpenseFlow
```

## 🧪 Testing the Application

### 1. Create Admin Account
1. Navigate to http://localhost:5173
2. Click "Sign Up"
3. Select "Admin" role
4. Enter company name
5. Complete registration

### 2. Login as Admin
1. Use admin credentials to login
2. Access admin dashboard
3. Create users (managers/employees)
4. Configure approval rules

### 3. Test Employee Workflow
1. Login as employee
2. Create new expense
3. Upload receipt (OCR will extract data)
4. Submit for approval

### 4. Test Manager Workflow
1. Login as manager
2. Review pending approvals
3. Approve/reject expenses
4. View approval history

## 📱 Features Overview

### 🔐 Authentication System
- **JWT-based**: Secure token authentication
- **Role-based Access**: Different permissions per role
- **Persistent Login**: Stay logged in across sessions
- **Secure Logout**: Token cleanup on logout

### 💰 Expense Management
- **Multi-currency**: Support for USD, EUR, INR, etc.
- **Real-time Conversion**: Live exchange rates
- **Receipt Upload**: File and camera upload
- **OCR Processing**: Automatic data extraction
- **Status Tracking**: Draft → Submitted → Approved/Rejected

### 👥 User Management
- **Admin Control**: Create and manage users
- **Role Assignment**: Assign roles and managers
- **User Deactivation**: Disable user accounts
- **Team Management**: View team members

### ⚙️ Approval Workflow
- **Flexible Rules**: Configure approval sequences
- **Manager Approval**: Optional manager review
- **Sequential/Parallel**: Choose approval flow type
- **Percentage Rules**: Set minimum approval percentages
- **Admin Override**: Override any approval decision

### 🏢 Company Settings
- **Approval Thresholds**: Set amount limits
- **Auto-approval**: Configure automatic approvals
- **Currency Settings**: Set company base currency
- **Policy Configuration**: Define expense policies

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
1. **MongoDB Connection Error**:
   - Check if MongoDB is running
   - Verify connection string in .env
   - Check firewall settings

2. **JWT Token Error**:
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Clear browser localStorage

3. **File Upload Error**:
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file formats

#### Frontend Issues
1. **API Connection Error**:
   - Verify backend is running
   - Check API_BASE_URL in services
   - Check CORS settings

2. **Authentication Error**:
   - Clear browser cache
   - Check localStorage
   - Verify token format

3. **OCR Not Working**:
   - Check Tesseract.js installation
   - Verify image format
   - Check browser permissions

### Debug Mode
Enable debug logging:
```bash
# Backend
DEBUG=expense:* npm run dev

# Frontend
VITE_DEBUG=true npm run dev
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh token

### Expense Endpoints
- `POST /api/v1/expenses/create` - Create expense
- `GET /api/v1/expenses/my-expenses` - Get user expenses
- `POST /api/v1/expenses/:id/submit` - Submit for approval
- `GET /api/v1/expenses/for-approval` - Get pending approvals

### Approval Endpoints
- `POST /api/v1/approval/:id/approve` - Approve expense
- `POST /api/v1/approval/:id/reject` - Reject expense
- `GET /api/v1/approval/pending` - Get pending approvals

### Admin Endpoints
- `GET /api/v1/company/employees` - Get company employees
- `POST /api/v1/user-management/create` - Create user
- `PUT /api/v1/company/settings` - Update company settings

## 🚀 Deployment

### Backend Deployment
1. **Environment Setup**:
   - Set production environment variables
   - Configure MongoDB Atlas or production DB
   - Set up Cloudinary production account

2. **Build & Deploy**:
   ```bash
   npm run build
   npm start
   ```

### Frontend Deployment
1. **Build Production**:
   ```bash
   npm run build
   ```

2. **Deploy to Hosting**:
   - Vercel, Netlify, or AWS S3
   - Update API endpoints for production
   - Configure environment variables

## 📈 Performance Optimization

### Backend Optimizations
- **Database Indexing**: Optimize MongoDB queries
- **Caching**: Implement Redis for session storage
- **Compression**: Enable gzip compression
- **Rate Limiting**: Implement API rate limiting

### Frontend Optimizations
- **Code Splitting**: Lazy load components
- **Image Optimization**: Compress and optimize images
- **Bundle Analysis**: Analyze and optimize bundle size
- **Caching**: Implement service worker caching

## 🔒 Security Considerations

### Backend Security
- **Input Validation**: Sanitize all inputs
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Restrict cross-origin requests
- **Environment Variables**: Secure credential storage

### Frontend Security
- **XSS Protection**: Sanitize user inputs
- **CSRF Protection**: Implement CSRF tokens
- **Content Security Policy**: Configure CSP headers
- **Secure Storage**: Use secure token storage

## 📝 Development Guidelines

### Code Style
- **ESLint**: Follow configured linting rules
- **Prettier**: Use consistent code formatting
- **TypeScript**: Strict type checking enabled
- **Comments**: Document complex logic

### Git Workflow
- **Feature Branches**: Create branches for features
- **Commit Messages**: Use conventional commits
- **Pull Requests**: Review before merging
- **Testing**: Test before submitting PRs

## 🎯 Hackathon Features

### Mandatory Requirements ✅
- **Real-time Data**: Currency conversion APIs
- **Responsive UI**: Mobile-first design
- **Input Validation**: Comprehensive form validation
- **Intuitive Navigation**: Clear user flows
- **Version Control**: Git with proper commits

### Good to Have Features ✅
- **Backend APIs**: Complete REST API
- **AI Integration**: OCR for receipt processing
- **Offline Support**: Local storage caching
- **Modern Tech**: React, TypeScript, Node.js

## 🏆 Project Highlights

### Technical Excellence
- **Full-stack TypeScript**: Type safety throughout
- **Modern Architecture**: Clean, scalable code structure
- **Comprehensive Testing**: Mock data and error handling
- **Documentation**: Detailed README and code comments

### User Experience
- **Intuitive Design**: Clean, modern UI
- **Responsive Layout**: Works on all devices
- **Error Handling**: User-friendly error messages
- **Loading States**: Smooth user interactions

### Business Value
- **Multi-role System**: Supports different user types
- **Approval Workflow**: Flexible approval processes
- **Receipt Processing**: OCR for easy expense entry
- **Currency Support**: Global business support

## 📞 Support & Contact

For questions or issues:
- **GitHub Issues**: Create issues for bugs
- **Documentation**: Check README files
- **Code Comments**: Inline documentation
- **API Docs**: Backend API documentation

---

**🎉 Congratulations! Your Expense Management System is ready for the hackathon!**

Built with ❤️ using the MERN stack and modern web technologies.
