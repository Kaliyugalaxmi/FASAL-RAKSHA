// FILE PATH → app/screens/Historyscreen.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { buildFarmerStages } from "../../components/TreatmentTracker";

const BG          = "#F8F9F8";
const WHITE       = "#FFFFFF";
const DARK        = "#1A2E1A";
const MUTED       = "#5A7260";
const GREEN       = "#1A5C2A";
const GREEN_LIGHT = "#E8F4EA";
const GREEN_MID   = "#3A7A2A";
const GREEN_DARK  = "#0F3D1A";
const BORDER      = "rgba(26,92,42,0.08)";
const AMBER       = "#B8680A";
const RED         = "#C0392B";
const RED_LIGHT   = "#FDECEA";
const AMBER_LIGHT = "#FFF3DC";

const HISTORY_KEY = "cropguard_scan_history_v2";

interface HistoryResult {
  name: string;
  probability: number;
  description: string;
  commonNames: string[];
  treatment: {
    biological: string[];
    chemical: string[];
    prevention: string[];
  };
}

interface HistoryRecord {
  id: string;
  timestamp: number;
  mode: "crop" | "pest";
  imageUri: string;
  isHealthy: boolean;
  scannedAt: string;
  results: HistoryResult[];
  locationName?: string;
}

function statusColor(r: HistoryRecord) {
  if (r.isHealthy) return GREEN;
  if (r.mode === "pest") return AMBER;
  const top = r.results[0]?.probability ?? 0;
  return top >= 70 ? RED : AMBER;
}
function statusBg(r: HistoryRecord) {
  if (r.isHealthy) return GREEN_LIGHT;
  if (r.mode === "pest") return AMBER_LIGHT;
  const top = r.results[0]?.probability ?? 0;
  return top >= 70 ? RED_LIGHT : AMBER_LIGHT;
}
function statusLabel(r: HistoryRecord) {
  if (r.isHealthy) return "Healthy";
  if (r.mode === "pest") return "Pest";
  const top = r.results[0]?.probability ?? 0;
  return top >= 70 ? "Infected" : "Warning";
}

