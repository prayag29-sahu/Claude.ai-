const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
})

exports.sendEmail = async ({ to, subject, html, text }) => {
  await transporter.sendMail({
    from: `"The Lightroom Photography" <${process.env.EMAIL_USER}>`,
    to, subject, html: html || `<p>${text}</p>`
  })
}

exports.sendBookingConfirmation = async (booking) => {
  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f0ebe3;padding:40px;">
      <h1 style="color:#c6a55c;font-weight:300;">The Lightroom Photography</h1>
      <p>Dear ${booking.name},</p>
      <p>Thank you for your booking request. We've received your inquiry and will get back to you within 24 hours.</p>
      <div style="border:1px solid #222;padding:20px;margin:20px 0;">
        <p><strong style="color:#c6a55c;">Event Type:</strong> ${booking.eventType}</p>
        <p><strong style="color:#c6a55c;">Date:</strong> ${new Date(booking.eventDate).toLocaleDateString()}</p>
        <p><strong style="color:#c6a55c;">Location:</strong> ${booking.location}</p>
      </div>
      <p>Where Light Meets Emotion<br/>The Lightroom Team</p>
    </div>
  `
  await exports.sendEmail({ to: booking.email, subject: 'Booking Request Received – The Lightroom Photography', html })
  
  // Notify admin
  await exports.sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking: ${booking.eventType} – ${booking.name}`,
    html: `<p>New booking from ${booking.name} (${booking.email})<br/>Event: ${booking.eventType} on ${new Date(booking.eventDate).toLocaleDateString()}</p>`
  })
}
