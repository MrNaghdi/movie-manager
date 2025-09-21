const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    //create transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    //email options
    const mailOptions = {
      from: process.env.EMAIL_FROM || "My App <noreply@myapp.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent (Mailtrap): ", info.messageId);
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    throw new Error("There was an error sending the email. Try again later!");
  }
};

module.exports = sendEmail;
