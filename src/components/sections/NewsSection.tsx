import { useLang } from "@/context/LanguageContext";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

interface Props { news: NewsItem[] }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}

export function NewsSection({ news }: Props) {
  const { t } = useLang();

  if (news.length === 0) return null;

  return (
    <section id="news" className="py-20 px-4 md:px-8 bg-[#0d0d0d]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/10" />
          <h2 className="font-mono text-xs tracking-[0.4em] uppercase text-white/40">{t.sections.news}</h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {news.map((n, i) => (
            <div
              key={n.id}
              className={`bg-[#111] border border-white/10 hover:border-orange-500/30 transition-all duration-300 overflow-hidden group ${i === 0 ? "md:col-span-2" : ""}`}
              style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)" }}
            >
              {n.image_url && (
                <div className={`overflow-hidden ${i === 0 ? "h-48" : "h-32"}`}>
                  <img src={n.image_url} alt={n.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5">
                <div className="text-[10px] font-mono text-white/30 mb-2">{formatDate(n.created_at)}</div>
                <h3 className="font-black uppercase text-sm tracking-wide mb-2 text-white line-clamp-2" style={{ fontFamily: "Arial Black" }}>{n.title}</h3>
                <p className="text-white/50 font-mono text-xs leading-relaxed line-clamp-3">{n.content}</p>
                <button className="mt-3 text-[10px] font-mono text-orange-400 hover:text-orange-300 uppercase tracking-widest">
                  {t.sections.readMore} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
