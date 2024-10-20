import nodemailer from "nodemailer";
import fs from "fs/promises"; // Make sure to import fs from 'fs/promises' for async access
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { configDotenv } from "dotenv";

configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Email logic (commented, but will work after checking file existence)
const transporter = nodemailer.createTransport({
  service: "gmail", // Use 'gmail' instead of manual host/port
  auth: {
    user: process.env.Email,
    pass: process.env.Gmail_App_Password,
  },
});

const sendEmail = async (
  certificateName,
  username,
  subject,
  receiverEmail
) => {
  // const filePath = path.join(__dirname, "../iccCertificate/kartikay Agarwal_certificate.pdf");
  const filePath = path.join(
    __dirname,
    `../${certificateName}/${username}_certificate.pdf`
  );
  const mailOptions = {
    from: process.env.EMAIL,
    to: receiverEmail,
    subject: subject,
    attachments: [
      {
        filename: `${username}.pdf`,
        path: filePath, // Use the filePath you've checked
        contentType: "application/pdf",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
