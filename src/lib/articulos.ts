import { client } from "@/../../sanity/lib/client";
import {
  ALL_ARTICULOS_QUERY,
  ARTICULO_BY_SLUG_QUERY,
  ALL_ARTICULO_SLUGS_QUERY,
} from "@/../../sanity/lib/queries";
import { resolveImageUrl } from "@/../../sanity/lib/image";
import { projectId } from "@/../../sanity/env";
import type { Articulo, CategoriaArticulo } from "@/types/articulo";

type SanityImageRaw = { urlExterna?: string | null; asset?: { url?: string; _id?: string } | null };
type SanityArticuloRaw = Omit<Articulo, "imagen_portada" | "seo"> & {
  imagenPortadaRaw: SanityImageRaw;
  seo: Omit<Articulo["seo"], "og_imagen"> & { ogImagenRaw: SanityImageRaw };
};

function normalizeArticulo(raw: SanityArticuloRaw): Articulo {
  return {
    ...raw,
    imagen_portada: resolveImageUrl(raw.imagenPortadaRaw),
    seo: {
      titulo:      raw.seo?.titulo      || raw.titulo,
      descripcion: raw.seo?.descripcion || raw.descripcion_corta,
      og_imagen:   resolveImageUrl(raw.seo?.ogImagenRaw) || resolveImageUrl(raw.imagenPortadaRaw),
    },
  };
}

function isSanityConfigured(): boolean {
  return !!projectId;
}

// ── Artículos de ejemplo (fallback mientras Sanity está vacío) ──────────────

