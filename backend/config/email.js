export async function enviarEmail(destino, asunto, mensaje) {
  if (!process.env.RESEND_API_KEY) {
    console.log("=== EMAIL (deshabilitado - sin RESEND_API_KEY) ===");
    console.log(`Para: ${destino}`);
    console.log(`Asunto: ${asunto}`);
    console.log(`Mensaje: ${mensaje}`);
    console.log("=================================================");
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Sistema Soporte <onboarding@resend.dev>',
        to: destino,
        subject: asunto,
        text: mensaje
      })
    });

    if (response.ok) {
      console.log("✓ Email enviado a:", destino);
      return true;
    } else {
      const error = await response.text();
      console.error("✗ Error email:", error);
      return false;
    }
  } catch (error) {
    console.error("✗ Error email:", error.message);
    return false;
  }
}
