import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import doubtRoutes from "./routes/doubt.routes.js";

/* =========================
   ENV CONFIG
   ========================= */
dotenv.config();

/* =========================
   APP INIT
   ========================= */
const app = express();

const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

/* =========================
   MIDDLEWARES
   ========================= */
app.use(cors({
   origin: allowedOrigin,
   credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   DB CONNECTION MIDDLEWARE
   ========================= */
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({ 
      message: "Database connection unavailable. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/* =========================
   ROUTES
   ========================= */
app.get("/", (req, res) => {
  res.json({ message: "Doubtiq API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/doubt", doubtRoutes);

// Handle favicon requests gracefully
app.get('/favicon.ico', (req, res) => {
   res.status(204).end();
});

/* =========================
    GLOBAL ERROR HANDLER (should be last)
    ========================= */
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({
      message: "Something went wrong",
      error: err.message,
   });
});

/* =========================
   SERVER START
   ========================= */
const PORT = process.env.PORT || 5000;

// For Vercel serverless, export the app
export default app;

// For local development, start the server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    try {
      await connectDB();
      console.log(`Server running on http://localhost:${PORT}`);
    } catch (error) {
      console.error("Failed to connect to database:", error.message);
    }
  });
}
