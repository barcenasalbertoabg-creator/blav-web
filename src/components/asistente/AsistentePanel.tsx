"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { defaultWhatsAppUrl } from "@/lib/whatsapp";
import type { RespuestaAsistente } from "@/app/api/asistente/route";
import type { Tarjeta } from "@/lib/asistente/catalogo";
import type { ContextoPagina } from "./AsistenteLauncher";

const MAX_CARACTERES = 500;
const MAX_TURNOS = 12;
const CLAVE_SESION = "blav-asistente-v1";
const ES_MOVIL = "(max-width: 767px)";

type MensajeUI = {
  rol: "usuario" | "asistente";
  texto: string;
  ids?: string[];
  tarjetas?: Tarjeta[];
  derivar?: boolean;
  whatsappUrl?: string;
};

type Sugerencia = { texto: string; href?: string };

interface Props {
  abierto: boolean;
  onCerrar: (destino?: string) => void;
  contexto: ContextoPagina;
}

function nuevoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function registrarEvento(tipo: "whatsapp_click" | "tarjeta_click") {
  try {
    const body = JSON.stringify({ tipo });
    if (!navigator.sendBeacon?.("/api/asistente/evento", body)) {
      void fetch("/api/asistente/evento", { method: "POST", body, keepalive: true });
    }
  } catch {
    /* la medición nunca debe romper el chat */
  }
}

function bienvenida(contexto: ContextoPagina): { texto: string; sugerencias: Sugerencia[] } {
  const vender = { texto: "Quiero vender mi propiedad", href: "/vende-tu-propiedad" };
  if (contexto?.clase === "propiedad") {
    return {
      texto: "¿Te ayudo con esta propiedad? Puedo mostrarte opciones similares o pasarte con un asesor.",
      sugerencias: [
        { texto: "Quiero agendar una visita" },
        { texto: "Ver opciones similares" },
        { texto: "¿Qué tienen en renta?" },
        vender,
      ],
    };
  }
  if (contexto?.clase === "proyecto") {
    return {
      texto: "¿Te ayudo con este desarrollo? Puedo darte información o mostrarte opciones similares.",
      sugerencias: [
        { texto: "Quiero información de este desarrollo" },
        { texto: "Ver opciones similares" },
        { texto: "Busco casa en venta" },
        vender,
      ],
    };
  }
  return {
    texto: "Hola, soy el asistente de IA de BLAV. Te ayudo a encontrar inmuebles de nuestro inventario.",
    sugerencias: [
      { texto: "¿Qué tienen en renta?" },
      { texto: "Busco casa en venta" },
      { texto: "Locales comerciales" },
      vender,
    ],
  };
}

// Convierte las sugerencias de ficha en una pregunta clara para el modelo.
function textoParaEnviar(s: string): string {
  if (s === "Quiero agendar una visita") return "Quiero agendar una visita de esta propiedad.";
  if (s === "Ver opciones similares") return "Muéstrame opciones similares a esta.";
  return s;
}

