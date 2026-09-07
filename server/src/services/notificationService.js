import nodemailer from 'nodemailer';

function hasSmtpConfiguration() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendEmailOtp(destination, code) {
  const transport = createTransport();

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: destination,
    subject: 'Your attendance system OTP',
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
}

export async function sendOtp(destinationType, destinationValue, code) {
  if (destinationType === 'email') {
    if (!destinationValue) {
      throw new Error('Email address is required for email OTP delivery');
    }

    if (hasSmtpConfiguration()) {
      await sendEmailOtp(destinationValue, code);
      return;
    }

    console.log(`[OTP:email] SMTP is not configured. Send ${code} to ${destinationValue}`);
    return;
  }

  if (!destinationValue) {
    throw new Error('Phone number is required for phone OTP delivery');
  }

  console.log(`[OTP:phone] SMS provider is not configured. Send ${code} to ${destinationValue}`);
}