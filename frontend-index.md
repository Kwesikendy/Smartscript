# SmartScript Frontend Index

## 🎨 **Frontend Architecture Overview**

The SmartScript frontend is a modern React 18 application built with Tailwind CSS, providing an intuitive interface for examination script management and AI-powered marking.

---

## 📁 **Directory Structure**

```
Smartscript/
├── public/                    # Static assets
│   ├── index.html            # Main HTML template
│   ├── favicon.ico           # Site favicon
│   └── manifest.json         # PWA manifest
├── src/                      # Source code
│   ├── components/           # Reusable UI components
│   ├── context/             # React context providers
│   ├── pages/               # Page components
│   ├── api/                 # API client configuration
│   ├── App.js               # Main application component
│   └── index.js             # Application entry point
├── build/                   # Production build output
└── package.json             # Dependencies and scripts
```

---

## 🧩 **Core Components**

### **1. App Component (`src/App.js`)**

**Purpose**: Main application component with routing and context providers

**Key Features**:
- React Router for navigation
- AuthProvider for authentication state
- ToastProvider for notifications
- Protected routes with JWT validation

**Routes**:
- `/` - Landing page
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - Main dashboard
- `/uploads` - Upload management
- `/groups` - Group management
- `/results` - Results viewing
- `/schemes` - Marking schemes
- `/account` - User account

### **2. Authentication (`src/context/AuthContext.js`)**

**Purpose**: Manages user authentication state and JWT tokens

**Key Features**:
- JWT token management
- Automatic token refresh
- User profile management
- Auto-logout on token expiration
- Axios integration for API calls

**State**:
```javascript
{
  token: string | null,
  user: User | null,
  isAuthenticated: boolean,
  loading: boolean
}
```

**Methods**:
- `login(email, password)` - User login
- `logout()` - User logout
- `fetchMe()` - Get current user profile

---

## 📄 **Page Components**

### **1. Dashboard (`src/pages/Dashboard.js`)**

**Purpose**: Main dashboard with statistics and quick actions

**Features**:
- Statistics cards (uploads, candidates, schemes)
- Quick action buttons
- Recent activity feed
- Real-time updates (15s intervals)

**Components Used**:
- `StatsCard` - Statistics display
- `LoadingOverlay` - Loading states
- `Alert` - Error messages

### **2. Groups Page (`src/pages/GroupsPage.js`)**

**Purpose**: Manage subject/course groupings

**Features**:
- List groups with pagination
- Create/edit groups with type selection
- Delete groups
- Search and filter
- Group type indicators (Simple/Batch)

**Group Types**:
- **Simple**: Individual scripts, each image as separate row
- **Batch**: Grouped uploads, batches as rows with optional naming

**Form Fields**:
- Name (required)
- Description (optional)
- Has Math (boolean)
- Group Type (simple/batch)

### **3. Group Uploads Page (`src/pages/GroupUploadsPage.js`)**

**Purpose**: Upload and manage files within a specific group

**Features**:
- **Simple Groups**: Shows individual images as rows
- **Batch Groups**: Shows batches as rows, then images within
- Upload modal with batch naming
- Search and filter functionality
- Status tracking and progress indicators

**Dynamic Behavior**:
- Different UI based on group type
- Batch name input for batch groups
- Individual image display for simple groups
- Batch display for batch groups

### **4. Uploads Page (`src/pages/UploadsPage.js`)**

**Purpose**: Global upload management

**Features**:
- List all uploads across groups
- Group-based organization
- Status tracking
- Search and filter
- Bulk operations

### **5. Upload Detail Page (`src/pages/UploadDetailPage.js`)**

**Purpose**: View and edit individual uploads

**Features**:
- Image viewer with OCR text
- OCR text editing
- Status indicators
- Page navigation
- Save changes

### **6. Results Page (`src/pages/ResultsPage.js`)**

**Purpose**: View marking results and exports

**Features**:
- Group-based results view
- Candidate detail pages
- Export functionality
- Statistics and analytics

### **7. Schemes Page (`src/pages/SchemesPage.js`)**

**Purpose**: Manage marking schemes

**Features**:
- Create/edit marking schemes
- Question structure definition
- Custom instructions
- Version management

### **8. Account Page (`src/pages/AccountPage.js`)**

**Purpose**: User account management

**Features**:
- Profile editing
- Billing information
- Plan management
- Payment integration

---

## 🧩 **Reusable Components**

### **1. DataTable (`src/components/DataTable.js`)**

**Purpose**: Generic data table with pagination and sorting

**Props**:
- `data` - Array of data objects
- `columns` - Column configuration
- `loading` - Loading state
- `pagination` - Pagination info
- `onPageChange` - Page change handler

**Features**:
- Sortable columns
- Pagination controls
- Loading states
- Custom cell rendering

### **2. StatsCard (`src/components/StatsCard.js`)**

**Purpose**: Display statistics with icons and trends

**Variants**:
- `UploadsStatsCard` - Upload statistics
- `CandidatesStatsCard` - Candidate statistics
- `MarkedStatsCard` - Marking statistics

**Props**:
- `title` - Card title
- `value` - Statistic value
- `icon` - Icon component
- `iconColor` - Icon color theme
- `change` - Trend indicator

### **3. StatusBadge (`src/components/StatusBadge.js`)**

**Purpose**: Visual status indicators

**Types**:
- `upload` - Upload status
- `ocr` - OCR status
- `marking` - Marking status

**Statuses**:
- `pending` - Yellow
- `processing` - Blue
- `completed` - Green
- `failed` - Red

### **4. Loading Components**

