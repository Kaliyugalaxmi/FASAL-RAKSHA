// FILE PATH → app/screens/DashboardScreenRedesigned.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { getFarmerName, getInitial } from "../../lib/userProfile";

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
const RED         = "#C0392B";

const HISTORY_KEY = "cropguard_scan_history_v2";

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  rain_chance: number;
  description: string;
  city: string;
  weatherId: number;
}

interface RecentScan {
  id: string;
  mode: "crop" | "pest";
  imageUri: string;
  isHealthy: boolean;
  topName: string;
  probability: number;
  scannedAt: string;
}

function scanStatusColor(s: RecentScan) {
  if (s.isHealthy) return GREEN_MID;
  if (s.mode === "pest") return AMBER;
  return s.probability >= 70 ? RED : AMBER;
}

function scanStatusLabel(s: RecentScan) {
  if (s.isHealthy) return "Healthy";
  if (s.mode === "pest") return "Pest";
  return s.probability >= 70 ? "Severe" : "Disease";
}

const MARKET_ITEMS = [
  {
    id: "1",
    tag: "Seeds",
    tagColor: GREEN,
    name: "Tomato Hybrid Seeds (Arka Rakshak)",
    desc: "IIHR Hybrid • Triple Disease Resistant",
    price: "₹320",
    unit: "/ 10g",
    image: require("../../assets/images/crops/tomato_hybrid_seeds.png"),
    fallbackEmoji: "🍅",
  },
  {
    id: "2",
    tag: "Fertilizers",
    tagColor: AMBER,
    name: "IFFCO NPK 12:32:16",
    desc: "Complex Fertilizer • For All Crops",
    price: "₹450",
    unit: "/ 50 kg",
    image: require("../../assets/images/crops/iffco_npk_123216.png"),
    fallbackEmoji: "🌾",
  },
  {
    id: "3",
    tag: "Pesticides",
    tagColor: "#8B4513",
    name: "Neem Oil Pesticide (Coromandel)",
    desc: "Natural • Eco-Friendly • Cold Pressed",
    price: "₹280",
    unit: "/ 500 ml",
    image: require("../../assets/images/crops/neem_oil.png"),
    fallbackEmoji: "🌿",
  },
];

const MY_CROPS = [
  {
    id: "1",
    name: "Tomato",
    status: "Healthy",
    stage: "Fruiting",
    noIssues: true,
    image: require("../../assets/images/crops/crop_tomato.jpg"),
  },
  {
    id: "2",
    name: "Wheat",
    status: "Healthy",
    stage: "Tillering",
    noIssues: true,
    image: require("../../assets/images/crops/crop_wheat.jpg"),
  },
];

const NAV = [
  { key: "home",    icon: "home",        outlineIcon: "home-outline",        label: "Home",    route: "/screens/Dashboardscreen" },
  { key: "scan",    icon: "scan",        outlineIcon: "scan-outline",        label: "Scan",    route: "/(tabs)/scan"    },
  { key: "shop",    icon: "bag",         outlineIcon: "bag-outline",         label: "Shop",    route: "/(tabs)/shop"    },
  { key: "history", icon: "time",        outlineIcon: "time-outline",        label: "History", route: "/(tabs)/history" },
  { key: "profile", icon: "person",      outlineIcon: "person-outline",      label: "Profile", route: "/(tabs)/profile" },
] as const;

