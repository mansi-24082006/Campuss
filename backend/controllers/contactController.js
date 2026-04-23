import { sendEmail, getContactAdminTemplate, getContactUserAckTemplate } from "../utils/emailService.js";

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    // 1. Send email to Admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "mansivaghasiya2408@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      html: getContactAdminTemplate(name, email, message),
    });

    // 2. Send acknowledgment email to User
    await sendEmail({
      to: email,
      subject: "We received your message - CampusBuzz",
      html: getContactUserAckTemplate(name, message),
    });

    res.status(200).json({ success: true, message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Failed to send message. Please try again later." });
  }
};
