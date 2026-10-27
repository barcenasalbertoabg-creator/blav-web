import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/../../sanity/env";
import { TIPO_LABEL, OPERACION_LABEL } from "@/types/propiedad";
import type { TipoPropiedad, OperacionPropiedad } from "@/types/propiedad";
import { contieneDinero, quitarDinero } from "./validar";

export const CATALOGO_TAG = "catalogo-asistente";
const REVALIDATE_SEGUNDOS = 300;

// Cliente sin CDN: tras el webhook de Sanity queremos el dato recién publicado,
// no la copia del CDN. Solo se consulta una vez cada 5 min (o al publicar).
const sanity = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: false })
  : null;

const CATALOGO_QUERY = `{
  "propiedades": *[_type == "propiedad" && defined(slug.current)] | order(destacado desc, _createdAt desc) {
    "slug": slug.current,
    titulo, tipo, operacion, estado,
    precio, mostrarPrecio, moneda, notaPrecio,
    superficie, superficieTerreno, recamaras, banos, mediosBanos,
    estacionamientos, niveles, antiguedad,
    amenidades, caracteristicas[]{ label, valor },
    descripcionCorta,
    ubicacion { ciudad, zona, descripcion },
    "proyecto": proyecto->nombre,
    "imagen": coalesce(imagenPortada.urlExterna, imagenPortada.asset->url)
  },
  "proyectos": *[_type == "project" && defined(slug.current)] | order(destacado desc, nombre asc) {
    "slug": slug.current,
    nombre, categoria, estado,
    precioDesde, moneda, notaPrecio,
    descripcionCorta, amenidades,
    "pabellones": pabellones[].nombre,
    ubicacion { ciudad, zona, descripcion },
    "imagen": coalesce(imagenPortada.urlExterna, imagenPortada.asset->url)
  }
}`;

type Ubicacion = { ciudad?: string | null; zona?: string | null; descripcion?: string | null } | null;

type PropiedadRaw = {
  slug: string;
  titulo: string;
  tipo: TipoPropiedad;
  operacion: OperacionPropiedad;
  estado: string;
  precio?: number | null;
  mostrarPrecio?: boolean | null;
  moneda?: string | null;
  notaPrecio?: string | null;
  superficie?: number | null;
  superficieTerreno?: number | null;
  recamaras?: number | null;
  banos?: number | null;
  mediosBanos?: number | null;
  estacionamientos?: number | null;
  niveles?: number | null;
  antiguedad?: string | null;
  amenidades?: string[] | null;
  caracteristicas?: { label?: string | null; valor?: string | null }[] | null;
  descripcionCorta?: string | null;
  ubicacion?: Ubicacion;
  proyecto?: string | null;
  imagen?: string | null;
};

type ProyectoRaw = {
  slug: string;
  nombre: string;
  categoria?: string | null;
  estado: string;
  precioDesde?: number | null;
  moneda?: string | null;
  notaPrecio?: string | null;
  descripcionCorta?: string | null;
  amenidades?: string[] | null;
  pabellones?: (string | null)[] | null;
  ubicacion?: Ubicacion;
  imagen?: string | null;
};

/** Datos que se usan para armar las tarjetas. Vienen de Sanity, nunca del modelo. */
export interface Tarjeta {
  id: string;
  titulo: string;
  url: string;
  imagen: string;
  etiqueta: string; // "Casa · Venta" / "Desarrollo · Comercial"
  precio: string | null; // null si no se publica
  notaPrecio: string;
  zona: string;
  specs: string[];
}

/** Lo que ve el modelo por cada inmueble disponible. */
type ItemModelo = Record<string, unknown> & { ref: string };

export interface Catalogo {
  /** JSON que se pega en el system prompt. */
  textoModelo: string;
  /** Referencia corta que ve el modelo ("P3", "D1") ↔ id real (slug). Los slugs
   *  largos se copian mal; una referencia corta inexistente simplemente se descarta. */
  refAId: Map<string, string>;
  idARef: Map<string, string>;
  /** id → tarjeta, solo inventario disponible. */
  tarjetas: Map<string, Tarjeta>;
  /** id → precio público y operación, para filtrar presupuestos en el servidor. */
  precios: Map<string, { precio: number | null; operacion: string }>;
  /** id → frases de zona normalizadas ("tres cantos", "condominio prato"), para detectar la zona en el servidor. */
  zonas: Map<string, string[]>;
  /** Para validar que un precio oculto no se filtre en el texto. */
  preciosOcultos: number[];
  totalDisponibles: number;
  generado: string;
}

