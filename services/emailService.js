const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// exports.sendOTPEmail = async (email, otp) => {
//   await transporter.sendMail({
//     from: `"Soulease" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Your OTP Verification Code",
//     html: `
//       <h2>Email Verification</h2>
//       <p>Your OTP code is:</p>
//       <h1>${otp}</h1>
//       <p>This code expires in 5 minutes.</p>
//     `,
//   });
// };







exports.sendOTPEmail = async (email, otp) => {
  console.log("Sending OTP to:", email);
  console.log("OTP is:", otp);

  await transporter.sendMail({
    from: `"Soulease" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
  });

  console.log("Email sent successfully");
};


exports.sendWelcomeEmail = async (email, name) => {
  try {
    console.log("Sending Welcome Email to:", email);

    await transporter.sendMail({
      from: `"Soulease" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🌿 Welcome to Soulease",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Welcome to Soulease, ${name} 💙</h2>

          <p>We're really happy to have you here.</p>

          <p>
            Your journey starts now:
            <br/>🌱 Track your emotions  
            <br/>🧠 Understand your mind  
            <br/>💫 Build a better you  
          </p>

          <p>Take your first step today ✨</p>

          <br/>
          <p>— Team Soulease</p>
        </div>
      `,
    });

    console.log("Welcome email sent successfully");

  } catch (err) {
    console.log("Welcome email error:", err);
  }
};
