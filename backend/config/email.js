export async function enviarEmail(destino, asunto, mensaje) {
  try {
    // Validar que la API key esté configurada
    if (!process.env.RESEND_API_KEY) {
      console.error("✗ Error: RESEND_API_KEY no está configurada en las variables de entorno");
      return false;
    }

    // Validar email de destino
    if (!destino || !destino.includes('@')) {
      console.error("✗ Error: Email de destino inválido:", destino);
      return false;
    }

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
      const data = await response.json();
      console.log("✓ Email enviado a:", destino, "- ID:", data.id);
      return true;
    } else {
      const errorData = await response.json();
      console.error("✗ Error email (Resend API):", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return false;
    }
  } catch (error) {
    console.error("✗ Error email (fetch):", error.message);
    return false;
  }
}