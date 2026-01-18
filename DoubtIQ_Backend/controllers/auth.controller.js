import User from "../models/user.js";
import Otp from "../models/Otp.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import transporter from "../config/mail.js";
import { JWT_CONFIG } from "../config/jwt.js";

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const ensureJwtSecret = () => {
	if (!JWT_CONFIG?.secret) {
		throw new Error("JWT secret is not configured");
	}
};

const generateToken = (userId) => {
	ensureJwtSecret();
	return jwt.sign({ id: userId }, JWT_CONFIG.secret, {
		expiresIn: JWT_CONFIG.expiresIn || "7d",
	});
};

const sendJson = (res, status, payload) => res.status(status).json(payload);

/* =========================
	 REGISTER
	 ========================= */
export const registerUser = async (req, res) => {
	try {
		const name = req.body?.name?.trim();
		const email = normalizeEmail(req.body?.email || "");
		const password = req.body?.password;

		if (!name || !email || !password) {
			return sendJson(res, 400, { message: "Name, email, and password are required" });
		}

		const userExists = await User.findOne({ email });
		if (userExists) {
			return sendJson(res, 409, { message: "User already exists" });
		}

		const user = await User.create({ name, email, password });
		const token = generateToken(user._id);

		return sendJson(res, 201, {
			message: "User registered successfully",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("registerUser error:", error.message);
		return sendJson(res, 500, { message: "Database connection error. Please contact admin." });
	}
};

/* =========================
	 LOGIN
	 ========================= */
export const loginUser = async (req, res) => {
	try {
		const email = normalizeEmail(req.body?.email || "");
		const password = req.body?.password;

		if (!email || !password) {
			return sendJson(res, 400, { message: "Email and password are required" });
		}

		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			return sendJson(res, 401, { message: "Invalid credentials" });
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return sendJson(res, 401, { message: "Invalid credentials" });
		}

		user.lastLogin = new Date();
		await user.save({ validateBeforeSave: false });

		const token = generateToken(user._id);

		return sendJson(res, 200, {
			message: "Login successful",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("loginUser error:", error.message);
		return sendJson(res, 500, { message: "Database connection error. Please contact admin." });
	}
};

/* =========================
	 FORGOT PASSWORD (SEND OTP)
	 ========================= */
export const forgotPassword = async (req, res) => {
	try {
		const email = normalizeEmail(req.body?.email || "");

		if (!email) {
			return sendJson(res, 400, { message: "Email is required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return sendJson(res, 404, { message: "User not found" });
		}

		const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

		await Otp.deleteMany({ email });
		await Otp.create({
			email,
			otp: otpCode,
			expiresAt: new Date(Date.now() + 10 * 60 * 1000),
		});

		// Check if email credentials are configured
		const emailConfigured = process.env.EMAIL_USER && 
			process.env.EMAIL_USER !== 'your_actual_email@gmail.com' &&
			process.env.EMAIL_PASS && 
			process.env.EMAIL_PASS !== 'your_actual_app_password';

		if (emailConfigured) {
			try {
				await transporter.sendMail({
					from: `"Doubtiq" <${process.env.EMAIL_USER}>`,
					to: email,
					subject: "Password Reset OTP",
					html: `<p>Your OTP is <b>${otpCode}</b>. It expires in 10 minutes.</p>`,
				});
			} catch (emailError) {
				console.error("Email sending failed:", emailError.message);
				// Log OTP to console for development
				console.log(`\n🔐 OTP for ${email}: ${otpCode}\n`);
			}
		} else {
			// Email not configured - log OTP to console for development
			console.log(`\n🔐 OTP for ${email}: ${otpCode}\n`);
			console.log("⚠️  Email not configured. Configure EMAIL_USER and EMAIL_PASS in .env to send real emails.\n");
		}

		return sendJson(res, 200, { 
			message: "OTP sent to email",
			...(process.env.NODE_ENV === 'development' && !emailConfigured ? { otp: otpCode } : {})
		});
	} catch (error) {
		console.error("forgotPassword error:", error);
		return sendJson(res, 500, { 
			message: "Internal server error",
			error: process.env.NODE_ENV === 'development' ? error.message : undefined
		});
	}
};

/* =========================
	 VERIFY OTP
	 ========================= */
export const verifyOtp = async (req, res) => {
	try {
		const email = normalizeEmail(req.body?.email || "");
		const otp = req.body?.otp?.trim();

		if (!email || !otp) {
			return sendJson(res, 400, { message: "Email and OTP are required" });
		}

		const otpRecord = await Otp.findOne({ email, otp });
		if (!otpRecord) {
			return sendJson(res, 400, { message: "Invalid OTP" });
		}

		if (otpRecord.expiresAt < Date.now()) {
			await otpRecord.deleteOne();
			return sendJson(res, 400, { message: "OTP expired" });
		}

		return sendJson(res, 200, { message: "OTP verified successfully" });
	} catch (error) {
		console.error("verifyOtp error:", error.message);
		return sendJson(res, 500, { message: "Internal server error" });
	}
};

/* =========================
	 RESET PASSWORD
	 ========================= */
export const resetPassword = async (req, res) => {
	try {
		const email = normalizeEmail(req.body?.email || "");
		const password = req.body?.password;
		const otp = req.body?.otp?.trim();

		if (!email || !password || !otp) {
			return sendJson(res, 400, { message: "Email, new password, and OTP are required" });
		}

		const otpRecord = await Otp.findOne({ email, otp });
		if (!otpRecord) {
			return sendJson(res, 400, { message: "Invalid OTP" });
		}
		if (otpRecord.expiresAt < Date.now()) {
			await otpRecord.deleteOne();
			return sendJson(res, 400, { message: "OTP expired" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return sendJson(res, 404, { message: "User not found" });
		}

		user.password = password; // Will be hashed by the User model pre-save hook
		await user.save();
		await Otp.deleteMany({ email });

		return sendJson(res, 200, { message: "Password reset successful" });
	} catch (error) {
		console.error("resetPassword error:", error.message);
		return sendJson(res, 500, { message: "Internal server error" });
	}
};

/* =========================
	 ME (CURRENT USER)
	 ========================= */
export const getMe = async (req, res) => {
	try {
		if (!req.user) {
			return sendJson(res, 401, { message: "Unauthorized" });
		}

		return sendJson(res, 200, {
			message: "User authenticated",
			user: {
				id: req.user._id,
				name: req.user.name,
				email: req.user.email,
				role: req.user.role,
			},
		});
	} catch (error) {
		console.error("getMe error:", error);
		return sendJson(res, 500, { message: "Internal server error" });
	}
};
