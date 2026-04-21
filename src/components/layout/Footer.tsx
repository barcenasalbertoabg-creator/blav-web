import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blav-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-display text-2xl font-semibold tracking-widest uppercase text-white">
                BLAV
              </span>
              <br />
              <span className="font-display text-[10px] tracking-[0.25em] text-gold uppercase">
                Bienes Raíces
              </span>
            </div>
            <p className="font-sans text-sm text-white/60 leading-relaxed">
              Soluciones de propiedades en Querétaro y Guanajuato. Residencial,
              comercial, industrial e inversión.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              Navegación
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Inicio" },
                { href: "/proyectos", label: "Proyectos" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/contacto", label: "Contacto" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-gold mb-4">
              Contacto
            </h4>
            <div className="space-y-2">
              <p className="font-sans text-sm text-white/60">Alberto Bárcenas</p>
              <a
                href="tel:4428378891"
                className="block font-sans text-sm text-white/80 hover:text-white transition-colors"
              >
                (442) 837 88 91
              </a>
              <a
                href="https://wa.me/524428378891?text=Hola%2C%20vi%20el%20sitio%20de%20BLAV%20Bienes%20Ra%C3%ADces%20y%20me%20gustar%C3%ADa%20informaci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="block font-sans text-sm text-whatsapp hover:text-white transition-colors"
              >
                WhatsApp →
              </a>
              <p className="font-sans text-xs text-white/40 mt-4">
                Querétaro &amp; Guanajuato, México
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/30">
            © {new Date().getFullYear()} BLAV Bienes Raíces. Todos los derechos reservados.
          </p>
          <p className="font-sans text-xs text-white/30">blav.com.mx</p>
        </div>
      </div>
    </footer>
  );
}
