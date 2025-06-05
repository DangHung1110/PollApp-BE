import nodemailer from 'nodemailer';

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ emailFrom, emailTo, emailSubject, emailHTML }) {
    await this.transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      html: emailHTML,    
    });
  }
}

export default MailService
