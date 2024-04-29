const nodemailer = require("nodemailer");

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });
}
function sendEmail(subject, email, isText, content, attachment) {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
    };
    if (isText) {
      mailOptions.text = content;
    } else {
      mailOptions.html = content;
    }

    if (attachment) {
      mailOptions.attachments = [attachment];
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
  }
}

module.exports = {
  sendEmail,
};