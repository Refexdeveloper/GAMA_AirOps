const { SMTP_MAIL, SMTP_PASSWORD } = process.env;
const {
  getActiveSmtpConfig,
  createTransporter,
} = require("../services/smtpService");

/**
 * Prefers DB SMTP config; falls back to SMTP_MAIL / SMTP_PASSWORD env.
 */
const sendMail = async (email, mailSubject, content, callback) => {
  try {
    let transporter;
    let from;

    const dbConfig = await getActiveSmtpConfig();
    if (dbConfig) {
      transporter = createTransporter(dbConfig);
      const fromEmail = dbConfig.from_email || dbConfig.user || "noreply@localhost";
      const fromName = dbConfig.from_name || "GAMA AirOps";
      from = dbConfig.from_name ? `"${fromName}" <${fromEmail}>` : fromEmail;
    } else if (SMTP_MAIL && SMTP_PASSWORD) {
      transporter = createTransporter({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        user: SMTP_MAIL,
        password: SMTP_PASSWORD,
      });
      from = SMTP_MAIL;
    } else {
      const err = new Error("SMTP not configured. Set SMTP in Administration Settings or env.");
      console.log(err.message);
      if (typeof callback === "function") callback(err, null);
      return;
    }

    const mailOptions = {
      from,
      to: email,
      subject: mailSubject,
      html: content,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        if (typeof callback === "function") callback(error, null);
      } else {
        console.log("Mail sent successfully!", info.response);
        if (typeof callback === "function") callback(null, info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
    if (typeof callback === "function") callback(error.message, null);
  }
};

module.exports = sendMail;
