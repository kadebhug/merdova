# Merdova v2

A modern Next.js application built with React, featuring smooth animations, Supabase integration, and email functionality.

## Features

- 🚀 Next.js 15 with App Router
- 🎨 Beautiful UI with Framer Motion animations
- 📧 Email sending with Nodemailer
- 🗄️ Supabase integration
- 📱 Responsive design
- 🌙 Day/Night cycle component

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd merdova_v2
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- Supabase URL and keys
- SMTP email settings (for nodemailer)
- Contact email address

### Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASSWORD`

For other email providers, adjust the SMTP settings accordingly.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Project Structure

```
merdova_v2/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── send-email/    # Email API endpoint
│   ├── layout.jsx         # Root layout
│   ├── page.jsx           # Home page
│   └── sanaflower/        # Sanaflower page
├── src/
│   ├── components/        # React components
│   └── config/            # Configuration files
└── public/                # Static assets
```

## API Routes

### POST /api/send-email

Send emails using nodemailer.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text email body",
  "html": "<p>HTML email body</p>",
  "from": "sender@example.com" // optional
}
```

## Technologies

- Next.js 15
- React 19
- Framer Motion
- GSAP
- Lenis (smooth scrolling)
- Nodemailer
- Supabase

## License

MIT
