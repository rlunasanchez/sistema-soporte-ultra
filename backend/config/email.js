export async function enviarEmail(destino, asunto, mensaje) {
  console.log("=== EMAIL (deshabilitado - sin servicio de correo) ===");
  console.log(`Para: ${destino}`);
  console.log(`Asunto: ${asunto}`);
  console.log(`Mensaje: ${mensaje}`);
  console.log("===================================================");
  return false;
}
