// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { sendOTPEmail } = require("../services/emailService");

// // 🚫 Blocked dummy domains
// const blockedDomains = [
//   "mailinator.com",
//   "tempmail.com",
//   "10minutemail.com",
//   "guerrillamail.com",
//   "reddummy.com",
//   "redtest.com"
// ];

// // ================= REGISTER =================
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const domain = email.split("@")[1];

//     if (!domain || blockedDomains.includes(domain)) {
//       return res.status(400).json({
//         message: "Please use a valid email address"
//       });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({
//         message: "User already exists"
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       otp,
//       otpExpiry: Date.now() + 5 * 60 * 1000
//     });

//     await sendOTPEmail(email, otp);

//     res.status(201).json({
//       message: "OTP sent for verification"
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ================= VERIFY EMAIL =================
// exports.verifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const user = await User.findOne({ email });

//     if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
//       return res.status(400).json({
//         message: "Invalid or expired OTP"
//       });
//     }

//     user.isVerified = true;
//     user.otp = null;
//     user.otpExpiry = null;

//     await user.save();

//     res.json({
//       message: "Email verified successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ================= LOGIN =================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({
//         message: "Account not found. Please register first."
//       });
//     }

//     if (!user.isVerified) {
//       return res.status(400).json({
//         message: "Please verify your email first"
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Invalid credentials"
//       });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email
//       }
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ================= FORGOT PASSWORD =================
// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.json({
//         message: "If this email exists, a reset OTP has been sent"
//       });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     user.otp = otp;
//     user.otpExpiry = Date.now() + 5 * 60 * 1000;

//     await user.save();
//     await sendOTPEmail(email, otp);

//     res.json({
//       message: "If this email exists, a reset OTP has been sent"
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ================= RESET PASSWORD =================
// exports.resetPassword = async (req, res) => {
//   try {
//     const { email, otp, newPassword } = req.body;

//     const user = await User.findOne({ email });

//     if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
//       return res.status(400).json({
//         message: "Invalid or expired OTP"
//       });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     user.password = hashedPassword;
//     user.otp = null;
//     user.otpExpiry = null;

//     await user.save();

//     res.json({
//       message: "Password reset successfully"
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };















const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { sendOTPEmail } = require("../services/emailService");
const { sendOTPEmail, sendWelcomeEmail } = require("../services/emailService");

// 🚫 Blocked dummy domains
const blockedDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "reddummy.com",
  "redtest.com"
];

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const domain = email.split("@")[1];

    if (!domain || blockedDomains.includes(domain)) {
      return res.status(400).json({
        message: "Please use a valid email address"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "OTP sent for verification"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= VERIFY EMAIL =================
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== String(otp) || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    // user.isVerified = true;
    // user.otp = null;
    // user.otpExpiry = null;

    // await user.save();

    user.isVerified = true;
user.otp = null;
user.otpExpiry = null;

// 🔥 send welcome email ONLY once
if (!user.isWelcomeSent) {
  sendWelcomeEmail(user.email, user.name); // no await (fast ⚡)
  user.isWelcomeSent = true;
}

await user.save();

    res.json({
      message: "Email verified successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Account not found. Please register first."
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If this email exists, a reset OTP has been sent"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();
    await sendOTPEmail(email, otp);

    res.json({
      message: "If this email exists, a reset OTP has been sent"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    console.log("Stored OTP:", user.otp);
    console.log("Entered OTP:", otp);
    console.log("Stored Expiry:", user.otpExpiry);
    console.log("Current Time:", Date.now());

    if (
      user.otp !== String(otp) ||
      !user.otpExpiry ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      message: "Password reset successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
