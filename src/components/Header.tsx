import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLang } from "@/context/LanguageContext";

export const Header = () => {
  const { t } = useLang();

  return (
    <div className="fixed z-50 pt-8 md:pt-10 top-0 left-0 w-full">
      <header className="flex items-center justify-between container">
        <a href="/">
          <Logo className="w-[120px] md:w-[140px]" />
        </a>
        <nav className="flex max-lg:hidden absolute left-1/2 -translate-x-1/2 items-center justify-center gap-x-10">
          {[
            { label: t.nav.team, href: "#team" },
            { label: t.nav.matches, href: "#matches" },
            { label: t.nav.achievements, href: "#achievements" },
            { label: t.nav.contact, href: "#contact" },
          ].map((item) => (
            <a
              className="uppercase inline-block font-mono text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out text-sm tracking-widest"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 max-lg:hidden">
          <LanguageSwitcher />
          <a
            className="uppercase transition-colors ease-out duration-150 font-mono text-sm tracking-widest text-primary hover:text-primary/80 border border-primary/40 hover:border-primary px-4 py-1.5 rounded-full"
            href="#join"
          >
            {t.nav.joinUs}
          </a>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <MobileMenu />
        </div>
      </header>
    </div>
  );
};
