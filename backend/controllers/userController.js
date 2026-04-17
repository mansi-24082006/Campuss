import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
      .populate("eventsAttended", "title date category");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUsers = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "faculty") {
      query.collegeName = req.user.collegeName;
    }
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "faculty", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    user.status = status;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, department, collegeName } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (department) user.department = department;
    if (collegeName) user.collegeName = collegeName;

    await user.save();
    
    // Remove password before sending back
    const updatedUser = user.toObject();
    delete updatedUser.password;
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: RECALCULATE STATE/NATIONAL RANKINGS
export const recalculateRanks = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });

    const students = await User.find({ role: "student" }).sort({ points: -1 });

    // 1. National Ranks
    const nationalPromises = students.map((s, idx) => {
      s.ranking.national = idx + 1;
      return s.save();
    });

    // 2. State Ranks
    const states = [...new Set(students.map(s => s.state))];
    for (const state of states) {
      const stateStudents = students.filter(s => s.state === state);
      stateStudents.forEach((s, idx) => {
        s.ranking.state = idx + 1;
      });
    }

    // 3. College Ranks
    const colleges = [...new Set(students.map(s => s.collegeName))];
    for (const college of colleges) {
      const collegeStudents = students.filter(s => s.collegeName === college);
      collegeStudents.forEach((s, idx) => {
        s.ranking.college = idx + 1;
      });
    }

    await Promise.all(students.map(s => s.save()));

    res.json({ message: "Rankings recalculated successfully for all levels", count: students.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: MONITOR FRAUD / USER FLAG CONTROL
export const flagUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    const { reason } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.flags.push({
      reason: reason || "Suspicious activity detected",
      flaggedBy: req.user.id
    });
    
    // If user has more than 3 flags, set to inactive automatically (Monitor Fraud)
    if (user.flags.length >= 3) {
      user.status = "inactive";
    }

    await user.save();
    res.json({ message: "User flagged successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { scope } = req.query; // 'college', 'state', 'national'
    let filter = { role: "student" };

    if (scope === "college" && req.user) {
      filter.collegeName = req.user.collegeName;
    } else if (scope === "state" && req.user) {
      filter.state = req.user.state;
    }

    const leaderboard = await User.find(filter)
      .select("fullName points collegeName department avatar ranking")
      .sort({ points: -1 })
      .limit(50);
      
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

