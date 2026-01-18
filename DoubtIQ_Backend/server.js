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
   DB CONNECTION
   ========================= */
connectDB();

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
   ROUTES
   ========================= */
app.get("/", (req, res) => {
  res.json({ message: "Doubtiq API is running 🚀" });
});

app.use("/api/auth", authRoutes);

/* =========================
   GLOBAL ERROR HANDLER
   ========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message,
  });
});

app.use("/api/doubt", doubtRoutes);

/* =========================
   SERVER START
   ========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
