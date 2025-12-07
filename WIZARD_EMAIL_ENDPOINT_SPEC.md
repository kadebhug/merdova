# Survey Wizard Email Endpoint Specification

## Overview
This document describes the Survey Wizard form structure and email requirements for creating an endpoint that accepts form submissions and sends notification emails.

## Form Data Structure

The wizard collects the following data:

### Required Fields
- **name** (string): User's full name
- **email** (string): User's email address (validated format)
- **description** (string): Project description/details
- **projectType** (string[]): Array of selected service types
- **timeline** (string): Project timeline selection
- **budget** (string): Budget range selection

### Optional Fields
- **phone** (string): User's phone number (validated format if provided)
- **company** (string): Company name
- **industry** (string): Industry/sector selection

## Field Value Options

### projectType (Multiple Selection)
- `"Web Development"`
- `"Mobile Apps"`
- `"Custom Software"`
- `"Digital Marketing"`
- `"Cloud Solutions"`
- `"Consultation"`

### timeline (Single Selection)
- `"asap"` → Display: "ASAP (Within 2 weeks)"
- `"1-2months"` → Display: "1-2 Months"
- `"3-6months"` → Display: "3-6 Months"
- `"6plus"` → Display: "6+ Months"
- `"exploring"` → Display: "Just Exploring"

### budget (Single Selection)
- `"under50k"` → Display: "Under R50,000"
- `"50-150k"` → Display: "R50,000 - R150,000"
- `"150-300k"` → Display: "R150,000 - R300,000"
- `"300plus"` → Display: "R300,000+"
- `"notsure"` → Display: "Not sure yet"

### industry (Single Selection - Optional)
- `"Technology"`
- `"Finance & Banking"`
- `"Healthcare"`
- `"Retail & E-commerce"`
- `"Education"`
- `"Manufacturing"`
- `"Real Estate"`
- `"Hospitality"`
- `"Non-profit"`
- `"Other"`

## Email Requirements

The endpoint should send **two emails**:

### 1. Confirmation Email (to User)
**Recipient:** `formData.email`  
**Subject:** `"Thank You for Your Project Inquiry - Merdova"`

**Content:**
- Thank you message with user's name
- Summary of project details:
  - Services selected (comma-separated)
  - Timeline (formatted label)
  - Budget range (formatted label)
  - Industry (if provided)
- Message: "Our team will review your project details and get back to you within **24 hours**."

### 2. Notification Email (to Business)
**Recipient:** Business email (from environment/config)  
**Subject:** `"New Project Inquiry from {name}"`  
**Reply-To:** `formData.email` (so replies go directly to customer)

**Content:**
- Contact Information section:
  - Name
  - Email (as clickable mailto link)
  - Company (if provided)
  - Phone (if provided)
- Project Details section:
  - Services Requested (comma-separated)
  - Timeline (formatted label)
  - Budget Range (formatted label)
  - Industry (if provided)
- Project Description section:
  - Full description text (preserve formatting/line breaks)
- Call-to-action button: "Reply to {name}" (mailto link)

## Endpoint Specification

### Request
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "projectType": ["Web Development", "Mobile Apps"],
  "timeline": "1-2months",
  "budget": "50-150k",
  "description": "I need a mobile app for my business...",
  "industry": "Technology",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+27 12 345 6789",
  "company": "Example Corp"
}
```

### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Emails sent successfully",
  "confirmationId": "email-id-1",
  "notificationId": "email-id-2"
}
```

**Validation Error (400):**
```json
{
  "error": "Missing required fields: name, email, description"
}
```

**Server Error (500):**
```json
{
  "error": "Error message here",
  "details": "Detailed error information"
}
```

## Validation Rules

1. **Required fields validation:**
   - `name`: Must not be empty
   - `email`: Must be valid email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
   - `description`: Must not be empty
   - `projectType`: Must be array with at least one item
   - `timeline`: Must be one of the valid timeline values
   - `budget`: Must be one of the valid budget values

2. **Optional fields validation:**
   - `phone`: If provided, must match format `/^[\d\s\-\+\(\)]{10,}$/`
   - `company`: No validation required
   - `industry`: No validation required (can be empty string)

## Current Implementation

The current implementation uses:
- **Platform:** Supabase Edge Functions (Deno runtime)
- **Email Service:** Resend API
- **Frontend Call:** `supabase.functions.invoke('send-wizard-email', { body: formData })`

## Environment Variables Required

- `RESEND_API_KEY`: Resend API key for sending emails
- `BUSINESS_EMAIL`: Email address where business notifications should be sent

## Notes

- Both emails should be sent in parallel (Promise.all) for better performance
- Email templates should support both HTML and plain text versions
- The `from` email address should be from a verified domain in production
- CORS headers should be included for browser requests
- Timeline and budget values should be converted to human-readable labels before including in emails


