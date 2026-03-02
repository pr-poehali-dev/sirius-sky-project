import { useState, useEffect } from "react";
import { api, isAdminLoggedIn, adminLogin, adminLogout } from "@/lib/api";

type Tab = "players" | "matches" | "news" | "achievements" | "club";

interface Player { id: number; nickname: string; real_name: string; role: string; country: string; hltv_rating: number; kills_per_round: number; headshot_pct: number; maps_played: number; photo_url: string; bio: string; active: boolean; sort_order: number }
interface Match { id: number; opponent: string; event: string; match_date: string; score_us: number | null; score_them: number | null; map: string; result: string; stream_url: string }
interface NewsItem { id: number; title: string; content: string; image_url: string; published: boolean }
interface Achievement { id: number; title: string; event: string; place: string; year: number; prize: string }
interface ClubInfo { title: string; description: string; founded: string; country: string }

const ROLES = ["StarPlayer", "IGL", "Rifler", "Support", "AWPer"];
const RESULTS = ["upcoming", "win", "loss", "draw"];

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [token, setToken] = useState("");
  const [err, setErr] = useState("");

  const handle = async () => {
    adminLogin(token);
    const res = await api.getClub();
    if (res.error === "Forbidden" || res.errorMessage) {
      adminLogout();
      setErr("Неверный токен");
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0602] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/15 p-8 w-full max-w-sm" style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}>
        <div className="text-center mb-6">
          <div className="text-2xl font-black uppercase tracking-wider mb-1" style={{ fontFamily: "Arial Black" }}>FIVE CUSTLASS</div>
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest">Admin Panel</div>
        </div>
        <input
          type="password"
          placeholder="Токен администратора"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handle()}
          className="w-full bg-white/5 border border-white/15 rounded px-4 py-3 text-white font-mono text-sm mb-3 outline-none focus:border-orange-500/50"
        />
        {err && <p className="text-red-400 text-xs font-mono mb-3">{err}</p>}
        <button onClick={handle} className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-widest py-3 text-sm transition-colors" style={{ fontFamily: "Arial Black" }}>
          Войти
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", rows }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{label}</label>
      {rows ? (
        <textarea rows={rows} value={String(value)} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded px-3 py-2 text-white font-mono text-sm outline-none focus:border-orange-500/50 resize-none" />
      ) : (
        <input type={type} value={String(value)} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded px-3 py-2 text-white font-mono text-sm outline-none focus:border-orange-500/50" />
      )}
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#1a1a1a] border border-white/15 rounded px-3 py-2 text-white font-mono text-sm outline-none focus:border-orange-500/50">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function PlayersTab() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editing, setEditing] = useState<Partial<Player> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const r = await api.getPlayers(); setPlayers(r); setLoading(false); };
  useEffect(() => { load(); }, []);

  const blank: Partial<Player> = { nickname: "", real_name: "", role: "Rifler", country: "UA", hltv_rating: 1.0, kills_per_round: 0.70, headshot_pct: 45, maps_played: 0, photo_url: "", bio: "", active: true, sort_order: 0 };

  const save = async () => {
    if (!editing) return;
    if (editing.id) await api.updatePlayer(editing.id, editing);
    else await api.createPlayer(editing);
    setEditing(null);
    load();
  };

  const del = async (id: number) => {
    if (!confirm("Удалить игрока?")) return;
    await api.deletePlayer(id);
    load();
  };

  if (loading) return <div className="text-white/40 font-mono text-sm p-8 text-center">Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black uppercase tracking-widest text-sm" style={{ fontFamily: "Arial Black" }}>Игроки ({players.length})</h3>
        <button onClick={() => setEditing(blank)} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-4 py-2 uppercase tracking-widest transition-colors">+ Добавить</button>
      </div>

      {editing && (
        <div className="bg-[#0f0f0f] border border-orange-500/30 p-6 mb-6 rounded grid grid-cols-2 gap-4">
          <Field label="Никнейм" value={editing.nickname || ""} onChange={(v) => setEditing({ ...editing, nickname: v })} />
          <Field label="Реальное имя" value={editing.real_name || ""} onChange={(v) => setEditing({ ...editing, real_name: v })} />
          <Select label="Роль" value={editing.role || "Rifler"} options={ROLES} onChange={(v) => setEditing({ ...editing, role: v })} />
          <Field label="Страна" value={editing.country || ""} onChange={(v) => setEditing({ ...editing, country: v })} />
          <Field label="HLTV Rating" type="number" value={editing.hltv_rating || 1.0} onChange={(v) => setEditing({ ...editing, hltv_rating: parseFloat(v) })} />
          <Field label="K/R" type="number" value={editing.kills_per_round || 0.7} onChange={(v) => setEditing({ ...editing, kills_per_round: parseFloat(v) })} />
          <Field label="HS%" type="number" value={editing.headshot_pct || 45} onChange={(v) => setEditing({ ...editing, headshot_pct: parseInt(v) })} />
          <Field label="Карт сыграно" type="number" value={editing.maps_played || 0} onChange={(v) => setEditing({ ...editing, maps_played: parseInt(v) })} />
          <div className="col-span-2">
            <Field label="URL фото" value={editing.photo_url || ""} onChange={(v) => setEditing({ ...editing, photo_url: v })} />
          </div>
          <div className="col-span-2">
            <Field label="Биография" value={editing.bio || ""} onChange={(v) => setEditing({ ...editing, bio: v })} rows={3} />
          </div>
          <div className="col-span-2 flex gap-3">
            <button onClick={save} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-6 py-2 uppercase tracking-widest transition-colors">Сохранить</button>
            <button onClick={() => setEditing(null)} className="border border-white/20 hover:border-white/40 text-white/60 font-mono text-xs px-4 py-2 uppercase tracking-widest transition-colors">Отмена</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {players.map((p) => (
          <div key={p.id} className="flex items-center gap-4 bg-[#111] border border-white/10 px-5 py-3">
            <div className="flex-1">
              <span className="font-black uppercase text-sm mr-2" style={{ fontFamily: "Arial Black" }}>{p.nickname}</span>
              <span className="text-xs text-white/40 font-mono">{p.role} · {p.country}</span>
            </div>
            <span className="text-orange-400 font-mono text-sm font-bold">{Number(p.hltv_rating).toFixed(2)}</span>
            <button onClick={() => setEditing({ ...p })} className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest px-3 py-1 border border-white/10 hover:border-white/30 transition-colors">Изменить</button>
            <button onClick={() => del(p.id)} className="text-[10px] font-mono text-red-400/60 hover:text-red-400 uppercase tracking-widest px-3 py-1 border border-red-400/10 hover:border-red-400/30 transition-colors">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchesTab() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [editing, setEditing] = useState<Partial<Match> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const r = await api.getMatches(); setMatches(r); setLoading(false); };
  useEffect(() => { load(); }, []);

  const blank: Partial<Match> = { opponent: "", event: "", match_date: "", score_us: null, score_them: null, map: "", result: "upcoming", stream_url: "" };

  const save = async () => {
    if (!editing) return;
    if (editing.id) await api.updateMatch(editing.id, editing);
    else await api.createMatch(editing);
    setEditing(null); load();
  };

  const del = async (id: number) => {
    if (!confirm("Удалить матч?")) return;
    await api.deleteMatch(id); load();
  };

  if (loading) return <div className="text-white/40 font-mono text-sm p-8 text-center">Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black uppercase tracking-widest text-sm" style={{ fontFamily: "Arial Black" }}>Матчи ({matches.length})</h3>
        <button onClick={() => setEditing(blank)} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-4 py-2 uppercase tracking-widest transition-colors">+ Добавить</button>
      </div>

      {editing && (
        <div className="bg-[#0f0f0f] border border-orange-500/30 p-6 mb-6 rounded grid grid-cols-2 gap-4">
          <Field label="Соперник" value={editing.opponent || ""} onChange={(v) => setEditing({ ...editing, opponent: v })} />
          <Field label="Турнир" value={editing.event || ""} onChange={(v) => setEditing({ ...editing, event: v })} />
          <Field label="Дата и время" type="datetime-local" value={editing.match_date || ""} onChange={(v) => setEditing({ ...editing, match_date: v })} />
          <Field label="Карта" value={editing.map || ""} onChange={(v) => setEditing({ ...editing, map: v })} />
          <Select label="Результат" value={editing.result || "upcoming"} options={RESULTS} onChange={(v) => setEditing({ ...editing, result: v })} />
          <Field label="Ссылка на стрим" value={editing.stream_url || ""} onChange={(v) => setEditing({ ...editing, stream_url: v })} />
          <Field label="Счёт (мы)" type="number" value={editing.score_us ?? ""} onChange={(v) => setEditing({ ...editing, score_us: v ? parseInt(v) : null })} />
          <Field label="Счёт (они)" type="number" value={editing.score_them ?? ""} onChange={(v) => setEditing({ ...editing, score_them: v ? parseInt(v) : null })} />
          <div className="col-span-2 flex gap-3">
            <button onClick={save} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-6 py-2 uppercase tracking-widest transition-colors">Сохранить</button>
            <button onClick={() => setEditing(null)} className="border border-white/20 text-white/60 font-mono text-xs px-4 py-2 uppercase tracking-widest">Отмена</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {matches.length === 0 && <p className="text-white/30 font-mono text-xs text-center py-8">Матчи не добавлены</p>}
        {matches.map((m) => (
          <div key={m.id} className="flex items-center gap-4 bg-[#111] border border-white/10 px-5 py-3">
            <div className="flex-1">
              <span className="font-black uppercase text-sm mr-2" style={{ fontFamily: "Arial Black" }}>vs {m.opponent}</span>
              <span className="text-xs text-white/40 font-mono">{m.event} · {m.result}</span>
            </div>
            <button onClick={() => setEditing({ ...m })} className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest px-3 py-1 border border-white/10 hover:border-white/30 transition-colors">Изменить</button>
            <button onClick={() => del(m.id)} className="text-[10px] font-mono text-red-400/60 hover:text-red-400 uppercase tracking-widest px-3 py-1 border border-red-400/10 hover:border-red-400/30 transition-colors">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsTab() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<Partial<NewsItem> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const r = await api.getNews(); setNews(r); setLoading(false); };
  useEffect(() => { load(); }, []);

  const blank: Partial<NewsItem> = { title: "", content: "", image_url: "", published: true };

  const save = async () => {
    if (!editing) return;
    if (editing.id) await api.updateNews(editing.id, editing);
    else await api.createNews(editing);
    setEditing(null); load();
  };

  const del = async (id: number) => {
    if (!confirm("Удалить новость?")) return;
    await api.deleteNews(id); load();
  };

  if (loading) return <div className="text-white/40 font-mono text-sm p-8 text-center">Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black uppercase tracking-widest text-sm" style={{ fontFamily: "Arial Black" }}>Новости ({news.length})</h3>
        <button onClick={() => setEditing(blank)} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-4 py-2 uppercase tracking-widest transition-colors">+ Добавить</button>
      </div>

      {editing && (
        <div className="bg-[#0f0f0f] border border-orange-500/30 p-6 mb-6 rounded grid gap-4">
          <Field label="Заголовок" value={editing.title || ""} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="URL изображения" value={editing.image_url || ""} onChange={(v) => setEditing({ ...editing, image_url: v })} />
          <Field label="Текст новости" value={editing.content || ""} onChange={(v) => setEditing({ ...editing, content: v })} rows={5} />
          <div className="flex gap-3">
            <button onClick={save} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-6 py-2 uppercase tracking-widest transition-colors">Сохранить</button>
            <button onClick={() => setEditing(null)} className="border border-white/20 text-white/60 font-mono text-xs px-4 py-2 uppercase tracking-widest">Отмена</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {news.length === 0 && <p className="text-white/30 font-mono text-xs text-center py-8">Новости не добавлены</p>}
        {news.map((n) => (
          <div key={n.id} className="flex items-center gap-4 bg-[#111] border border-white/10 px-5 py-3">
            <div className="flex-1 font-mono text-sm text-white/80 truncate">{n.title}</div>
            <button onClick={() => setEditing({ ...n })} className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest px-3 py-1 border border-white/10 hover:border-white/30 transition-colors">Изменить</button>
            <button onClick={() => del(n.id)} className="text-[10px] font-mono text-red-400/60 hover:text-red-400 uppercase tracking-widest px-3 py-1 border border-red-400/10 hover:border-red-400/30 transition-colors">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsTab() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [editing, setEditing] = useState<Partial<Achievement> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); const r = await api.getAchievements(); setItems(r); setLoading(false); };
  useEffect(() => { load(); }, []);

  const blank: Partial<Achievement> = { title: "", event: "", place: "1st", year: new Date().getFullYear(), prize: "" };

  const save = async () => {
    if (!editing) return;
    if (editing.id) await api.updateAchievement(editing.id, editing);
    else await api.createAchievement(editing);
    setEditing(null); load();
  };

  const del = async (id: number) => {
    if (!confirm("Удалить достижение?")) return;
    await api.deleteAchievement(id); load();
  };

  if (loading) return <div className="text-white/40 font-mono text-sm p-8 text-center">Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black uppercase tracking-widest text-sm" style={{ fontFamily: "Arial Black" }}>Достижения ({items.length})</h3>
        <button onClick={() => setEditing(blank)} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-4 py-2 uppercase tracking-widest transition-colors">+ Добавить</button>
      </div>

      {editing && (
        <div className="bg-[#0f0f0f] border border-orange-500/30 p-6 mb-6 rounded grid grid-cols-2 gap-4">
          <Field label="Название" value={editing.title || ""} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="Турнир" value={editing.event || ""} onChange={(v) => setEditing({ ...editing, event: v })} />
          <Field label="Место (1st / 2nd / Top 8 ...)" value={editing.place || ""} onChange={(v) => setEditing({ ...editing, place: v })} />
          <Field label="Год" type="number" value={editing.year || 2024} onChange={(v) => setEditing({ ...editing, year: parseInt(v) })} />
          <div className="col-span-2">
            <Field label="Призовые" value={editing.prize || ""} onChange={(v) => setEditing({ ...editing, prize: v })} />
          </div>
          <div className="col-span-2 flex gap-3">
            <button onClick={save} className="bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs px-6 py-2 uppercase tracking-widest transition-colors">Сохранить</button>
            <button onClick={() => setEditing(null)} className="border border-white/20 text-white/60 font-mono text-xs px-4 py-2 uppercase tracking-widest">Отмена</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && <p className="text-white/30 font-mono text-xs text-center py-8">Достижения не добавлены</p>}
        {items.map((a) => (
          <div key={a.id} className="flex items-center gap-4 bg-[#111] border border-white/10 px-5 py-3">
            <span className="font-black text-orange-400 text-sm w-8" style={{ fontFamily: "Arial Black" }}>{a.place}</span>
            <div className="flex-1 font-mono text-sm text-white/80 truncate">{a.title} · {a.event} · {a.year}</div>
            <button onClick={() => setEditing({ ...a })} className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-widest px-3 py-1 border border-white/10 hover:border-white/30 transition-colors">Изменить</button>
            <button onClick={() => del(a.id)} className="text-[10px] font-mono text-red-400/60 hover:text-red-400 uppercase tracking-widest px-3 py-1 border border-red-400/10 hover:border-red-400/30 transition-colors">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClubTab() {
  const [club, setClub] = useState<ClubInfo>({ title: "", description: "", founded: "", country: "" });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getClub().then((r) => { if (r.title) setClub(r); setLoading(false); });
  }, []);

  const save = async () => {
    await api.updateClub(club);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-white/40 font-mono text-sm p-8 text-center">Загрузка...</div>;

  return (
    <div>
      <h3 className="font-black uppercase tracking-widest text-sm mb-6" style={{ fontFamily: "Arial Black" }}>О клубе</h3>
      <div className="bg-[#0f0f0f] border border-white/10 p-6 rounded grid gap-4">
        <Field label="Название команды" value={club.title} onChange={(v) => setClub({ ...club, title: v })} />
        <Field label="Описание" value={club.description} onChange={(v) => setClub({ ...club, description: v })} rows={4} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Год основания" value={club.founded} onChange={(v) => setClub({ ...club, founded: v })} />
          <Field label="Страна" value={club.country} onChange={(v) => setClub({ ...club, country: v })} />
        </div>
        <button onClick={save} className={`${saved ? "bg-green-500" : "bg-orange-500 hover:bg-orange-400"} text-black font-bold text-xs px-6 py-3 uppercase tracking-widest transition-colors`}>
          {saved ? "✓ Сохранено!" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: "players", label: "Игроки" },
  { id: "matches", label: "Матчи" },
  { id: "news", label: "Новости" },
  { id: "achievements", label: "Достижения" },
  { id: "club", label: "О клубе" },
];

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [tab, setTab] = useState<Tab>("players");

  if (!loggedIn) return <LoginForm onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-[#0a0602] text-white">
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">← Сайт</a>
          <span className="text-white/20">|</span>
          <span className="font-black uppercase text-sm tracking-widest" style={{ fontFamily: "Arial Black" }}>Admin Panel</span>
        </div>
        <button onClick={() => { adminLogout(); setLoggedIn(false); }} className="text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">
          Выйти
        </button>
      </div>

      <div className="border-b border-white/10 px-6 flex gap-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-3 font-mono text-xs uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${tab === t.id ? "border-orange-500 text-white" : "border-transparent text-white/40 hover:text-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-4xl">
        {tab === "players" && <PlayersTab />}
        {tab === "matches" && <MatchesTab />}
        {tab === "news" && <NewsTab />}
        {tab === "achievements" && <AchievementsTab />}
        {tab === "club" && <ClubTab />}
      </div>
    </div>
  );
}
