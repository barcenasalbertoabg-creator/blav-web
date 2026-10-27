"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

// El panel (y todo su JS) solo se descarga cuando el visitante lo abre.
const cargarPanel = () => import("./AsistentePanel");
const AsistentePanel = dynamic(cargarPanel, {
  ssr: false,
  loading: () => (
    <div
      role="status"
      aria-label="Cargando asistente"
      className="fixed z-[55] right-[28px] bottom-[calc(92px+env(safe-area-inset-bottom))] w-12 h-12 rounded-full bg-asis-dark flex items-center justify-center"
    >
      <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
    </div>
  ),
});

export type ContextoPagina = { id: string; clase: "propiedad" | "proyecto" } | null;

function contextoDeRuta(pathname: string): ContextoPagina {
  const prop = pathname.match(/^\/propiedades\/([^/]+)\/?$/);
  if (prop) return { id: decodeURIComponent(prop[1]), clase: "propiedad" };
  const proy = pathname.match(/^\/proyectos\/([^/]+)\/?$/);
  if (proy) return { id: `proyecto/${decodeURIComponent(proy[1])}`, clase: "proyecto" };
  return null;
}

const ES_MOVIL = "(max-width: 767px)";

// Marca un contenedor con data-fondo-decorativo para permitir el botón completo sobre su foto.
// Posición completa del botón (coincide con las clases right-[28px] / bottom-[92px]).
const DERECHA = 28;
const ABAJO = 92;
const TAMANO = 48;
const UTIL = "a,button,input,select,textarea,label,[role=button],img,picture,video,iframe,form,nav";

/** ¿El botón, en su posición completa, quedaría encima de un botón, foto, formulario o precio? */
function tapariaAlgo(boton: HTMLElement | null): boolean {
  const izq = window.innerWidth - DERECHA - TAMANO;
  const arriba = window.innerHeight - ABAJO - TAMANO;
  for (const fx of [0.1, 0.5, 0.9]) {
    for (const fy of [0.1, 0.5, 0.9]) {
      for (const el of document.elementsFromPoint(izq + TAMANO * fx, arriba + TAMANO * fy)) {
        if (boton?.contains(el) || el.closest("[data-flotante]")) continue;
        const util = el.closest(UTIL);
        // Las fotos de fondo decorativas (hero) sí se pueden cubrir; las de propiedades no.
        if (util?.matches("img,picture") && util.closest("[data-fondo-decorativo]")) continue;
        if (util) return true;
        if (el.childElementCount === 0 && /\$\s?\d/.test(el.textContent ?? "")) return true;
      }
    }
  }
  return false;
}

export default function AsistenteLauncher() {
  const pathname = usePathname();
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [montado, setMontado] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [replegado, setReplegado] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const navegacionPendiente = useRef<string | null>(null);
  const abiertoRef = useRef(false);
  abiertoRef.current = abierto;

  // ── En scroll hacia abajo se oculta; reaparece al subir o al detenerse.
  //    Al detenerse, si quedaría encima de algo útil, se repliega al borde. ──
  useEffect(() => {
    let ultimoY = window.scrollY;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let timer2: ReturnType<typeof setTimeout> | undefined;
    const revisar = () => setReplegado(tapariaAlgo(botonRef.current));
    const onScroll = () => {
      const y = window.scrollY;
      if (y > ultimoY + 8 && y > 160) setOculto(true);
      else if (y < ultimoY - 8) setOculto(false);
      ultimoY = y;
      clearTimeout(timer);
      clearTimeout(timer2);
      timer = setTimeout(() => {
        revisar();
        setOculto(false);
      }, 700);
      // Las secciones animadas (AnimatedSection) llegan a su lugar después: segunda revisión.
      timer2 = setTimeout(revisar, 1700);
    };
    const inicial = setTimeout(revisar, 800);
    // Imágenes que terminan de cargar mueven el contenido: volver a revisar.
    let pendiente = 0;
    const alCambiarAlto = new ResizeObserver(() => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(revisar);
    });
    alCambiarAlto.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", revisar);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", revisar);
      alCambiarAlto.disconnect();
      cancelAnimationFrame(pendiente);
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(inicial);
    };
  }, [pathname]);

  // ── Botón "atrás" del celular: cierra el panel sin salir de la página ──
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      if (abiertoRef.current && !e.state?.blavAsistente) {
        setAbierto(false);
        const destino = navegacionPendiente.current;
        navegacionPendiente.current = null;
        if (destino) router.push(destino);
        else botonRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [router]);

  const abrir = useCallback(() => {
    setMontado(true);
    setAbierto(true);
    if (window.matchMedia(ES_MOVIL).matches && !window.history.state?.blavAsistente) {
      // Se conserva el estado de Next (__NA, etc.) para que su router no recargue.
      window.history.pushState({ ...window.history.state, blavAsistente: true }, "");
    }
  }, []);

  const cerrar = useCallback((destino?: string) => {
    if (window.history.state?.blavAsistente) {
      navegacionPendiente.current = destino ?? null;
      window.history.back(); // el popstate cierra el panel
      return;
    }
    setAbierto(false);
    if (destino) router.push(destino);
    else botonRef.current?.focus({ preventScroll: true });
  }, [router]);

  if (pathname?.startsWith("/studio")) return null;

  return (
    <>
      <button
        ref={botonRef}
        type="button"
        onClick={abrir}
        onPointerEnter={() => void cargarPanel()}
        onPointerDown={() => void cargarPanel()}
        onFocus={() => void cargarPanel()}
        aria-label="Abrir asistente de IA de BLAV"
        aria-haspopup="dialog"
        aria-expanded={abierto}
        data-flotante
        data-replegado={replegado || undefined}
        className={`fixed z-40 right-[28px] bottom-[calc(92px+env(safe-area-inset-bottom))] w-12 h-12 rounded-full bg-asis-dark p-[2px] shadow-lg ring-2 ring-asis-gold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-asis-gold focus-visible:translate-x-0 ${
          abierto || oculto
            ? "opacity-0 translate-y-3 scale-90 pointer-events-none"
            : replegado
              ? "opacity-100 translate-x-[60px]" // solo asoman 16px: el margen lateral del sitio en móvil (px-4)
              : "opacity-100"
        }`}
      >
        <Image
          src="/images/asistente-blav.jpeg"
          alt=""
          width={44}
          height={44}
          sizes="44px"
          className="w-full h-full rounded-full object-cover object-[50%_30%]"
        />
        <span
          aria-hidden="true"
          className={`${replegado ? "hidden" : ""} absolute -top-1 -left-1 bg-asis-gold text-white text-[9px] font-sans font-semibold leading-none px-1 py-[3px] rounded`}
        >
          IA
        </span>
      </button>

      {montado && (
        <AsistentePanel
          abierto={abierto}
          onCerrar={cerrar}
          contexto={contextoDeRuta(pathname ?? "")}
        />
      )}
    </>
  );
}
