import Feedback from "../models/Feedback.js";

export const submitGeneralFeedback = async (req, res) => {
  try {
    const { message, type } = req.body;
    const feedback = new Feedback({
      studentId: req.user.id,
      message,
      type: type || "suggestion",
    });
    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGeneralFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("studentId", "fullName email")
      .sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
