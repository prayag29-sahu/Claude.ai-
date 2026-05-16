const router = require('express').Router()
const { sendEmail } = require('../utils/email')

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `Contact Form: ${subject || 'New Message'} from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`
    })
    res.json({ success: true, message: 'Message sent' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' })
  }
})

module.exports = router
