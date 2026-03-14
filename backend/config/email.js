import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  secure: false,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY
  }
});

export async function enviarEmail(destino, asunto, mensaje) {
  try {
    let info = await transporter.sendMail({
      from: '"Sistema Soporte" <onboarding@resend.dev>',
      to: destino,
      subject: asunto,
      text: mensaje
    });
    console.log("✓ Email enviado a:", destino);
    return true;
  } catch (error) {
    console.error("✗ Error email:", error.message);
    return false;
  }
}