// FILE PATH → app/(tabs)/profile.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { currentPhone, signOut } from "../../lib/session";
import { getFarmerName, getFarmerVillage, getInitial } from "../../lib/userProfile";

// ─── Theme (mirrors Dashboard exactly) ────────────────────────────────────────
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
const AMBER_LIGHT = "#FEF3E2";
const RED         = "#C0392B";
const RED_LIGHT   = "#FEF2F2";
const RED_BORDER  = "rgba(192,57,43,0.15)";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScanRecord {
  id: string;
  mode: "crop" | "pest";
  isHealthy: boolean;
  results: { name: string; probability: number }[];
  scannedAt: string;
  timestamp: number;
}

interface LiveStats {
  total: number;
  healthy: number;
  diseaseFound: number;
  pestFound: number;
  cropScans: number;
  pestScans: number;
  lastScanDate: string | null;
}

// ─── Menu sections ────────────────────────────────────────────────────────────
const MENU = [
  {
    title: "My Activity",
    items: [
      { icon: "time-outline",       label: "Scan History",   sub: "View all past detections",    action: "history"  },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "call-outline",        label: "Kisan Helpline", sub: "1800-180-1551 (Free)",       action: "helpline" },
      { icon: "star-outline",        label: "Rate the App",   sub: "Share your feedback",        action: "rate"     },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function computeStats(records: ScanRecord[]): LiveStats {
  return {
    total:        records.length,
    healthy:      records.filter(r => r.isHealthy).length,
    cropScans:    records.filter(r => r.mode === "crop").length,
    pestScans:    records.filter(r => r.mode === "pest").length,
    diseaseFound: records.filter(r => r.mode === "crop" && !r.isHealthy).length,
    pestFound:    records.filter(r => r.mode === "pest" && !r.isHealthy).length,
    lastScanDate: records.length > 0 ? records[0].scannedAt : null,
  };
}

function healthRate(stats: LiveStats): number {
  if (stats.total === 0) return 0;
  return Math.round((stats.healthy / stats.total) * 100);
}

function formatPhone(raw: string | null): string {
  if (!raw) return "+91 •••• •••• ••";
  const digits = raw.replace("+91", "").trim();
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [phone, setPhone]     = useState<string | null>(null);
  const [farmerName, setFarmerName] = useState("Farmer");
  const [village, setVillage] = useState("");
  const [stats, setStats]     = useState<LiveStats>({
    total: 0, healthy: 0, diseaseFound: 0, pestFound: 0,
    cropScans: 0, pestScans: 0, lastScanDate: null,
  });

  useEffect(() => { 
    currentPhone().then(setPhone);
    getFarmerName().then(setFarmerName);
    getFarmerVillage().then(setVillage);
  }, []);

  useFocusEffect(
    useCallback(() => { loadStats(); }, [])
  );

  const loadStats = async () => {
    setLoading(true);
    try {
      const resolvedPhone = await currentPhone();
      // Using unified history key for consistency
      const raw = await AsyncStorage.getItem("cropguard_scan_history_v2");
      const records: ScanRecord[] = raw ? JSON.parse(raw) : [];
      setStats(computeStats(records));
    } catch { /* keep zeros */ }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of Fasal Raksha?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out", style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/screens/Loginscreen");
          },
        },
      ]
    );
  };

  const handleMenuPress = (action: string) => {
    switch (action) {
      case "history":
      case "crop":
      case "pest":
        router.navigate("/(tabs)/history" as any);
        break;
      case "helpline":
        Alert.alert("Kisan Helpline", "Calling 1800-180-1551 (Toll Free)…");
        break;
      default:
        Alert.alert("Coming Soon", "This feature will be available in a future update.");
    }
  };

  const rate = healthRate(stats);
  // Arc fill: 0–100 maps to 0–251 (circumference of r=40 circle)
  const CIRC = 251.2;
  const arcFill = (rate / 100) * CIRC;

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Header ── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>My Profile</Text>
        <View style={s.headerBadge}>
          <Ionicons name="leaf" size={13} color={GREEN} />
          <Text style={s.headerBadgeText}>Farmer</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        {/* ══════════════════════════════════
            HERO CARD — Avatar + Health Ring
            ══════════════════════════════════ */}
        <View style={s.heroCard}>
          {/* Left: avatar + name */}
          <View style={s.heroLeft}>
            <View style={s.avatarWrap}>
              <View style={s.avatarCircle}>
                <Text style={s.avatarInitial}>{getInitial(farmerName)}</Text>
              </View>
              <View style={s.onlineDot} />
            </View>
            <Text style={s.heroName}>{farmerName}</Text>
            <Text style={s.heroPhone}>{formatPhone(phone)}</Text>
            <View style={s.heroPillRow}>
              <View style={s.heroPill}>
                <Ionicons name="location-outline" size={11} color={GREEN} />
                <Text style={s.heroPillText}>{village || "India"}</Text>
              </View>
              <View style={[s.heroPill, { backgroundColor: AMBER_LIGHT }]}>
                <Ionicons name="calendar-outline" size={11} color={AMBER} />
                <Text style={[s.heroPillText, { color: AMBER }]}>
                  {stats.lastScanDate ? stats.lastScanDate.split(",")[0] : "No scans"}
                </Text>
              </View>
            </View>
          </View>

          {/* Right: SVG health ring */}
          <View style={s.ringWrap}>
            <View style={s.svgContainer}>
              {/* Background ring */}
              <View style={s.ringBg} />
              {/* Filled ring — approximated with a conic-like border trick */}
              <View
                style={[
                  s.ringFill,
                  {
                    borderColor: rate === 0 ? "transparent" : GREEN_MID,
                    // Rotate so fill starts from top; we simulate progress via borderWidth variation
                    transform: [{ rotate: "-90deg" }],
                    borderTopColor: rate >= 25 ? GREEN_MID : "transparent",
                    borderRightColor: rate >= 50 ? GREEN_MID : "transparent",
                    borderBottomColor: rate >= 75 ? GREEN_MID : "transparent",
                    borderLeftColor: rate >= 100 ? GREEN_MID : "transparent",
                  },
                ]}
              />
              {/* Center text */}
              <View style={s.ringCenter}>
                <Text style={s.ringPct}>{stats.total === 0 ? "—" : `${rate}%`}</Text>
                <Text style={s.ringLabel}>Health</Text>
              </View>
            </View>
            <Text style={s.ringCaption}>Crop Health Rate</Text>
          </View>
        </View>

        {/* ══════════════════════════════════
            STAT PILLS — 4 key numbers
            ══════════════════════════════════ */}
        <View style={s.statsGrid}>
          {[
            { icon: "scan-outline",         value: stats.total,        label: "Total Scans",    color: GREEN,       bg: GREEN_LIGHT  },
            { icon: "medkit-outline",        value: stats.diseaseFound, label: "Diseases Found", color: RED,         bg: RED_LIGHT    },
            { icon: "bug-outline",           value: stats.pestFound,    label: "Pests Found",    color: AMBER,       bg: AMBER_LIGHT  },
            { icon: "checkmark-circle-outline", value: stats.healthy,  label: "Healthy Scans",  color: GREEN_MID,   bg: GREEN_LIGHT  },
          ].map((st) => (
            <View key={st.label} style={[s.statPill, { backgroundColor: st.bg }]}>
              <View style={[s.statIconWrap, { backgroundColor: st.color + "22" }]}>
                <Ionicons name={st.icon as any} size={16} color={st.color} />
              </View>
              {loading ? (
                <ActivityIndicator size="small" color={st.color} style={{ marginVertical: 4 }} />
              ) : (
                <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
              )}
              <Text style={[s.statLabel, { color: st.color + "BB" }]}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* ══════════════════════════════════
            BREAKDOWN BAR
            ══════════════════════════════════ */}
        {stats.total > 0 && (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.cardHeaderIcon}>
                <Ionicons name="bar-chart-outline" size={14} color={GREEN} />
              </View>
              <Text style={s.cardTitle}>Scan Breakdown</Text>
            </View>
            <View style={s.barTrack}>
              {stats.cropScans > 0 && (
                <View style={[s.barFill, {
                  flex: stats.cropScans,
                  backgroundColor: GREEN_MID,
                  borderTopLeftRadius: 6, borderBottomLeftRadius: 6,
                  borderTopRightRadius: stats.pestScans === 0 ? 6 : 0,
                  borderBottomRightRadius: stats.pestScans === 0 ? 6 : 0,
                }]} />
              )}
              {stats.pestScans > 0 && (
                <View style={[s.barFill, {
                  flex: stats.pestScans,
                  backgroundColor: AMBER,
                  borderTopRightRadius: 6, borderBottomRightRadius: 6,
                  borderTopLeftRadius: stats.cropScans === 0 ? 6 : 0,
                  borderBottomLeftRadius: stats.cropScans === 0 ? 6 : 0,
                }]} />
              )}
            </View>
            <View style={s.legendRow}>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: GREEN_MID }]} />
                <Text style={s.legendText}>Crop scans  </Text>
                <Text style={[s.legendCount, { color: GREEN_MID }]}>{stats.cropScans}</Text>
              </View>
              <View style={s.legendItem}>
                <View style={[s.legendDot, { backgroundColor: AMBER }]} />
                <Text style={s.legendText}>Pest scans  </Text>
                <Text style={[s.legendCount, { color: AMBER }]}>{stats.pestScans}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Empty state CTA */}
        {stats.total === 0 && !loading && (
          <View style={s.emptyCard}>
            <Text style={s.emptyEmoji}>🌱</Text>
            <Text style={s.emptyTitle}>No scans yet</Text>
            <Text style={s.emptySub}>Scan a crop or pest to see your farm activity here.</Text>
            <TouchableOpacity
              style={s.emptyBtn}
              onPress={() => router.push("/(tabs)/scan" as any)}
            >
              <Ionicons name="scan-outline" size={16} color={WHITE} />
              <Text style={s.emptyBtnText}>Start Scanning</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ══════════════════════════════════
            MENU SECTIONS
            ══════════════════════════════════ */}
        {MENU.map((section) => (
          <View key={section.title} style={s.menuCard}>
            <Text style={s.menuSectionTitle}>{section.title}</Text>
            {section.items.map((item, idx) => {
              const dynamicSub =
                item.action === "history" && stats.total > 0
                  ? `${stats.total} total scan${stats.total !== 1 ? "s" : ""}`
                  : item.action === "crop" && stats.cropScans > 0
                  ? `${stats.cropScans} crop scan${stats.cropScans !== 1 ? "s" : ""}`
                  : item.action === "pest" && stats.pestScans > 0
                  ? `${stats.pestScans} pest scan${stats.pestScans !== 1 ? "s" : ""}`
                  : item.sub;

              return (
                <Pressable
                  key={item.action}
                  style={({ pressed }) => [
                    s.menuItem,
                    idx < section.items.length - 1 && s.menuItemBorder,
                    pressed && s.menuItemPressed,
                  ]}
                  onPress={() => handleMenuPress(item.action)}
                >
                  <View style={s.menuIconBox}>
                    <Ionicons name={item.icon as any} size={17} color={GREEN} />
                  </View>
                  <View style={s.menuTextCol}>
                    <Text style={s.menuLabel}>{item.label}</Text>
                    <Text style={s.menuSub}>{dynamicSub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={MUTED} />
                </Pressable>
              );
            })}
          </View>
        ))}

        {/* ══════════════════════════════════
            APP INFO STRIP
            ══════════════════════════════════ */}
        <View style={s.infoStrip}>
          <Ionicons name="leaf" size={11} color={GREEN + "66"} />
          <Text style={s.infoText}>Fasal Raksha v1.0.0</Text>
          <View style={s.infoDot} />
          <Text style={s.infoText}>MobileNetV2 AI</Text>
          <View style={s.infoDot} />
          <Text style={s.infoText}>Offline Ready</Text>
        </View>

        {/* ══════════════════════════════════
            SIGN OUT
            ══════════════════════════════════ */}
        <TouchableOpacity style={s.logoutBtn} activeOpacity={0.85} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={RED} />
          <Text style={s.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={s.privacyNote}>
          🔒 Your data stays on your device. We never sell your information.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: BG },

  // ── Header ──
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: BG,
  },
  headerTitle: {
    fontSize: 20, fontWeight: "800", color: GREEN_DARK,
    fontFamily: "serif", letterSpacing: -0.4,
  },
  headerBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: GREEN_LIGHT, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 50, borderWidth: 1, borderColor: BORDER,
  },
  headerBadgeText: { fontSize: 11, fontWeight: "700", color: GREEN },

  scroll: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },

  // ── Hero card ──
  heroCard: {
    backgroundColor: WHITE, borderRadius: 20,
    padding: 20, flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: BORDER,
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  heroLeft:    { flex: 1, gap: 6 },
  avatarWrap:  { position: "relative", marginBottom: 4, alignSelf: "flex-start" },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: GREEN_DARK,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2.5, borderColor: GREEN_LIGHT,
  },
  avatarInitial: { fontSize: 24, fontWeight: "800", color: WHITE },
  onlineDot: {
    position: "absolute", bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: GREEN_MID, borderWidth: 2, borderColor: WHITE,
  },
  heroName:  { fontSize: 18, fontWeight: "800", color: GREEN_DARK },
  heroPhone: { fontSize: 12, color: MUTED, fontWeight: "500" },
  heroPillRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  heroPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: GREEN_LIGHT, borderRadius: 50,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 0.5, borderColor: BORDER,
  },
  heroPillText: { fontSize: 10, color: GREEN, fontWeight: "600" },

  // ── Health Ring ──
  ringWrap:    { alignItems: "center", gap: 6 },
  svgContainer: {
    width: 90, height: 90,
    alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  ringBg: {
    position: "absolute",
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 8,
    borderColor: GREEN_LIGHT,
  },
  ringFill: {
    position: "absolute",
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 8,
    borderColor: "transparent",
  },
  ringCenter: { alignItems: "center", gap: 1 },
  ringPct:    { fontSize: 18, fontWeight: "800", color: GREEN_DARK },
  ringLabel:  { fontSize: 9,  fontWeight: "700", color: MUTED, letterSpacing: 0.5, textTransform: "uppercase" },
  ringCaption: { fontSize: 10, color: MUTED, fontWeight: "600", textAlign: "center" },

  // ── Stats grid ──
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statPill: {
    flex: 1, minWidth: "44%", borderRadius: 16,
    padding: 14, gap: 6,
    borderWidth: 1, borderColor: BORDER,
    alignItems: "flex-start",
  },
  statIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  statValue: { fontSize: 26, fontWeight: "800", fontFamily: "serif", lineHeight: 30 },
  statLabel: { fontSize: 11, fontWeight: "600", lineHeight: 14 },

  // ── Breakdown card ──
  card: {
    backgroundColor: WHITE, borderRadius: 18, padding: 16,
    borderWidth: 1, borderColor: BORDER, gap: 12,
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardHeaderIcon: {
    width: 28, height: 28, borderRadius: 9,
    backgroundColor: GREEN_LIGHT,
    alignItems: "center", justifyContent: "center",
  },
  cardTitle:  { fontSize: 13, fontWeight: "800", color: DARK },
  barTrack: {
    height: 10, borderRadius: 5,
    flexDirection: "row", backgroundColor: GREEN_LIGHT,
    overflow: "hidden",
  },
  barFill:  { height: "100%" },
  legendRow: { flexDirection: "row", gap: 20 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot:  { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: MUTED, fontWeight: "500" },
  legendCount: { fontSize: 12, fontWeight: "700" },

  // ── Empty state ──
  emptyCard: {
    backgroundColor: WHITE, borderRadius: 18, padding: 28,
    alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: BORDER,
  },
  emptyEmoji: { fontSize: 38 },
  emptyTitle: { fontSize: 15, fontWeight: "800", color: DARK },
  emptySub:   { fontSize: 12, color: MUTED, textAlign: "center", lineHeight: 18 },
  emptyBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    marginTop: 6, backgroundColor: GREEN_DARK,
    borderRadius: 50, paddingHorizontal: 20, paddingVertical: 11,
  },
  emptyBtnText: { fontSize: 13, fontWeight: "700", color: WHITE },

  // ── Menu ──
  menuCard: {
    backgroundColor: WHITE, borderRadius: 18,
    paddingHorizontal: 14, paddingTop: 14, paddingBottom: 4,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  menuSectionTitle: {
    fontSize: 10, fontWeight: "700", color: MUTED,
    letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 12, gap: 12,
  },
  menuItemBorder:  { borderBottomWidth: 0.5, borderBottomColor: BORDER },
  menuItemPressed: { opacity: 0.6 },
  menuIconBox: {
    width: 38, height: 38, borderRadius: 11,
    backgroundColor: GREEN_LIGHT,
    alignItems: "center", justifyContent: "center",
    borderWidth: 0.5, borderColor: BORDER,
  },
  menuTextCol: { flex: 1, gap: 2 },
  menuLabel:   { fontSize: 14, fontWeight: "700", color: DARK },
  menuSub:     { fontSize: 11, color: MUTED, lineHeight: 15 },

  // ── Info strip ──
  infoStrip: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 6, paddingVertical: 4,
  },
  infoText: { fontSize: 10, color: MUTED + "99", fontWeight: "500" },
  infoDot:  { width: 3, height: 3, borderRadius: 2, backgroundColor: MUTED + "44" },

  // ── Logout ──
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: RED_LIGHT, borderRadius: 16, height: 52,
    borderWidth: 1, borderColor: RED_BORDER,
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: RED },

  // ── Privacy ──
  privacyNote: {
    fontSize: 11, color: MUTED + "88",
    textAlign: "center", lineHeight: 17, paddingHorizontal: 16,
  },
});