// ── Iconos ───────────────────────────────────────────────────
function IconoWhatsApp({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current`} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Tarjeta ──────────────────────────────────────────────────
function TarjetaInmueble({ t, onAbrir }: { t: Tarjeta; onAbrir: (e: React.MouseEvent, url: string) => void }) {
  return (
    <Link
      href={t.url}
      onClick={(e) => onAbrir(e, t.url)}
      className="snap-start shrink-0 w-[200px] bg-white border border-black/10 rounded-lg overflow-hidden hover:border-asis-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-asis-gold"
    >
      <div className="relative h-[100px] bg-asis-crema">
        {t.imagen && (
          <Image src={t.imagen} alt="" fill sizes="200px" className="object-cover" unoptimized />
        )}
      </div>
      <div className="p-2.5 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-asis-gold font-semibold">{t.etiqueta}</p>
        <p className="text-[13px] leading-snug font-medium text-asis-dark line-clamp-2">{t.titulo}</p>
        <p className="text-[13px] font-semibold text-asis-dark">
          {t.precio ?? <span className="font-normal text-black/60 text-xs">Precio por WhatsApp</span>}
        </p>
        {t.zona && <p className="text-[11px] text-black/60 line-clamp-1">{t.zona}</p>}
        {t.specs.length > 0 && <p className="text-[11px] text-black/60">{t.specs.join(" · ")}</p>}
      </div>
    </Link>
  );
}

// ── Panel ────────────────────────────────────────────────────
export default function AsistentePanel({ abierto, onCerrar, contexto }: Props) {
  const [mensajes, setMensajes] = useState<MensajeUI[]>([]);
  const [conversacionId, setConversacionId] = useState<string>("");
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [esMovil, setEsMovil] = useState(false);
  const [viewport, setViewport] = useState<{ alto: number; abajo: number } | null>(null);
  const [arrastre, setArrastre] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inicioArrastre = useRef<number | null>(null);

  const { texto: textoBienvenida, sugerencias } = bienvenida(contexto);
  const turnos = mensajes.filter((m) => m.rol === "usuario").length;
  const limiteAlcanzado = turnos >= MAX_TURNOS;

  // ── Conversación de la visita (sessionStorage) ──
  useEffect(() => {
    try {
      const guardado = JSON.parse(sessionStorage.getItem(CLAVE_SESION) ?? "null");
      if (guardado?.conversacionId && Array.isArray(guardado.mensajes)) {
        setConversacionId(guardado.conversacionId);
        setMensajes(guardado.mensajes);
        return;
      }
    } catch {
      /* sin almacenamiento: la conversación vive solo en memoria */
    }
    setConversacionId(nuevoId());
  }, []);

  useEffect(() => {
    if (!conversacionId) return;
    try {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ conversacionId, mensajes }));
    } catch {
      /* ignorar */
    }
  }, [conversacionId, mensajes]);

  // ── Móvil / escritorio ──
  useEffect(() => {
    const mq = window.matchMedia(ES_MOVIL);
    const actualizar = () => setEsMovil(mq.matches);
    actualizar();
    mq.addEventListener("change", actualizar);
    return () => mq.removeEventListener("change", actualizar);
  }, []);

  // ── Teclado en móvil: ajustar la hoja al área visible (visualViewport) ──
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !abierto) return;
    const actualizar = () => {
      const abajo = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setViewport({ alto: vv.height, abajo });
    };
    actualizar();
    vv.addEventListener("resize", actualizar);
    vv.addEventListener("scroll", actualizar);
    return () => {
      vv.removeEventListener("resize", actualizar);
      vv.removeEventListener("scroll", actualizar);
    };
  }, [abierto]);

  // ── Mantener visible el último mensaje ──
  useLayoutEffect(() => {
    const lista = listaRef.current;
    if (lista) lista.scrollTop = lista.scrollHeight;
  }, [mensajes, cargando, abierto, viewport?.alto]);

  // ── Foco y teclado ──
  useEffect(() => {
    if (!abierto) return;
    // En móvil no se enfoca el input para no abrir el teclado sin que lo pidan.
    if (window.matchMedia(ES_MOVIL).matches) panelRef.current?.focus({ preventScroll: true });
    else inputRef.current?.focus({ preventScroll: true });
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCerrar();
      }
      // En móvil la hoja es modal: el Tab no se escapa a la página.
      if (e.key === "Tab" && esMovil && panelRef.current) {
        const focos = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]'
        );
        if (!focos.length) return;
        const primero = focos[0];
        const ultimo = focos[focos.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto, esMovil, onCerrar]);

  // ── Enviar ──
  const enviar = useCallback(
    async (contenido: string) => {
      const limpio = contenido.trim().slice(0, MAX_CARACTERES);
      if (!limpio || cargando || limiteAlcanzado) return;

      const historial: MensajeUI[] = [...mensajes, { rol: "usuario", texto: limpio }];
      setMensajes(historial);
      setTexto("");
      setCargando(true);

      let nuevo: MensajeUI;
      try {
        const res = await fetch("/api/asistente", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversacionId,
            mensajes: historial.map((m) => ({ rol: m.rol, texto: m.texto, ids: m.ids })),
            contexto: contexto ? { id: contexto.id } : undefined,
          }),
        });
        const data = (await res.json()) as RespuestaAsistente;
        nuevo = {
          rol: "asistente",
          texto: data.respuesta,
          ids: data.ids,
          tarjetas: data.tarjetas,
          derivar: data.derivarWhatsApp,
          whatsappUrl: data.whatsappUrl,
        };
      } catch {
        nuevo = {
          rol: "asistente",
          texto: "Perdón, no pude conectarme. Si quieres, Alberto te atiende directo por WhatsApp.",
          derivar: true,
          whatsappUrl: defaultWhatsAppUrl(),
        };
      }
      setMensajes((prev) => [...prev, nuevo]);
      setCargando(false);
    },
    [cargando, limiteAlcanzado, mensajes, conversacionId, contexto]
  );

  const reiniciar = () => {
    setMensajes([]);
    setConversacionId(nuevoId());
    setTexto("");
  };

  // Tarjetas y enlaces internos: se cierra el panel y se navega (móvil y escritorio).
  // Ctrl/Cmd/Shift/clic medio conservan el comportamiento nativo (nueva pestaña).
  const abrirEnlace = (e: React.MouseEvent, url: string, esTarjeta = false) => {
    if (esTarjeta) registrarEvento("tarjeta_click");
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onCerrar(url);
  };

  // ── Deslizar hacia abajo para cerrar (solo en la cabecera) ──
  const onPointerDown = (e: React.PointerEvent) => {
    if (!esMovil || (e.target as HTMLElement).closest("a,button")) return;
    inicioArrastre.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (inicioArrastre.current === null) return;
    setArrastre(Math.max(0, e.clientY - inicioArrastre.current));
  };
  const onPointerUp = () => {
    if (inicioArrastre.current === null) return;
    inicioArrastre.current = null;
    if (arrastre > 90) onCerrar();
    setArrastre(0);
  };

  const ultimoAsistente = [...mensajes].reverse().find((m) => m.rol === "asistente");
  const waCabecera = ultimoAsistente?.whatsappUrl ?? defaultWhatsAppUrl();

  // Alto de la hoja: ~85% de la pantalla, o el área visible si el teclado está abierto.
  const estiloMovil: React.CSSProperties | undefined =
    esMovil && viewport
      ? {
          height: Math.min(window.innerHeight * 0.85, viewport.alto - 8),
          bottom: viewport.abajo,
          transform: arrastre ? `translateY(${arrastre}px)` : undefined,
          transition: arrastre ? "none" : undefined,
        }
      : undefined;

  return (
    <div hidden={!abierto}>
      {/* Fondo: solo en móvil, para cerrar tocando fuera. En escritorio la página sigue usable. */}
      {esMovil && (
        <div
          aria-hidden="true"
          onClick={() => onCerrar()}
          className="fixed inset-0 z-[55] bg-black/35"
        />
      )}

      <div
        ref={panelRef}
        role="dialog"
        aria-modal={esMovil}
        aria-labelledby="asistente-titulo"
        tabIndex={-1}
        style={estiloMovil}
        className={`fixed z-[56] flex flex-col bg-white font-sans text-asis-dark shadow-2xl outline-none transition-transform duration-200
          inset-x-0 bottom-0 h-[85dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]
          md:inset-x-auto md:right-6 md:bottom-6 md:w-[380px] md:h-[600px] md:max-h-[calc(100dvh-7rem)] md:rounded-2xl md:pb-0 md:border md:border-black/10 md:overflow-hidden`}
      >
        {/* Cabecera */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="shrink-0 bg-asis-dark text-white rounded-t-2xl px-3 pt-2 pb-3 touch-none select-none md:touch-auto md:select-auto"
        >
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/30 md:hidden" aria-hidden="true" />
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/asistente-blav.jpeg"
              alt=""
              width={40}
              height={40}
              sizes="40px"
              draggable={false}
              className="w-10 h-10 shrink-0 rounded-full object-cover object-[50%_30%] ring-2 ring-asis-gold select-none"
            />
            <div className="flex-1 min-w-0">
              <h2 id="asistente-titulo" className="text-[15px] font-semibold leading-tight truncate">
                Asistente IA de BLAV
              </h2>
              <p className="text-[11px] text-white/70 leading-tight truncate">Responde con nuestro inventario</p>
            </div>
            <a
              href={waCabecera}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => registrarEvento("whatsapp_click")}
              className="w-11 h-11 shrink-0 rounded-full bg-whatsapp text-white flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label="WhatsApp directo con un asesor"
              title="WhatsApp directo con un asesor"
            >
              <IconoWhatsApp className="w-6 h-6" />
            </a>
            <button
              type="button"
              onClick={() => onCerrar()}
              aria-label="Cerrar asistente"
              className="w-11 h-11 -mr-1 rounded-full flex items-center justify-center hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div
          ref={listaRef}
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-3 bg-asis-crema"
          aria-live="polite"
          aria-relevant="additions"
        >
          <div className="max-w-[88%] bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[14px] leading-relaxed shadow-sm">
            {textoBienvenida}
          </div>

          {mensajes.length === 0 && (
            <div className="flex flex-wrap gap-2" aria-label="Sugerencias">
              {sugerencias.map((s) =>
                s.href ? (
                  <Link
                    key={s.texto}
                    href={s.href}
                    onClick={(e) => abrirEnlace(e, s.href!)}
                    className="min-h-[40px] px-3.5 py-2 rounded-full border border-asis-gold/60 bg-white text-[13px] text-asis-dark hover:bg-asis-gold hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-asis-gold"
                  >
                    {s.texto}
                  </Link>
                ) : (
                  <button
                    key={s.texto}
                    type="button"
                    onClick={() => void enviar(textoParaEnviar(s.texto))}
                    className="min-h-[40px] px-3.5 py-2 rounded-full border border-asis-gold/60 bg-white text-[13px] text-asis-dark hover:bg-asis-gold hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-asis-gold"
                  >
                    {s.texto}
                  </button>
                )
              )}
            </div>
          )}

          {mensajes.map((m, i) =>
            m.rol === "usuario" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] bg-asis-dark text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                  <span className="sr-only">Tú: </span>
                  {m.texto}
                </p>
              </div>
            ) : (
              <div key={i} className="space-y-2">
                <p className="max-w-[88%] bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[14px] leading-relaxed shadow-sm whitespace-pre-wrap">
                  <span className="sr-only">Asistente: </span>
                  {m.texto}
                </p>
                {m.tarjetas && m.tarjetas.length > 0 && (
                  <div
                    className="-mx-3 px-3 flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none]"
                    aria-label="Inmuebles sugeridos"
                  >
                    {m.tarjetas.map((t) => (
                      <TarjetaInmueble key={t.id} t={t} onAbrir={(e, url) => abrirEnlace(e, url, true)} />
                    ))}
                  </div>
                )}
                {m.derivar && m.whatsappUrl && (
                  <a
                    href={m.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => registrarEvento("whatsapp_click")}
                    className="flex items-center justify-center gap-2 h-11 rounded-full bg-whatsapp text-white text-[14px] font-semibold shadow-sm hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-asis-dark"
                  >
                    <IconoWhatsApp />
                    Continuar por WhatsApp
                  </a>
                )}
              </div>
            )
          )}

          {cargando && (
            <div role="status" className="flex items-center gap-1 bg-white rounded-2xl rounded-tl-sm px-4 py-3 w-fit shadow-sm">
              <span className="sr-only">El asistente está escribiendo…</span>
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full bg-asis-gold motion-safe:animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          )}

          {limiteAlcanzado && !cargando && (
            <div className="text-center text-[13px] text-black/70 space-y-2 pt-1">
              <p>Llegaste al límite de esta conversación. Alberto puede seguir ayudándote por WhatsApp.</p>
              <button type="button" onClick={reiniciar} className="underline underline-offset-2 text-asis-gold min-h-[44px]">
                Empezar una nueva conversación
              </button>
            </div>
          )}
        </div>

        {/* Entrada */}
        <div className="shrink-0 border-t border-black/10 bg-white px-3 pt-2 pb-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void enviar(texto);
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor="asistente-input" className="sr-only">
              Escribe tu pregunta
            </label>
            <input
              ref={inputRef}
              id="asistente-input"
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value.slice(0, MAX_CARACTERES))}
              maxLength={MAX_CARACTERES}
              enterKeyHint="send"
              autoComplete="off"
              disabled={limiteAlcanzado}
              placeholder={limiteAlcanzado ? "Conversación terminada" : "Escribe tu pregunta…"}
              className="flex-1 min-w-0 h-11 rounded-full border border-black/15 bg-asis-crema px-4 text-[16px] text-asis-dark placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-asis-gold disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!texto.trim() || cargando || limiteAlcanzado}
              aria-label="Enviar pregunta"
              className="w-11 h-11 shrink-0 rounded-full bg-asis-dark text-white flex items-center justify-center disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-asis-gold"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
          <div className="flex items-center justify-between gap-2 mt-1.5 px-1">
            <p className="text-[11px] leading-snug text-black/55">
              Asistente de IA. Puede cometer errores; confirma los detalles con un asesor.
            </p>
            {texto.length > MAX_CARACTERES - 100 && (
              <span className="text-[11px] text-black/55 shrink-0" aria-live="polite">
                {texto.length}/{MAX_CARACTERES}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
