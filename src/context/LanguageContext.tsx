import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "RUS" | "ENG" | "UKR";

interface Translations {
  nav: {
    team: string;
    matches: string;
    achievements: string;
    contact: string;
    joinUs: string;
  };
  hero: {
    pill: string;
    title1: string;
    title2: string;
    subtitle: string;
    cta: string;
  };
}

const translations: Record<Language, Translations> = {
  RUS: {
    nav: {
      team: "Команда",
      matches: "Матчи",
      achievements: "Достижения",
      contact: "Контакты",
      joinUs: "Вступить",
    },
    hero: {
      pill: "CS2 · ПРОФЕССИОНАЛЬНАЯ КОМАНДА",
      title1: "Играем на",
      title2: "победу",
      subtitle: "Профессиональная киберспортивная команда по Counter Strike 2. Мы живём игрой — и побеждаем вместе.",
      cta: "[Следить за нами]",
    },
  },
  ENG: {
    nav: {
      team: "Team",
      matches: "Matches",
      achievements: "Achievements",
      contact: "Contact",
      joinUs: "Join Us",
    },
    hero: {
      pill: "CS2 · PROFESSIONAL TEAM",
      title1: "We play to",
      title2: "win",
      subtitle: "Professional esports team in Counter Strike 2. We live the game — and win together.",
      cta: "[Follow Us]",
    },
  },
  UKR: {
    nav: {
      team: "Команда",
      matches: "Матчі",
      achievements: "Досягнення",
      contact: "Контакти",
      joinUs: "Приєднатись",
    },
    hero: {
      pill: "CS2 · ПРОФЕСІЙНА КОМАНДА",
      title1: "Граємо на",
      title2: "перемогу",
      subtitle: "Професійна кіберспортивна команда з Counter Strike 2. Ми живемо грою — і перемагаємо разом.",
      cta: "[Стежити за нами]",
    },
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("RUS");

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