**LoadingOverlay** - Full-screen loading overlay
**LoadingSpinner** - Spinner component
**LoadingProgressBar** - Progress bar with percentage

### **5. Modal (`src/components/Modal.js`)**

**Purpose**: Reusable modal dialog

**Props**:
- `isOpen` - Modal visibility
- `onClose` - Close handler
- `title` - Modal title
- `size` - Modal size (sm, md, lg)

### **6. Alert (`src/components/Alert.js`)**

**Purpose**: Notification alerts

**Types**:
- `success` - Green success message
- `error` - Red error message
- `warning` - Yellow warning message
- `info` - Blue info message

### **7. ToastProvider (`src/components/ToastProvider.js`)**

**Purpose**: Toast notification system

**Methods**:
- `toast.success(message)` - Success toast
- `toast.error(message)` - Error toast
- `toast.info(message)` - Info toast
- `toast.warning(message)` - Warning toast

---

## 🎨 **Styling & UI**

### **Tailwind CSS**
- Utility-first CSS framework
- Responsive design
- Dark/light theme support
- Custom color palette

### **Framer Motion**
- Smooth animations
- Page transitions
- Hover effects
- Loading animations

### **Design System**

**Colors**:
- Primary: Indigo (600, 700)
- Success: Green (500, 600)
- Warning: Yellow (500, 600)
- Error: Red (500, 600)
- Neutral: Gray (50-900)

**Typography**:
- Headings: Font-semibold, text-gray-900
- Body: Text-gray-600
- Small: Text-xs, text-gray-500

**Spacing**:
- Consistent padding/margin scale
- Responsive spacing
- Component-specific spacing

---

## 🔌 **API Integration**

### **Axios Configuration (`src/api/axios.js`)**

**Features**:
- Base URL configuration
- Request/response interceptors
- Automatic token injection
- Error handling
- Request/response logging

**Interceptors**:
- Request: Add JWT token to headers
- Response: Handle 401 errors, refresh tokens

### **API Endpoints**

**Authentication**:
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

**Groups**:
- `GET /groups` - List groups
- `POST /groups` - Create group
- `GET /groups/{id}` - Get group
- `PUT /groups/{id}` - Update group
- `DELETE /groups/{id}` - Delete group
- `GET /groups/{id}/pages` - Get group pages
- `POST /groups/{id}/uploads` - Upload to group

**Uploads**:
- `GET /uploads` - List uploads
- `GET /uploads/{id}` - Get upload
- `DELETE /uploads/{id}` - Delete upload
- `GET /uploads/{id}/pages` - Get upload pages

**Results**:
- `GET /results/groups` - List groups with results
- `GET /results/groups/{id}/results` - Get group results
- `GET /results/groups/{id}/export.csv` - Export results

---

## 🔄 **State Management**

### **React Context**
- `AuthContext` - Authentication state
- `ToastProvider` - Notification state

### **Local State**
- Component-level state with `useState`
- Form state with `react-hook-form`
- Loading states and error handling

### **Data Flow**
1. User interaction triggers API call
2. Loading state shown
3. API response updates component state
4. UI re-renders with new data
5. Success/error notifications shown

---

## 📱 **Responsive Design**

### **Breakpoints**
- `sm` - 640px+
- `md` - 768px+
- `lg` - 1024px+
- `xl` - 1280px+
- `2xl` - 1536px+

### **Mobile-First Approach**
- Touch-friendly interfaces
- Responsive navigation
- Optimized forms
- Mobile-specific interactions

---

## 🚀 **Build & Deployment**

### **Scripts**
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run tw:watch` - Tailwind CSS watch mode

### **Build Process**
1. Tailwind CSS compilation
2. React build with Create React App
3. Asset optimization
4. Static file generation

### **Production Build**
- Minified JavaScript and CSS
- Optimized images
- Gzip compression
- CDN-ready static assets

---

## 🧪 **Testing**

### **Testing Library**
- React Testing Library for component tests
- Jest for test runner
- User event testing
- Accessibility testing

### **Test Structure**
- Component unit tests
- Integration tests
- API mocking
- Snapshot testing

---

## 🔧 **Development Tools**

### **Code Quality**
- ESLint for code linting
- Prettier for code formatting
- React hooks linting rules

### **Development Experience**
- Hot reloading
- Source maps
- Error boundaries
- Development warnings

---

## 🎯 **Key Features Implementation**

### **Group Types (Simple vs Batch)**

**Simple Groups**:
- Each uploaded file becomes separate upload
- UI shows individual images as rows
- Direct click navigation to image details
- Individual image management

**Batch Groups**:
- Multiple files grouped into single batch
- UI shows batches as rows
- Optional batch naming during upload
- Click batch to see all images within
- Hierarchical navigation structure

### **Upload Flow**
1. User selects group type when creating group
2. Upload modal adapts based on group type
3. Batch groups show name input field
4. Files uploaded with appropriate grouping
5. UI displays results based on group type

### **Navigation Patterns**
- Simple groups: Group → Individual Images
- Batch groups: Group → Batches → Images within Batch
- Consistent back navigation
- Breadcrumb-style navigation

---

## 📊 **Performance Optimizations**

### **Code Splitting**
- Route-based code splitting
- Lazy loading of components
- Dynamic imports

### **Optimization Techniques**
- React.memo for component memoization
- useCallback for function memoization
- useMemo for expensive calculations
- Image lazy loading

### **Bundle Analysis**
- Webpack bundle analyzer
- Dependency optimization
- Tree shaking

---

This frontend provides a modern, responsive interface for the SmartScript examination marking system, with comprehensive support for both simple and batch group types, intuitive navigation, and a polished user experience.
