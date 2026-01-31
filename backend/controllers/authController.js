import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// USER REGISTER
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, collegeName, phoneNumber, role } = req.body;

    if (!fullName || !email || !password || !collegeName || !phoneNumber) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      collegeName,
      phoneNumber,
      role
    });

    return res.json({
      message: "Signup Successful",
      token: generateToken(user._id, user.role),
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.status(400).json({ message: "Invalid password" });

    if (role !== user.role)
      return res.status(400).json({ message: "Role does not match your account" });

    return res.json({
      message: "Login Successful",
      token: generateToken(user._id, user.role),
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