function getStages(result: HistoryResult, isPest: boolean) {
  const stages = buildFarmerStages(
    result.treatment.biological,
    result.treatment.chemical,
    result.treatment.prevention,
    isPest,
    result.name
  );
  return stages.map(s => ({
    stage: s.stage,
    label: s.title,
    color: s.kind === "urgent" ? RED : s.kind === "organic" ? GREEN : s.kind === "chemical" ? "#8B5CF6" : s.kind === "check" ? AMBER : GREEN_MID,
    bg: s.kind === "urgent" ? RED_LIGHT : s.kind === "organic" ? GREEN_LIGHT : s.kind === "chemical" ? "#F3EEFF" : s.kind === "check" ? AMBER_LIGHT : GREEN_LIGHT,
    actions: s.actions
  }));
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ record, onClose }: { record: HistoryRecord | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const [activeIdx, setActiveIdx] = useState(0);
  const [tab, setTab] = useState<"overview" | "treatment" | "prevention">("overview");
  const [openStage, setOpenStage] = useState<string | null>("01");

  useEffect(() => {
    if (record) { setActiveIdx(0); setTab("overview"); setOpenStage("01"); }
  }, [record]);

  if (!record) return null;

  const col    = statusColor(record);
  const bg     = statusBg(record);
  const item   = record.results[activeIdx];
  const isPest = record.mode === "pest";
  const stages = item ? getStages(item, isPest) : [];

  return (
    <Modal visible={!!record} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />

        <View style={d.header}>
          <TouchableOpacity style={d.backBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={d.headerTitle}>Scan Detail</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        >
          {/* Hero image */}
          {record.imageUri ? (
            <Image source={{ uri: record.imageUri }} style={d.heroImg} resizeMode="cover" />
          ) : (
            <View style={d.heroPlaceholder}>
              <Text style={{ fontSize: 52 }}>{isPest ? "🐛" : "🌿"}</Text>
            </View>
          )}

          {/* Status banner */}
          <View style={[d.statusBanner, { backgroundColor: bg, borderColor: col + "30" }]}>
            <Text style={{ fontSize: 24 }}>{record.isHealthy ? "✅" : isPest ? "🐛" : "⚠️"}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[d.statusTitle, { color: col }]}>
                {record.isHealthy ? "Healthy Plant" : isPest ? "Pest Identified" : "Disease Detected"}
              </Text>
              <Text style={d.statusMeta}>{record.scannedAt}</Text>
            </View>
            <View style={[d.statusBadge, { backgroundColor: col + "15" }]}>
              <Text style={[d.statusBadgeText, { color: col }]}>{statusLabel(record)}</Text>
            </View>
          </View>

          {/* Healthy */}
          {record.isHealthy && (
            <View style={[d.card, { backgroundColor: GREEN_LIGHT, borderColor: GREEN + "30", margin: 16 }]}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: GREEN, marginBottom: 6 }}>🌿 No Disease Found</Text>
              <Text style={{ fontSize: 13, color: GREEN, lineHeight: 20 }}>
                Your plant looks healthy! Keep monitoring every 3–5 days and maintain good agricultural practices.
              </Text>
            </View>
          )}

          {/* Disease results */}
          {!record.isHealthy && record.results.length > 0 && (
            <View style={{ paddingHorizontal: 16 }}>

              {/* Result selector — agar multiple results hain */}
              {record.results.length > 1 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {record.results.map((res, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          d.resultChip,
                          activeIdx === idx && { backgroundColor: GREEN_DARK, borderColor: GREEN_DARK }
                        ]}
                        onPress={() => { setActiveIdx(idx); setOpenStage("01"); }}
                      >
                        <Text style={[d.resultChipText, activeIdx === idx && { color: WHITE }]}>
                          {res.name} · {res.probability}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              )}

              {item && (
                <>
                  {/* Disease name + confidence */}
                  <View style={d.card}>
                    <Text style={d.cardLabel}>{isPest ? "IDENTIFIED PEST" : "DISEASE IDENTIFIED"}</Text>
                    <Text style={d.diseaseName}>{item.name}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 }}>
                      <View style={{ flex: 1, height: 6, backgroundColor: "#F0EAD8", borderRadius: 3, overflow: "hidden" }}>
                        <View style={{ height: "100%", borderRadius: 3, width: `${item.probability}%` as any, backgroundColor: col }} />
                      </View>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: col }}>{item.probability}% confidence</Text>
                    </View>
                  </View>

                  {/* Tabs */}
                  <View style={d.tabRow}>
                    {(["overview", "treatment", "prevention"] as const).map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[d.tabBtn, tab === t && d.tabBtnActive]}
                        onPress={() => setTab(t)}
                      >
                        <Text style={[d.tabLabel, tab === t && d.tabLabelActive]}>
                          {t === "overview" ? "🔍 Info" : t === "treatment" ? "💊 Treatment" : "🛡️ Prevention"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Overview tab */}
                  {tab === "overview" && (
                    <View style={d.card}>
                      <Text style={d.cardLabel}>{isPest ? "ABOUT THIS PEST" : "SYMPTOMS & DESCRIPTION"}</Text>
                      <Text style={{ fontSize: 13, color: DARK, lineHeight: 21, marginTop: 4 }}>
                        {item.description || "No description available for this result."}
                      </Text>
                      {item.commonNames?.length > 0 && (
                        <View style={{ marginTop: 10 }}>
                          <Text style={d.cardLabel}>ALSO KNOWN AS</Text>
                          <Text style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>
                            {item.commonNames.join(", ")}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Treatment tab */}
                  {tab === "treatment" && (
                    <>
                      {stages.filter(s => s.stage !== "05").length === 0 ? (
                        <View style={d.card}>
                          <Text style={{ color: MUTED, fontSize: 13 }}>No treatment steps available.</Text>
                        </View>
                      ) : (
                        stages.filter(s => s.stage !== "05").map((stage) => (
                          <TouchableOpacity
                            key={stage.stage}
                            style={[d.stageCard, { borderColor: stage.color + "30" }]}
                            onPress={() => setOpenStage(openStage === stage.stage ? null : stage.stage)}
                            activeOpacity={0.85}
                          >
                            <View style={d.stageHeader}>
                              <View style={[d.stageBadge, { backgroundColor: stage.bg }]}>
                                <Text style={[d.stageNum, { color: stage.color }]}>{stage.stage}</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={[d.stageLabel, { color: stage.color }]}>{stage.label}</Text>
                                <Text style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{stage.actions.length} actions</Text>
                              </View>
                              <Ionicons name={openStage === stage.stage ? "chevron-up" : "chevron-down"} size={16} color={MUTED} />
                            </View>
                            {openStage === stage.stage && (
                              <View style={{ paddingHorizontal: 14, paddingBottom: 12, borderTopWidth: 1, borderTopColor: BORDER }}>
                                {stage.actions.map((a, ai) => (
                                  <View key={ai} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 8 }}>
                                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: stage.color, marginTop: 6, flexShrink: 0 }} />
                                    <Text style={{ fontSize: 13, color: DARK, lineHeight: 19, flex: 1 }}>{a}</Text>
                                  </View>
                                ))}
                              </View>
                            )}
                          </TouchableOpacity>
                        ))
                      )}
                    </>
                  )}

                  {/* Prevention tab */}
                  {tab === "prevention" && (
                    <>
                      {stages.filter(s => s.stage === "05").length === 0 ? (
                        <View style={d.card}>
                          <Text style={{ color: MUTED, fontSize: 13 }}>No prevention tips available.</Text>
                        </View>
                      ) : (
                        stages.filter(s => s.stage === "05").map((stage) => (
                          <View key={stage.stage} style={[d.stageCard, { borderColor: stage.color + "30" }]}>
                            <View style={d.stageHeader}>
                              <View style={[d.stageBadge, { backgroundColor: stage.bg }]}>
                                <Text style={[d.stageNum, { color: stage.color }]}>🛡️</Text>
                              </View>
                              <Text style={[d.stageLabel, { color: stage.color, flex: 1 }]}>{stage.label}</Text>
                            </View>
                            <View style={{ paddingHorizontal: 14, paddingBottom: 12, borderTopWidth: 1, borderTopColor: BORDER }}>
                              {stage.actions.map((a, ai) => (
                                <View key={ai} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 8 }}>
                                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: stage.color, marginTop: 6, flexShrink: 0 }} />
                                  <Text style={{ fontSize: 13, color: DARK, lineHeight: 19, flex: 1 }}>{a}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        ))
                      )}
                    </>
                  )}
                </>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── History Card ─────────────────────────────────────────────────────────────