// ── Utilidades ───────────────────────────────────────────────

function limpiarTexto(s?: string | null): string {
  return (s ?? "").replace(/\s+/g, " ").replace(/\s*[–—]\s*/g, " – ").trim();
}

function sinVacios<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined || v === "") continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out as Partial<T>;
}

export function formatearPrecio(precio: number, moneda?: string | null): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda === "USD" ? "USD" : "MXN",
    maximumFractionDigits: 0,
  }).format(precio);
}

function imagenMiniatura(url?: string | null): string {
  if (!url) return "";
  if (url.includes("cdn.sanity.io")) {
    return `${url}${url.includes("?") ? "&" : "?"}w=440&h=280&fit=crop&auto=format&q=70`;
  }
  return url;
}

function zonaTexto(u: Ubicacion): string {
  const zona = limpiarTexto(u?.zona);
  const ciudad = normalizarCiudad(u?.ciudad);
  // Evita "Ciudad Meseta, Meseta" cuando la ciudad ya va dentro de la zona.
  if (!ciudad || zona.toLowerCase().includes(ciudad.toLowerCase()) || ciudad.length > 30) return zona || ciudad;
  return zona ? `${zona}, ${ciudad}` : ciudad;
}

export function normalizarBusqueda(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9ñ ]+/g, " ").replace(/\s+/g, " ").trim();
}

/** "Ciudad Meseta – Condominio Piamonte" → ["ciudad meseta", "meseta", "condominio piamonte", "piamonte"]. */
function frasesZona(u: Ubicacion): string[] {
  const partes = [u?.zona, u?.ciudad]
    .filter((x): x is string => !!x && x.length <= 40)
    .flatMap((x) => x.split(/\s*[–—\-\/,|]\s*/))
    .map(normalizarBusqueda)
    .filter((x) => x.length >= 4);
  const frases = new Set<string>();
  for (const parte of partes) {
    frases.add(parte);
    // Sin prefijos genéricos: "ciudad meseta" → "meseta", "condominio prato" → "prato".
    const sinPrefijo = parte.replace(/^(ciudad|condominio|fraccionamiento|fracc|residencial|privada|col|colonia)\s+/, "");
    if (sinPrefijo.length >= 4) frases.add(sinPrefijo);
  }
  // "queretaro" es demasiado amplio para usarse como zona.
  frases.delete("queretaro");
  return Array.from(frases);
}

/** Normaliza ciudad: "Queretaro" / "Querétaro" / direcciones largas → valor corto. */
function normalizarCiudad(c?: string | null): string {
  const s = limpiarTexto(c);
  if (!s) return "";
  const sinAcentos = s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (sinAcentos.includes("queretaro")) return "Querétaro";
  return s;
}

function specsPropiedad(p: PropiedadRaw): string[] {
  const specs: string[] = [];
  if (p.recamaras) specs.push(`${p.recamaras} rec.`);
  if (p.banos) specs.push(`${p.banos}${p.mediosBanos ? `½` : ""} baños`);
  if (p.superficie) specs.push(`${p.superficie} m² const.`);
  else if (p.superficieTerreno) specs.push(`${p.superficieTerreno} m² terreno`);
  if (p.estacionamientos) specs.push(`${p.estacionamientos} est.`);
  return specs.slice(0, 4);
}

// Campos de "características" que hablan de dinero: no van al modelo.
const LABEL_DINERO = /precio|costo|renta|mantenimiento|cuota|pago|enganche|valor|\$/i;

function caracteristicasSeguras(p: PropiedadRaw): string[] {
  return (p.caracteristicas ?? [])
    .filter((c) => c?.label && c?.valor)
    .filter((c) => !LABEL_DINERO.test(c.label!) && !contieneDinero(c.valor!))
    .map((c) => `${limpiarTexto(c.label)}: ${limpiarTexto(c.valor)}`)
    .slice(0, 8);
}

