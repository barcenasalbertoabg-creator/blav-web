"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ownerLeadWhatsAppUrl,
  ownerGenericWhatsAppUrl,
  type Operacion,
} from "@/lib/whatsapp";

interface FormData {
  nombre: string;
  telefono: string;
  tipoInmueble: string;
  zona: string;
  operacion: Operacion;
}

const tiposInmueble = ["Casa", "Departamento", "Terreno", "Local", "Oficina", "Bodega"];

const inputClass =
  "w-full border border-blav-black/20 bg-white px-4 py-3 font-sans text-sm text-blav-black placeholder:text-blav-grayMid focus:outline-none focus:border-gold transition-colors";

export default function VenderRentarForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      tipoInmueble: tiposInmueble[0],
      operacion: "Venta",
    },
  });

  const operacion = watch("operacion");
  const [touchedOperacion, setTouchedOperacion] = useState(false);

  function selectOperacion(op: Operacion) {
    setValue("operacion", op);
    setTouchedOperacion(true);
  }

  function onSubmit(data: FormData) {
    const url = ownerLeadWhatsAppUrl(data);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const whatsappAltUrl = ownerGenericWhatsAppUrl(touchedOperacion ? operacion : undefined);

  return (
    <div>
      {/* Selector vender / rentar */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          type="button"
          onClick={() => selectOperacion("Venta")}
          aria-pressed={operacion === "Venta"}
          className={`font-sans text-sm font-medium tracking-wide uppercase px-6 py-4 border transition-colors duration-200 ${
            operacion === "Venta"
              ? "bg-blav-black text-white border-blav-black"
              : "bg-white text-blav-black border-blav-black/20 hover:border-blav-black"
          }`}
        >
          Quiero vender
        </button>
        <button
          type="button"
          onClick={() => selectOperacion("Renta")}
          aria-pressed={operacion === "Renta"}
          className={`font-sans text-sm font-medium tracking-wide uppercase px-6 py-4 border transition-colors duration-200 ${
            operacion === "Renta"
              ? "bg-blav-black text-white border-blav-black"
              : "bg-white text-blav-black border-blav-black/20 hover:border-blav-black"
          }`}
        >
          Quiero rentar
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              {...register("nombre", { required: "Nombre requerido" })}
              placeholder="Nombre completo *"
              className={inputClass}
            />
            {errors.nombre && (
              <p className="text-xs text-red-600 mt-1">{errors.nombre.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("telefono", { required: "Teléfono requerido" })}
              placeholder="Teléfono *"
              type="tel"
              className={inputClass}
            />
            {errors.telefono && (
              <p className="text-xs text-red-600 mt-1">{errors.telefono.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select {...register("tipoInmueble")} className={inputClass}>
            {tiposInmueble.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select {...register("operacion")} className={inputClass}>
            <option value="Venta">Venta</option>
            <option value="Renta">Renta</option>
          </select>
        </div>

        <div>
          <input
            {...register("zona", { required: "Zona/ubicación requerida" })}
            placeholder="Zona/ubicación *"
            className={inputClass}
          />
          {errors.zona && (
            <p className="text-xs text-red-600 mt-1">{errors.zona.message}</p>
          )}
        </div>

        <button type="submit" className="btn-gold w-full justify-center text-sm">
          Enviar por WhatsApp
        </button>

        <p className="font-sans text-xs text-blav-grayMid text-center">
          Al enviar serás redirigido a WhatsApp con tu información pre-llenada.
        </p>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="h-px flex-1 bg-blav-black/10" />
        <span className="font-sans text-xs uppercase tracking-widest text-blav-grayMid">o</span>
        <span className="h-px flex-1 bg-blav-black/10" />
      </div>

      <a
        href={whatsappAltUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-outline-gold w-full justify-center text-sm"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Prefiero escribir por WhatsApp
      </a>
    </div>
  );
}