export default function DashboardScreen() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const [active, setActive] = useState("home");

  const [weather, setWeather]               = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError]     = useState(false);
  const [recentScans, setRecentScans]       = useState<RecentScan[]>([]);
  const [farmerName, setFarmerName]         = useState("Farmer");

  useFocusEffect(useCallback(() => {
    loadRecentScans();
    getFarmerName().then(setFarmerName);
  }, []));

  React.useEffect(() => { fetchWeather(); }, []);

  // ── BUG 2 FIX: Properly validate scan data before setting state ──
  const loadRecentScans = async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (!raw) { setRecentScans([]); return; }
      const all = JSON.parse(raw);
      if (!Array.isArray(all) || all.length === 0) { setRecentScans([]); return; }
      const recent: RecentScan[] = all.slice(0, 3).map((r: any) => ({
        id:          r.id ?? String(Math.random()),
        mode:        r.mode === "pest" ? "pest" : "crop",
        imageUri:    r.imageUri ?? "",
        isHealthy:   Boolean(r.isHealthy),
        topName:     r.isHealthy
          ? "Healthy Plant"
          : r.results?.[0]?.name ?? (r.mode === "pest" ? "Unknown Pest" : "Unknown Disease"),
        probability: r.results?.[0]?.probability ?? 0,
        scannedAt:   r.scannedAt ?? "",
      }));
      setRecentScans(recent);
    } catch {
      setRecentScans([]);
    }
  };

  const fetchWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(false);
    try {
      const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_KEY;
      let LAT = 19.4647, LON = 72.8114;

      try {
        const { status } = await require('expo-location').requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await require('expo-location').getCurrentPositionAsync({});
          LAT = location.coords.latitude;
          LON = location.coords.longitude;
        }
      } catch (e) {}

      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric`
      );
      if (!currentRes.ok) throw new Error("failed");
      const current = await currentRes.json();
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&cnt=1`
      );
      const forecast = await forecastRes.json();
      const rainChance = forecastRes.ok ? Math.round((forecast.list?.[0]?.pop ?? 0) * 100) : 0;
      setWeather({
        temp:        Math.round(current.main.temp),
        feels_like:  Math.round(current.main.feels_like),
        humidity:    current.main.humidity,
        wind_speed:  Math.round(current.wind.speed * 3.6),
        rain_chance: rainChance,
        description: current.weather[0].description
          .split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        city: current.name,
        weatherId: current.weather[0].id,
      });
    } catch {
      setWeatherError(true);
    } finally {
      setWeatherLoading(false);
    }
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning,";
    if (h < 17) return "Good Afternoon,";
    return "Good Evening,";
  })();

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Image
            source={require("../../assets/images/LOGO.png")}
            style={s.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={s.appName}>Fasal Raksha</Text>
            <Text style={s.tagline}>Surakshit Fasal, Samruddh Kisan</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[s.profileAvatarWrap, s.profileAvatarFallback]}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Text style={s.profileAvatarInitial}>{getInitial(farmerName)}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting ── */}
        <View style={s.greetingRow}>
          <Text style={s.greetingTop}>{greeting}</Text>
          <Text style={s.greetingName}>{farmerName} 🌿</Text>
        </View>

        {/* ── BUG 1 FIX: Weather Card — fixed height container so image never disappears ── */}
        <View style={s.weatherCardContainer}>
          <ImageBackground
            source={require("../../assets/images/crops/weather_farm_bg.jpg")}
            style={StyleSheet.absoluteFillObject}
            imageStyle={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={[
                "rgba(255,255,255,0.97)",
                "rgba(255,255,255,0.90)",
                "rgba(255,255,255,0.55)",
                "rgba(255,255,255,0.0)",
              ]}
              locations={[0, 0.45, 0.70, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
            {weatherLoading ? (
              <View style={s.weatherInner}>
                <ActivityIndicator color={DARK} size="small" />
                <Text style={s.weatherLoadText}>Fetching weather…</Text>
              </View>
            ) : weatherError || !weather ? (
              <View style={s.weatherInner}>
                <Ionicons name="cloud-offline-outline" size={22} color={DARK} />
                <Text style={s.weatherLoadText}>Weather unavailable</Text>
                <TouchableOpacity onPress={fetchWeather} style={s.retryBtn}>
                  <Text style={s.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={s.weatherContent}>
                <View style={s.weatherLeft}>
                  <View style={s.weatherLocRow}>
                    <Ionicons name="location-outline" size={13} color={GREEN_DARK} />
                    <Text style={s.weatherLocText}>{weather.city}, Maharashtra</Text>
                  </View>
                  <Text style={s.weatherTemp}>{weather.temp}°C</Text>
                  <Text style={s.weatherDesc}>{weather.description}</Text>
                  <View style={s.weatherPillRow}>
                    <View style={s.weatherPill}>
                      <Ionicons name="water-outline" size={12} color={MUTED} />
                      <Text style={s.weatherPillText}>{weather.humidity}% Humidity</Text>
                    </View>
                    <View style={s.weatherDivider} />
                    <View style={s.weatherPill}>
                      <Ionicons name="flag-outline" size={12} color={MUTED} />
                      <Text style={s.weatherPillText}>{weather.wind_speed} km/h Wind</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ImageBackground>
        </View>

        {/* ── Your Crops ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Your Crops</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
            <Text style={s.viewAll}>View All  ›</Text>
          </TouchableOpacity>
        </View>
        <View style={s.cropsRow}>
          {MY_CROPS.map((crop) => (
            <TouchableOpacity key={crop.id} style={s.cropCard} activeOpacity={0.85}>
              <Image source={crop.image} style={s.cropImage} resizeMode="cover" />
              <View style={s.cropInfo}>
                <Text style={s.cropName}>{crop.name}</Text>
                <View style={s.healthBadge}>
                  <Ionicons name="checkmark-circle" size={13} color={GREEN} />
                  <Text style={s.healthText}>{crop.status}</Text>
                </View>
                <Text style={s.cropStageLabel}>Growth Stage</Text>
                <View style={s.cropStageRow}>
                  <Text style={s.cropStage}>{crop.stage}</Text>
                  <Ionicons name="chevron-forward" size={14} color={GREEN} />
                </View>
              </View>
              <View style={s.noIssuesBar}>
                <Ionicons name="leaf-outline" size={12} color={GREEN} />
                <Text style={s.noIssuesText}>No issues detected</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quick Scan Banner ── */}
        <TouchableOpacity
          style={s.scanBanner}
          activeOpacity={0.9}
          onPress={() => router.push("/(tabs)/scan")}
        >
          <Image
            source={require("../../assets/images/crops/plant_illustration.jpg")}
            style={s.scanPlantImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["#FFFFFF", "#FFFFFF", "rgba(255,255,255,0.90)", "rgba(255,255,255,0)"]}
            locations={[0, 0.40, 0.62, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.scanFadeOverlay}
          />
          <View style={s.scanBannerContent}>
            <Text style={s.scanBannerTitle}>Quick Scan</Text>
            <Text style={s.scanBannerDesc}>
              Scan your crop or plant{"\n"}to detect issues instantly
            </Text>
            <View style={s.scanTagRow}>
              <View style={s.scanTag}>
                <Text style={s.scanTagText}>Fast • Easy • Accurate</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Marketplace Highlights ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Marketplace Highlights</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/shop")}>
            <Text style={s.viewAll}>View All  ›</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.marketScroll}
        >
          {MARKET_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={s.marketCard}
              activeOpacity={0.88}
              onPress={() => router.push("/(tabs)/shop")}
            >
              <View style={[s.marketTag, { backgroundColor: item.tagColor }]}>
                <Text style={s.marketTagText}>{item.tag}</Text>
              </View>
              <View style={s.marketCardBody}>
                <View style={s.marketImageBox}>
                  {item.image ? (
                    <Image
                      source={item.image}
                      style={s.marketProductImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={s.marketEmoji}>{item.fallbackEmoji}</Text>
                  )}
                </View>
                <View style={s.marketInfo}>
                  <Text style={s.marketName} numberOfLines={2}>{item.name}</Text>
                  <Text style={s.marketDesc} numberOfLines={2}>{item.desc}</Text>
                  <View style={s.marketFooter}>
                    <Text style={s.marketPrice}>
                      {item.price} <Text style={s.marketUnit}>{item.unit}</Text>
                    </Text>
                    <TouchableOpacity
                      style={[s.cartBtn, { backgroundColor: item.tagColor + "22" }]}
                      onPress={() => router.push("/(tabs)/shop")}
                    >
                      <Ionicons name="cart-outline" size={16} color={item.tagColor} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Recent Scans ── */}
        {recentScans.length > 0 && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Recent Scans</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
                <Text style={s.viewAll}>View All  ›</Text>
              </TouchableOpacity>
            </View>

            {recentScans.map((scan) => {
              const col = scanStatusColor(scan);
              return (
                <TouchableOpacity
                  key={scan.id}
                  style={s.scanRow}
                  activeOpacity={0.85}
                  onPress={() => router.push("/(tabs)/history")}
                >
                  {scan.imageUri ? (
                    <Image source={{ uri: scan.imageUri }} style={s.scanThumb} />
                  ) : (
                    <View style={[s.scanThumb, s.scanThumbPH]}>
                      <Text style={{ fontSize: 22 }}>
                        {scan.mode === "pest" ? "🐛" : "🍃"}
                      </Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={s.scanName} numberOfLines={1}>{scan.topName}</Text>
                    <View style={s.scanMeta}>
                      <View style={[s.scanDot, { backgroundColor: scan.mode === "pest" ? AMBER : GREEN_MID }]} />
                      <Text style={s.scanMetaText}>
                        {scan.mode === "pest" ? "Pest" : "Crop"} · {scan.scannedAt}
                      </Text>
                    </View>
                  </View>
                  <View style={[s.statusBadge, { backgroundColor: col + "18" }]}>
                    <View style={[s.statusDot, { backgroundColor: col }]} />
                    <Text style={[s.statusText, { color: col }]}>{scanStatusLabel(scan)}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* ── First Scan CTA ── */}
        {recentScans.length === 0 && (
          <TouchableOpacity
            style={s.firstScanCTA}
            activeOpacity={0.88}
            onPress={() => router.push("/(tabs)/scan")}
          >
            <View style={s.firstScanLeft}>
              <Text style={s.firstScanEmoji}>🌱</Text>
              <View>
                <Text style={s.firstScanTitle}>Pehli scan karo!</Text>
                <Text style={s.firstScanSub}>Apni fasal ki sehat jaanch karo</Text>
              </View>
            </View>
            <View style={s.firstScanBtn}>
              <Ionicons name="scan-outline" size={18} color={WHITE} />
              <Text style={s.firstScanBtnText}>Scan</Text>
            </View>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* ── Bottom Navbar ── */}
      <View style={[s.navbar, { height: 64 + insets.bottom, paddingBottom: 8 + insets.bottom }]}>
        {NAV.map((item) => {
          const on = item.key === active;
          return (
            <TouchableOpacity
              key={item.key}
              style={s.navItem}
              activeOpacity={0.7}
              onPress={() => {
                setActive(item.key);
                if (item.key !== "home") router.push(item.route as any);
              }}
            >
              <Ionicons
                name={(on ? item.icon : item.outlineIcon) as any}
                size={24}
                color={on ? DARK : MUTED}
              />
              <Text style={[s.navLabel, on && s.navLabelActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12,
    backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  headerLeft:            { flexDirection: "row", alignItems: "center", gap: 10 },
  logo:                  { width: 44, height: 44, borderRadius: 22 },
  appName:               { fontSize: 18, fontWeight: "800", color: GREEN_DARK, letterSpacing: -0.3 },
  tagline:               { fontSize: 11, color: GREEN, marginTop: 1 },
  profileAvatarWrap: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 2.5, borderColor: GREEN, overflow: "hidden",
  },
  profileAvatarFallback: { backgroundColor: GREEN_LIGHT, alignItems: "center", justifyContent: "center" },
  profileAvatarImg:      { width: "100%", height: "100%" },
  profileAvatarInitial:  { fontSize: 20, fontWeight: "800", color: GREEN },

  scroll: { paddingHorizontal: 20, paddingTop: 10 },

  greetingRow:  { marginBottom: 16 },
  greetingTop:  { fontSize: 16, color: DARK, fontWeight: "500" },
  greetingName: { fontSize: 30, fontWeight: "800", color: GREEN_DARK, letterSpacing: -0.5, lineHeight: 36 },

  // ── BUG 1 FIX: weatherCardContainer has fixed height so ImageBackground never collapses ──
  weatherCardContainer: {
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  weatherInner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 20, flex: 1,
  },
  weatherLoadText: { color: DARK, fontSize: 13 },
  retryBtn:        { marginLeft: 8, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: GREEN_LIGHT, borderRadius: 8 },
  retryText:       { color: GREEN, fontSize: 12, fontWeight: "700" },
  weatherContent:  { flexDirection: "row", padding: 18, flex: 1, alignItems: "center" },
  weatherLeft:     { flex: 1 },
  weatherLocRow:   { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 6 },
  weatherLocText:  { color: GREEN_DARK, fontSize: 12, fontWeight: "500" },
  weatherTemp:     { fontSize: 52, fontWeight: "800", color: GREEN_DARK, letterSpacing: -2, lineHeight: 58 },
  weatherDesc:     { color: DARK, fontSize: 14, marginBottom: 12 },
  weatherPillRow:  { flexDirection: "row", alignItems: "center" },
  weatherPill:     { flexDirection: "row", alignItems: "center", gap: 5 },
  weatherPillText: { color: MUTED, fontSize: 12, fontWeight: "500" },
  weatherDivider:  { width: 1, height: 14, backgroundColor: BORDER, marginHorizontal: 10 },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle:  { fontSize: 18, fontWeight: "800", color: DARK },
  viewAll:       { fontSize: 13, color: GREEN, fontWeight: "600" },

  cropsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  cropCard: {
    flex: 1, backgroundColor: WHITE, borderRadius: 16, overflow: "hidden",
    borderWidth: 1, borderColor: BORDER,
  },
  cropImage:      { width: "100%", height: 110 },
  cropInfo:       { padding: 10, gap: 2 },
  cropName:       { fontSize: 15, fontWeight: "700", color: DARK },
  healthBadge: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: GREEN_LIGHT, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start", marginTop: 2,
  },
  healthText:     { fontSize: 11, fontWeight: "600", color: GREEN },
  cropStageLabel: { fontSize: 10, color: GREEN, fontWeight: "600", marginTop: 6, letterSpacing: 0.5 },
  cropStageRow:   { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cropStage:      { fontSize: 13, fontWeight: "700", color: DARK },
  noIssuesBar: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: GREEN_LIGHT, paddingVertical: 6, paddingHorizontal: 10,
    borderTopWidth: 1, borderTopColor: BORDER,
  },
  noIssuesText: { fontSize: 11, color: GREEN, fontWeight: "500" },

  scanBanner: {
    backgroundColor: WHITE,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1, borderColor: BORDER,
    overflow: "hidden",
    minHeight: 145,
  },
  scanPlantImage: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
    width: "100%", height: "100%",
  },
  scanFadeOverlay: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right: 0,
  },
  scanBannerContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: 145,
    justifyContent: "center",
    gap: 4,
    maxWidth: "62%",
  },
  scanBannerTitle: { fontSize: 24, fontWeight: "800", color: GREEN_DARK },
  scanBannerDesc:  { fontSize: 13, color: MUTED, lineHeight: 19 },
  scanTagRow:      { flexDirection: "row", marginTop: 8 },
  scanTag:         { backgroundColor: GREEN_DARK, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  scanTagText:     { color: WHITE, fontSize: 11, fontWeight: "600" },

  marketScroll: { gap: 12, paddingBottom: 8, paddingRight: 4, marginBottom: 20 },
  marketCard: {
    width: 260, backgroundColor: WHITE, borderRadius: 16,
    padding: 12, borderWidth: 1, borderColor: BORDER,
  },
  marketTag: {
    alignSelf: "flex-start", borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10,
  },
  marketTagText:      { color: WHITE, fontSize: 11, fontWeight: "700" },
  marketCardBody:     { flexDirection: "row", alignItems: "center", gap: 12 },
  marketImageBox: {
    width: 90, height: 80, backgroundColor: BG, borderRadius: 10,
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  marketProductImage: { width: 80, height: 70 },
  marketEmoji:        { fontSize: 40 },
  marketInfo:         { flex: 1, gap: 3 },
  marketName:         { fontSize: 13, fontWeight: "700", color: DARK },
  marketDesc:         { fontSize: 11, color: MUTED, lineHeight: 15 },
  marketFooter: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginTop: 6,
  },
  marketPrice: { fontSize: 16, fontWeight: "800", color: DARK },
  marketUnit:  { fontSize: 11, fontWeight: "400", color: MUTED },
  cartBtn:     { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },

  scanRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: WHITE, borderRadius: 14, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: BORDER,
  },
  scanThumb:    { width: 50, height: 50, borderRadius: 12 },
  scanThumbPH:  { backgroundColor: GREEN_LIGHT, alignItems: "center", justifyContent: "center" },
  scanName:     { fontSize: 13, fontWeight: "600", color: DARK },
  scanMeta:     { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 },
  scanDot:      { width: 5, height: 5, borderRadius: 3 },
  scanMetaText: { fontSize: 11, color: MUTED },
  statusBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50,
  },
  statusDot:  { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "700" },

  firstScanCTA: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: GREEN_DARK, borderRadius: 16,
    paddingHorizontal: 18, paddingVertical: 16, marginBottom: 12,
  },
  firstScanLeft:    { flexDirection: "row", alignItems: "center", gap: 12 },
  firstScanEmoji:   { fontSize: 28 },
  firstScanTitle:   { fontSize: 15, fontWeight: "800", color: WHITE },
  firstScanSub:     { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 },
  firstScanBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  firstScanBtnText: { fontSize: 13, fontWeight: "700", color: WHITE },

  navbar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: WHITE, flexDirection: "row",
    paddingTop: 6, paddingHorizontal: 8,
    borderTopWidth: 1, borderTopColor: BORDER,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  navItem:        { flex: 1, alignItems: "center", justifyContent: "center", gap: 2 },
  navLabel:       { fontSize: 10, color: MUTED, fontWeight: "700", marginTop: 2 },
  navLabelActive: { color: DARK },
});