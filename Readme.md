# StayAtlas-Main Project Structure & Linking Guide

## 🏗️ Project Overview
StayAtlas is a full-stack villa booking platform with a React frontend and Node.js/Express backend, featuring user authentication, villa management, booking system, and admin dashboard.

## 📁 Root Structure
```
StayAtlas-main/
├── StayAtlas-Backend/          # Node.js/Express API Server
└── stayatlas-booking/          # React Frontend Application
```

---

## 🔧 Backend Structure (StayAtlas-Backend/)

### 🚀 Entry Points
- **`server.js`** - Main server entry point
  - Connects to MongoDB database
  - Initializes admin user
  - Starts Express server
  - **Links to:** `app.js`, `config/db.js`, `models/user.model.js`

- **`app.js`** - Express application configuration
  - Sets up middleware (CORS, JSON parsing, cookies, etc.)
  - Registers all API routes
  - **Links to:** All route files in `routes/` directory

### 🗄️ Database & Configuration
- **`config/db.js`** - MongoDB connection configuration
- **`constants.js`** - Application constants and configurations

### 📊 Models (Database Schemas)
- **`models/user.model.js`** - User authentication and profile data
- **`models/villa.model.js`** - Villa/property listings
- **`models/booking.model.js`** - Booking reservations
- **`models/review.model.js`** - User reviews and ratings
- **`models/experiencereview.model.js`** - Experience reviews
- **`models/adminAction.model.js`** - Admin activity logs

### 🛣️ Routes (API Endpoints)
- **`routes/user.route.js`** - User authentication & profile management
  - `/api/v1/users/*`
- **`routes/villa.route.js`** - Villa CRUD operations
  - `/api/v1/villas/*`
- **`routes/booking.route.js`** - Booking management
  - `/api/v1/bookings/*`
- **`routes/review.route.js`** - Review system
  - `/api/v1/reviews/*`
- **`routes/experience.route.js`** - Experience sharing
  - `/api/v1/shareexperience/*`
- **`routes/adminAction.route.js`** - Admin operations
  - `/api/v1/admin/*`
- **`routes/bookingSearchRoutes.js`** - Villa search functionality
  - `/api/v1/villas/*` (search endpoints)

### 🎮 Controllers (Business Logic)
- **`controllers/user.controller.js`** - User operations logic
- **`controllers/villa.controller.js`** - Villa management logic
- **`controllers/booking.controller.js`** - Booking operations logic
- **`controllers/review.controllers.js`** - Review system logic
- **`controllers/experiencereview.controller.js`** - Experience review logic
- **`controllers/adminAction.controller.js`** - Admin operations logic

### 🛡️ Middleware (Request Processing)
- **`middlewares/auth.middleware.js`** - JWT authentication
- **`middlewares/admin.middleware.js`** - Admin role verification
- **`middlewares/villaOwner.middleware.js`** - Villa owner verification
- **`middlewares/checkIfBannedUser.js`** - User ban checking
- **`middlewares/multer.middleware.js`** - File upload handling
- **`middlewares/parse.address.middleware.js`** - Address parsing
- **`middlewares/errorHandler.js`** - Global error handling

### 🛠️ Utilities & Helpers
- **`utils/asyncHandler.js`** - Async error handling wrapper
- **`utils/ApiError.js`** - Custom error class
- **`utils/ApiResponse.js`** - Standardized API responses
- **`utils/cloudinary.js`** - Cloudinary image upload
- **`utils/deleteFromCloudinary.js`** - Image deletion from Cloudinary
- **`utils/paginate.js`** - Pagination helper
- **`utils/sendEmail.js`** - Email sending functionality

### ✅ Validators (Input Validation)
- **`validators/user.validator.js`** - User input validation
- **`validators/villa.validator.js`** - Villa data validation
- **`validators/booking.validator.js`** - Booking validation
- **`validators/review.validator.js`** - Review validation

### 📁 Static Assets
- **`public/`** - Static files (images, villa assets)
  - `villaAssets/` - Villa-related images
  - `stay-15xAdS51.jpg` - Default images

### 📊 Sample Data
- **`data/sampleVillas.js`** - Sample villa data for testing

