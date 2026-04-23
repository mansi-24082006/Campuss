import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../backend/.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const deleteIoTProjectFair = async () => {
  await connectDB();
  
  const Event = (await import('../../backend/models/Event.js')).default;
  const Notification = (await import('../../backend/models/Notification.js')).default;

  // Search and delete events
  const deletedEvents = await Event.deleteMany({
    title: { $regex: /iot project fair/i }
  });
  console.log(`Deleted ${deletedEvents.deletedCount} events.`);

  // Search and delete notifications
  const deletedNotifications = await Notification.deleteMany({
    message: { $regex: /iot project fair/i }
  });
  console.log(`Deleted ${deletedNotifications.deletedCount} notifications.`);

  process.exit(0);
};

deleteIoTProjectFair();
