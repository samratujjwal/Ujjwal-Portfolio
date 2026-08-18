import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, message } = req.body as { email?: string; message?: string };

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `Portfolio Contact <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New portfolio message from ${email}`,
      text: message,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Nodemailer error:", error);
    return res.status(500).json({ error: "Failed to send email." });
  }
}