---

## 🎨 Frontend Structure (stayatlas-booking/)

### 🚀 Entry Points
- **`main.jsx`** - React application entry point
  - Sets up Redux store
  - Renders App component
  - **Links to:** `App.jsx`, `state/store.js`

- **`App.jsx`** - Main application component
  - Defines routing structure
  - Handles authentication state
  - **Links to:** All page components and layouts

### 🏗️ Layout Components
- **`layout/MainLayout.jsx`** - Main application layout
  - **Links to:** `components/Header.jsx`, `components/footer.jsx`
- **`layout/ExclusiveLayout.jsx`** - Exclusive properties layout

### 📄 Pages (Route Components)
- **`pages/Home.jsx`** - Landing page
- **`pages/Login.jsx`** - User login
- **`pages/Signup.jsx`** - User registration
- **`pages/Profile.jsx`** - User profile management
- **`pages/Explore.jsx`** - Villa exploration
- **`pages/Exclusive.jsx`** - Exclusive properties
- **`pages/Booking.jsx`** - Booking process
- **`pages/BookingDetailsPage.jsx`** - Booking details
- **`pages/AdminDashboard.jsx`** - Admin panel
- **`pages/ListForm.jsx`** - Property listing form
- **`pages/ViewExclusive.jsx`** - Exclusive property details
- **`pages/VerifyOTP.jsx`** - OTP verification
- **`pages/ResetPasswordPage.jsx`** - Password reset
- **`pages/ErrorPage.jsx`** - Error handling

#### Footer Pages
- **`pages/FooterPage/aboutus.jsx`** - About us
- **`pages/FooterPage/Privacy.jsx`** - Privacy policy
- **`pages/FooterPage/TermsAndConditions.jsx`** - Terms & conditions
- **`pages/FooterPage/CancellationPolicy.jsx`** - Cancellation policy
- **`pages/FooterPage/ListYourProperty.jsx`** - Property listing
- **`pages/FooterPage/Chat.jsx`** - Chat support

### 🧩 Components (Reusable UI)
#### Core Components
- **`components/Header.jsx`** - Main navigation header
- **`components/footer.jsx`** - Site footer
- **`components/SearchBar.jsx`** - Search functionality
- **`components/BookingSearchBar.jsx`** - Booking search
- **`components/FilterSidebar.jsx`** - Filter options
- **`components/Sort.jsx`** - Sorting functionality

#### Property Components
- **`components/propertygrid.jsx`** - Property grid display
- **`components/datapropertylist.jsx`** - Property list data
- **`components/VilaDetail.jsx`** - Villa details
- **`components/VillaHeader.jsx`** - Villa page header
- **`components/ExclusivePropertyCard.jsx`** - Exclusive property cards
- **`components/exclusiveProperty.jsx`** - Exclusive property display

#### Booking Components
- **`components/BookingDetail.jsx`** - Booking information
- **`components/CancelBookingModal.jsx`** - Booking cancellation
- **`components/EditModal.jsx`** - Edit functionality

#### User Components
- **`components/UserProfile.jsx`** - User profile display
- **`components/OwnerProfile.jsx`** - Property owner profile
- **`components/EditProfile.jsx`** - Profile editing
- **`components/ReviewForm.jsx`** - Review submission
- **`components/ShowReview.jsx`** - Review display

#### Admin Components
- **`components/Admin/Dashboard.jsx`** - Admin dashboard
- **`components/Admin/Sidebar.jsx`** - Admin navigation
- **`components/Admin/UserManagement.jsx`** - User management
- **`components/Admin/VillaManagement.jsx`** - Villa management
- **`components/Admin/BookingManagement.jsx`** - Booking management
- **`components/Admin/ExperienceManagement.jsx`** - Experience management
- **`components/Admin/ContentManagement.jsx`** - Content management
- **`components/Admin/Chart.jsx`** - Analytics charts
- **`components/Admin/AdminHead.jsx`** - Admin header
- **`components/Admin/AdminNotification.jsx`** - Admin notifications
- **`components/Admin/ReviewModal.jsx`** - Review management modal

