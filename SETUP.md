# E-Commerce Frontend Setup

## Environment Variables

Create a `.env.local` file in the frontend root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Features

- User authentication with Supabase
- Product browsing (public)
- Shopping cart functionality (authenticated users)
- Order management (authenticated users)
- Responsive design

## Authentication

- Users can register and login using Supabase Auth
- JWT tokens are automatically included in API requests
- Protected routes require authentication
- Cart and order functionality is only available to authenticated users

