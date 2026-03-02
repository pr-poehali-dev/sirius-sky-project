import { useLang } from "@/context/LanguageContext";

interface Achievement {
  id: number;
  title: string;
  event: string;
  place: string;
  year: number;
  prize: string;
}

interface Props { achievements: Achievement[] }

const PLACE_COLORS: Record<string, string> = {
  "1st": "#ffd700",
  "2nd": "#c0c0c0",
  "3rd": "#cd7f32",
};

export function AchievementsSection({ achievements }: Props) {
  const { t } = useLang();

  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/10" />
          <h2 className="font-mono text-xs tracking-[0.4em] uppercase text-white/40">{t.sections.achievements}</h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="space-y-3">
          {achievements.map((a) => {
            const pc = PLACE_COLORS[a.place] || "#ffa500";
            return (
              <div
                key={a.id}
                className="flex items-center gap-6 bg-[#0f0f0f] border border-white/10 px-6 py-4 hover:border-orange-500/30 transition-colors"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
              >
                <div className="text-center shrink-0 w-14">
                  <div className="text-xl font-black" style={{ fontFamily: "Arial Black", color: pc }}>{a.place}</div>
                  <div className="text-[10px] font-mono text-white/30">{a.year}</div>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex-1 min-w-0">
                  <div className="font-black uppercase text-sm tracking-wide text-white truncate" style={{ fontFamily: "Arial Black" }}>{a.title}</div>
                  <div className="text-xs font-mono text-white/40 mt-0.5">{a.event}</div>
                </div>
                {a.prize && (
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{t.sections.prize}</div>
                    <div className="text-sm font-bold text-orange-400">{a.prize}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
