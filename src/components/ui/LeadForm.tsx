"use client";

import { useForm } from "react-hook-form";
import { leadFormWhatsAppUrl } from "@/lib/whatsapp";

interface LeadFormProps {
  projects: string[];
  defaultProject?: string;
}

interface FormData {
  nombre: string;
  telefono: string;
  email?: string;
  proyecto: string;
  tipo: string;
  mensaje?: string;
}

const tipos = ["Compra", "Renta", "Inversión", "Información general"];

export default function LeadForm({ projects, defaultProject }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { proyecto: defaultProject ?? projects[0] ?? "", tipo: tipos[0] },
  });

  function onSubmit(data: FormData) {
    const url = leadFormWhatsAppUrl(data);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const inputClass =
    "w-full border border-blav-black/20 bg-white px-4 py-3 font-sans text-sm text-blav-black placeholder:text-blav-grayMid focus:outline-none focus:border-gold transition-colors";

  return (
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

      <input
        {...register("email")}
        placeholder="Correo electrónico (opcional)"
        type="email"
        className={inputClass}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select {...register("proyecto")} className={inputClass}>
          {projects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select {...register("tipo")} className={inputClass}>
          {tipos.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <textarea
        {...register("mensaje")}
        placeholder="Mensaje adicional (opcional)"
        rows={3}
        className={inputClass}
      />

      <button type="submit" className="btn-gold w-full justify-center text-sm">
        Enviar por WhatsApp
      </button>

      <p className="font-sans text-xs text-blav-grayMid text-center">
        Al enviar serás redirigido a WhatsApp con tu información pre-llenada.
      </p>
    </form>
  );
}
