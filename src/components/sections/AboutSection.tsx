import { useLang } from "@/context/LanguageContext";

interface ClubInfo {
  title: string;
  description: string;
  founded: string;
  country: string;
}

interface Props { club: ClubInfo | null }

export function AboutSection({ club }: Props) {
  const { t } = useLang();

  return (
    <section id="about" className="py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/10" />
          <h2 className="font-mono text-xs tracking-[0.4em] uppercase text-white/40">{t.sections.about}</h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div
          className="bg-[#0f0f0f] border border-white/10 p-8 md:p-12 relative overflow-hidden"
          style={{ clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 32px 100%, 0 calc(100% - 32px))" }}
        >
          {/* Декоративный элемент */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <svg viewBox="0 0 100 100" fill="none">
              <g transform="translate(50,50)">
                {[-40,-20,0,20,40].map((r,i) => (
                  <g key={i} transform={`rotate(${r})`}>
                    <rect x="-1" y="-40" width="2" height="30" rx="1" fill="#ff8c00"/>
                    <polygon points="0,-41 -2,-43 0,-50 2,-43" fill="#ff8c00"/>
                  </g>
                ))}
              </g>
            </svg>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 text-white" style={{ fontFamily: "Arial Black" }}>
                {club?.title || "Five Custlass"}
              </h3>
              <p className="text-white/60 font-mono text-sm leading-relaxed">
                {club?.description || "Профессиональная киберспортивная организация по Counter-Strike 2. Пять клинков — одна воля к победе."}
              </p>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-orange-500 pl-4">
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Основана</div>
                <div className="text-white font-black text-xl" style={{ fontFamily: "Arial Black" }}>{club?.founded || "2024"}</div>
              </div>
              <div className="border-l-2 border-orange-500/50 pl-4">
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Страна</div>
                <div className="text-white font-bold font-mono">{club?.country || "International"}</div>
              </div>
              <div className="border-l-2 border-orange-500/30 pl-4">
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Игра</div>
                <div className="text-orange-400 font-black font-mono" style={{ fontFamily: "Arial Black" }}>CS2</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
