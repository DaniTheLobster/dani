// Netlify serverless function to send emails via Gmail SMTP
const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the form data
    const params = new URLSearchParams(event.body);
    const name = params.get('name') || '';
    const email = params.get('email') || '';
    const subject = params.get('subject') || '';
    const message = params.get('message') || '';

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({ success: false, error: 'All fields are required' }),
      };
    }

    // Create Gmail transporter using App Password
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // SSL
      auth: {
        user: 'danielthelober@gmail.com',
        pass: 'hjca dkco vnyz yuau'.replace(/\s/g, ''), // Remove spaces from app password
      },
    });

    // Send the email
    const mailOptions = {
      from: '"DANI Contact Form" <danielthelober@gmail.com>',
      to: 'danielthelober@gmail.com',
      replyTo: email,
      subject: `[UPLINK] ${subject}`,
      text: `New signal received from the abyss:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Transmitted from jovial-profiterole-8bcff6.netlify.app`,
      html: `
        <div style="font-family: 'JetBrains Mono', monospace; background: #0a0a0f; color: #00f2ff; padding: 20px; border: 1px solid #00f2ff;">
          <h2 style="color: #bc13fe; text-transform: uppercase; letter-spacing: 2px;">📡 NEW UPLINK SIGNAL</h2>
          <hr style="border-color: #00f2ff; margin: 20px 0;">
          <p><strong style="color: #00f2ff;">DESIGNATION:</strong> ${escapeHtml(name)}</p>
          <p><strong style="color: #bc13fe;">FREQUENCY:</strong> ${escapeHtml(email)}</p>
          <p><strong style="color: #ff00de;">SIGNAL TYPE:</strong> ${escapeHtml(subject)}</p>
          <hr style="border-color: #00f2ff; margin: 20px 0;">
          <p><strong style="color: #00f2ff;">PAYLOAD:</strong></p>
          <div style="background: rgba(0,0,0,0.5); padding: 15px; border-left: 3px solid #00f2ff; white-space: pre-wrap;">${escapeHtml(message)}</div>
          <hr style="border-color: #00f2ff; margin: 20px 0;">
          <p style="font-size: 0.8rem; color: #888;">Transmitted from jovial-profiterole-8bcff6.netlify.app</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ success: false, error: 'Failed to transmit signal: ' + error.message }),
    };
  }
};

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
