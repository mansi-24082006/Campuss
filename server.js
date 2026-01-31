import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`),
);
