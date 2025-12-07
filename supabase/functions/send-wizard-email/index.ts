// Supabase Edge Function to send emails using Resend
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WizardFormData {
  projectType: string[];
  timeline: string;
  budget: string;
  description: string;
  industry: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Resend API key from environment variables
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }

    // Get business email from environment variables (where notifications should be sent)
    const businessEmail = Deno.env.get('BUSINESS_EMAIL') || 'your-email@example.com'

    // Initialize Resend
    const resend = new Resend(resendApiKey)

    // Parse request body
    const formData: WizardFormData = await req.json()

    // Validate required fields
    if (!formData.name || !formData.email || !formData.description) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, email, description' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Format timeline and budget labels
    const timelineLabels: Record<string, string> = {
      'asap': 'ASAP (Within 2 weeks)',
      '1-2months': '1-2 Months',
      '3-6months': '3-6 Months',
      '6plus': '6+ Months',
      'exploring': 'Just Exploring'
    }

    const budgetLabels: Record<string, string> = {
      'under50k': 'Under R50,000',
      '50-150k': 'R50,000 - R150,000',
      '150-300k': 'R150,000 - R300,000',
      '300plus': 'R300,000+',
      'notsure': 'Not sure yet'
    }

    const timelineLabel = timelineLabels[formData.timeline] || formData.timeline
    const budgetLabel = budgetLabels[formData.budget] || formData.budget

    // 1. Send confirmation email to the user
    const confirmationEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank You for Your Inquiry</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Thank You, ${formData.name}!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>We've received your project inquiry and are excited to learn more about your vision.</p>
            
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #667eea; margin-top: 0;">Your Project Details</h2>
              <p><strong>Services:</strong> ${formData.projectType.join(', ')}</p>
              <p><strong>Timeline:</strong> ${timelineLabel}</p>
              <p><strong>Budget:</strong> ${budgetLabel}</p>
              ${formData.industry ? `<p><strong>Industry:</strong> ${formData.industry}</p>` : ''}
            </div>

            <p>Our team will review your project details and get back to you within <strong>24 hours</strong>.</p>
            
            <p>If you have any immediate questions, feel free to reach out to us directly.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
              <p>Best regards,<br>The Merdova Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    const confirmationEmailText = `
Thank You, ${formData.name}!

We've received your project inquiry and are excited to learn more about your vision.

Your Project Details:
- Services: ${formData.projectType.join(', ')}
- Timeline: ${timelineLabel}
- Budget: ${budgetLabel}
${formData.industry ? `- Industry: ${formData.industry}` : ''}

Our team will review your project details and get back to you within 24 hours.

If you have any immediate questions, feel free to reach out to us directly.

Best regards,
The Merdova Team
    `

    // 2. Send notification email to business
    const notificationEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Project Inquiry</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ff6b6b; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Project Inquiry</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
            <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
              ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ''}
              ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
            </div>

            <h2 style="color: #333;">Project Details</h2>
            <div style="background: white; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <p><strong>Services Requested:</strong> ${formData.projectType.join(', ')}</p>
              <p><strong>Timeline:</strong> ${timelineLabel}</p>
              <p><strong>Budget Range:</strong> ${budgetLabel}</p>
              ${formData.industry ? `<p><strong>Industry:</strong> ${formData.industry}</p>` : ''}
            </div>

            <h2 style="color: #333;">Project Description</h2>
            <div style="background: white; padding: 20px; border-radius: 5px; white-space: pre-wrap;">${formData.description}</div>

            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${formData.email}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reply to ${formData.name}</a>
            </div>
          </div>
        </body>
      </html>
    `

    const notificationEmailText = `
New Project Inquiry

Contact Information:
- Name: ${formData.name}
- Email: ${formData.email}
${formData.company ? `- Company: ${formData.company}` : ''}
${formData.phone ? `- Phone: ${formData.phone}` : ''}

Project Details:
- Services Requested: ${formData.projectType.join(', ')}
- Timeline: ${timelineLabel}
- Budget Range: ${budgetLabel}
${formData.industry ? `- Industry: ${formData.industry}` : ''}

Project Description:
${formData.description}
    `

    // Send both emails
    const [confirmationResult, notificationResult] = await Promise.all([
      resend.emails.send({
        from: 'Merdova <onboarding@resend.dev>', // Update this with your verified domain
        to: formData.email,
        subject: 'Thank You for Your Project Inquiry - Merdova',
        html: confirmationEmailHtml,
        text: confirmationEmailText,
      }),
      resend.emails.send({
        from: 'Merdova <onboarding@resend.dev>', // Update this with your verified domain
        to: businessEmail,
        subject: `New Project Inquiry from ${formData.name}`,
        html: notificationEmailHtml,
        text: notificationEmailText,
        replyTo: formData.email, // So replies go directly to the customer
      }),
    ])

    // Check for errors
    if (confirmationResult.error) {
      console.error('Error sending confirmation email:', confirmationResult.error)
      throw new Error(`Failed to send confirmation email: ${JSON.stringify(confirmationResult.error)}`)
    }

    if (notificationResult.error) {
      console.error('Error sending notification email:', notificationResult.error)
      throw new Error(`Failed to send notification email: ${JSON.stringify(notificationResult.error)}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Emails sent successfully',
        confirmationId: confirmationResult.data?.id,
        notificationId: notificationResult.data?.id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in send-wizard-email function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while sending emails',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

