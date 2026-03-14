import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 30000
});

export async function enviarEmail(destino, asunto, mensaje) {
  try {
    let info = await transporter.sendMail({
      from: '"Sistema Soporte" <rodrigo.luna.analista@gmail.com>',
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
