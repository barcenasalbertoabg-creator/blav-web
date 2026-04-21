"use client";

import { useEffect } from "react";

interface Props {
  message: string;
  visible: boolean;
  onHide: () => void;
}

export default function Toast({ message, visible, onHide }: Props) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 2500);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 bg-blav-black text-white font-sans text-sm px-5 py-3 shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