// ── Construcción ─────────────────────────────────────────────

function construir(propiedades: PropiedadRaw[], proyectos: ProyectoRaw[]): Catalogo {
  const tarjetas = new Map<string, Tarjeta>();
  const precios = new Map<string, { precio: number | null; operacion: string }>();
  const zonasPorId = new Map<string, string[]>();
  const preciosOcultos: number[] = [];
  const refAId = new Map<string, string>();
  const idARef = new Map<string, string>();
  const registrarRef = (prefijo: "P" | "D", id: string) => {
    const ref = `${prefijo}${Array.from(refAId.keys()).filter((r) => r.startsWith(prefijo)).length + 1}`;
    refAId.set(ref, id);
    idARef.set(id, ref);
    return ref;
  };
  const disponibles: ItemModelo[] = [];
  const noDisponibles: { titulo: string; tipo: string; operacion: string; estado: string; zona: string }[] = [];
  const zonas = new Set<string>();
  const ciudades = new Set<string>();
  const tipos = new Set<string>();
  const operaciones = new Set<string>();

  for (const p of propiedades) {
    if (!p.slug || !p.titulo) continue;

    if (p.estado !== "disponible") {
      noDisponibles.push({
        titulo: limpiarTexto(p.titulo),
        tipo: TIPO_LABEL[p.tipo] ?? p.tipo,
        operacion: p.operacion,
        estado: p.estado === "vendido" ? "vendida" : p.estado === "rentado" ? "rentada" : "no disponible",
        zona: zonaTexto(p.ubicacion ?? null),
      });
      continue;
    }

    const precioPublico = p.mostrarPrecio !== false && typeof p.precio === "number" && p.precio > 0;
    if (!precioPublico && typeof p.precio === "number" && p.precio > 0) preciosOcultos.push(p.precio);

    const zona = limpiarTexto(p.ubicacion?.zona);
    const ciudad = normalizarCiudad(p.ubicacion?.ciudad);
    if (zona) zonas.add(zona);
    if (ciudad) ciudades.add(ciudad);
    tipos.add(p.tipo);
    operaciones.add(p.operacion);

    disponibles.push({
      ref: registrarRef("P", p.slug),
      clase: "propiedad",
      ...sinVacios({
        titulo: limpiarTexto(p.titulo),
        tipo: p.tipo,
        operacion: p.operacion,
        // Precio solo si es público. El modelo lo usa para filtrar presupuestos,
        // pero nunca lo escribe: el que ve el visitante sale de la tarjeta.
        precio: precioPublico ? p.precio : null,
        moneda: precioPublico ? p.moneda ?? "MXN" : null,
        precioPublicado: precioPublico,
        m2Construccion: p.superficie,
        m2Terreno: p.superficieTerreno,
        recamaras: p.recamaras,
        banos: p.banos,
        mediosBanos: p.mediosBanos,
        estacionamientos: p.estacionamientos,
        niveles: p.niveles,
        antiguedad: limpiarTexto(p.antiguedad),
        amenidades: p.amenidades ?? [],
        caracteristicas: caracteristicasSeguras(p),
        descripcion: quitarDinero(limpiarTexto(p.descripcionCorta)),
        zona,
        ciudad,
        accesos: quitarDinero(limpiarTexto(p.ubicacion?.descripcion)),
        desarrollo: limpiarTexto(p.proyecto),
      }),
    });

    precios.set(p.slug, { precio: precioPublico ? p.precio! : null, operacion: p.operacion });
    zonasPorId.set(p.slug, frasesZona(p.ubicacion ?? null));
    tarjetas.set(p.slug, {
      id: p.slug,
      titulo: limpiarTexto(p.titulo),
      url: `/propiedades/${p.slug}`,
      imagen: imagenMiniatura(p.imagen),
      etiqueta: `${TIPO_LABEL[p.tipo] ?? p.tipo} · ${OPERACION_LABEL[p.operacion] ?? p.operacion}`,
      precio: precioPublico ? formatearPrecio(p.precio!, p.moneda) : null,
      notaPrecio: limpiarTexto(p.notaPrecio) || "Precio por WhatsApp",
      zona: zonaTexto(p.ubicacion ?? null),
      specs: specsPropiedad(p),
    });
  }

  for (const d of proyectos) {
    if (!d.slug || !d.nombre) continue;
    if (d.estado !== "activo") {
      noDisponibles.push({
        titulo: limpiarTexto(d.nombre),
        tipo: "Desarrollo",
        operacion: limpiarTexto(d.categoria),
        estado: d.estado === "vendido" ? "vendido / rentado" : "próximamente",
        zona: zonaTexto(d.ubicacion ?? null),
      });
      continue;
    }

    const id = `proyecto/${d.slug}`;
    const precioPublico = typeof d.precioDesde === "number" && d.precioDesde > 0;
    const zona = limpiarTexto(d.ubicacion?.zona);
    const ciudad = normalizarCiudad(d.ubicacion?.ciudad);
    if (zona) zonas.add(zona);
    if (ciudad) ciudades.add(ciudad);
    tipos.add(`desarrollo ${limpiarTexto(d.categoria).toLowerCase()}`.trim());

    disponibles.push({
      ref: registrarRef("D", id),
      clase: "desarrollo",
      ...sinVacios({
        nombre: limpiarTexto(d.nombre),
        categoria: limpiarTexto(d.categoria),
        precioDesde: precioPublico ? d.precioDesde : null,
        moneda: precioPublico ? d.moneda ?? "MXN" : null,
        precioPublicado: precioPublico,
        descripcion: quitarDinero(limpiarTexto(d.descripcionCorta)),
        amenidades: d.amenidades ?? [],
        secciones: (d.pabellones ?? []).filter(Boolean).map((s) => limpiarTexto(s)),
        zona,
        ciudad,
        accesos: quitarDinero(limpiarTexto(d.ubicacion?.descripcion)),
      }),
    });

    zonasPorId.set(id, frasesZona(d.ubicacion ?? null));
    precios.set(id, {
      precio: precioPublico ? d.precioDesde! : null,
      operacion: limpiarTexto(d.categoria).toLowerCase() === "preventa" ? "preventa" : "venta",
    });
    tarjetas.set(id, {
      id,
      titulo: limpiarTexto(d.nombre),
      url: `/proyectos/${d.slug}`,
      imagen: imagenMiniatura(d.imagen),
      etiqueta: `Desarrollo · ${limpiarTexto(d.categoria) || "BLAV"}`,
      precio: precioPublico ? `Desde ${formatearPrecio(d.precioDesde!, d.moneda)}` : null,
      notaPrecio: limpiarTexto(d.notaPrecio) || "Precio por WhatsApp",
      zona: zonaTexto(d.ubicacion ?? null),
      specs: [],
    });
  }

  const ordenar = (s: Set<string>) => Array.from(s).sort((a, b) => a.localeCompare(b, "es"));
  const textoModelo = JSON.stringify({
    inventario_disponible: disponibles,
    zonas_existentes: ordenar(zonas),
    ciudades_existentes: ordenar(ciudades),
    tipos_existentes: ordenar(tipos),
    operaciones_existentes: ordenar(operaciones),
    no_disponibles: noDisponibles,
  });

  return {
    textoModelo,
    refAId,
    idARef,
    tarjetas,
    precios,
    zonas: zonasPorId,
    preciosOcultos,
    totalDisponibles: disponibles.length,
    generado: new Date().toISOString(),
  };
}

/**
 * Catálogo para el asistente. Se cachea con el tag CATALOGO_TAG (lo invalida el
 * webhook de Sanity en /api/revalidate) y como respaldo se regenera cada 5 min.
 */
export async function getCatalogoAsistente(): Promise<Catalogo> {
  if (!sanity) return construir([], []);
  const data = await sanity.fetch<{ propiedades: PropiedadRaw[]; proyectos: ProyectoRaw[] }>(
    CATALOGO_QUERY,
    {},
    { next: { revalidate: REVALIDATE_SEGUNDOS, tags: [CATALOGO_TAG] } }
  );
  return construir(data?.propiedades ?? [], data?.proyectos ?? []);
}
