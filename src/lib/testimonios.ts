import { client } from "@/../../sanity/lib/client";
import { FEATURED_TESTIMONIOS_QUERY } from "@/../../sanity/lib/queries";
import { resolveImageUrl } from "@/../../sanity/lib/image";
import { projectId } from "@/../../sanity/env";

export interface Testimonio {
  nombre: string;
  cargo_o_tipo_operacion: string;
  texto: string;
  calificacion: number;
  foto?: string;
  destacado: boolean;
}

type SanityImageRaw = { urlExterna?: string | null; asset?: { url?: string; _id?: string } | null };
type SanityTestimonioRaw = Omit<Testimonio, "foto"> & { fotoRaw?: SanityImageRaw };

function normalizeTestimonio(raw: SanityTestimonioRaw): Testimonio {
  return {
    ...raw,
    foto: raw.fotoRaw ? resolveImageUrl(raw.fotoRaw) : undefined,
  };
}

const TESTIMONIOS_ESTATICOS: Testimonio[] = [
  {
    nombre: "Mariana López",
    cargo_o_tipo_operacion: "Compradora de casa en Juriquilla",
    texto:
      "Después de meses buscando por mi cuenta, llegué con BLAV y en menos de tres semanas encontré exactamente lo que necesitaba. Alberto entendió desde el principio lo que buscaba y fue muy directo sobre los pros y contras de cada opción. El proceso fue muy ordenado y transparente.",
    calificacion: 5,
    destacado: true,
  },
  {
    nombre: "Ricardo Fernández",
    cargo_o_tipo_operacion: "Inversionista — local comercial en El Marqués",
    texto:
      "Compré un local comercial con la asesoría de BLAV. Lo que más valoro es que nunca me presionaron a cerrar rápido; al contrario, me dieron información real del mercado para tomar la mejor decisión. Transparencia total en todo momento.",
    calificacion: 5,
    destacado: true,
  },
  {
    nombre: "Ana Gutiérrez",
    cargo_o_tipo_operacion: "Renta de departamento en Sonterra",
    texto:
      "Buscaba departamento en Querétaro por trabajo y no conocía bien la ciudad. Con BLAV me orientaron sobre las zonas, me mostraron opciones que encajaban con mi presupuesto y el proceso fue muy sencillo. Muy recomendable para quienes son nuevos en la ciudad.",
    calificacion: 5,
    destacado: true,
  },
  {
    nombre: "Carlos Mendoza",
    cargo_o_tipo_operacion: "Venta de bodega industrial",
    texto:
      "Puse mi bodega en manos de BLAV para venderla y la cerraron en dos meses. La estrategia de comercialización fue efectiva y el acompañamiento durante los trámites notariales fue muy profesional. Sin duda volvería a trabajar con ellos.",
    calificacion: 5,
    destacado: true,
  },
];

export async function getFeaturedTestimonios(): Promise<Testimonio[]> {
  if (!projectId) return TESTIMONIOS_ESTATICOS;
  try {
    const raw: SanityTestimonioRaw[] = await client.fetch(FEATURED_TESTIMONIOS_QUERY);
    if (!raw || raw.length === 0) return TESTIMONIOS_ESTATICOS;
    return raw.map(normalizeTestimonio);
  } catch {
    return TESTIMONIOS_ESTATICOS;
  }
}
