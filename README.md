# watchUtopia - Architecture Documentation

## Overview

I developed watchUtopia as an e-commerce platform for luxury watches. The application is built with React and Supabase, handling user authentication, product browsing, shopping cart, and order management.

## Tech Stack

- **React 19** with **Vite** - Frontend framework and build tool
- **React Router v7** - Client-side routing
- **Supabase** - Backend (PostgreSQL, Auth, Storage)
- **Tailwind CSS** - Styling

## Architecture

### Project Structure

```
src/
├── components/       # UI components (pages, layout, common, profile)
├── contexts/         # Global state (AuthContext)
├── router/          # Routes and protection
├── services/        # Business logic and API calls
└── utils/           # Helper functions
```

### Key Architectural Decisions

**Component Structure**  
I organized components into Pages (full views), Layout (wrapper), Common (reusable pieces), and Profile (role-based views). Each page handles its own data fetching and state.

**Service Layer**  
I separated all business logic into dedicated services (authService, productService, cartService, etc.). The dataService acts as a central hub for CRUD operations, reducing code duplication.

**Authentication & Authorization**  
I used React Context (AuthContext) for global auth state. The ProtectedRoute component checks authentication and roles before rendering protected pages. This gives role-based access control - super admins can edit products, users can checkout, and guests must log in.

**State Management**  
I kept state management simple:

- React Context for auth state
- Local useState for component state
- Services handle data fetching

No Redux needed - this keeps the architecture straightforward.

**Routing**  
I used React Router's createBrowserRouter with nested routes:

- Public routes (home, products)
- Auth routes (login, register)
- Protected routes (cart, checkout, orders)
- Admin routes (product management)

**Backend Integration**  
Supabase handles authentication, PostgreSQL database, and file storage. I created a supabaseClient module with error handling that all services use.

### Data Flow

User interaction → Component calls service → Service calls Supabase → State updates → UI re-renders

This unidirectional flow keeps things predictable and separates UI from business logic.

## Summary

The architecture follows a modular pattern with clear separation of concerns. Components handle presentation, services manage business logic, and Supabase provides backend infrastructure. This approach makes the codebase maintainable and easy to extend - adding features follows a consistent pattern: service function → component → route → protection if needed.
