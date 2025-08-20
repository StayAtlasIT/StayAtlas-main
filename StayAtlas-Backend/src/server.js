import dotenv from "dotenv"
import connectDB from "./config/db.js"
import { app } from "./app.js"
import { User } from "./models/user.model.js"
// Removed: import { asyncHandler } from "./utils/asyncHandler.js"; // No longer needed for init

dotenv.config({
  path: './.env'
})

// Function to initialize data, not an Express handler
const init = async() => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin already present");
      return;
    }
    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      phoneNumber: process.env.DEFAULT_ADMIN_PHONE,
      email: process.env.DEFAULT_ADMIN_EMAIL,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
      role: "admin",
      username: "stayatlasit@gmail.com"
    });

    const createdAdmin = await User.findById(admin._id);

    if (!createdAdmin) {
      console.log(`Error while creating Admin`);
    } else {
      console.log("Admin created!!");
    }
  } catch (error) {
    console.error("Error during initialization:", error);
    // Depending on criticality, you might want to exit the process here as well
    // process.exit(1);
  }
};

// Start the server
connectDB()
.then(() => {
  // Call init directly after successful DB connection
  return init(); // Return the promise from init so catch can handle its errors
})
.then(() => {
  // Start the Express app after initialization is complete
  app.listen(process.env.PORT || 6000, () => {
    console.log(`server is running at PORT:${process.env.PORT}`);
  });
})
.catch((err) => {
  console.log(`MongoDB connection or Initialization Failed!!!!:`, err);
  process.exit(1); // Exit process if DB connection or init fails
});