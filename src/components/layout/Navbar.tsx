"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-white"
      } border-b border-gold/20`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-blav.png"
            alt="BLAV Bienes Raíces"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`font-sans text-sm tracking-widest uppercase transition-colors duration-200 ${
                  pathname === href
                    ? "text-gold"
                    : "text-blav-black hover:text-gold"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://wa.me/524428378891?text=Hola%2C%20vi%20el%20sitio%20de%20BLAV%20Bienes%20Ra%C3%ADces%20y%20me%20gustar%C3%ADa%20informaci%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-xs"
            >
              WhatsApp
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <span
            className={`block h-px bg-blav-black transition-all duration-300 ${
              open ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block h-px bg-blav-black transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px bg-blav-black transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-gold/20">
          <ul className="flex flex-col px-6 py-4 gap-4">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`font-sans text-sm tracking-widest uppercase ${
                    pathname === href ? "text-gold" : "text-blav-black"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://wa.me/524428378891?text=Hola%2C%20vi%20el%20sitio%20de%20BLAV%20Bienes%20Ra%C3%ADces%20y%20me%20gustar%C3%ADa%20informaci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
