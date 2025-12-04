# Migration from Vite React to Next.js

This document outlines the changes made during the migration from Vite + React to Next.js.

## Key Changes

### 1. Project Structure
- **Before**: `src/main.jsx` as entry point, `src/App.jsx` as root component
- **After**: `app/` directory with `layout.jsx` and `page.jsx` (App Router)

### 2. Routing
- **Before**: React Router with `<BrowserRouter>`, `<Routes>`, `<Route>`
- **After**: Next.js file-based routing
  - `/` → `app/page.jsx`
  - `/sanaflower` → `app/sanaflower/page.jsx`

### 3. Environment Variables
- **Before**: `VITE_` prefix (e.g., `VITE_SUPABASE_URL`)
- **After**: `NEXT_PUBLIC_` prefix for client-side variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
- Server-side variables (like SMTP config) don't need prefix

### 4. Components
- All components that use hooks, browser APIs, or client-side features now have `'use client'` directive
- Image imports work the same way, but Next.js Image component can be used for optimization

### 5. API Routes
- New API route: `app/api/send-email/route.js`
- Uses nodemailer for email sending
- Configure SMTP settings in `.env.local`

### 6. Build & Dev Commands
- **Before**: `npm run dev` (Vite), `npm run build` (Vite)
- **After**: `npm run dev` (Next.js), `npm run build` (Next.js)

### 7. Removed Files
- `vite.config.js`
- `index.html`
- `src/main.jsx`
- `src/App.jsx`
- `src/App.css`
- `src/index.css` (moved to `app/globals.css`)

## Email Configuration

The app now includes nodemailer for sending emails. The survey form automatically sends emails when submitted.

### Setup Steps:
1. Copy `.env.example` to `.env.local`
2. Configure SMTP settings:
   - For Gmail: Use App Password (not regular password)
   - For other providers: Adjust host, port, and secure settings
3. Set `NEXT_PUBLIC_CONTACT_EMAIL` to the email where survey submissions should be sent

## Next Steps

1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`
3. Test the application: `npm run dev`
4. Test email functionality by submitting the survey form

## Notes

- The `ScrollManager` component wraps the entire app in `app/layout.jsx`
- All components maintain their original functionality
- CSS files remain in their component directories
- Supabase client configuration updated for Next.js environment variables

