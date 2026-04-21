import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Force IPv4 to avoid EREFUSED errors on some Windows/DNS setups
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    
    if (error.message.includes("EREFUSED") || error.message.includes("ENOTFOUND")) {
      console.error("💡 Hint: This seems like a DNS issue. Try changing your DNS to 8.8.8.8 (Google DNS) or check your internet connection.");
    } else if (error.message.includes("Could not connect to any servers in your MongoDB Atlas cluster")) {
      console.error("💡 Hint: Make sure your current IP address is whitelisted in MongoDB Atlas (Network Access).");
    }
    
    // Don't crash the server immediately in dev mode, let it stay alive for easier debugging
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