function HistoryCard({ record, onPress }: { record: HistoryRecord; onPress: () => void }) {
  const col   = statusColor(record);
  const bg    = statusBg(record);
  const label = statusLabel(record);
  const top   = record.results[0];

  // FIX: hardcoded title hata ke real data use karo
  const title = record.isHealthy
    ? "Healthy Plant"
    : top?.name
    ? top.name + (record.locationName ? " — " + record.locationName : "")
    : record.mode === "pest"
    ? "Unknown Pest"
    : "Unknown Disease";

  return (
    <TouchableOpacity style={h.card} activeOpacity={0.8} onPress={onPress}>
      <View style={h.cardBody}>
        <Image
          source={
            record.imageUri
              ? { uri: record.imageUri }
              : require("../../assets/images/LOGO.png")
          }
          style={h.image}
          resizeMode="cover"
        />
        <View style={h.info}>
          <Text style={h.title} numberOfLines={1}>{title}</Text>
          <Text style={h.date}>{record.scannedAt}</Text>
          <View style={[h.statusBadge, { backgroundColor: bg }]}>
            <View style={[h.statusDot, { backgroundColor: col }]} />
            <Text style={[h.statusText, { color: col }]}>{label}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#D1D1D1" />
      </View>
    </TouchableOpacity>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Historyscreen() {
  const insets   = useSafeAreaInsets();
  const router   = useRouter();
  const [records, setRecords]       = useState<HistoryRecord[]>([]);
  const [selected, setSelected]     = useState<HistoryRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]         = useState("");
  const [timeFilter, setTimeFilter] = useState<"Today" | "This Week" | "This Month">("Today");

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(HISTORY_KEY);
      if (!raw) { setRecords([]); return; }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) { setRecords([]); return; }
      // Newest pehle
      const sorted = parsed.sort((a: HistoryRecord, b: HistoryRecord) =>
        (b.timestamp ?? 0) - (a.timestamp ?? 0)
      );
      setRecords(sorted);
    } catch {
      setRecords([]);
    }
  }, []);

  useEffect(() => { load(); }, []);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  // Time filter logic
  const filterByTime = (record: HistoryRecord) => {
    const now  = Date.now();
    const ts   = record.timestamp ?? 0;
    const diff = now - ts;
    if (timeFilter === "Today")      return diff < 86400000;           // 24 hrs
    if (timeFilter === "This Week")  return diff < 7 * 86400000;       // 7 days
    if (timeFilter === "This Month") return diff < 30 * 86400000;      // 30 days
    return true;
  };

  const filtered = records.filter(r => {
    const matchesTime   = filterByTime(r);
    const name          = r.results[0]?.name?.toLowerCase() ?? "";
    const location      = r.locationName?.toLowerCase() ?? "";
    const matchesSearch = search.trim() === "" || name.includes(search.toLowerCase()) || location.includes(search.toLowerCase());
    return matchesTime && matchesSearch;
  });

  const healthyCount  = records.filter(r => r.isHealthy).length;
  const infectedCount = records.filter(r => !r.isHealthy && r.mode === "crop" && (r.results[0]?.probability ?? 0) >= 70).length;
  const warningCount  = records.filter(r => !r.isHealthy && (r.mode === "pest" || (r.results[0]?.probability ?? 0) < 70)).length;

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={26} color={DARK} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Scan History</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh-outline" size={24} color={DARK} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={GREEN_MID} />}
      >
        {/* Search Bar */}
        <View style={s.searchContainer}>
          <Ionicons name="search-outline" size={20} color={MUTED} style={s.searchIcon} />
          <TextInput
            style={s.searchInput}
            placeholder="Search by disease or location..."
            placeholderTextColor={MUTED}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={MUTED} />
            </TouchableOpacity>
          )}
        </View>

        {/* Time Filters */}
        <View style={s.filterRow}>
          {(["Today", "This Week", "This Month"] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[s.filterChip, timeFilter === f && s.filterChipActive]}
              onPress={() => setTimeFilter(f)}
            >
              <Text style={[s.filterText, timeFilter === f && s.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <View style={s.listContainer}>
          {filtered.length === 0 ? (
            <View style={s.empty}>
              <Ionicons name="leaf-outline" size={40} color={MUTED} style={{ marginBottom: 10 }} />
              <Text style={s.emptyTitle}>
                {records.length === 0 ? "No scans yet" : "No results found"}
              </Text>
              <Text style={s.emptyText}>
                {records.length === 0
                  ? "Scan a crop to see your history here"
                  : "Try changing the filter or search term"}
              </Text>
            </View>
          ) : (
            filtered.map((record) => (
              <HistoryCard
                key={record.id}
                record={record}
                onPress={() => setSelected(record)}
              />
            ))
          )}
        </View>

        {/* Month Overview Card */}
        <View style={s.overviewCard}>
          <View style={s.overviewHeader}>
            <View>
              <Text style={s.overviewTitle}>OVERVIEW</Text>
              <Text style={s.overviewTotal}>{records.length} Total Scans</Text>
            </View>
            <Ionicons name="stats-chart" size={20} color={WHITE} />
          </View>
          <View style={s.statsGrid}>
            <View style={s.statBox}>
              <Text style={s.statValue}>{healthyCount}</Text>
              <Text style={s.statLabel}>Healthy</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{infectedCount}</Text>
              <Text style={s.statLabel}>Infected</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statValue}>{warningCount}</Text>
              <Text style={s.statLabel}>Warnings</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <DetailModal record={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: DARK },

  searchContainer: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: WHITE, marginHorizontal: 20, marginTop: 16,
    borderRadius: 14, paddingHorizontal: 15, height: 50,
    marginBottom: 14, borderWidth: 1, borderColor: BORDER,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 14, color: DARK },

  filterRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 20 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 25, backgroundColor: WHITE, borderWidth: 1, borderColor: BORDER },
  filterChipActive: { backgroundColor: GREEN_DARK, borderColor: GREEN_DARK },
  filterText: { fontSize: 13, fontWeight: "600", color: MUTED },
  filterTextActive: { color: WHITE },

  listContainer: { paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  empty: { alignItems: "center", paddingVertical: 50 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: DARK, marginBottom: 6 },
  emptyText: { color: MUTED, fontSize: 13, textAlign: "center" },

  overviewCard: {
    backgroundColor: GREEN_DARK, marginHorizontal: 20,
    borderRadius: 20, padding: 20, gap: 18,
  },
  overviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  overviewTitle: { color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: "700", letterSpacing: 1.2 },
  overviewTotal: { color: WHITE, fontSize: 18, fontWeight: "800", marginTop: 4 },
  statsGrid: { flexDirection: "row", gap: 10 },
  statBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.10)", borderRadius: 12, padding: 14, alignItems: "center" },
  statValue: { color: WHITE, fontSize: 22, fontWeight: "800" },
  statLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 4 },
});

