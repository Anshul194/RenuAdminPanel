// index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDb from "./config/connectdb.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

connectDb()
  .then(() => {
    // Start the server after successful connection
    app.listen(port, () => {
      console.log(`Server listening at localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1); // Exit the process with a non-zero exit code
  }); // Call the connectDb function

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // Remove the trailing slash
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Load Routes
app.use("/api", routes);
