const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Redis App 👋" <atirichardessotina@gmail.com>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
}

module.exports = sendEmail;
