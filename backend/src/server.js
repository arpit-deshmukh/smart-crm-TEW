const dotenv = require("dotenv");
dotenv.config();


const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Start listening immediately so Render sees an "Open Port"
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });

  try {
    // 2. Then connect to the database
    await connectDB();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    // If DB fails, we close the server and exit
    server.close(() => process.exit(1));
  }
};

startServer();