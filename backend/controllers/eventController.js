import Event from "../models/Event.js";
import User from "../models/User.js";
import Certificate from "../models/Certificate.js";
import { createNotification } from "./notificationController.js";
import { sendEmail, getRegistrationTemplate, getCertificateTemplate } from "../utils/emailService.js";

// GET ALL EVENTS (Approved ones for students, all for faculty/admin)
export const getEvents = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "student") {
      // Students see approved/completed events
      query.status = { $in: ["approved", "active", "upcoming", "completed"] };
    } else if (req.user.role === "faculty") {
      // Faculty see events they organize OR are assigned to
      query.$or = [
        { organizer: req.user.id },
        { assignedFaculty: req.user.id }
      ];
    }
    // Admin sees all by default

    // Add query filters if any
    if (req.query.level) query.participationLevel = req.query.level;
    if (req.query.type) query.type = req.query.type;
    if (req.query.category) query.category = req.query.category;
    if (req.query.mode) query.mode = req.query.mode;
    if (req.query.department && req.query.department !== "all") {
      query.department = req.query.department;
    }

    // Search functionality
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Date filters
    const now = new Date();
    if (req.query.dateFilter === "today") {
      const start = new Date(now); start.setHours(0,0,0,0);
      const end = new Date(now); end.setHours(23,59,59,999);
      query.date = { $gte: start, $lte: end };
    } else if (req.query.dateFilter === "upcoming") {
      query.date = { $gte: now };
    } else if (req.query.dateFilter === "week") {
      const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7);
      query.date = { $gte: now, $lte: weekEnd };
    } else if (req.query.dateFilter === "month") {
      const monthEnd = new Date(now); monthEnd.setMonth(now.getMonth() + 1);
      query.date = { $gte: now, $lte: monthEnd };
    }

    const events = await Event.find(query)
      .sort({ date: -1 })
      .populate("organizer", "fullName email")
      .populate("assignedFaculty", "fullName email");

    // Prepend host to image URL for frontend
    const protocol = req.protocol;
    const host = req.get("host");
    const processedEvents = events.map(event => {
      const eventObj = event.toObject();
      if (eventObj.image && eventObj.image.startsWith("/uploads")) {
        eventObj.image = `${protocol}://${host}${eventObj.image}`;
      }
      return eventObj;
    });

    console.log(`[DEBUG] getEvents: Found ${processedEvents.length} events for user role ${req.user.role}`);
    
    res.json(processedEvents);
  } catch (error) {
    console.error("[ERROR] getEvents:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET EVENT BY ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "fullName collegeName")
      .populate("registeredStudents", "fullName email collegeName department")
      .populate("attendedStudents", "fullName email collegeName")
      .populate("waitlist", "fullName email")
      .populate("feedback.studentId", "fullName");
    if (!event) return res.status(404).json({ message: "Event not found" });

    const eventObj = event.toObject();
    if (eventObj.image && eventObj.image.startsWith("/uploads")) {
      const protocol = req.protocol;
      const host = req.get("host");
      eventObj.image = `${protocol}://${host}${eventObj.image}`;
    }

    res.json(eventObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE EVENT (Admin & Faculty)
export const createEvent = async (req, res) => {
  try {
    const isFaculty = req.user.role === "faculty";
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && !isFaculty) {
      return res.status(403).json({ message: "Unauthorized to create events." });
    }

    if (!req.body.title || !req.body.date) {
      return res.status(400).json({ message: "Title and Date are required fields." });
    }

    const assignedFacultyId = req.body.assignedFaculty === "none" || req.body.assignedFaculty === "null" ? null : req.body.assignedFaculty;
    
    // Parse numeric fields if they come as strings from FormData
    const registrationLimit = req.body.registrationLimit ? parseInt(req.body.registrationLimit) : 0;
    
    // Parse speakers JSON if it's a string
    let speakers = [];
    try {
      if (req.body.speakers) {
        speakers = typeof req.body.speakers === 'string' ? JSON.parse(req.body.speakers) : req.body.speakers;
      }
    } catch (err) {
      console.error("Failed to parse speakers:", err);
    }

    // Handle Boolean fields from FormData
    const enableWaitlist = req.body.enableWaitlist === "true" || req.body.enableWaitlist === true;

    // Handle Image upload or fallback
    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image && req.body.image !== "null" && req.body.image !== "undefined") {
      imagePath = req.body.image;
    }

    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      endDate: req.body.endDate,
      category: req.body.category,
      type: req.body.type,
      venue: req.body.venue,
      registrationLimit,
      participationLevel: req.body.participationLevel,
      mode: req.body.mode,
      department: req.body.department,
      organizerName: req.body.organizerName,
      prizeDetails: req.body.prizeDetails,
      rules: req.body.rules,
      enableWaitlist,
      speakers,
      image: imagePath,
      createdBy: req.user.id,
      organizer: isAdmin ? (assignedFacultyId || req.user.id) : req.user.id,
      assignedFaculty: isAdmin ? assignedFacultyId : null,
      status: isAdmin ? "approved" : "pending",
    });

    await event.save();

    // 1. If an Admin assigns a faculty, notify that faculty immediately
    if (isAdmin && assignedFacultyId) {
      await createNotification({
        recipient: assignedFacultyId,
        sender: req.user.id,
        message: `System Alert: You have been assigned as the organizer for "${event.title}".`,
        type: "info",
        link: `/faculty/events`
      });
    }

    // 2. If an Admin creates an event, it's auto-approved. Notify ALL students!
    if (isAdmin) {
      const allStudents = await User.find({ role: "student" }).select("_id");
      const broadcast = allStudents.map(student => ({
        recipient: student._id,
        sender: req.user.id,
        message: `📢 Announcement: New event "${event.title}" is now open for registration! 🚀`,
        type: "info",
        link: `/event/${event._id}`
      }));
      if (broadcast.length > 0) {
        const NotificationModel = (await import("../models/Notification.js")).default;
        await NotificationModel.insertMany(broadcast);
      }
    } else {
      // 3. If a Faculty creates an event, maybe notify admins (Optional based on requirements)
      // For now, it just sits in 'pending' for admin review
    }

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// APPROVE/REJECT EVENT (Admin)
export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    // 1. Notify Organizer
    await createNotification({
      recipient: event.organizer,
      sender: req.user.id,
      message: `Your event "${event.title}" has been ${status}.`,
      type: status === "approved" ? "success" : "error",
      link: `/event/${event._id}`
    });

    // 2. If approved, notify ALL students (The Announcement)
    if (status === "approved") {
      const allStudents = await User.find({ role: "student" }).select("_id");
      const broadcast = allStudents.map(student => ({
        recipient: student._id,
        sender: req.user.id,
        message: `📢 New Event: "${event.title}" is now open for registration! Check it out. 🌟`,
        type: "info",
        link: `/event/${event._id}`
      }));
      if (broadcast.length > 0) {
        const NotificationModel = (await import("../models/Notification.js")).default;
        await NotificationModel.insertMany(broadcast);
      }
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REGISTER FOR EVENT (Student) - with waitlist support
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.status !== "approved") {
      return res.status(400).json({ message: "Event is not open for registration" });
    }

    if (event.registeredStudents.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered" });
    }

    if (event.waitlist?.includes(req.user.id)) {
      return res.status(400).json({ message: "Already on waitlist" });
    }

    // Check seat limit
    if (event.registrationLimit > 0 && event.registeredStudents.length >= event.registrationLimit) {
      if (event.enableWaitlist) {
        event.waitlist.push(req.user.id);
        await event.save();
        return res.json({ message: "Added to waitlist", waitlisted: true, event });
      }
      return res.status(400).json({ message: "Registration limit reached" });
    }

    event.registeredStudents.push(req.user.id);
    await event.save();

    // Notify Student
    await createNotification({
      recipient: req.user.id,
      sender: event.organizer, // From the organizer
      message: `Successfully registered for "${event.title}"!`,
      type: "success",
      link: `/event/${event._id}`
    });

    // Send Confirmation Email
    const user = await User.findById(req.user.id);
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: `Registration Confirmed: ${event.title} 🚀`,
        html: getRegistrationTemplate(user.fullName, event)
      });
    }

    res.json({ message: "Registered successfully", waitlisted: false, event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// JOIN WAITLIST (Student)
export const joinWaitlist = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (!event.enableWaitlist) return res.status(400).json({ message: "Waitlist not enabled" });
    if (event.registeredStudents.includes(req.user.id))
      return res.status(400).json({ message: "Already registered" });
    if (event.waitlist?.includes(req.user.id))
      return res.status(400).json({ message: "Already on waitlist" });

    event.waitlist.push(req.user.id);
    await event.save();
    res.json({ message: "Added to waitlist", position: event.waitlist.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT FEEDBACK (Student)
export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if student attended
    if (!event.attendedStudents.some(s => s.toString() === req.user.id)) {
      return res.status(403).json({ message: "Only attended students can give feedback" });
    }

    // Check if already submitted
    const existing = event.feedback.find(f => f.studentId?.toString() === req.user.id);
    if (existing) {
      return res.status(400).json({ message: "Feedback already submitted" });
    }

    const user = await User.findById(req.user.id).select("fullName");
    event.feedback.push({
      studentId: req.user.id,
      studentName: user.fullName,
      rating,
      comment,
    });
    await event.save();

    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET FEEDBACK FOR AN EVENT (Faculty/Admin)
export const getEventFeedback = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("feedback.studentId", "fullName")
      .select("feedback title");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event.feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK ATTENDANCE (Faculty) with bulk support
export const markAttendance = async (req, res) => {
  try {
    const { studentIds } = req.body; // Array of student IDs
    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({ message: "No students provided" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Filter valid students from the registered list using string comparison
    const registeredIds = event.registeredStudents.map(s => s.toString());
    const validStudents = studentIds.filter(id => registeredIds.includes(id.toString()));

    // Use string comparison to avoid duplicates in attendedStudents
    const currentAttended = new Set(event.attendedStudents.map(id => id.toString()));
    validStudents.forEach(id => currentAttended.add(id.toString()));
    
    event.attendedStudents = Array.from(currentAttended);
    
    // Check Settings for Auto-Certification
    const Settings = (await import("../models/Settings.js")).default;
    const settings = await Settings.findOne();
    
    if (settings?.certificateAutoIssue) {
      // Auto-verify all students who just got marked present
      for (const studentId of validStudents) {
        if (!event.verifiedStudents.some(s => s.toString() === studentId.toString())) {
          event.verifiedStudents.push(studentId);
          
          // Create Certificate Record
          const user = await User.findById(studentId);
          if (user) {
            const certId = `CB-CERT-${event._id.toString().toUpperCase().slice(-6)}-${user._id.toString().toUpperCase().slice(-4)}`;
            await Certificate.create({
              certificateId: certId,
              studentId: user._id, 
              eventId: event._id,
              metadata: {
                studentName: user.fullName,
                eventTitle: event.title,
                organizerName: "CampusBuzz"
              }
            });
          }
        }
      }
    }
    
    await event.save();

    const pointsMap = {
      "Seminar": 20, "Workshop": 30, "Hackathon": 50, "Technical": 40, "Non-Technical": 20,
      "hackathon": 50, "seminar": 20, "tech-fest": 40, "competition": 35, "workshop": 30,
    };

    const pointsToAdd = pointsMap[event.category] || pointsMap[event.type] || 20;

    await User.updateMany(
      { _id: { $in: validStudents } },
      {
        $addToSet: { eventsAttended: event._id },
        $inc: { points: pointsToAdd }
      }
    );

    res.json({ message: "Attendance marked and points updated", count: validStudents.length, event });

    // Notify Students that certificate is ready
    for (const studentId of validStudents) {
      await createNotification({
        recipient: studentId,
        sender: req.user.id,
        message: `Attendance marked for "${event.title}". Next step: Faculty verification for certificate.`,
        type: "success",
        link: "/dashboard?tab=registered"
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY STUDENT FOR CERTIFICATE (Faculty)
export const verifyStudentForCertificate = async (req, res) => {
  try {
    const { studentId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if student attended using robust string comparison
    const hasAttended = event.attendedStudents.some(s => s.toString() === studentId.toString());
    if (!hasAttended) {
      return res.status(400).json({ message: "Student must be marked present first" });
    }

    const isVerified = event.verifiedStudents.some(s => s.toString() === studentId.toString());
    if (isVerified) {
      return res.status(400).json({ message: "Student already verified" });
    }

    event.verifiedStudents.push(studentId);
    await event.save();

    // Create a record in the Certificate collection for "storage" & "tracking"
    const user = await User.findById(studentId);
    if (user) {
      const certId = `CB-CERT-${event._id.toString().toUpperCase().slice(-6)}-${user._id.toString().toUpperCase().slice(-4)}`;
      await Certificate.create({
        certificateId: certId,
        studentId: user._id,
        eventId: event._id,
        metadata: {
          studentName: user.fullName,
          eventTitle: event.title,
          organizerName: "CampusBuzz"
        }
      });
    }

    // Notify Student
    await createNotification({
      recipient: studentId,
      sender: req.user.id,
      message: `Congratulations! Your certificate for "${event.title}" has been verified and is ready for download.`,
      type: "success",
      link: "/dashboard?tab=certificates"
    });

    // Send Certificate Achievement Email
    if (user && user.email) {
      const campusBuzzCertId = `CB-CERT-${event._id.toString().toUpperCase().slice(-6)}-${user._id.toString().toUpperCase().slice(-4)}`;
      await sendEmail({
        to: user.email,
        subject: `Certificate Ready: ${event.title} 📜`,
        html: getCertificateTemplate(user.fullName, event, `${process.env.FRONTEND_URL}/verify/${campusBuzzCertId}`)
      });
    }

    res.json({ message: "Student verified for certificate", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { certId } = req.params;
    const parts = certId.split("-");
    if (parts.length < 4) return res.status(400).json({ message: "Invalid ID format" });

    const eventId = parts[2];
    const userId = parts[3];

    const event = await Event.findById(eventId).populate("organizer", "fullName");
    const user = await User.findById(userId);

    if (!event || !user) return res.status(404).json({ message: "Certificate not found" });

    const attended = event.attendedStudents.some(s => s.toString() === userId);
    if (!attended) return res.status(404).json({ message: "Attendee not verified" });

    res.json({
      studentName: user.fullName,
      eventTitle: event.title,
      category: event.category,
      type: event.type,
      date: event.date,
      organizer: event.organizer?.fullName
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET PENDING EVENTS (Admin Only)
export const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "pending" }).populate("organizer", "fullName collegeName");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK WINNERS & COMPLETE EVENT (Faculty)
export const updateWinnerList = async (req, res) => {
  try {
    const { winners } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.winners = winners;
    event.status = "completed";
    
    // Auto-verify all attended students if not already verified
    const Settings = (await import("../models/Settings.js")).default;
    const settings = await Settings.findOne();
    
    if (settings?.certificateAutoIssue) {
      for (const studentId of event.attendedStudents) {
        if (!event.verifiedStudents.some(s => s.toString() === studentId.toString())) {
          event.verifiedStudents.push(studentId);
          const user = await User.findById(studentId);
          if (user) {
            const certId = `CB-CERT-${event._id.toString().toUpperCase().slice(-6)}-${user._id.toString().toUpperCase().slice(-4)}`;
            await Certificate.create({
              certificateId: certId,
              studentId: user._id,
              eventId: event._id,
              metadata: { studentName: user.fullName, eventTitle: event.title, organizerName: "CampusBuzz" }
            });
          }
        }
      }
    }
    
    await event.save();

    for (const winner of winners) {
      await User.findByIdAndUpdate(winner.studentId, {
        $inc: { points: winner.points },
        $push: { badges: `Winner: ${event.title} (${winner.position})` }
      });

      // Notify Winner
      await createNotification({
        recipient: winner.studentId,
        sender: req.user.id,
        message: `Congratulations! You won ${winner.position} in "${event.title}"! 🎉`,
        type: "success",
        link: "/dashboard?tab=profile"
      });
    }

    // Notify ALL attended students to leave feedback
    for (const studentId of event.attendedStudents) {
      await createNotification({
        recipient: studentId,
        sender: req.user.id,
        message: `Event "${event.title}" is officially completed! How was it? Leave your feedback! ⭐`,
        type: "info",
        link: "/dashboard?tab=registered"
      });
    }

    res.json({ message: "Winners updated and points awarded", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET LEADERBOARD
export const getLeaderboard = async (req, res) => {
  try {
    const { type, value } = req.query;
    let query = { role: "student" };
    if (type === "college") query.collegeName = value;
    if (type === "state") query.state = value;
    // National level: no geographic query limits

    const students = await User.find({ role: "student" })
      .sort({ points: -1 })
      .limit(20)
      .select("fullName collegeName points ranking badges eventsAttended");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET RECOMMENDATIONS (Student)
export const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const dept = user?.department || "Technical";
    
    // Find events matching user department or top upcoming events
    const recommendations = await Event.find({
      status: "approved",
      $or: [
        { category: { $regex: dept, $options: "i" } },
        { description: { $regex: dept, $options: "i" } }
      ]
    })
    .sort({ date: 1 })
    .limit(5);

    // Prepend host to image URL
    const protocol = req.protocol;
    const host = req.get("host");
    const processedRecommendations = recommendations.map(event => {
      const eventObj = event.toObject();
      if (eventObj.image && eventObj.image.startsWith("/uploads")) {
        eventObj.image = `${protocol}://${host}${eventObj.image}`;
      }
      return eventObj;
    });

    res.json(processedRecommendations);
  } catch (error) {
    console.error("[ERROR] getRecommendations:", error);
    res.json([]); // Return empty for a silent fail to keep dashboard alive
  }
};

// GET ADMIN REPORTS / STATS
export const getAdminReports = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "fullName")
      .select("title category type status registeredStudents attendedStudents date organizer feedback");

    const topEvents = events
      .map(e => ({
        _id: e._id,
        title: e.title,
        category: e.category,
        type: e.type,
        status: e.status,
        date: e.date,
        organizer: e.organizer?.fullName,
        registered: e.registeredStudents?.length || 0,
        attended: e.attendedStudents?.length || 0,
        feedbackCount: e.feedback?.length || 0,
        avgRating: e.feedback?.length
          ? (e.feedback.reduce((s, f) => s + f.rating, 0) / e.feedback.length).toFixed(1)
          : null,
      }))
      .sort((a, b) => b.registered - a.registered);

    const topStudents = await User.find({ role: "student" })
      .sort({ points: -1 })
      .limit(10)
      .select("fullName email department points badges eventsAttended state collegeName flags");

    // Aggregate stats by State (State/National Data)
    const stateStats = await User.aggregate([
      { $match: { role: "student" } },
      {
        $group: {
          _id: "$state",
          totalStudents: { $sum: 1 },
          avgPoints: { $avg: "$points" },
          totalPoints: { $sum: "$points" },
        },
      },
      { $sort: { totalPoints: -1 } },
    ]);

    // Aggregate stats by College (Manage Colleges)
    const collegeStats = await User.aggregate([
      { $match: { role: "student" } },
      {
        $group: {
          _id: "$collegeName",
          state: { $first: "$state" },
          totalStudents: { $sum: 1 },
          totalPoints: { $sum: "$points" },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 15 }
    ]);

    // Flagged Users (Monitor Fraud)
    const flaggedUsers = await User.find({ "flags.0": { $exists: true } })
      .select("fullName collegeName flags status")
      .populate("flags.flaggedBy", "fullName role");

    res.json({ topEvents, topStudents, stateStats, collegeStats, flaggedUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Handle Boolean fields from FormData
    const enableWaitlist = updateData.enableWaitlist === "true" || updateData.enableWaitlist === true;
    
    // Parse speakers JSON if it's a string
    let parsedSpeakers = updateData.speakers;
    if (updateData.speakers && typeof updateData.speakers === 'string') {
      try {
        parsedSpeakers = JSON.parse(updateData.speakers);
      } catch (err) {
        console.error("Failed to parse speakers in update:", err);
      }
    }

    // Handle Image upload or fallback
    let imagePath = updateData.image; 
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (imagePath === "null" || imagePath === "undefined") {
      imagePath = "";
    }

    // Explicitly map fields to avoid junk from req.body
    const mappedData = {
      title: updateData.title,
      description: updateData.description,
      date: updateData.date,
      endDate: updateData.endDate,
      category: updateData.category,
      type: updateData.type,
      venue: updateData.venue,
      registrationLimit: updateData.registrationLimit ? parseInt(updateData.registrationLimit) : undefined,
      participationLevel: updateData.participationLevel,
      mode: updateData.mode,
      department: updateData.department,
      organizerName: updateData.organizerName,
      prizeDetails: updateData.prizeDetails,
      rules: updateData.rules,
      enableWaitlist: enableWaitlist,
      speakers: parsedSpeakers,
      image: imagePath
    };

    // Remove undefined fields so they don't overwrite with null
    Object.keys(mappedData).forEach(key => mappedData[key] === undefined && delete mappedData[key]);

    const oldEvent = await Event.findById(req.params.id);
    const event = await Event.findByIdAndUpdate(req.params.id, mappedData, { new: true });

    // If Date or Venue changed, notify all registered students
    if (oldEvent && (oldEvent.date?.toString() !== event.date?.toString() || oldEvent.venue !== event.venue)) {
      const students = event.registeredStudents || [];
      for (const studentId of students) {
        await createNotification({
          recipient: studentId,
          sender: req.user.id,
          message: `📢 Update: The details for "${event.title}" have changed. Check the event page for new info!`,
          type: "info",
          link: `/event/${event._id}`
        });
      }
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check permissions
    if (req.user.role === "faculty") {
      const isOwner = event.createdBy.toString() === req.user.id.toString();
      const isAssigned = event.assignedFaculty?.toString() === req.user.id.toString();
      if (!isOwner && !isAssigned) {
        return res.status(403).json({ message: "Unauthorized to delete this event." });
      }
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
