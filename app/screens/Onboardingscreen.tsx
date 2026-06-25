// FILE PATH → app/screens/OnboardingScreen.tsx
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { markOnboarded } from "../../lib/session";

// ─── Theme (matches DashboardScreenRedesigned.tsx exactly) ────────────────
const BG          = "#F5F5EF";
const WHITE       = "#FFFFFF";
const DARK        = "#1A2E1A";
const MUTED       = "#5A7260";
const GREEN       = "#1A5C2A";
const GREEN_LIGHT = "#E8F4EA";
const GREEN_MID   = "#3A7A2A";
const GREEN_DARK  = "#0F3D1A";
const BORDER      = "rgba(26,92,42,0.12)";
const AMBER       = "#B8680A";

const { width } = Dimensions.get("window");

// ─── Slide Data ───────────────────────────────────────────────────────────
// Replace each `image` require() below with your real photo paths.
// Suggested location: assets/images/onboarding/
const SLIDES: {
  key: string;
  tag: string;
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  badge?: { icon: "scan" | "leaf"; text: string };
}[] = [
  {
    key: "1",
    tag: "DIAGNOSE INSTANTLY",
    title: "Snap a Photo\nof Your Crop",
    subtitle:
      "Point your camera at any leaf, stem, or fruit. Our AI spots diseases and pests in seconds.",
    image: require("../../assets/images/crops/onboarding_scan.jpg"),
    badge: { icon: "scan", text: "AI Match: 98%" },
  },
  {
    key: "2",
    tag: "AI-POWERED ANALYSIS",
    title: "We Analyse\nIt for You",
    subtitle:
      "Your photo is scanned for 50+ diseases, nutrient deficiencies, and pest infestations instantly.",
    // TODO: swap for a dedicated "analysing" photo if/when you add one.
    image: require("../../assets/images/crops/plant_illustration.jpg"),
    badge: { icon: "leaf", text: "Analyzing Crop Health…" },
  },
  {
    key: "3",
    tag: "EXPERT TREATMENT",
    title: "Get Results\n& Treatment",
    subtitle:
      "Clear treatment advice with exact dosages — fertilizers, pesticides, and organic remedies.",
    // TODO: swap for a dedicated "treatment" photo if/when you add one.
    image: require("../../assets/images/crops/weather_farm_bg.jpg"),
  },
];