const ARTICULOS_ESTATICOS: Articulo[] = [
  {
    slug: "como-elegir-zona-para-vivir-en-queretaro",
    titulo: "Cómo elegir una zona para vivir en Querétaro",
    categoria: "consejos" as CategoriaArticulo,
    descripcion_corta:
      "Querétaro tiene zonas muy distintas entre sí. Esta guía te ayuda a entender cuál se ajusta mejor a tu estilo de vida, presupuesto y necesidades cotidianas.",
    imagen_portada:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    fecha: "2026-01-15",
    tiempo_lectura: 5,
    seo: {
      titulo: "Cómo elegir una zona para vivir en Querétaro — BLAV",
      descripcion:
        "Guía práctica para entender Juriquilla, El Marqués, Sonterra, Centro y más. Elige la zona correcta según tu presupuesto y estilo de vida.",
      og_imagen: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80",
    },
    contenido: `Querétaro es hoy una de las ciudades con mayor calidad de vida y crecimiento económico en México. Eso tiene un precio: la oferta inmobiliaria es amplia pero también variada, y elegir la zona correcta puede marcar una gran diferencia en tu día a día.

Antes de buscar propiedades, vale la pena hacerse algunas preguntas: ¿cuánto tiempo estás dispuesto a invertir en traslados? ¿Qué tan importante es estar cerca de escuelas o parques? ¿Prefieres un ambiente más urbano o más tranquilo? ¿Cuál es tu presupuesto mensual o de compra?

Juriquilla es quizás la zona más consolidada para familias con poder adquisitivo alto. Cuenta con escuelas privadas de calidad, acceso a la naturaleza, centros comerciales y excelente infraestructura. El precio por metro cuadrado es de los más altos de la ciudad, pero la demanda sigue siendo fuerte, lo que la convierte también en una zona de alta plusvalía.

El Marqués es una de las apuestas más interesantes en este momento. Es un municipio en plena expansión, con desarrollos residenciales bien planeados, cercanía a zonas industriales y precios más accesibles que Juriquilla. Ideal si buscas una propiedad nueva sin estirar demasiado el presupuesto.

Sonterra combina tranquilidad con acceso a servicios. Es una zona familiar bien consolidada, con zonas comerciales cercanas y buena conectividad hacia el corredor industrial. La oferta de casas usadas en Sonterra suele tener buena relación calidad-precio.

El Centro Histórico de Querétaro es Patrimonio de la Humanidad y tiene un mercado inmobiliario muy particular. Las propiedades aquí son ideales para renta turística o para quienes valoran vivir rodeados de arquitectura y cultura. Sin embargo, hay que revisar las restricciones que aplican en zonas protegidas antes de hacer cualquier modificación.

Corregidora es un municipio autónomo que ofrece mucho por su precio. Santa Cruz, El Pueblito y El Salitre son algunas de sus colonias más activas. La ventaja principal es el bajo impuesto predial y la rápida expansión de servicios.

El Libramiento Norponiente es la zona de desarrollo más reciente y de mayor perfil en la ciudad. Proyectos residenciales premium, clubes de golf y una apuesta clara por el segmento de lujo. Si buscas una propiedad de inversión o una residencia de alto nivel, esta zona tiene mucho potencial de plusvalía en los próximos años.

No existe una zona perfecta para todos. La clave es alinear la decisión con tu etapa de vida, tus hábitos cotidianos y tus objetivos financieros. En BLAV te ayudamos a encontrar la opción que realmente se adapta a ti, no solo a mostrarte lo que tenemos disponible.`,
  },
  {
    slug: "que-revisar-antes-de-rentar-una-propiedad",
    titulo: "Qué revisar antes de rentar una propiedad",
    categoria: "renta" as CategoriaArticulo,
    descripcion_corta:
      "Rentar parece sencillo, pero hay detalles clave que muchos inquilinos no revisan y que después se convierten en problemas. Aquí te decimos qué no puedes pasar por alto.",
    imagen_portada:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    fecha: "2026-02-10",
    tiempo_lectura: 4,
    seo: {
      titulo: "Qué revisar antes de rentar una propiedad — BLAV",
      descripcion:
        "Documentos, contrato, depósito, inventario y estado físico. Todo lo que debes revisar antes de firmar un contrato de arrendamiento.",
      og_imagen: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    },
    contenido: `La renta de una propiedad implica más que gustarte el espacio y negociar el precio. Antes de firmar cualquier contrato, hay una serie de elementos que deberías revisar con calma. Detectar un problema antes de rentar te puede ahorrar meses de complicaciones.

La documentación del inmueble es el primer punto. Solicita el predial reciente del dueño para confirmar que está pagado. Si hay adeudos de agua o de mantenimiento en condominio, asegúrate de que estén liquidados antes de que firmes. También es recomendable que el propietario te muestre que el inmueble no tiene juicios activos o hipotecas que pongan en riesgo la ocupación.

El contrato de arrendamiento es el documento más importante. Debe incluir: el precio mensual de renta, la forma y fecha de pago, el monto del depósito en garantía, las condiciones para hacer modificaciones al inmueble, quién paga qué servicios, y las condiciones para la rescisión anticipada. Evita contratos de una sola página; un buen contrato protege tanto al inquilino como al arrendador.

El depósito en garantía normalmente equivale a uno o dos meses de renta. Es importante que el contrato especifique en qué condiciones se devuelve y en cuánto tiempo. Si hay daños preexistentes en el inmueble, documéntalos fotográficamente antes de mudarte para no cargar con ellos al salir.

El inventario es algo que muchos inquilinos pasan por alto. Si la propiedad se renta amueblada o semi-amueblada, pide un inventario firmado de todo lo que está incluido: muebles, electrodomésticos, accesorios de cocina y baño. Esto te protege si hay disputas al momento de entregar.

Revisa el estado físico del inmueble con detalle: humedad en paredes o techo, funcionamiento del drenaje, estado de las instalaciones eléctricas e hidráulicas, ventanas y cerraduras, y el funcionamiento de todos los aparatos incluidos. Si algo no funciona bien, pide que lo corrijan antes de firmar o que lo descuenten del precio.

Pregunta también sobre el nivel de ruido en la zona y la seguridad del fraccionamiento o edificio. Esto es difícil de evaluar en una sola visita, pero puedes intentar hacer una visita en distintos horarios del día.

Con una revisión cuidadosa antes de firmar, la mayoría de los problemas comunes en arrendamiento se pueden evitar. En BLAV te acompañamos en todo el proceso: desde la búsqueda hasta la firma del contrato.`,
  },
  {
    slug: "como-evaluar-una-propiedad-de-inversion",
    titulo: "Cómo evaluar una propiedad de inversión",
    categoria: "inversion" as CategoriaArticulo,
    descripcion_corta:
      "No todas las propiedades son buenas inversiones. Estos indicadores clave te ayudan a decidir si el negocio tiene sentido en números y en contexto de mercado.",
    imagen_portada:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    fecha: "2026-03-05",
    tiempo_lectura: 6,
    seo: {
      titulo: "Cómo evaluar una propiedad de inversión — BLAV",
      descripcion:
        "Cap rate, plusvalía, flujo de caja y aspectos legales. Todo lo que necesitas analizar antes de comprar una propiedad como inversión.",
      og_imagen: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    },
    contenido: `Invertir en bienes raíces sigue siendo una de las formas más sólidas de preservar y hacer crecer el capital en México. Pero no toda propiedad es automáticamente una buena inversión. Antes de decidir, es indispensable analizar varios factores con frialdad, más allá de si el inmueble te gusta estéticamente.

El primero y más importante es la ubicación. En bienes raíces, la plusvalía —el incremento de valor en el tiempo— está directamente ligada a la zona. Áreas con crecimiento de infraestructura, nuevos desarrollos comerciales o mejoras en conectividad tienden a subir de valor. En Querétaro, zonas como el Libramiento Norponiente, El Marqués y Juriquilla han mostrado tasas de crecimiento sostenidas en los últimos años.

El rendimiento por renta es la métrica más clara para evaluar una inversión que generará flujo mensual. Se calcula dividiendo la renta mensual anualizada entre el precio de compra. Un inmueble que se compra en 3 millones y renta en 18,000 pesos mensuales genera un rendimiento bruto del 7.2% anual. En zonas de alta demanda de renta —cerca de hospitales, universidades o parques industriales— este indicador suele ser más alto.

El flujo de caja neto es lo que queda después de pagar mantenimiento, predial, seguros y posibles períodos de vacancia. Un error común es proyectar el rendimiento sin considerar estos gastos. Para propiedades en condominio, el mantenimiento puede ser significativo y debe incluirse en el análisis.

El tipo de propiedad importa. Los locales comerciales y bodegas industriales suelen tener contratos de arrendamiento más largos y estables que las residenciales, pero también requieren un inquilino más específico. Las propiedades residenciales cerca de zonas de alta demanda tienen menor vacancia y son más fáciles de administrar.

Si planeas apalancar la compra con crédito hipotecario, analiza si el flujo de renta cubre al menos la mensualidad del crédito. Un negocio donde el inquilino paga prácticamente el crédito mientras tú acumulas patrimonio es uno de los esquemas más eficientes en el largo plazo.

Los aspectos legales son no negociables. Verifica que el inmueble esté correctamente escriturado, que no tenga gravámenes y que esté al corriente en todos sus pagos. Una propiedad con problemas jurídicos puede convertirse en una fuente de gastos que anulen cualquier rendimiento.

Finalmente, considera tu horizonte de inversión. Si buscas liquidez a corto plazo, bienes raíces puede no ser el vehículo ideal. Pero si tienes un horizonte de 5 años o más, la combinación de plusvalía y rendimiento por renta puede ser muy difícil de igualar con otros instrumentos.

En BLAV analizamos contigo cada oportunidad con información real de mercado. No te vamos a decir que todo es buen negocio; te ayudamos a identificar las opciones que sí lo son.`,
  },
];

