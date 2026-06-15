import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
const KEY = "hms.theme";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

// Inline script string applied in <head> before hydration to prevent theme flash.
// Reads stored theme (or system preference) and sets `.dark` on <html> synchronously.
export const themeBootScript = `(function(){try{var k="${KEY}";var s=localStorage.getItem(k);var t=s||(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`;
function readInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(KEY) as Theme | null;
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}



export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialise from storage synchronously on the client so the React tree
  // matches the class the boot script applied — no flash on hydration.
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
