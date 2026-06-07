const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL?.trim().replace(/^["']|["']$/g, "");

  if (!mongoUrl) {
    console.error("MongoDB connection failed: MONGO_URL is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;