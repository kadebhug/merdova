# Supabase Edge Function Setup for Email Sending

This guide will walk you through setting up the Supabase Edge Function that sends emails using Resend for the Survey Wizard.

## Prerequisites

1. A Supabase account and project (already set up based on `SUPABASE_SETUP.md`)
2. A Resend account (sign up at https://resend.com)
3. Supabase CLI installed on your machine

## Step 1: Install Supabase CLI

If you haven't already, install the Supabase CLI:

### Windows (using Scoop)
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### macOS (using Homebrew)
```bash
brew install supabase/tap/supabase
```

### Or download directly
Visit: https://github.com/supabase/cli/releases

## Step 2: Login to Supabase CLI

```bash
supabase login
```

This will open your browser to authenticate.

## Step 3: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

You can find your project ref in your Supabase dashboard URL: `https://supabase.com/dashboard/project/your-project-ref`

Alternatively, you can initialize a new project:
```bash
supabase init
```

## Step 4: Set Up Resend

1. Go to https://resend.com and sign up/login
2. Navigate to API Keys in your dashboard
3. Create a new API key (name it something like "Supabase Edge Function")
4. Copy the API key - you'll need it in the next step

**Note:** For production, you'll want to:
- Verify your domain in Resend
- Update the `from` email address in `supabase/functions/send-wizard-email/index.ts` to use your verified domain instead of `onboarding@resend.dev`

## Step 5: Set Environment Variables

Set the environment variables for your edge function:

```bash
supabase secrets set RESEND_API_KEY=your-resend-api-key-here
supabase secrets set BUSINESS_EMAIL=your-business-email@example.com
```

Replace:
- `your-resend-api-key-here` with your actual Resend API key
- `your-business-email@example.com` with the email where you want to receive project inquiries

## Step 6: Deploy the Edge Function

Deploy the function to Supabase:

```bash
supabase functions deploy send-wizard-email
```

This will upload your function to Supabase and make it available at:
`https://your-project-ref.supabase.co/functions/v1/send-wizard-email`

## Step 7: Test the Function

You can test the function locally first:

```bash
supabase functions serve send-wizard-email
```

Then test it with a curl command or use the Supabase dashboard's function testing interface.

### Test with curl:

```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-wizard-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "projectType": ["Web Development"],
    "timeline": "1-2months",
    "budget": "50-150k",
    "description": "Test project description",
    "industry": "Technology",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "company": "Test Company"
  }'
```

## Step 8: Update Email From Address (Production)

Before going to production, update the `from` email address in the edge function:

1. Verify your domain in Resend
2. Open `supabase/functions/send-wizard-email/index.ts`
3. Replace `'Merdova <onboarding@resend.dev>'` with your verified domain:
   ```typescript
   from: 'Merdova <noreply@yourdomain.com>',
   ```
4. Redeploy the function:
   ```bash
   supabase functions deploy send-wizard-email
   ```

## How It Works

When a user submits the Survey Wizard form:

1. The frontend calls the Supabase Edge Function `send-wizard-email`
2. The edge function:
   - Validates the form data
   - Sends a confirmation email to the user
   - Sends a notification email to your business email
3. Both emails are sent using Resend
4. The function returns success/error status to the frontend

## Email Templates

The function sends two emails:

### 1. Confirmation Email (to user)
- Thanks the user for their inquiry
- Shows a summary of their project details
- Confirms that you'll respond within 24 hours

### 2. Notification Email (to business)
- Contains all the project details
- Includes contact information
- Has a reply button that goes directly to the customer

## Troubleshooting

### Function not found
- Make sure you've deployed the function: `supabase functions deploy send-wizard-email`
- Check that you're using the correct function name in your frontend code

### Email not sending
- Verify your Resend API key is correct: `supabase secrets list`
- Check Resend dashboard for any errors or rate limits
- Ensure your `from` email is verified in Resend (for production)

### CORS errors
- The function includes CORS headers, but if you encounter issues, check your Supabase project settings

### Environment variables not working
- Make sure you set secrets using `supabase secrets set` (not local `.env` files)
- Secrets are project-specific and need to be set for each environment

## Local Development

To test locally:

1. Start Supabase locally:
   ```bash
   supabase start
   ```

2. Serve the function:
   ```bash
   supabase functions serve send-wizard-email --env-file .env.local
   ```

3. Create a `.env.local` file with:
   ```
   RESEND_API_KEY=your-key-here
   BUSINESS_EMAIL=your-email@example.com
   ```

## Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Resend Documentation](https://resend.com/docs)
- [Deno Runtime Docs](https://deno.land/manual)

## Security Notes

- Never commit your Resend API key to version control
- Use Supabase secrets for all sensitive environment variables
- In production, always use a verified domain for sending emails
- Consider rate limiting if you expect high volume

