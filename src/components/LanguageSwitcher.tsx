import { useLang, Language } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";

const LANGS: Language[] = ["ENG", "RUS", "UKR"];

export const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-1 py-1">
      <Icon name="Globe" size={14} className="text-white/50 ml-2 mr-1" />
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest transition-all duration-200",
            lang === l
              ? "bg-primary text-black"
              : "text-white/50 hover:text-white"
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
};