#### UI Components
- **`components/ui/button.jsx`** - Reusable button component
- **`components/ui/avatar.jsx`** - Avatar component
- **`components/ui/dropdown-menu.jsx`** - Dropdown menu

#### Feature Components
- **`components/Slideshow.jsx`** - Image slideshow
- **`components/Gallery.jsx`** - Image gallery
- **`components/Testimonials.jsx`** - User testimonials
- **`components/Trending.jsx`** - Trending properties
- **`components/FrequentlyVisited.jsx`** - Popular properties
- **`components/Offfers.jsx`** - Special offers
- **`components/NotificationBell.jsx`** - Notification system
- **`components/ShareModel.jsx`** - Sharing functionality
- **`components/ShareOptions.jsx`** - Share options
- **`components/ExclusiveHeader.jsx`** - Exclusive section header
- **`components/ExclusiveInfo.jsx`** - Exclusive information

### 🔐 Authentication & Protection
- **`components/ProtectedRoutes.jsx`** - Route protection for authenticated users
- **`components/AdminProtectedRoute.jsx`** - Admin route protection

### 🎯 State Management
- **`state/store.js`** - Redux store configuration
  - **Links to:** `state/features/authSlice.js`
- **`state/features/authSlice.js`** - Authentication state management

### 🛠️ Utilities & Configuration
- **`utils/axios.js`** - HTTP client configuration
  - **Links to:** Backend API endpoints
- **`utils/countriesCities.js`** - Location data
- **`lib/utils.js`** - Utility functions

### 🎨 Styling
- **`index.css`** - Global styles
- **`vite.config.js`** - Vite build configuration
- **`tailwind.config.js`** - Tailwind CSS configuration

### 📦 Assets
- **`assets/`** - Static assets (images, icons)
  - Villa images, backgrounds, logos

---

## 🔗 Key Integration Points

### Frontend ↔ Backend Communication
1. **Authentication Flow:**
   - Frontend: `pages/Login.jsx` → `utils/axios.js` → Backend: `routes/user.route.js`

2. **Villa Management:**
   - Frontend: `pages/Explore.jsx` → `utils/axios.js` → Backend: `routes/villa.route.js`

3. **Booking System:**
   - Frontend: `pages/Booking.jsx` → `utils/axios.js` → Backend: `routes/booking.route.js`

4. **Admin Operations:**
   - Frontend: `components/Admin/*` → `utils/axios.js` → Backend: `routes/adminAction.route.js`

### Data Flow Patterns
1. **User Authentication:**
   ```
   Login → Auth Middleware → User Controller → User Model → Database
   ```

2. **Villa Booking:**
   ```
   Booking Form → Booking Controller → Villa Model → Booking Model → Database
   ```

3. **Admin Management:**
   ```
   Admin Dashboard → Admin Middleware → Admin Controller → Various Models → Database
   ```

---

## 🚀 Development Workflow

### Backend Development
1. **Database Changes:** Modify models in `models/`
2. **API Endpoints:** Add routes in `routes/` and controllers in `controllers/`
3. **Middleware:** Add new middleware in `middlewares/`
4. **Validation:** Update validators in `validators/`

### Frontend Development
1. **New Pages:** Add to `pages/` and update routing in `App.jsx`
2. **Components:** Add reusable components to `components/`
3. **State Management:** Update Redux slices in `state/features/`
4. **API Integration:** Use `utils/axios.js` for backend communication

### Environment Configuration
- **Backend:** `.env` file for database, JWT, and service configurations
- **Frontend:** `.env` file for API endpoints and external service URLs

---

## 📋 Quick Reference for Updates

### Adding New Features
1. **Backend:** Route → Controller → Model → Middleware (if needed)
2. **Frontend:** Page → Component → State → API Integration

### Common Update Locations
- **User Management:** `controllers/user.controller.js`, `models/user.model.js`
- **Villa Listings:** `controllers/villa.controller.js`, `models/villa.model.js`
- **Booking System:** `controllers/booking.controller.js`, `models/booking.model.js`
- **Admin Features:** `controllers/adminAction.controller.js`, `components/Admin/`
- **UI Components:** `components/` directory
- **Styling:** `index.css`, Tailwind classes

