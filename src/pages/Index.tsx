import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { TeamSection } from "@/components/sections/TeamSection";
import { MatchesSection } from "@/components/sections/MatchesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { api } from "@/lib/api";

export default function Index() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [news, setNews] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [club, setClub] = useState(null);

  useEffect(() => {
    api.getPlayers().then(setPlayers).catch(() => {});
    api.getMatches().then(setMatches).catch(() => {});
    api.getNews().then(setNews).catch(() => {});
    api.getAchievements().then(setAchievements).catch(() => {});
    api.getClub().then(setClub).catch(() => {});
  }, []);

  return (
    <>
      <Hero />
      <TeamSection players={players} />
      <MatchesSection matches={matches} />
      <AboutSection club={club} />
      <NewsSection news={news} />
      <AchievementsSection achievements={achievements} />
      <footer className="py-12 border-t border-white/10 text-center">
        <p className="font-mono text-xs text-white/20 uppercase tracking-widest">
          © {new Date().getFullYear()} Five Custlass · Counter Strike 2
        </p>
        <a href="/admin" className="font-mono text-xs text-white/10 hover:text-white/30 uppercase tracking-widest mt-2 inline-block transition-colors">
          Admin
        </a>
      </footer>
    </>
  );
}
