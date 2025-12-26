/**
 * Firebase Cloud Functions - Wizard Email Service
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import {defineJsonSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as nodemailer from "nodemailer";

// Set global options for cost control
setGlobalOptions({maxInstances: 10});

// Use the exported config secret that contains all the old functions.config() values
// This was created by running: firebase functions:config:export
const config = defineJsonSecret("FUNCTIONS_CONFIG_EXPORT");

// Wizard form data interface
interface WizardFormData {
  projectType: string[];
  timeline: string;
  budget: string;
  description: string;
  industry?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

// Timeline value to label mapping
const timelineLabels: Record<string, string> = {
  "asap": "ASAP (Within 2 weeks)",
  "1-2months": "1-2 Months",
  "3-6months": "3-6 Months",
  "6plus": "6+ Months",
  "exploring": "Just Exploring",
};

// Budget value to label mapping
const budgetLabels: Record<string, string> = {
  "under50k": "Under R50,000",
  "50-150k": "R50,000 - R150,000",
  "150-300k": "R150,000 - R300,000",
  "300plus": "R300,000+",
  "notsure": "Not sure yet",
};

/**
 * Validate the wizard form data
 */
function validateFormData(data: WizardFormData): string[] {
  const errors: string[] = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("name");
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("email");
  }
  if (!data.description || data.description.trim() === "") {
    errors.push("description");
  }
  if (!data.projectType || !Array.isArray(data.projectType) || data.projectType.length === 0) {
    errors.push("projectType");
  }
  if (!data.timeline || !timelineLabels[data.timeline]) {
    errors.push("timeline");
  }
  if (!data.budget || !budgetLabels[data.budget]) {
    errors.push("budget");
  }
  if (data.phone && !/^[\d\s\-+()]{10,}$/.test(data.phone)) {
    errors.push("phone (invalid format)");
  }

  return errors;
}

/**
 * Generate confirmation email HTML for the user
 */
