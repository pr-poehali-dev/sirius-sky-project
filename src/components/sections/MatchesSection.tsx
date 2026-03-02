import { useLang } from "@/context/LanguageContext";

interface Match {
  id: number;
  opponent: string;
  event: string;
  match_date: string | null;
  score_us: number | null;
  score_them: number | null;
  map: string;
  result: string;
  stream_url: string;
}

interface Props { matches: Match[] }

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function MatchesSection({ matches }: Props) {
  const { t } = useLang();

  return (
    <section id="matches" className="py-20 px-4 md:px-8 bg-[#0d0d0d]">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/10" />
          <h2 className="font-mono text-xs tracking-[0.4em] uppercase text-white/40">{t.sections.matches}</h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16 border border-white/10" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
            <div className="text-4xl mb-4 opacity-20">⚔</div>
            <p className="font-mono text-white/40 uppercase tracking-widest text-xs">{t.sections.matchesEmpty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-4 bg-[#111] border border-white/10 px-6 py-4 hover:border-orange-500/30 transition-colors"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 tracking-widest"
                      style={{
                        background: m.result === "upcoming" ? "#ffa50022" : m.result === "win" ? "#66bb6a22" : "#ef535022",
                        color: m.result === "upcoming" ? "#ffa500" : m.result === "win" ? "#66bb6a" : "#ef5350",
                        border: `1px solid ${m.result === "upcoming" ? "#ffa50055" : m.result === "win" ? "#66bb6a55" : "#ef535055"}`,
                      }}
                    >
                      {m.result === "upcoming" ? t.sections.upcoming : t.sections.played}
                    </span>
                    <span className="text-[10px] text-white/30 font-mono">{m.event}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase text-white" style={{ fontFamily: "Arial Black" }}>FIVE CUSTLASS</span>
                    {m.result !== "upcoming" && m.score_us !== null && (
                      <span className="text-xs font-mono text-white/60">{m.score_us} : {m.score_them}</span>
                    )}
                    <span className="text-white/40 text-xs">vs</span>
                    <span className="text-xs font-black uppercase text-white/80" style={{ fontFamily: "Arial Black" }}>{m.opponent}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-white/40 font-mono">{formatDate(m.match_date)}</div>
                  {m.map && <div className="text-[10px] text-white/30 font-mono mt-1">{m.map}</div>}
                  {m.stream_url && (
                    <a href={m.stream_url} target="_blank" rel="noreferrer" className="text-[10px] text-orange-400 font-mono hover:text-orange-300 mt-1 block">▶ Stream</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
