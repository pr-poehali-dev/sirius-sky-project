import { useState } from "react";
import { useLang } from "@/context/LanguageContext";

interface Player {
  id: number;
  nickname: string;
  real_name: string;
  role: string;
  country: string;
  hltv_rating: number;
  kills_per_round: number;
  headshot_pct: number;
  maps_played: number;
  photo_url: string;
  bio: string;
}

interface Props {
  players: Player[];
}

const ROLE_COLORS: Record<string, string> = {
  StarPlayer: "#ffa500",
  IGL: "#4fc3f7",
  Rifler: "#ef5350",
  Support: "#66bb6a",
  AWPer: "#ab47bc",
};

function getRatingColor(r: number) {
  if (r >= 1.3) return "#ffa500";
  if (r >= 1.1) return "#66bb6a";
  if (r >= 1.0) return "#fff";
  return "#ef5350";
}

function PlayerCard({ player, onClick }: { player: Player; onClick: () => void }) {
  const { t } = useLang();
  const color = ROLE_COLORS[player.role] || "#fff";

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer bg-[#111] border border-white/10 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
      style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-orange-900/0 to-orange-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Фото или аватар */}
      <div className="relative h-52 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] flex items-end justify-center overflow-hidden">
        {player.photo_url ? (
          <img src={player.photo_url} alt={player.nickname} className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <span className="text-6xl font-black uppercase text-white/10 select-none" style={{ fontFamily: "Arial Black" }}>
              {player.nickname[0]}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        <span className="relative z-10 px-2 py-0.5 mb-3 text-[10px] font-mono tracking-widest uppercase font-bold rounded-sm" style={{ background: color + "22", color, border: `1px solid ${color}55` }}>
          {player.role}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-black uppercase tracking-wide" style={{ fontFamily: "Arial Black" }}>{player.nickname}</span>
          <span className="text-xs text-white/40 font-mono">{player.country}</span>
        </div>
        <div className="text-xs text-white/50 font-mono mb-3">{player.real_name}</div>

        {/* HLTV Rating */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="text-center">
            <div className="text-[10px] text-white/40 font-mono mb-1">{t.sections.rating.split(" ").slice(-1)[0]}</div>
            <div className="text-lg font-black" style={{ color: getRatingColor(player.hltv_rating), fontFamily: "Arial Black" }}>
              {Number(player.hltv_rating).toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/40 font-mono mb-1">{t.sections.kpr}</div>
            <div className="text-sm font-bold text-white">{Number(player.kills_per_round).toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/40 font-mono mb-1">{t.sections.hs}</div>
            <div className="text-sm font-bold text-white">{player.headshot_pct}%</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/40 font-mono mb-1">{t.sections.maps}</div>
            <div className="text-sm font-bold text-white">{player.maps_played}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerModal({ player, onClose }: { player: Player; onClose: () => void }) {
  const { t } = useLang();
  const color = ROLE_COLORS[player.role] || "#fff";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/15 max-w-lg w-full overflow-hidden"
        style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 text-white/50 hover:text-white font-mono text-xl">✕</button>

        <div className="h-64 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] relative flex items-center justify-center overflow-hidden">
          {player.photo_url ? (
            <img src={player.photo_url} alt={player.nickname} className="absolute inset-0 w-full h-full object-cover object-top opacity-70" />
          ) : (
            <span className="text-8xl font-black text-white/10" style={{ fontFamily: "Arial Black" }}>{player.nickname[0]}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-widest rounded-sm" style={{ background: color + "22", color, border: `1px solid ${color}55` }}>
              {player.role}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-baseline gap-3 mb-1">
            <h2 className="text-2xl font-black uppercase tracking-wide" style={{ fontFamily: "Arial Black" }}>{player.nickname}</h2>
            <span className="text-sm text-white/40 font-mono">{player.country}</span>
          </div>
          <div className="text-sm text-white/50 font-mono mb-4">{player.real_name}</div>

          <div className="text-sm text-white/40 font-mono mb-1 uppercase tracking-widest">{t.sections.rating}</div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "Rating 3.0", value: Number(player.hltv_rating).toFixed(2), color: getRatingColor(player.hltv_rating) },
              { label: t.sections.kpr, value: Number(player.kills_per_round).toFixed(2), color: "#fff" },
              { label: t.sections.hs, value: `${player.headshot_pct}%`, color: "#fff" },
              { label: t.sections.maps, value: String(player.maps_played), color: "#fff" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded p-3 text-center">
                <div className="text-[10px] text-white/40 font-mono mb-1">{s.label}</div>
                <div className="text-lg font-black" style={{ color: s.color, fontFamily: "Arial Black" }}>{s.value}</div>
              </div>
            ))}
          </div>

          {player.bio && (
            <p className="text-sm text-white/60 font-mono leading-relaxed">{player.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TeamSection({ players }: Props) {
  const { t } = useLang();
  const [selected, setSelected] = useState<Player | null>(null);

  return (
    <section id="team" className="py-20 px-4 md:px-8 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/10" />
          <h2 className="font-mono text-xs tracking-[0.4em] uppercase text-white/40">{t.sections.team}</h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {players.map((p) => (
            <PlayerCard key={p.id} player={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      </div>

      {selected && <PlayerModal player={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