function generateConfirmationEmail(data: WizardFormData): string {
  const services = data.projectType.join(", ");
  const timeline = timelineLabels[data.timeline] || data.timeline;
  const budget = budgetLabels[data.budget] || data.budget;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Inquiry</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Thank You, ${data.name}!</h1>
              <p style="margin: 15px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">We've received your project inquiry</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 25px; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for reaching out to Merdova! We're excited to learn about your project and explore how we can help bring your vision to life.
              </p>
              
              <!-- Project Summary -->
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                <h2 style="margin: 0 0 20px; color: #333333; font-size: 18px; font-weight: 600;">Your Project Summary</h2>
                
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                      <strong style="color: #555;">Services:</strong>
                    </td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #667eea;">
                      ${services}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef;">
                      <strong style="color: #555;">Timeline:</strong>
                    </td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e9ecef; color: #333;">
                      ${timeline}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;${data.industry ? " border-bottom: 1px solid #e9ecef;" : ""}">
                      <strong style="color: #555;">Budget:</strong>
                    </td>
                    <td style="padding: 8px 0;${data.industry ? " border-bottom: 1px solid #e9ecef;" : ""} color: #333;">
                      ${budget}
                    </td>
                  </tr>
                  ${data.industry ? `
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #555;">Industry:</strong>
                    </td>
                    <td style="padding: 8px 0; color: #333;">
                      ${data.industry}
                    </td>
                  </tr>
                  ` : ""}
                </table>
              </div>
              
              <!-- What's Next -->
              <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-left: 4px solid #667eea; border-radius: 0 8px 8px 0; padding: 20px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 10px; color: #333333; font-size: 16px; font-weight: 600;">What Happens Next?</h3>
                <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                  Our team will review your project details and get back to you within <strong>24 hours</strong>. We'll discuss your requirements in detail and provide a tailored proposal.
                </p>
              </div>
              
              <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                If you have any urgent questions, feel free to reply to this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 25px 40px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #888888; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #667eea;">The Merdova Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generate notification email HTML for the business
 * Contains ALL possible information from the wizard
 */
function generateNotificationEmail(data: WizardFormData): string {
  const services = data.projectType.join(", ");
  const timeline = timelineLabels[data.timeline] || data.timeline;
  const budget = budgetLabels[data.budget] || data.budget;
  const escapedDescription = data.description.replace(/\n/g, "<br>");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Inquiry - Complete Details</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">🎉 New Project Inquiry</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">from ${data.name}</p>
              <p style="margin: 5px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Submitted: ${new Date().toLocaleString()}</p>
            </td>
          </tr>
          
          <!-- Contact Information -->
          <tr>
            <td style="padding: 30px 40px 20px;">
              <h2 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #11998e; padding-bottom: 10px;">
                📋 Contact Information
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="140" style="padding: 8px 0; color: #666; vertical-align: top; font-weight: 500;">Full Name:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: 600; font-size: 15px;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top; font-weight: 500;">Email Address:</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${data.email}" style="color: #11998e; text-decoration: none; font-weight: 500;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top; font-weight: 500;">Phone Number:</td>
                  <td style="padding: 8px 0; color: #333;">
                    ${data.phone ? `<a href="tel:${data.phone}" style="color: #11998e; text-decoration: none;">${data.phone}</a>` : '<span style="color: #999; font-style: italic;">Not provided</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top; font-weight: 500;">Company Name:</td>
                  <td style="padding: 8px 0; color: #333;">
                    ${data.company ? data.company : '<span style="color: #999; font-style: italic;">Not provided</span>'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Project Details -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <h2 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #11998e; padding-bottom: 10px;">
                🚀 Project Details
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="140" style="padding: 8px 0; color: #666; vertical-align: top; font-weight: 500;">Services Requested:</td>
                  <td style="padding: 8px 0; color: #11998e; font-weight: 600;">
                    ${services || '<span style="color: #999; font-style: italic;">Not specified</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top; font-weight: 500;">Project Timeline:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: 500;">
                    ${timeline || '<span style="color: #999; font-style: italic;">Not specified</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top; font-weight: 500;">Budget Range:</td>
                  <td style="padding: 8px 0; color: #333; font-weight: 500;">
                    ${budget || '<span style="color: #999; font-style: italic;">Not specified</span>'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top; font-weight: 500;">Industry/Sector:</td>
                  <td style="padding: 8px 0; color: #333;">
                    ${data.industry ? data.industry : '<span style="color: #999; font-style: italic;">Not provided</span>'}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Description -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <h2 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600; border-bottom: 2px solid #11998e; padding-bottom: 10px;">
                📝 Project Description
              </h2>
              <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; color: #333; line-height: 1.8; white-space: pre-wrap;">
                ${escapedDescription || '<span style="color: #999; font-style: italic;">No description provided</span>'}
              </div>
            </td>
          </tr>
          
          <!-- Quick Actions -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 15px;">
                    <a href="mailto:${data.email}?subject=Re: Your Project Inquiry - Merdova" style="display: inline-block; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 8px; font-weight: 600; font-size: 16px; margin-right: 10px;">
                      📧 Reply to ${data.name}
                    </a>
                  </td>
                </tr>
                ${data.phone ? `
                <tr>
                  <td align="center">
                    <a href="tel:${data.phone}" style="display: inline-block; background: #f8f9fa; color: #11998e; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 500; font-size: 14px; border: 2px solid #11998e;">
                      📞 Call ${data.name}
                    </a>
                  </td>
                </tr>
                ` : ""}
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #888888; font-size: 13px;">
                This inquiry was submitted via the Merdova website wizard form.<br>
                <span style="font-size: 12px; color: #aaa;">All information provided by the client is included above.</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generate plain text version of confirmation email
 */
function generateConfirmationText(data: WizardFormData): string {
  const services = data.projectType.join(", ");
  const timeline = timelineLabels[data.timeline] || data.timeline;
  const budget = budgetLabels[data.budget] || data.budget;

  return `
Thank You, ${data.name}!

We've received your project inquiry and are excited to learn more about your vision.

YOUR PROJECT SUMMARY
====================
Services: ${services}
Timeline: ${timeline}
Budget: ${budget}${data.industry ? `\nIndustry: ${data.industry}` : ""}

WHAT HAPPENS NEXT?
==================
Our team will review your project details and get back to you within 24 hours. We'll discuss your requirements in detail and provide a tailored proposal.

If you have any urgent questions, feel free to reply to this email.

Best regards,
The Merdova Team
`;
}

/**
 * Generate plain text version of notification email
 * Contains ALL possible information from the wizard
 */
function generateNotificationText(data: WizardFormData): string {
  const services = data.projectType.join(", ");
  const timeline = timelineLabels[data.timeline] || data.timeline;
  const budget = budgetLabels[data.budget] || data.budget;

  return `
NEW PROJECT INQUIRY - COMPLETE DETAILS
${"=".repeat(50)}
Submitted: ${new Date().toLocaleString()}

CONTACT INFORMATION
${"-".repeat(50)}
Full Name: ${data.name}
Email Address: ${data.email}
Phone Number: ${data.phone || "Not provided"}
Company Name: ${data.company || "Not provided"}

PROJECT DETAILS
${"-".repeat(50)}
Services Requested: ${services || "Not specified"}
Project Timeline: ${timeline || "Not specified"}
Budget Range: ${budget || "Not specified"}
Industry/Sector: ${data.industry || "Not provided"}

PROJECT DESCRIPTION
${"-".repeat(50)}
${data.description || "No description provided"}

${"=".repeat(50)}
Reply directly to this email to contact ${data.name}.
${data.phone ? `Or call: ${data.phone}` : ""}
`;
}

/**
 * Send wizard form email endpoint
 * Sends both confirmation email to user and notification email to business
 * 
 * Required parameters (set via firebase functions:secrets:set or firebase functions:config:set):
 * - SMTP_HOST: SMTP server hostname
 * - SMTP_PORT: SMTP server port (465 for SSL, 587 for TLS)
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 * - SMTP_FROM: Sender email address
 * - BUSINESS_EMAIL: Business email for notifications
 */
export const sendWizardEmail = onRequest(
  {
    cors: true,
    secrets: [config],
  },
  async (req, res) => {
    // Only allow POST requests
    if (req.method !== "POST") {
      res.status(405).json({error: "Method not allowed. Use POST."});
      return;
    }

    try {
      const formData = req.body as WizardFormData;

      // Validate required fields
      const validationErrors = validateFormData(formData);
      if (validationErrors.length > 0) {
        res.status(400).json({
          error: `Missing or invalid required fields: ${validationErrors.join(", ")}`,
        });
        return;
      }

      // Get SMTP configuration from exported config
      // The config was exported from functions.config() using: firebase functions:config:export
      const configValue = config.value();
      const smtpHostValue = configValue.smtp?.host || "smtp.gmail.com";
      const smtpPortValue = parseInt(configValue.smtp?.port || "587", 10);
      const smtpUserValue = configValue.smtp?.user || "";
      const smtpPassValue = configValue.smtp?.pass || "";
      const smtpFromValue = configValue.smtp?.from || "";
      const businessEmailValue = configValue.business?.email || "";

      // Create transporter with SMTP configuration
      const transporter = nodemailer.createTransport({
        host: smtpHostValue,
        port: smtpPortValue,
        secure: smtpPortValue === 465,
        auth: {
          user: smtpUserValue,
          pass: smtpPassValue,
        },
      });

      // Prepare both emails
      const confirmationMailOptions: nodemailer.SendMailOptions = {
        from: smtpFromValue,
        to: formData.email,
        subject: "Thank You for Your Project Inquiry - Merdova",
        text: generateConfirmationText(formData),
        html: generateConfirmationEmail(formData),
      };

      const notificationMailOptions: nodemailer.SendMailOptions = {
        from: smtpFromValue,
        to: businessEmailValue,
        replyTo: formData.email,
        subject: `New Project Inquiry from ${formData.name}`,
        text: generateNotificationText(formData),
        html: generateNotificationEmail(formData),
      };

      // Send both emails in parallel
      const [confirmationResult, notificationResult] = await Promise.all([
        transporter.sendMail(confirmationMailOptions),
        transporter.sendMail(notificationMailOptions),
      ]);

      logger.info("Wizard emails sent successfully", {
        confirmationId: confirmationResult.messageId,
        notificationId: notificationResult.messageId,
        to: formData.email,
        name: formData.name,
      });

      res.status(200).json({
        success: true,
        message: "Emails sent successfully",
        confirmationId: confirmationResult.messageId,
        notificationId: notificationResult.messageId,
      });
    } catch (error) {
      logger.error("Failed to send wizard emails", {error});

      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: "Failed to send emails",
        details: errorMessage,
      });
    }
  }
);
