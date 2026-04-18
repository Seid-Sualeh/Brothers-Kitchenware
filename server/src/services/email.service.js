const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

async function sendEmail({ to, subject, text, html }) {
  const tx = getTransporter();
  if (!tx) {
    // Fallback for local dev
    console.log("[email:fallback]", { to, subject, text });
    return { sent: false, mode: "fallback" };
  }
  const info = await tx.sendMail({
    from: process.env.MAIL_FROM || "no-reply@brotherskitchenware.com",
    to,
    subject,
    text,
    html,
  });
  return { sent: true, messageId: info.messageId };
}

async function sendOrderProcessingEmail({ to, name, orderId, total }) {
  return sendEmail({
    to,
    subject: `Order #${orderId} is processing`,
    text: `Hi ${name || "there"}, your order #${orderId} for $${Number(total).toFixed(2)} is processing. We will notify you once payment is confirmed.`,
  });
}

async function sendOrderCompletedEmail({ to, name, orderId }) {
  return sendEmail({
    to,
    subject: `Order #${orderId} completed`,
    text: `Hi ${name || "there"}, thank you! Your payment for order #${orderId} has been confirmed and the order is now completed.`,
  });
}

async function sendMarketingEmail({ to, subject, text }) {
  return sendEmail({ to, subject, text });
}

module.exports = {
  sendEmail,
  sendOrderProcessingEmail,
  sendOrderCompletedEmail,
  sendMarketingEmail,
};