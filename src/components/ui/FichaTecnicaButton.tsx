"use client";

import { useState } from "react";

interface Props {
  tipo: "propiedad" | "proyecto";
  slug: string;
}

export default function FichaTecnicaButton({ tipo, slug }: Props) {
  const [incluirContacto, setIncluirContacto] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/ficha-tecnica/${tipo}/${slug}?contacto=${incluirContacto}&_t=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo generar el PDF");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `ficha-tecnica-${slug}.pdf`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError("Error al generar el PDF. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={incluirContacto}
          onChange={(e) => setIncluirContacto(e.target.checked)}
          className="w-4 h-4 accent-gold"
        />
        <span className="font-sans text-sm text-blav-grayMid">
          Incluir datos de contacto del asesor
        </span>
      </label>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="btn-outline-gold inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generando PDF...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 18v-2h8v2H8zm0-4v-2h8v2H8zm0-4V8h4v2H8z" />
            </svg>
            Descargar ficha técnica (PDF)
          </>
        )}
      </button>

      {error && (
        <p className="font-sans text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
