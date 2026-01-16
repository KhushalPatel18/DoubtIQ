import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { JWT_CONFIG } from "../config/jwt.js";

const sendJson = (res, status, payload) => res.status(status).json(payload);

// Extract token from Authorization header (Bearer) or fallback to query/body for testing
const extractToken = (req) => {
  const auth = req.headers?.authorization || "";
  if (auth.startsWith("Bearer ")) {
    return auth.substring(7).trim();
  }
  // Helpful fallbacks for Postman/testing
  if (req.query?.token) return req.query.token;
  if (req.body?.token) return req.body.token;
  return null;
};

// Mandatory auth: requires a valid JWT and active user
export const requireAuth = async (req, res, next) => {
  try {
    if (!JWT_CONFIG?.secret) {
      return sendJson(res, 500, { message: "Server JWT not configured" });
    }

    const token = extractToken(req);
    if (!token) {
      return sendJson(res, 401, { message: "Auth token missing" });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_CONFIG.secret);
    } catch (err) {
      return sendJson(res, 401, { message: "Invalid or expired token" });
    }

    const user = await User.findById(payload.id).select("-password");
    if (!user) {
      return sendJson(res, 401, { message: "User not found" });
    }
    if (user.isActive === false) {
      return sendJson(res, 403, { message: "User is inactive" });
    }

    req.user = user; // Attach the authenticated user
    return next();
  } catch (error) {
    console.error("requireAuth error:", error);
    return sendJson(res, 500, { message: "Internal server error" });
  }
};

// Optional auth: attaches user if token is valid, otherwise continues unauthenticated
export const optionalAuth = async (req, res, next) => {
  try {
    if (!JWT_CONFIG?.secret) return next();

    const token = extractToken(req);
    if (!token) return next();

    let payload;
    try {
      payload = jwt.verify(token, JWT_CONFIG.secret);
    } catch {
      return next();
    }

    const user = await User.findById(payload.id).select("-password");
    if (user) req.user = user;
    return next();
  } catch (error) {
    console.error("optionalAuth error:", error);
    return next();
  }
};

// Role guard: ensure the current user has the specified role
export const requireRole = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return sendJson(res, 401, { message: "Unauthorized" });
      }
      if (req.user.role !== role) {
        return sendJson(res, 403, { message: "Forbidden" });
      }
      return next();
    } catch (error) {
      console.error("requireRole error:", error);
      return sendJson(res, 500, { message: "Internal server error" });
    }
  };
};