const h = StyleSheet.create({
  card: {
    backgroundColor: WHITE, borderRadius: 16,
    padding: 12, borderWidth: 1, borderColor: BORDER,
  },
  cardBody: { flexDirection: "row", alignItems: "center", gap: 14 },
  image: { width: 65, height: 65, borderRadius: 12, backgroundColor: GREEN_LIGHT },
  info: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: "700", color: DARK },
  date: { fontSize: 12, color: MUTED },
  statusBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50, alignSelf: "flex-start", marginTop: 2,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: "700" },
});

const d = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: BG,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: WHITE, borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: DARK },
  heroImg: { width: "100%", height: 230 },
  heroPlaceholder: { width: "100%", height: 160, backgroundColor: GREEN_LIGHT, alignItems: "center", justifyContent: "center" },
  statusBanner: {
    flexDirection: "row", alignItems: "center", gap: 10,
    margin: 16, marginBottom: 8, padding: 14,
    borderRadius: 18, borderWidth: 1,
  },
  statusTitle:     { fontSize: 15, fontWeight: "800" },
  statusMeta:      { fontSize: 11, color: MUTED, marginTop: 2 },
  statusBadge:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 50 },
  statusBadgeText: { fontSize: 11, fontWeight: "700" },
  card: {
    backgroundColor: WHITE, borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: BORDER,
  },
  cardLabel:   { fontSize: 9, fontWeight: "700", color: MUTED, letterSpacing: 1.2, marginBottom: 4 },
  diseaseName: { fontSize: 18, fontWeight: "800", color: DARK },
  resultChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 50,
    backgroundColor: WHITE, borderWidth: 1, borderColor: BORDER,
  },
  resultChipText: { fontSize: 12, fontWeight: "600", color: DARK },
  tabRow: {
    flexDirection: "row", backgroundColor: WHITE,
    borderRadius: 14, padding: 4,
    borderWidth: 1, borderColor: BORDER, marginBottom: 12, gap: 4,
  },
  tabBtn:         { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  tabBtnActive:   { backgroundColor: GREEN_LIGHT },
  tabLabel:       { fontSize: 11, fontWeight: "600", color: MUTED },
  tabLabelActive: { color: GREEN_MID, fontWeight: "700" },
  stageCard: {
    backgroundColor: WHITE, borderRadius: 16, marginBottom: 10,
    borderWidth: 1, overflow: "hidden",
  },
  stageHeader: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  stageBadge:  { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  stageNum:    { fontSize: 13, fontWeight: "800" },
  stageLabel:  { fontSize: 14, fontWeight: "700" },
});