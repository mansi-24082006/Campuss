import Notification from "../models/Notification.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
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
    if (notification.recipient.toString() !== req.user._id.toString()) {
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
      { recipient: req.user._id, read: false },
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
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// @desc    Broadcast notification to all event participants
// @route   POST /api/notifications/broadcast/:eventId
// @access  Private (Faculty/Admin)
export const broadcastNotification = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { message, type } = req.body;
    
    // We need Event model here
    const Event = (await import("../models/Event.js")).default;
    const event = await Event.findById(eventId);
    
    if (!event) return res.status(404).json({ message: "Event not found" });

    const studentIds = event.registeredStudents || [];
    
    // Create notifications in bulk for efficiency
    const notifications = studentIds.map(studentId => ({
      recipient: studentId,
      sender: req.user.id,
      message: `[Event Update: ${event.title}] ${message}`,
      type: type || "info",
      link: `/event/${event._id}`
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.json({ message: `Announcement broadcasted to ${notifications.length} students.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notifications sent by the current user (Announcements)
// @route   GET /api/notifications/sent
// @access  Private (Faculty/Admin)
export const getSentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ sender: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
