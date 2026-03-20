import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 25,
  secure: false,
  auth: {
    user: "rodrigo.luna.analista@gmail.com",
    pass: "bajeyijjqtebzfeo"
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
