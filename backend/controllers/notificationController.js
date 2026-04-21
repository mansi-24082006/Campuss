import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import PushSubscription from "../models/PushSubscription.js";
import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    if (notification.recipient.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to create notifications (not an express route)
export const createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    
    // Trigger Push Notification
    sendPushNotification(data.recipient, {
      title: "CampusBuzz Update",
      body: data.message,
      link: data.link || "/dashboard"
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// @desc    Subscribe to push notifications
// @route   POST /api/notifications/subscribe
// @access  Private
export const subscribePush = async (req, res) => {
  try {
    const { subscription, deviceType } = req.body;
    
    // Update or create subscription
    await PushSubscription.findOneAndUpdate(
      { "subscription.endpoint": subscription.endpoint },
      { 
        user: req.user.id, 
        subscription, 
        deviceType: deviceType || "desktop" 
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Subscription added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Internal function to send push notifications
const sendPushNotification = async (userId, payload) => {
  try {
    const subscriptions = await PushSubscription.find({ user: userId });
    
    const pushPayload = JSON.stringify({
      title: payload.title || "CampusBuzz",
      body: payload.body,
      icon: "/logo192.png", // Ensure this exists or use a default
      badge: "/logo192.png",
      data: {
        url: payload.link || "/dashboard"
      }
    });

    const sendPromises = subscriptions.map(sub => 
      webpush.sendNotification(sub.subscription, pushPayload)
        .catch(err => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Subscription expired or no longer valid
            return PushSubscription.deleteOne({ _id: sub._id });
          }
          console.error("Error sending push:", err);
        })
    );

    await Promise.all(sendPromises);
  } catch (error) {
    console.error("Push notification error:", error);
  }
};

// @desc    Broadcast notification to all event participants
// @route   POST /api/notifications/broadcast/:eventId
// @access  Private (Faculty/Admin)
export const broadcastNotification = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { message, type } = req.body;
    
    // Populating registered students to get their names and emails
    const Event = (await import("../models/Event.js")).default;
    const event = await Event.findById(eventId).populate("registeredStudents", "fullName email");
    
    if (!event) return res.status(404).json({ message: "Event not found" });

    const students = event.registeredStudents || [];
    
    // 1. Create Dashboard Notifications in Bulk
    const notifications = students.map(student => ({
      recipient: student._id,
      sender: req.user.id,
      message: `[Event Update: ${event.title}] ${message}`,
      type: type || "info",
      link: `/event/${event._id}`
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      
      // Trigger Push for all participants
      students.forEach(student => {
        sendPushNotification(student._id, {
          title: `Event Update: ${event.title}`,
          body: message,
          link: `/event/${event._id}`
        });
      });
    }

    // 2. Send Emails in Background (Don't await whole loop to respond faster)
    // We import email utilities here to avoid circular dependencies if any
    const { sendEmail, getAnnouncementTemplate } = await import("../utils/emailService.js");
    
    students.forEach(student => {
      if (student.email) {
        sendEmail({
          to: student.email,
          subject: `📢 ${event.title}: New Announcement 🚀`,
          html: getAnnouncementTemplate(student.fullName, event, message, type)
        });
      }
    });

    res.json({ message: `Announcement broadcasted to ${students.length} students via Dashboard, Email and Push.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notifications sent by the current user (Announcements)
// @route   GET /api/notifications/sent
// @access  Private (Faculty/Admin)
export const getSentNotifications = async (req, res) => {
  try {
    // Group by message content to avoid showing duplicate broadcast entries
    const announcements = await Notification.aggregate([
      { $match: { sender: new mongoose.Types.ObjectId(req.user.id) } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$message",
          message: { $first: "$message" },
          createdAt: { $first: "$createdAt" },
          type: { $first: "$type" },
          originalId: { $first: "$_id" }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 20 }
    ]);
    
    // Map to a consistent format
    res.json(announcements.map(a => ({ ...a, _id: a.originalId })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Global Broadcast to ALL students
// @route   POST /api/notifications/global-broadcast
// @access  Private (Admin Only)
export const globalBroadcast = async (req, res) => {
  try {
    const { message, type } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const User = (await import("../models/User.js")).default;
    const students = await User.find({ role: "student" }).select("_id email fullName");

    const notifications = students.map(student => ({
      recipient: student._id,
      sender: req.user.id,
      message: `📢 GLOBAL: ${message}`,
      type: type || "warning",
      link: "/dashboard"
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      
      // Trigger Push for all students
      students.forEach(student => {
        sendPushNotification(student._id, {
          title: "📢 Global Announcement",
          body: message,
          link: "/dashboard"
        });
      });
    }

    res.json({ message: `Message broadcasted to ${students.length} users via Dashboard and Push.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Faculty Broadcast to all students in their events
// @route   POST /api/notifications/faculty-broadcast
// @access  Private (Faculty Only)
export const facultyBroadcast = async (req, res) => {
  try {
    const { message, type } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const Event = (await import("../models/Event.js")).default;
    const User = (await import("../models/User.js")).default;

    const myEvents = await Event.find({
      $or: [{ organizer: req.user.id }, { assignedFaculty: req.user.id }]
    }).select("registeredStudents title date venue");

    // Flatten to unique student IDs
    const studentIds = [...new Set(myEvents.flatMap(e => e.registeredStudents.map(s => s.toString())))];

    if (studentIds.length === 0) {
      return res.json({ message: "No students currently registered for your events." });
    }

    // Fetch student details for email sending
    const students = await User.find({ _id: { $in: studentIds } }).select("fullName email");

    const notifications = students.map(student => ({
      recipient: student._id,
      sender: req.user.id,
      message: `📢 FROM FACULTY: ${message}`,
      type: type || "info",
      link: "/dashboard"
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      
      // Trigger Push for registered students
      students.forEach(student => {
        sendPushNotification(student._id, {
          title: "📢 Faculty Announcement",
          body: message,
          link: "/dashboard"
        });
      });
    }

    // Send Emails in Background
    const { sendEmail, getAnnouncementTemplate } = await import("../utils/emailService.js");
    
    // We use a generic event object for the template since this is from a faculty generally
    const genericEvent = { title: "Faculty Updates", date: new Date(), venue: "Campus" };

    students.forEach(student => {
      if (student.email) {
        sendEmail({
          to: student.email,
          subject: `📢 Faculty Update: New Announcement 🚀`,
          html: getAnnouncementTemplate(student.fullName, genericEvent, message, type)
        });
      }
    });

    res.json({ message: `Message broadcasted to ${students.length} students via Dashboard, Email and Push.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
