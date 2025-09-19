# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

SmartScript is a React-based web application for AI-powered examination script processing and marking. The frontend communicates with a backend API (typically running on port 8080) and provides features for uploading scripts, managing marking schemes, viewing results, and processing payments via Paystack.

## Commands

### Development
```powershell
# Start development server (includes Tailwind watch)
npm start

# Build for production
npm run build

# Run tests (interactive watch mode)
npm test

# Build Tailwind CSS manually
npm run tw:build

# Watch Tailwind changes
npm run tw:watch
```

### Environment Setup
```powershell
# Install dependencies
npm install

# Copy environment template and configure
cp .env.example .env
# Add: REACT_APP_API_BASE_URL=http://localhost:8080
```

### Testing
```powershell
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- --testPathPattern=ComponentName
```

## Architecture

### Application Structure
- **React Router** handles routing with protected routes requiring authentication
- **Context-based Authentication** manages JWT tokens with refresh token support
- **Axios interceptors** handle automatic token attachment and refresh logic
- **AppShell component** provides consistent layout with responsive sidebar navigation
- **Tailwind CSS** with custom theme for styling

### Key Architectural Patterns

#### Authentication Flow
- JWT tokens stored in localStorage (`token` and `refreshToken`)
- AuthContext provides authentication state throughout the app
- ProtectedRoute component wraps authenticated pages with AppShell
- Automatic token refresh on 401 responses via axios interceptors
- Redirects to `/login` on authentication failures

#### API Integration
- Centralized axios instance (`src/api/axios.js`) with base URL configuration
- Request interceptors attach Authorization headers
- Response interceptors handle token refresh and error responses
- API responses support both `{ success: true, data: {...} }` and direct object formats

#### Component Organization
```
src/
├── components/          # Reusable UI components
│   ├── AppShell.js     # Main layout wrapper
│   ├── ProtectedRoute.js # Auth wrapper for routes
│   └── ...             # Form components, modals, etc.
├── pages/              # Route components
├── context/            # React contexts (AuthContext)
├── api/                # API configuration and calls
└── ...
```

### Page Structure
- **Dashboard**: Stats overview with quick actions and navigation shortcuts
- **Uploads**: Script upload management with drag-and-drop support
- **Groups**: Organization of scripts and schemes into logical groups  
- **Schemes**: Marking scheme management and upload
- **Results**: Processed results viewing with candidate details
- **Anomalies**: Detection and review of potential issues
- **Account**: User profile and LLM model preferences

### Payment Integration
- Paystack integration for credit purchases
- Two-step process: backend initialization → frontend popup
- Payment verification through backend endpoints
- Metadata support for transaction tracking

## Key Configuration

### Environment Variables
- `REACT_APP_API_BASE_URL`: Backend API base URL (defaults to http://localhost:8080)

### Tailwind CSS
- Custom theme with education-focused colors (`smart-blue`, `edu-yellow`, etc.)
- Container utilities with responsive padding
- Custom animations (float, fade-in-up, shimmer)
- Extended screen sizes (3xl: 1920px, 4xl: 2560px)

### Dependencies
- **React 18** with React Router for navigation
- **Framer Motion** for animations and transitions
- **Axios** for HTTP requests with interceptors
- **React Hook Form** for form handling
- **React Dropzone** for file uploads
- **Lucide React** for icons
- **Paystack** payment integration

## Development Guidelines

### State Management
- Use AuthContext for authentication state
- Local component state for UI-specific data
- API calls in useEffect hooks with proper cleanup

### API Error Handling
- Handle both formatted (`{ success, data }`) and raw API responses
- Graceful degradation for missing endpoints (404s)
- User-friendly error messages with Alert components
- Auto-retry logic for authentication failures

### Styling Approach
- Tailwind-first with custom utility classes
- Responsive design with mobile-first approach
- Consistent spacing using Tailwind's spacing scale
- Custom animations for enhanced UX

### File Upload Patterns
- React Dropzone for drag-and-drop interfaces
- Progress indicators for upload states
- Error handling for file size/type restrictions
- Validation feedback before submission

### Route Protection
- All authenticated routes wrapped in ProtectedRoute
- Automatic redirect to login for unauthenticated users
- AppShell provides consistent navigation structure
- Loading states during authentication checks