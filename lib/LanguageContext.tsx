
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { LangCode, TRANSLATIONS, Translations } from "./translations";

const STORAGE_KEY = "@app_language";

// ── Context shape ────────────────────────────────────────
interface LanguageContextValue {
  /** Currently selected language code, e.g. "hi" */
  langCode: LangCode;
  /** Change + persist language */
  setLanguage: (code: LangCode) => Promise<void>;
  /** Translate a UI key, e.g. t("continue") */
  t: (key: keyof Translations) => string;
  /** true while loading saved preference on startup */
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  langCode: "en",
  setLanguage: async () => {},
  t: (key) => key as string,
  isLoading: true,
});

// ── Provider ─────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [langCode, setLangCode] = useState<LangCode>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved && saved in TRANSLATIONS) {
          setLangCode(saved as LangCode);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Change + persist
  const setLanguage = useCallback(async (code: LangCode) => {
    setLangCode(code);
    await AsyncStorage.setItem(STORAGE_KEY, code);
  }, []);

  // Translate helper
  const t = useCallback(
    (key: keyof Translations): string => {
      return TRANSLATIONS[langCode][key] ?? TRANSLATIONS["en"][key] ?? key;
    },
    [langCode]
  );

  return (
    <LanguageContext.Provider value={{ langCode, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return context;
}
