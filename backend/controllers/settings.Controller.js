import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        allowRegistrations: true,
        maintenanceMode: false,
        certificateAutoIssue: true,
        accessLevel: "admin"
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSystemLogs = async (req, res) => {
  const logs = [
    { id: 1, event: "User Login", user: "admin@campusbuzz.com", time: new Date().toISOString(), status: "Success" },
    { id: 2, event: "New Event Created", user: "faculty@gujaratuniversity.com", time: new Date(Date.now() - 3600000).toISOString(), status: "Pending Approval" },
    { id: 3, event: "Global Broadcast", user: "admin@campusbuzz.com", time: new Date(Date.now() - 7200000).toISOString(), status: "Sent" },
    { id: 4, event: "Database Backup", user: "System", time: new Date(Date.now() - 86400000).toISOString(), status: "Success" },
    { id: 5, event: "Failed Login", user: "unknown_user", time: new Date(Date.now() - 90000000).toISOString(), status: "Blocked" }
  ];
  res.json(logs);
};
