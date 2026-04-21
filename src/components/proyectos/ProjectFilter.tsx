"use client";

interface Props {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export default function ProjectFilter({ categories, active, onChange }: Props) {
  const all = ["Todos", ...categories];

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {all.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`font-sans text-xs tracking-widest uppercase px-5 py-2.5 border transition-colors duration-200 ${
            active === cat
              ? "bg-gold text-white border-gold"
              : "bg-white text-blav-grayMid border-blav-black/20 hover:border-gold hover:text-gold"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
