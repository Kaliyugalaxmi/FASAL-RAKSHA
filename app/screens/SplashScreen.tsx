// FILE PATH → app/screens/SplashScreen.tsx
//
// FIX: Pehle ye screen GOLD/cream theme (#FEFCE8) mein thi jabki Dashboard
// aur Profile GREEN theme (#F5F5EF / #1A5C2A) mein hain. App khulte hi
// off-brand lagta tha. Ab same green palette use ho rahi hai jo
// Dashboard/Profile/Signup mein hai — taaki first impression se hi
// consistent dikhe.

import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { hasOnboarded, isLoggedIn } from "../../lib/session";

// ─── Theme — same tokens as Dashboard/Profile/Signup ──────────────────────
const BG          = "#F5F5EF";
const WHITE       = "#FFFFFF";
const GREEN       = "#1A5C2A";
const GREEN_LIGHT = "#E8F4EA";
const GREEN_DARK  = "#0F3D1A";
const MUTED       = "#5A7260";

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      const [onboarded, loggedIn] = await Promise.all([
        hasOnboarded(),
        isLoggedIn(),
      ]);

      if (!onboarded) {
        router.replace("/screens/LanguageSelectScreen");
      } else if (!loggedIn) {
        router.replace("/screens/Loginscreen");
      } else {
        router.replace("/screens/Dashboardscreen");
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <View style={s.center}>
        <View style={s.logoCard}>
          <Image
            source={require("../../assets/images/LOGO.png")}
            style={s.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={s.textBlock}>
          <Text style={s.brand}>Fasal Raksha</Text>
          <Text style={s.tagline}>Surakshit Fasal, Samruddh Kisan</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: BG,
    alignItems: "center", justifyContent: "center",
  },
  center:   { alignItems: "center", gap: 28 },
  logoCard: {
    width: 150, height: 150, borderRadius: 36,
    backgroundColor: WHITE, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: GREEN_LIGHT,
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1, shadowRadius: 18, elevation: 5,
  },
  logoImage: { width: 130, height: 130 },
  textBlock: { alignItems: "center", gap: 6 },
  brand: {
    fontSize: 32, fontWeight: "800",
    color: GREEN_DARK, letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13, fontWeight: "500", color: MUTED,
    letterSpacing: 0.2, textAlign: "center", paddingHorizontal: 32,
  },
});