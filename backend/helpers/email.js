const nodemailer = require("nodemailer");
const config = {
  EMAIL_HOST: process.env.EMAIL_HOST || "",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 465,
  EMAIL_SECURE: process.env.EMAIL_SECURE == "true" ? true : false,
  EMAIL_FROM: process.env.EMAIL_FROM || "",
};

class EmailConfig {
  static transporter;

  static init() {
    const smtpConfig = {
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: config.EMAIL_SECURE,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASSWORD,
      },
      tls: {
        ciphers: "SSLv3",
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);
    this.transporter = transporter;
  }

  static sendEmail = (mail) => {
    try {
      const { to, subject, html } = mail;
      const mailOptions = { from: config.EMAIL_FROM, to, subject, html };
      return this.transporter.sendMail(mailOptions);
    } catch (err) {
      throw err;
    }
  };
}

module.exports = EmailConfig;
