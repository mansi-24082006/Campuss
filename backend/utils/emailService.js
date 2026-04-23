import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("📧 Email Service Error:", error.message);
    console.error("💡 Hint: If using Gmail, you likely need an 'App Password' instead of your regular password.");
  } else {
    console.log("📧 Email Service is ready!");
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"CampusBuzz" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Nodemailer Error Details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      user: process.env.EMAIL_USER
    });
    throw error; // Re-throw to be caught by the controller
  }
};

/**
 * EMAIL TEMPLATES
 */

export const getRegistrationTemplate = (userName, event) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #4f46e5; margin: 0;">🎉 Registration Confirmed!</h1>
    <p style="color: #64748b; font-size: 16px;">CampusBuzz: The Hub of Hubs</p>
  </div>
  
  <p style="font-size: 18px; color: #1e293b;">Hello <strong>${userName}</strong>,</p>
  <p style="color: #475569; line-height: 1.6;">You have successfully registered for the following event:</p>
  
  <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 20px; margin: 25px 0; border-radius: 4px;">
    <h2 style="margin: 0 0 10px 0; color: #1e293b;">${event.title}</h2>
    <p style="margin: 5px 0; color: #64748b;">📅 <strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
    <p style="margin: 5px 0; color: #64748b;">⏰ <strong>Time:</strong> ${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    <p style="margin: 5px 0; color: #64748b;">📍 <strong>Venue:</strong> ${event.venue || "Campus Location"}</p>
  </div>
  
  <p style="color: #475569; font-size: 14px; margin-top: 30px;">We'll send you a reminder shortly before the event starts. Don't forget to add this to your calendar!</p>
  
  <div style="text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
    <p style="color: #94a3b8; font-size: 12px;">© 2026 CampusBuzz Platform. All rights reserved.</p>
  </div>
</div>
`;

export const getReminderTemplate = (userName, event, hoursLeft) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e7f0; border-radius: 12px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #f59e0b; margin: 0;">⏰ Countdown: ${hoursLeft} Hour${hoursLeft > 1 ? "s" : ""} to Go!</h1>
    <p style="color: #64748b; font-size: 16px;">Get ready for ${event.title}</p>
  </div>
  
  <p style="font-size: 16px; color: #1e293b;">Hi <strong>${userName}</strong>,</p>
  <p style="color: #475569;">This is a friendly reminder that your event is about to start. We are excited to see you there!</p>
  
  <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 15px; margin: 20px 0; border-radius: 8px;">
    <p style="margin: 5px 0; color: #92400e;">📍 <strong>Venue:</strong> ${event.venue || "Campus Location"}</p>
    <p style="margin: 5px 0; color: #92400e;">🕒 <strong>Starting at:</strong> ${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
  </div>
  
  <p style="color: #475569; font-size: 14px;">Please reach the venue 10 minutes beforehand to mark your attendance.</p>
</div>
`;

export const getCertificateTemplate = (userName, event, certificateUrl) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; text-align: center;">
  <h1 style="color: #10b981; margin-bottom: 20px;">📜 Your Achievement Awaits!</h1>
  <p style="font-size: 18px; color: #1e293b;">Congratulations, <strong>${userName}</strong>!</p>
  <p style="color: #475569; line-height: 1.6;">Your participation in <strong>${event.title}</strong> has been verified. You can now download your official certificate.</p>
  
  <a href="${certificateUrl}" style="display: inline-block; background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 30px 0;">
    Download Certificate (PDF)
  </a>
  
  <p style="color: #94a3b8; font-size: 12px;">You can also access this from your CampusBuzz Profile dashboard at any time.</p>
</div>
`;
export const getAnnouncementTemplate = (userName, event, message, type) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
  <div style="text-align: center; margin-bottom: 25px;">
    <div style="display: inline-block; padding: 8px 16px; border-radius: 20px; background-color: ${type === 'warning' ? '#fff7ed' : type === 'success' ? '#f0fdf4' : '#f0f9ff'}; color: ${type === 'warning' ? '#ea580c' : type === 'success' ? '#16a34a' : '#0284c7'}; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
      📢 New Announcement
    </div>
    <h1 style="color: #1e293b; margin: 0; font-size: 24px; letter-spacing: -0.02em;">Update for ${event.title}</h1>
  </div>
  
  <p style="font-size: 16px; color: #475569; line-height: 1.6;">Hi <strong>${userName}</strong>,</p>
  
  <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 20px 0; border: 1px solid #f1f5f9;">
    <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
  </div>
  
  <p style="color: #64748b; font-size: 14px; margin-top: 25px;">
    You are receiving this because you are registered for <strong>${event.title}</strong>. 
    Stay tuned for more updates on the <a href="${process.env.FRONTEND_URL}/event/${event._id}" style="color: #4f46e5; text-decoration: none; font-weight: 600;">Event Portal</a>.
  </p>
  
  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
    <p style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">© 2026 CampusBuzz Platform • Connecting Campus Life</p>
  </div>
</div>
`;

export const getContactAdminTemplate = (name, email, message) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
  <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 20px; border-radius: 15px; margin-bottom: 30px; text-align: center;">
    <h2 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Inquiry</h2>
  </div>
  
  <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
    <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">Sender Details</p>
    <p style="margin: 5px 0; color: #1e293b; font-size: 16px;"><strong>Name:</strong> ${name}</p>
    <p style="margin: 5px 0; color: #1e293b; font-size: 16px;"><strong>Email:</strong> ${email}</p>
  </div>

  <div style="background-color: #ffffff; border: 1.5px solid #f1f5f9; border-radius: 12px; padding: 20px;">
    <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; font-weight: bold;">Message Content</p>
    <div style="color: #334155; line-height: 1.6; font-size: 16px; white-space: pre-wrap;">${message}</div>
  </div>

  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
    <p style="color: #94a3b8; font-size: 12px;">Sent via CampusBuzz Official Contact Form</p>
  </div>
</div>
`;

export const getContactUserAckTemplate = (name, message) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 20px; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
  <div style="text-align: center; margin-bottom: 30px;">
    <div style="display: inline-block; padding: 12px; background-color: #f0fdf4; border-radius: 50%; margin-bottom: 15px;">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>
    <h2 style="color: #1e293b; margin: 0; font-size: 24px;">Message Received!</h2>
    <p style="color: #64748b; margin-top: 8px;">We'll get back to you shortly</p>
  </div>

  <p style="color: #334155; font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
  <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for contacting CampusBuzz. We've successfully received your message and our team is already looking into it. Expect a response within the next 24 hours.</p>

  <div style="margin: 25px 0; padding: 20px; background-color: #f8fafc; border-radius: 12px; border-left: 4px solid #10b981;">
    <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px; text-transform: uppercase;">A copy of your message:</p>
    <p style="margin: 0; color: #475569; font-style: italic;">"${message}"</p>
  </div>

  <p style="color: #334155; font-size: 16px; margin-top: 30px;">Best Regards,<br/><strong style="color: #4f46e5;">The CampusBuzz Team</strong></p>

  <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
    <p style="color: #94a3b8; font-size: 11px;">You are receiving this because you used the contact form on CampusBuzz.</p>
  </div>
</div>
`;
