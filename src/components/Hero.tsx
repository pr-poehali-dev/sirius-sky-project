import { GL } from "./gl";
import { Pill } from "./Pill";
import { Button } from "./ui/button";
import { useState } from "react";
import { Header } from "./Header";
import { useLang } from "@/context/LanguageContext";

export function Hero() {
  const [hovering, setHovering] = useState(false);
  const { t } = useLang();

  return (
    <div className="flex flex-col h-svh justify-between relative z-10">
      <GL hovering={hovering} />
      <Header />

      {/* Большой фоновый текст команды */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="text-[20vw] font-black uppercase tracking-tighter text-white/[0.03] leading-none"
          style={{ fontFamily: "Arial Black, Arial" }}
        >
          CUSTLASS
        </span>
      </div>

      <div className="pb-16 mt-auto text-center relative">
        <Pill className="mb-6">{t.hero.pill}</Pill>

        {/* Эмблема команды */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center backdrop-blur-sm shadow-[0_0_40px_rgba(255,165,0,0.3)]">
              <svg viewBox="0 0 48 48" className="w-12 h-12 md:w-14 md:h-14" fill="none">
                <g transform="translate(24,26)">
                  {[-28,-14,0,14,28].map((r, i) => (
                    <g key={i} transform={`rotate(${r})`}>
                      <rect x="-1.2" y="-18" width="2.4" height="13" rx="1" fill="#ff8c00" opacity={i === 2 ? 1 : 0.7}/>
                      <polygon points="0,-19 -2,-21.5 0,-25 2,-21.5" fill="#ff8c00" opacity={i === 2 ? 1 : 0.7}/>
                    </g>
                  ))}
                  <circle cx="0" cy="0" r="4" fill="#1a1a1a" stroke="#ff8c00" strokeWidth="1.5"/>
                  <circle cx="0" cy="0" r="1.8" fill="#ff8c00"/>
                </g>
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-full bg-primary/20 blur-md -z-10 animate-pulse" />
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
          {t.hero.title1} <br />
          <i className="font-light text-primary">{t.hero.title2}</i>
        </h1>
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance mt-6 max-w-[440px] mx-auto">
          {t.hero.subtitle}
        </p>

        <a className="contents max-sm:hidden" href="#team">
          <Button
            className="mt-10 border border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary font-mono tracking-widest"
            variant="ghost"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {t.hero.cta}
          </Button>
        </a>
        <a className="contents sm:hidden" href="#team">
          <Button
            size="sm"
            variant="ghost"
            className="mt-10 border border-primary/50 hover:border-primary bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary font-mono tracking-widest"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {t.hero.cta}
          </Button>
        </a>

        {/* Нижняя строка с CS2 бейджем */}
        <div className="flex items-center justify-center gap-3 mt-8 opacity-40">
          <div className="h-px w-12 bg-foreground/40" />
          <span className="font-mono text-xs tracking-[0.3em] uppercase">Counter Strike 2</span>
          <div className="h-px w-12 bg-foreground/40" />
        </div>
      </div>
    </div>
  );
}