export async function getAllArticulos(): Promise<Articulo[]> {
  if (!isSanityConfigured()) return ARTICULOS_ESTATICOS;
  try {
    const raw: SanityArticuloRaw[] = await client.fetch(ALL_ARTICULOS_QUERY);
    if (!raw || raw.length === 0) return ARTICULOS_ESTATICOS;
    return raw.map(normalizeArticulo);
  } catch {
    return ARTICULOS_ESTATICOS;
  }
}

export async function getArticuloBySlug(slug: string): Promise<Articulo | null> {
  const estatico = ARTICULOS_ESTATICOS.find((a) => a.slug === slug);
  if (!isSanityConfigured()) return estatico ?? null;
  try {
    const raw: SanityArticuloRaw | null = await client.fetch(ARTICULO_BY_SLUG_QUERY, { slug });
    if (!raw) return estatico ?? null;
    return normalizeArticulo(raw);
  } catch {
    return estatico ?? null;
  }
}

export async function getArticuloSlugs(): Promise<string[]> {
  const staticSlugs = ARTICULOS_ESTATICOS.map((a) => a.slug);
  if (!isSanityConfigured()) return staticSlugs;
  try {
    const slugs: (string | null)[] = await client.fetch(ALL_ARTICULO_SLUGS_QUERY);
    const sanitySlugs = (slugs ?? []).filter((s): s is string => !!s);
    return sanitySlugs.length > 0 ? sanitySlugs : staticSlugs;
  } catch {
    return staticSlugs;
  }
}
