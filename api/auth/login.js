import { put, list } from '@vercel/blob';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  try {
    const { blobs } = await list({ prefix: `user-${email.replace('@', '-at-')}` });
    if (blobs.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await put(`verification-${verificationCode}.json`, JSON.stringify({ email, type: 'login', expires: Date.now() + 600000 }), { access: 'public' });

    const transporter = nodemailer.createTransporter({
      host: 'smtp.mailfence.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Minimal Chef - Login Code',
      html: `
        <h2>Login to Minimal Chef</h2>
        <p>Your login code is: <strong>${verificationCode}</strong></p>
        <p>This code expires in 10 minutes.</p>
      `
    });

    res.status(200).json({ message: 'Login code sent' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}