export default {
    smtpHost: process.env.SMTP_HOST!,
    smtpPort: parseInt(process.env.SMTP_PORT!, 10),
    smtpUser: process.env.SMTP_USER!,
    smtpPass: process.env.SMTP_PASS!,
    emailTo: process.env.EMAIL_TO!,
    emailFrom: process.env.EMAIL_FROM!,
  };
  