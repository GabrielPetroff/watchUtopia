# watchUtopia - Architecture Documentation

## Overview

I developed watchUtopia as an e-commerce platform for luxury watches. The application is built with React and Supabase, handling user authentication, product browsing, shopping cart, wishlist, order management, and admin functionality.

## Tech Stack

- **React 19** with **Vite** - Frontend framework and build tool
- **React Router v7** - Client-side routing
- **Supabase** - Backend (PostgreSQL, Auth, Storage)
- **Tailwind CSS** - Styling

## Architecture

### Project Structure

```
src/
├── components/       # UI components
│   ├── pages/       # Full page views
│   ├── layout/      # Layout wrapper
│   ├── common/      # Reusable components
│   └── profile/     # Role-based profile pages
├── contexts/         # Global state (AuthContext)
├── router/          # Routes and protected routes
├── services/        # Business logic and API calls
│   ├── api/         # Supabase client and error handling
│   ├── auth/        # Authentication service
│   ├── cart/        # Shopping cart service
│   ├── contact/     # Contact form service
│   ├── data/        # Core data operations service
│   ├── image/       # Image URL helper service
│   ├── order/       # Order management service
│   └── wishlist/    # Wishlist service
└── utils/           # Helper functions
```

### Key Architectural Decisions

**Component Structure**  
I organized components into Pages (full views), Layout (wrapper), Common (reusable pieces), and Profile (role-based views). Each page handles its own data fetching and state management.

**Service Layer**  
I separated all business logic into dedicated services with clear responsibilities:

- **authService** - User authentication (register, login, logout, session management)
- **cartService** - Shopping cart operations (add, update, remove, clear)
- **wishlistService** - Wishlist management (add, remove, check items)
- **orderService** - Order operations (create, fetch, update shipping, delete)
- **dataService** - Central hub for CRUD operations (products, orders, storage, brands)
- **contactService** - Contact form submissions (create, fetch, update status)
- **imageService** - Image URL generation helper

The dataService acts as the primary data layer, reducing code duplication across the application. All services follow a consistent pattern with standardized error handling.

**Authentication & Authorization**  
I used React Context (AuthContext) for global auth state management. The ProtectedRoute component checks authentication and user roles before rendering protected pages. This provides role-based access control:

- **Super Admins** - Full product management, order oversight, contact message handling
- **Registered Users** - Shopping, cart, wishlist, order tracking, profile management
- **Guests** - Browse products, must authenticate for transactions

**State Management**  
I kept state management simple and effective:

- React Context for authentication state
- Local useState for component-level state
- Services handle all data fetching and mutations
- Custom events for cart updates across components

No Redux needed - this keeps the architecture straightforward and maintainable.

**Routing**  
I used React Router's createBrowserRouter with nested routes:

- **Public routes** - Home, products, product details, about, contact, shipping info
- **Auth routes** - Login, register
- **Protected routes** - Cart, checkout, wishlist, orders, profile
- **Admin routes** - Product management (create, edit, delete)

**Backend Integration**  
Supabase provides authentication, PostgreSQL database, and file storage. I created a centralized supabaseClient module with global error handling that all services use consistently.

### Data Flow

User interaction → Component calls service → Service calls Supabase → State updates → UI re-renders

This unidirectional flow keeps things predictable and separates UI concerns from business logic.

### Service Layer Details

**Authentication Flow**

```javascript
authService.login() → Supabase Auth → AuthContext updates → Protected routes unlock
```

**Product Operations**

```javascript
dataService.getAllProducts() → Supabase brands table → Products page renders
dataService.getProductById() → Single product fetch → Details page displays
```

**Shopping Flow**

```javascript
cartService.addToCart() → Supabase cart_items → Custom event → Cart updates
orderService.createOrder() → Supabase orders → Cart cleared → Order confirmation
```

**Admin Operations**

```javascript
dataService.createProduct() → Validates → Uploads image → Inserts to brands table
dataService.updateProduct() → Image handling → Updates record → Refreshes list
dataService.deleteProduct() → Removes image → Deletes record → Updates UI
```

## Summary

The architecture follows a modular pattern with clear separation of concerns. Components handle presentation, services manage business logic, and Supabase provides backend infrastructure. The codebase is now optimized with only actively used functions, comprehensive documentation, and consistent patterns throughout.

This approach makes the application maintainable and easy to extend - adding features follows a consistent pattern: create service function → implement component logic → add route → apply protection if needed. The recent cleanup ensures every piece of code serves a clear purpose in the application.
