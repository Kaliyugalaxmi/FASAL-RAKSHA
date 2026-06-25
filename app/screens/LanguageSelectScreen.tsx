// ─────────────────────────────────────────────────────────
//  LanguageSelectScreen.tsx  –  updated to use LanguageContext
// ─────────────────────────────────────────────────────────
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../../lib/LanguageContext";

const BG          = "#F5F5EF";
const CARD_BG     = "#FFFFFF";
const DARK        = "#1A2E1A";
const GREEN       = "#1A5C2A";
const GREEN_DARK  = "#0F3D1A";
const GREEN_LIGHT = "#E8F4EA";
const MUTED       = "#5A7260";
const BORDER      = "rgba(26,92,42,0.12)";

interface Language {
  code: string;
  name: string;
  native: string;
  sub: string;
  emoji: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "English", native: "English", sub: "Default System",  emoji: "🌐" },
  { code: "hi", name: "Hindi",   native: "हिंदी",   sub: "उत्तर प्रदेश",    emoji: "🌿" },
  { code: "mr", name: "Marathi", native: "मराठी",   sub: "महाराष्ट्र",       emoji: "🍃" },
  { code: "te", name: "Telugu",  native: "తెలుగు",  sub: "ఆంధ్రప్రదేశ్",    emoji: "🌾" },
  { code: "ta", name: "Tamil",   native: "தமிழ்",   sub: "தமிழ்நாடு",       emoji: "🌱" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ",   sub: "ಕರ್ನಾಟಕ",         emoji: "🍀" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ",  sub: "ਪੰਜਾਬ",          emoji: "🌻" },
  { code: "bn", name: "Bengali", native: "বাংলা",   sub: "পশ্চিমবঙ্গ",      emoji: "🌼" },
];

const showToast = (msg: string) => {
  if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
  else Alert.alert("", msg);
};

interface CardProps {
  lang: Language;
  selected: boolean;
  onPress: () => void;
}

const LanguageCard: React.FC<CardProps> = ({ lang, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    style={[s.card, selected && s.cardSelected]}
    onPress={onPress}
  >
    {selected && (
      <View style={s.checkBadge}>
        <Ionicons name="checkmark" size={11} color="#fff" />
      </View>
    )}
    <View style={[s.iconCircle, selected && s.iconCircleSelected]}>
      <Text style={s.emoji}>{lang.emoji}</Text>
    </View>
    <Text style={[s.nativeName, selected && s.nativeNameSelected]}>
      {lang.native}
    </Text>
    <Text style={[s.subText, selected && s.subTextSelected]}>
      {lang.sub}
    </Text>
  </TouchableOpacity>
);

export default function LanguageSelectScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { langCode, setLanguage, t } = useLanguage();       // ← use context
  const [selected, setSelected] = useState<string>(langCode);

  const handleContinue = async () => {
    await setLanguage(selected as any);                     // ← persist language
    const lang = LANGUAGES.find((l) => l.code === selected)!;
    showToast(`${t("language")}: ${lang.name} ✓`);
    router.push({ pathname: "/screens/Onboardingscreen", params: { langCode: lang.code } });
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.heading}>
          {/* Title uses t() so it's translated for returning users */}
          <Text style={s.title}>
            {t("chooseLanguage").split("\n")[0]}{"\n"}
            <Text style={s.titleAccent}>{t("chooseLanguage").split("\n")[1]}</Text>
          </Text>
          <Text style={s.subtitle}>{t("chooseLanguageSub")}</Text>
        </View>

        <View style={s.grid}>
          {LANGUAGES.map((lang) => (
            <LanguageCard
              key={lang.code}
              lang={lang}
              selected={selected === lang.code}
              onPress={() => setSelected(lang.code)}
            />
          ))}
        </View>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity style={s.continueBtn} activeOpacity={0.85} onPress={handleContinue}>
          <Text style={s.continueBtnText}>{t("continue")}</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const CARD_WIDTH = "47%";

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: BG },
  scroll: { paddingHorizontal: 20, paddingTop: 28 },
  heading: { marginBottom: 28 },
  title: { fontSize: 34, fontWeight: "800", color: DARK, fontFamily: "serif", lineHeight: 42, letterSpacing: -0.5 },
  titleAccent: { color: GREEN },
  subtitle: { marginTop: 10, fontSize: 14, fontWeight: "400", color: MUTED, lineHeight: 21 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
  card: { width: CARD_WIDTH, backgroundColor: CARD_BG, borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: BORDER, shadowColor: DARK, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, position: "relative" },
  cardSelected: { borderColor: GREEN, backgroundColor: GREEN_LIGHT, elevation: 0 },
  checkBadge: { position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: 10, backgroundColor: GREEN, alignItems: "center", justifyContent: "center" },
  iconCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(0,0,0,0.05)", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  iconCircleSelected: { backgroundColor: "rgba(26,92,42,0.12)" },
  emoji: { fontSize: 22 },
  nativeName: { fontSize: 17, fontWeight: "700", color: DARK, fontFamily: "serif" },
  nativeNameSelected: { color: GREEN_DARK },
  subText: { fontSize: 11, color: MUTED, marginTop: 3 },
  subTextSelected: { color: GREEN_DARK },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 14, backgroundColor: BG, borderTopWidth: 0.5, borderTopColor: BORDER },
  continueBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: DARK, borderRadius: 50, paddingVertical: 16 },
  continueBtnText: { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
});