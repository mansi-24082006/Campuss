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
    console.error("Error sending email:", error);
    // Suppress error in development if credentials missing
    return null;
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