// ─── Small inline icons (no extra deps needed) ─────────────────────────────
const IconCheck = ({ color = WHITE, size = 12 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12">
    <Path
      d="M2.5 6.2 L4.6 8.3 L9.5 3"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IconSearch = ({ color = GREEN_DARK, size = 14 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <Path
      d="M11.5 11.5 L15 15 M7.2 12.4 C10.07 12.4 12.4 10.07 12.4 7.2 C12.4 4.33 10.07 2 7.2 2 C4.33 2 2 4.33 2 7.2 C2 10.07 4.33 12.4 7.2 12.4Z"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const IconTractor = ({ color = GREEN }: { color?: string }) => (
  <Svg width={22} height={22} viewBox="0 0 28 28">
    <Path
      d="M14 4 C14 4 6 8 6 14 C6 21 10.5 24.5 14 26 C17.5 24.5 22 21 22 14 C22 8 14 4 14 4Z"
      fill={color}
      opacity={0.15}
    />
    <Path
      d="M14 8 C11 8 9 11 9.5 14 C10 17 12 19 14 20 C16 19 18 17 18.5 14 C19 11 17 8 14 8Z"
      fill={color}
    />
    <Path d="M14 8.5 L14 19.5" stroke={WHITE} strokeWidth={1.5} opacity={0.6} />
  </Svg>
);

// ─── Main Component ───────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const flatRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToAuth = async () => {
    await markOnboarded();
    router.replace("/screens/Signupscreen");
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    } else {
      goToAuth();
    }
  };

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Top bar: logo + skip ── */}
      <View style={s.topBar}>
        <View style={s.logoRow}>
          <View style={s.logoIcon}>
            <IconTractor color={GREEN} />
          </View>
          <View>
            <Text style={s.logoText}>Fasal Raksha</Text>
            <Text style={s.logoSub}>Surakshit Fasal, Samruddh Kisan</Text>
          </View>
        </View>

        {!isLast && (
          <TouchableOpacity style={s.skipBtn} onPress={goToAuth} activeOpacity={0.7}>
            <Text style={s.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Swipeable slides ── */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <View style={s.body}>
              {/* ── Photo hero card ── */}
              <View style={s.heroCard}>
                <ImageBackground source={item.image} style={s.heroImage} imageStyle={s.heroImageInner}>
                  {item.badge && (
                    <View style={s.badgeWrap}>
                      <View style={s.badgePill}>
                        {item.badge.icon === "scan" ? (
                          <IconCheck color={WHITE} size={11} />
                        ) : (
                          <IconSearch color={WHITE} size={12} />
                        )}
                        <Text style={s.badgeText}>{item.badge.text}</Text>
                      </View>
                    </View>
                  )}
                </ImageBackground>
              </View>

              {/* ── Content ── */}
              <View style={s.content}>
                <View style={s.tagPill}>
                  <View style={s.tagDot} />
                  <Text style={s.tagText}>{item.tag}</Text>
                </View>

                <Text style={s.title}>{item.title}</Text>
                <Text style={s.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* ── Bottom controls ── */}
      <View style={[s.bottom, { paddingBottom: insets.bottom + 20 }]}>
        {/* Round dot progress indicator — active dot grows into a pill */}
        <View style={s.progressRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                s.progressDot,
                i === activeIndex && s.progressDotActive,
                i < activeIndex && s.progressDotDone,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={[s.btn, isLast && s.btnLast]} activeOpacity={0.88} onPress={handleNext}>
          <Text style={s.btnText}>{isLast ? "Get Started" : "Next"}</Text>
          <Text style={s.btnArrow}>→</Text>
        </TouchableOpacity>

        {activeIndex === 0 && (
          <Text style={s.trustText}>Trusted by 50,000+ farmers across India</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: GREEN_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 16, fontWeight: "800", color: GREEN_DARK, letterSpacing: -0.2 },
  logoSub: { fontSize: 10.5, color: GREEN, marginTop: 1 },
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  skipText: { fontSize: 13, color: MUTED, fontWeight: "700" },

  // Body / slide
  body: { flex: 1, paddingHorizontal: 20 },

  // Photo hero card
  heroCard: {
    marginTop: 6,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: BORDER,
    height: width * 0.92,
  },
  heroImage: { flex: 1, justifyContent: "flex-end" },
  heroImageInner: { resizeMode: "cover" },

  badgeWrap: { padding: 14 },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: GREEN_DARK,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: WHITE },

  // Content
  content: {
    paddingTop: 22,
  },
  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
    gap: 6,
    backgroundColor: GREEN_LIGHT,
  },
  tagDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN },
  tagText: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2, color: GREEN_DARK },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: DARK,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14.5,
    color: MUTED,
    lineHeight: 22,
  },

  // Bottom
  bottom: {
    paddingHorizontal: 24,
    paddingTop: 14,
    gap: 16,
  },

  // ── Round dot progress indicator ──
  // Inactive: small circle. Active: stretches into a rounded pill (common
  // "dot → pill" pattern). Done (passed slides): solid mid-green circle.
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BORDER,
  },
  progressDotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN_DARK,
  },
  progressDotDone: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN_MID,
  },

  btn: {
    flexDirection: "row",
    backgroundColor: GREEN_DARK,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: GREEN_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  btnLast: { backgroundColor: GREEN },
  btnText: { fontSize: 16, fontWeight: "700", color: WHITE, letterSpacing: 0.3 },
  btnArrow: { fontSize: 16, fontWeight: "700", color: WHITE },

  trustText: { textAlign: "center", fontSize: 12, color: MUTED, marginTop: -4 },
});