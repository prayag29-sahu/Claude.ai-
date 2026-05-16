const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendBookingEmail = async ({ to, name, service, date, time }) => {
  if (!process.env.EMAIL_USER) return;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `✅ Booking Confirmed - Sachin Men's Saloon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d4af37; font-size: 28px;">Sachin Men's Saloon</h1>
          <p style="color: #888;">Your Appointment is Confirmed</p>
        </div>
        <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37;">
          <p style="margin: 0 0 10px;">Hi <strong style="color: #d4af37;">${name}</strong>,</p>
          <p>Your appointment has been successfully booked. Here are your details:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px 0; color: #888;">Service:</td><td style="color: #fff; font-weight: bold;">${service}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Date:</td><td style="color: #fff; font-weight: bold;">${date}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Time:</td><td style="color: #fff; font-weight: bold;">${time}</td></tr>
          </table>
        </div>
        <p style="margin-top: 20px; color: #888;">Please arrive 5 minutes before your scheduled time.</p>
        <p style="color: #888;">📍 Visit us at: 123 Style Street, Your City</p>
        <p style="color: #888;">📞 Call us: +91 98765 43210</p>
        <div style="text-align: center; margin-top: 30px; color: #555; font-size: 12px;">
          <p>© 2024 Sachin Men's Saloon. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
