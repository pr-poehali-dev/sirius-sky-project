import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "RUS" | "ENG" | "UKR";

interface Translations {
  nav: { team: string; matches: string; achievements: string; news: string; contact: string; joinUs: string };
  hero: { pill: string; title1: string; title2: string; subtitle: string; cta: string };
  sections: {
    team: string; matches: string; about: string; news: string; achievements: string;
    matchesEmpty: string; upcoming: string; played: string;
    role: string; rating: string; kpr: string; hs: string; maps: string;
    readMore: string; place: string; prize: string; viewProfile: string;
  };
}

const translations: Record<Language, Translations> = {
  RUS: {
    nav: { team: "Команда", matches: "Матчи", achievements: "Достижения", news: "Новости", contact: "Контакты", joinUs: "Вступить" },
    hero: { pill: "CS2 · ПРОФЕССИОНАЛЬНАЯ КОМАНДА", title1: "Пять клинков —", title2: "одна победа", subtitle: "Five Custlass — профессиональная киберспортивная команда по Counter Strike 2.", cta: "[Познакомиться с командой]" },
    sections: { team: "Состав", matches: "Расписание матчей", about: "О клубе", news: "Новости", achievements: "Достижения", matchesEmpty: "Матчи ещё не запланированы", upcoming: "Предстоящий", played: "Сыгран", role: "Роль", rating: "HLTV Rating 3.0", kpr: "K/R", hs: "HS%", maps: "Карт", readMore: "Читать", place: "Место", prize: "Приз", viewProfile: "Профиль" },
  },
  ENG: {
    nav: { team: "Team", matches: "Matches", achievements: "Achievements", news: "News", contact: "Contact", joinUs: "Join Us" },
    hero: { pill: "CS2 · PROFESSIONAL TEAM", title1: "Five blades —", title2: "one victory", subtitle: "Five Custlass — professional esports team in Counter Strike 2.", cta: "[Meet the team]" },
    sections: { team: "Roster", matches: "Match Schedule", about: "About Club", news: "News", achievements: "Achievements", matchesEmpty: "No matches scheduled yet", upcoming: "Upcoming", played: "Played", role: "Role", rating: "HLTV Rating 3.0", kpr: "K/R", hs: "HS%", maps: "Maps", readMore: "Read", place: "Place", prize: "Prize", viewProfile: "Profile" },
  },
  UKR: {
    nav: { team: "Команда", matches: "Матчі", achievements: "Досягнення", news: "Новини", contact: "Контакти", joinUs: "Приєднатись" },
    hero: { pill: "CS2 · ПРОФЕСІЙНА КОМАНДА", title1: "П'ять клинків —", title2: "одна перемога", subtitle: "Five Custlass — професійна кіберспортивна команда з Counter Strike 2.", cta: "[Познайомитись з командою]" },
    sections: { team: "Склад", matches: "Розклад матчів", about: "Про клуб", news: "Новини", achievements: "Досягнення", matchesEmpty: "Матчі ще не заплановані", upcoming: "Майбутній", played: "Зіграний", role: "Роль", rating: "HLTV Rating 3.0", kpr: "K/R", hs: "HS%", maps: "Карт", readMore: "Читати", place: "Місце", prize: "Приз", viewProfile: "Профіль" },
  },
};

interface LanguageContextType { lang: Language; setLang: (l: Language) => void; t: Translations }
const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("RUS");
  return <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
