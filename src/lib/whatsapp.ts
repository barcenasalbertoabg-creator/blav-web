const PHONE = "524428378891";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

export function projectWhatsAppUrl(projectName: string, customMsg?: string): string {
  const msg = customMsg ?? `Hola Alberto, me interesa información sobre ${projectName}. ¿Pueden asesorarme?`;
  return buildWhatsAppUrl(msg);
}

export function defaultWhatsAppUrl(): string {
  return buildWhatsAppUrl("Hola, vi el sitio de BLAV Bienes Raíces y me gustaría información.");
}

export interface LeadFormData {
  nombre: string;
  telefono: string;
  email?: string;
  proyecto: string;
  tipo: string;
  mensaje?: string;
}

export function leadFormWhatsAppUrl(data: LeadFormData): string {
  const lines = [
    "Hola Alberto, me contacto desde blav.com.mx.",
    `Nombre: ${data.nombre}`,
    `Teléfono: ${data.telefono}`,
    data.email ? `Email: ${data.email}` : null,
    `Proyecto: ${data.proyecto}`,
    `Tipo: ${data.tipo}`,
    data.mensaje ? `Mensaje: ${data.mensaje}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  return buildWhatsAppUrl(lines);
}
