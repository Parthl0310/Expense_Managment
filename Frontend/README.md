# Expense Management System - Frontend

A comprehensive React-based frontend for the Expense Management and Approval System built with TypeScript, Vite, and modern UI components.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** with secure token management
- **Role-based Access Control** (Admin, Manager, Employee)
- **Protected Routes** with automatic redirection
- **Persistent Login** with localStorage
- **Secure Logout** with token cleanup

### 👨‍💼 Admin Dashboard
- **User Management**: Create, update, and deactivate users
- **Approval Rules Configuration**: Set up complex approval workflows
- **Company Settings**: Configure approval thresholds and policies
- **Overview Dashboard**: System statistics and insights
- **Multi-role Support**: Manage different user types

### 👨‍💻 Manager Dashboard
- **Expense Approval**: Review and approve/reject expense requests
- **Detailed Expense View**: Complete expense information with receipts
- **Approval Workflow**: Sequential and parallel approval processes
- **Real-time Updates**: Live status updates and notifications
- **Bulk Actions**: Handle multiple approvals efficiently

### 👤 Employee Dashboard
- **Expense Creation**: Manual and OCR-based expense entry
- **Receipt Processing**: Upload and camera capture with OCR
- **Expense Tracking**: Monitor expense status and history
- **Currency Conversion**: Multi-currency support with real-time rates
- **Receipt Management**: Upload and view expense receipts

### 🛠️ Technical Features
- **OCR Integration**: Tesseract.js for receipt text extraction
- **Currency Conversion**: Real-time exchange rate conversion
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Context for global state
- **API Integration**: RESTful API communication

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── ErrorBoundary.tsx
│   ├── ProtectedRoute.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── contexts/           # React Context providers
│   └── AuthContext.tsx
├── data/              # Mock data and constants
│   └── mockData.ts
├── hooks/             # Custom React hooks
│   └── use-toast.ts
├── pages/             # Page components
│   ├── AdminEnhanced.tsx
│   ├── ManagerEnhanced.tsx
│   ├── EmployeeEnhanced.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   └── Index.tsx
├── services/          # API services
│   └── api.ts
├── utils/             # Utility functions
│   └── currencyConverter.ts
└── App.tsx           # Main application component
```

### Key Components

#### AuthContext
- Manages authentication state globally
- Handles login, logout, and registration
- Provides user information and permissions
- Automatic token refresh and validation

#### ProtectedRoute
- Route protection based on user roles
- Automatic redirection for unauthorized access
- Loading states during authentication checks

#### API Service
- Centralized API communication
- Automatic token attachment
- Error handling and user feedback
- Request/response interceptors

#### Currency Converter
- Real-time currency conversion
- Support for multiple currencies
- Exchange rate caching
- Amount parsing and formatting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000`

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_APP_NAME=ExpenseFlow
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🎨 UI Components

### Design System
- **Shadcn/ui**: Modern, accessible component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Responsive Design**: Mobile-first approach

### Key UI Features
- **Dark/Light Mode**: Theme switching support
- **Loading States**: Skeleton loaders and spinners
- **Error States**: User-friendly error messages
- **Empty States**: Helpful empty state illustrations
- **Form Validation**: Real-time validation feedback

## 🔧 Configuration

### API Configuration
The API service is configured to communicate with the backend at `http://localhost:8000/api/v1`. Update the `API_BASE_URL` in `src/services/api.ts` for different environments.

### Currency Configuration
Currency conversion is handled by the `CurrencyConverter` class in `src/utils/currencyConverter.ts`. It supports:
- Real-time exchange rates
- Multiple currency formats
- Amount parsing from strings
- Currency symbol mapping

### OCR Configuration
Receipt processing uses Tesseract.js for OCR. Configuration can be found in the Employee dashboard components.

## 🧪 Testing

### Mock Data
The application includes comprehensive mock data for development and testing:
- User accounts with different roles
- Sample expenses and approval requests
- Currency rates and country data
- Approval rules and company settings

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API service and context testing
- **E2E Tests**: Full user workflow testing
- **Error Testing**: Error boundary and fallback testing

## 🚀 Deployment

### Build Process
1. **Production Build**: `npm run build`
2. **Static Files**: Generated in `dist/` directory
3. **Environment Variables**: Configure for production
4. **API Endpoints**: Update for production backend

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3**: Cloud storage hosting
- **Docker**: Containerized deployment

## 🔒 Security Features

### Authentication Security
- JWT token storage in localStorage
- Automatic token refresh
- Secure logout with token cleanup
- Role-based access control

### Data Security
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure API communication

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Error logging and monitoring
- Graceful fallbacks

## 📱 Mobile Support

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for small screens
- Progressive Web App features

### Mobile Features
- Camera integration for receipts
- Touch gestures and interactions
- Offline capability
- Push notifications (future)

## 🔮 Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: Expense reporting and insights
- **Mobile App**: React Native implementation
- **Offline Support**: Service worker integration
- **Multi-language**: Internationalization support

### Technical Improvements
- **Performance**: Code splitting and lazy loading
- **Accessibility**: WCAG 2.1 compliance
- **Testing**: Comprehensive test coverage
- **Monitoring**: Error tracking and analytics

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow ESLint and Prettier rules
2. **Type Safety**: Use TypeScript strictly
3. **Component Structure**: Follow established patterns
4. **Testing**: Write tests for new features
5. **Documentation**: Update README and comments

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact the development team

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**