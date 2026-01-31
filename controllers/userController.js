import User from "../models/User.js";

export const getUsers = async (_, res) => {
  res.json(await User.find().select("-password"));
};

export const createUser = async (req, res) => {
  res.status(201).json(await User.create(req.body));
};

export const updateUser = async (req, res) => {
  res.json(
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true }),
  );
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
