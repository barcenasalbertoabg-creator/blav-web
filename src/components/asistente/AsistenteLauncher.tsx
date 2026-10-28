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

export default function AsistenteLauncher() {
  const pathname = usePathname();
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [montado, setMontado] = useState(false);
  const botonRef = useRef<HTMLButtonElement>(null);
  const navegacionPendiente = useRef<string | null>(null);
  const abiertoRef = useRef(false);
  abiertoRef.current = abierto;

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
        className={`fixed z-40 right-[28px] bottom-[calc(92px+env(safe-area-inset-bottom))] w-12 h-12 rounded-full bg-asis-dark p-[2px] shadow-lg ring-2 ring-asis-gold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-asis-gold ${
          abierto ? "opacity-0 translate-y-3 scale-90 pointer-events-none" : "opacity-100"
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
          className="absolute -top-1 -left-1 bg-asis-gold text-white text-[9px] font-sans font-semibold leading-none px-1 py-[3px] rounded"
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
