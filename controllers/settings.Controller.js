import Settings from "../models/Settings.js";

export const getSettings = async (_, res) => {
  res.json(await Settings.findOne());
};

export const updateSettings = async (req, res) => {
  res.json(
    await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true }),
  );
};