This structure provides a clear roadmap for navigating and updating the StayAtlas project efficiently. 

---

## 🔄 Latest Frontend Updates (applied)
- Navbar background unified to black across the app (`components/Header.jsx`, `components/ExclusiveHeader.jsx`, `components/Admin/AdminHead.jsx`).
- Logo switched to `src/assets/sa logo white.png` and enlarged; used in all navbars.
- Desktop nav link size increased to improve accessibility; hamburger menu retained for 426–1023px, and desktop action buttons are hidden for 768–1023px.
- Home search experience (`components/SearchBar.jsx`):
  - Mobile “bubble” search is reused for 768–1023px; it is centered and slightly lowered (`md:mt-6`).
  - Collapsed width scales by breakpoint: 380px → 520px (≥426px) → 640px (≥640px) → 860px (≥768px).
  - Expanded drawer centers on md (`md:max-w-4xl md:mx-auto`).

## 🧭 Quick Linking Structure (go-to files)

### Frontend map
```
stayatlas-booking/src/
├─ App.jsx                     # Routes and high-level app logic
├─ main.jsx                    # React bootstrap + Redux store
├─ layout/
│  ├─ MainLayout.jsx          # Wraps pages with Header/Footer
│  └─ ExclusiveLayout.jsx
├─ components/
│  ├─ Header.jsx              # Main navbar (logo, links, mobile menu)
│  ├─ ExclusiveHeader.jsx     # Navbar for exclusive pages
│  ├─ Admin/
│  │  └─ AdminHead.jsx        # Admin app bar
│  ├─ SearchBar.jsx           # Hero search (mobile/desktop variants)
│  ├─ propertygrid.jsx        # Listing grid
│  ├─ BookingDetail.jsx       # Booking page UI
│  └─ ui/                     # Reusable primitives
├─ pages/
│  ├─ Home.jsx                # Hero + search entry point
│  ├─ SearchResult.jsx        # Search destination
│  ├─ Explore.jsx / Exclusive.jsx / ViewExclusive.jsx
│  ├─ Booking.jsx / BookingDetailsPage.jsx
│  ├─ Login.jsx / Signup.jsx / Profile.jsx
│  └─ AdminDashboard.jsx
├─ state/
│  ├─ store.js                # Redux store
│  └─ features/authSlice.js   # Auth state & logout
├─ utils/
│  ├─ axios.js                # API client (base URL)
│  └─ countriesCities.js      # Location data for search
└─ assets/
   └─ sa logo white.png       # Current navbar logo
```

### Backend map
```
StayAtlas-Backend/src/
├─ server.js                   # Server start
├─ app.js                      # Express app + middleware + routes
├─ config/db.js                # Mongo connection
├─ routes/                     # HTTP endpoints
│  ├─ user.route.js            → controllers/user.controller.js
│  ├─ villa.route.js           → controllers/villa.controller.js
│  ├─ booking.route.js         → controllers/booking.controller.js
│  ├─ review.route.js          → controllers/review.controllers.js
│  ├─ experience.route.js      → controllers/experiencereview.controller.js
│  ├─ offer.route.js           → controllers/offer.controller.js
│  ├─ payment.route.js         → controllers/payment.controller.js
│  └─ bookingSearchRoutes.js   → search endpoints
├─ models/                     # Mongoose schemas
├─ controllers/                # Business logic
├─ middlewares/                # Auth/roles/uploads/error handling
└─ utils/                      # Cloudinary, ApiError/Response, paginate, sendEmail
```

Note on validators: current repo includes `validators/booking.validator.js`, `review.validator.js`, and `villa.validator.js` on the backend.

## ⚙️ Fast-update Playbook
- Navbar/logo changes → `components/Header.jsx`, `components/ExclusiveHeader.jsx`, `components/Admin/AdminHead.jsx`, `src/assets/sa logo white.png`.
- Search UX or widths → `components/SearchBar.jsx`.
- Hero layout → `pages/Home.jsx`.
- API base URL → `stayatlas-booking/src/utils/axios.js`.
- Backend endpoint logic → `StayAtlas-Backend/src/routes/*` and matching `controllers/*` + `models/*`.
