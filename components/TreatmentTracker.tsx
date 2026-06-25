// FILE PATH → app/components/TreatmentTracker.tsx
// Professional redesign — matches Fasal Raksha app-wide theme
// (header green #0F3D1A, brand greens, warm BG #F5F5EF, serif headings)
//
// Fixes vs old version:
//  - Progress header: circular ring replaced with a clean horizontal progress
//    bar + numeric %, less visual competition with the page header above it.
//  - Stage cards: every stage now uses ONE consistent card language
//    (icon chip + title + meta pill + chevron) instead of mixed pink/green/
//    purple/yellow blocks that read as "random colors" rather than a system.
//    Color is now used purposefully: red = urgent/today, green = organic,
//    violet = chemical, amber = check-in — same hierarchy as the rest of the
//    app's severity colors (RED/AMBER/GREEN_MID).
//  - Numbered action items inside an open stage use a quieter neutral chip
//    instead of solid red circles for every single line, so "urgency red" is
//    reserved for the stage header only.
//  - "Need expert advice" and "Other Possibilities" restyled to match the
//    DetailCard / otherRow patterns already used on CropResultScreen, so the
//    whole flow now feels like one product.

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Theme (matches app-wide Fasal Raksha palette) ───────────────────────────
const WHITE       = "#FFFFFF";
const DARK        = "#1A2E1A";
const MUTED       = "#5A7260";
const GREEN       = "#1A5C2A";
const GREEN_LIGHT = "#E8F4EA";
const GREEN_MID   = "#3A7A2A";
const GREEN_DARK  = "#0F3D1A";
const BORDER      = "rgba(26,92,42,0.12)";
const RED         = "#C0392B";
const RED_LIGHT   = "#FDECEA";
const AMBER       = "#B8680A";
const AMBER_LIGHT = "#FFF8EE";
const VIOLET       = "#5E4B9C";
const VIOLET_LIGHT = "#F1EEFB";

// ─── Types ────────────────────────────────────────────────────────────────────
export type StageKind = "urgent" | "organic" | "chemical" | "check" | "prevention";

export interface TreatmentStage {
  stage: string;          // "01".."05" — "05" reserved for prevention tab
  kind: StageKind;
  dayLabel: string;       // "Day 1", "Days 1–3", "Day 3–5 (if organic fails)"
  cadence: string;        // "Do once, immediately", "Every 3 days for 2 weeks"
  title: string;          // "Act Today", "Organic Spray", "Chemical Treatment"
  actions: string[];
  done?: boolean;
}

interface OtherPossibility {
  name: string;
  confidence: number;
  risk: "Low" | "Moderate" | "High";
}

interface TreatmentTrackerProps {
  diseaseName: string;
  estimatedDays?: number;
  stages: TreatmentStage[];
  otherPossibilities?: OtherPossibility[];
  helplineNumber?: string;
  helplineHours?: string;
  onMarkStageDone?: (stage: TreatmentStage) => void;
}

// ─── Visual config per stage kind — one consistent system ────────────────────
const KIND_CONFIG: Record<
  StageKind,
  { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap; chipBg: string }
> = {
  urgent:     { bg: RED_LIGHT,    fg: RED,    icon: "alert-circle",  chipBg: RED + "15" },
  organic:    { bg: GREEN_LIGHT,  fg: GREEN,  icon: "leaf",          chipBg: GREEN + "15" },
  chemical:   { bg: VIOLET_LIGHT, fg: VIOLET, icon: "flask",         chipBg: VIOLET + "15" },
  check:      { bg: AMBER_LIGHT,  fg: AMBER,  icon: "search",        chipBg: AMBER + "15" },
  prevention: { bg: GREEN_LIGHT,  fg: GREEN_MID, icon: "shield-checkmark", chipBg: GREEN_MID + "15" },
};

function riskColor(risk: OtherPossibility["risk"]) {
  if (risk === "High") return RED;
  if (risk === "Moderate") return AMBER;
  return GREEN_MID;
}

// ─── Stage Card ────────────────────────────────────────────────────────────────
function StageCard({
  stage,
  isOpen,
  onToggle,
  onMarkDone,
}: {
  stage: TreatmentStage;
  isOpen: boolean;
  onToggle: () => void;
  onMarkDone?: () => void;
}) {
  const cfg = KIND_CONFIG[stage.kind];

  return (
    <View style={[tc.card, stage.done && tc.cardDone]}>
      <TouchableOpacity style={tc.head} activeOpacity={0.8} onPress={onToggle}>
        <View style={[tc.iconChip, { backgroundColor: cfg.chipBg }]}>
          <Ionicons name={stage.done ? "checkmark-circle" : cfg.icon} size={20} color={cfg.fg} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={tc.metaRow}>
            <Text style={[tc.dayLabel, { color: cfg.fg }]}>{stage.dayLabel}</Text>
            <View style={[tc.cadencePill, { backgroundColor: cfg.chipBg }]}>
              <Ionicons name="time-outline" size={10} color={cfg.fg} />
              <Text style={[tc.cadenceText, { color: cfg.fg }]}>{stage.cadence}</Text>
            </View>
          </View>
          <Text style={tc.stageTitle}>{stage.title}</Text>
          <Text style={tc.actionCount}>
            {stage.actions.length} {stage.actions.length === 1 ? "action" : "actions"}
          </Text>
        </View>

        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color={MUTED}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={tc.body}>
          {stage.actions.map((action, i) => (
            <View key={i} style={[tc.actionRow, i === stage.actions.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={[tc.actionNum, { backgroundColor: cfg.chipBg }]}>
                <Text style={[tc.actionNumText, { color: cfg.fg }]}>{i + 1}</Text>
              </View>
              <Text style={tc.actionText}>{action}</Text>
            </View>
          ))}

          {onMarkDone && (
            <TouchableOpacity
              style={[tc.doneBtn, { backgroundColor: stage.done ? GREEN_MID : cfg.fg }]}
              activeOpacity={0.85}
              onPress={onMarkDone}
            >
              <Ionicons
                name={stage.done ? "checkmark-done" : "checkmark"}
                size={16}
                color={WHITE}
              />
              <Text style={tc.doneBtnText}>
                {stage.done ? "Stage Completed" : "Mark Stage as Done"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function TreatmentTracker({
  diseaseName,
  estimatedDays = 14,
  stages,
  otherPossibilities = [],
  helplineNumber = "1800-180-1551",
  helplineHours = "Free, daily 6AM–10PM",
  onMarkStageDone,
}: TreatmentTrackerProps) {
  const [openStage, setOpenStage] = useState<string | null>(stages[0]?.stage ?? null);
  const [filter, setFilter] = useState<"all" | "organic" | "chemical">("all");
  const [localStages, setLocalStages] = useState(stages);

  const toggleStage = (stageId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenStage((cur) => (cur === stageId ? null : stageId));
  };

  const markDone = (stage: TreatmentStage) => {
    setLocalStages((cur) =>
      cur.map((s) => (s.stage === stage.stage ? { ...s, done: true } : s))
    );
    onMarkStageDone?.(stage);
  };

  const visibleStages = localStages.filter((s) => {
    if (filter === "organic") return s.kind === "organic" || s.kind === "urgent" || s.kind === "check";
    if (filter === "chemical") return s.kind === "chemical" || s.kind === "urgent" || s.kind === "check";
    return true;
  });

  const completedCount = localStages.filter((s) => s.done).length;
  const progressPct = localStages.length
    ? Math.round((completedCount / localStages.length) * 100)
    : 0;

  return (
    <View style={tc.wrap}>
      {/* ── Treatment Plan header ── */}
      <View style={tc.planHeader}>
        <View style={{ flex: 1 }}>
          <Text style={tc.planEyebrow}>TREATMENT PLAN</Text>
          <Text style={tc.planTitle}>{diseaseName}</Text>

          <View style={tc.progressTrack}>
            <View style={[tc.progressFill, { width: `${Math.max(progressPct, 4)}%` }]} />
          </View>

          <View style={tc.planMetaRow}>
            <Ionicons name="calendar-outline" size={13} color={MUTED} />
            <Text style={tc.planMetaText}>
              Est. {estimatedDays}-day treatment · Start immediately
            </Text>
          </View>
        </View>

        <View style={tc.progressBadge}>
          <Text style={tc.progressBadgeNum}>{progressPct}%</Text>
          <Text style={tc.progressBadgeLabel}>done</Text>
        </View>
      </View>

      {/* ── Filter tabs ── */}
      <View style={tc.tabRow}>
        {(
          [
            { key: "all", label: "All Steps", icon: "list-outline" },
            { key: "organic", label: "Organic", icon: "leaf-outline" },
            { key: "chemical", label: "Chemical", icon: "flask-outline" },
          ] as const
        ).map((t) => {
          const on = filter === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[tc.tabBtn, on && tc.tabBtnActive]}
              activeOpacity={0.85}
              onPress={() => setFilter(t.key)}
            >
              <Ionicons name={t.icon} size={14} color={on ? WHITE : GREEN} />
              <Text style={[tc.tabBtnText, on && tc.tabBtnTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filter !== "all" && (
        <View
          style={[
            tc.trackBanner,
            { backgroundColor: filter === "organic" ? GREEN_LIGHT : VIOLET_LIGHT },
          ]}
        >
          <Ionicons
            name={filter === "organic" ? "leaf" : "flask"}
            size={16}
            color={filter === "organic" ? GREEN : VIOLET}
          />
          <View style={{ flex: 1 }}>
            <Text style={[tc.trackBannerTitle, { color: filter === "organic" ? GREEN : VIOLET }]}>
              {filter === "organic" ? "Organic / Natural Track" : "Chemical Track"}
            </Text>
            <Text style={tc.trackBannerSub}>
              {filter === "organic"
                ? "Safe for humans and soil · Best as first attempt"
                : "Use only if organic treatment doesn't show results"}
            </Text>
          </View>
        </View>
      )}

      {/* ── Stage cards ── */}
      <View style={tc.stageList}>
        {visibleStages.map((stage) => (
          <StageCard
            key={stage.stage}
            stage={stage}
            isOpen={openStage === stage.stage}
            onToggle={() => toggleStage(stage.stage)}
            onMarkDone={() => markDone(stage)}
          />
        ))}
      </View>

      {/* ── Expert helpline ── */}
      <TouchableOpacity
        style={tc.helplineCard}
        activeOpacity={0.85}
        onPress={() => Linking.openURL(`tel:${helplineNumber.replace(/-/g, "")}`)}
      >
        <View style={tc.helplineIconWrap}>
          <Ionicons name="call" size={18} color={GREEN_DARK} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={tc.helplineTitle}>Need expert advice?</Text>
          <Text style={tc.helplineSub}>
            Call your local KVK or Kisan Call Centre:{" "}
            <Text style={tc.helplineNumber}>{helplineNumber}</Text> ({helplineHours})
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={GREEN_DARK} />
      </TouchableOpacity>

      {/* ── Other Possibilities ── */}
      {otherPossibilities.length > 0 && (
        <View style={tc.otherSection}>
          <Text style={tc.otherTitle}>Other Possibilities</Text>
          {otherPossibilities.map((p, i) => {
            const col = riskColor(p.risk);
            return (
              <TouchableOpacity key={i} style={tc.otherRow} activeOpacity={0.85}>
                <View style={[tc.otherIcon, { backgroundColor: col + "15" }]}>
                  <Ionicons name="bug-outline" size={20} color={col} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={tc.otherName}>{p.name}</Text>
                  <Text style={[tc.otherPct, { color: col }]}>{p.confidence}% confidence</Text>
                </View>
                <View style={[tc.riskPill, { backgroundColor: col }]}>
                  <Text style={tc.riskPillText}>{p.risk} Risk</Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color={MUTED} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

export function buildFarmerStages(
  biological: string[],
  chemical: string[],
  prevention: string[],
  isPest: boolean,
  diseaseName: string
): TreatmentStage[] {
  const stages: TreatmentStage[] = [];

  // 1. Urgent / Immediate Action
  stages.push({
    stage: "01",
    kind: "urgent",
    dayLabel: "Day 1",
    cadence: "Do once, immediately",
    title: isPest ? "Remove Pests" : "Isolate Infection",
    actions: isPest 
      ? [`Manually remove visible ${diseaseName} if possible`, "Prune heavily infested leaves", "Clean the area around the plant"]
      : [`Remove leaves showing ${diseaseName} symptoms`, "Do not leave cuttings on soil", "Disinfect tools after use"],
  });

  // 2. Biological / Organic
  if (biological && biological.length > 0) {
    stages.push({
      stage: "02",
      kind: "organic",
      dayLabel: "Days 1–3",
      cadence: "Every 3 days",
      title: "Organic Treatment",
      actions: biological,
    });
  }

  // 3. Chemical
  if (chemical && chemical.length > 0) {
    stages.push({
      stage: "03",
      kind: "chemical",
      dayLabel: "Day 3–5 (if organic fails)",
      cadence: "Follow label instructions",
      title: "Chemical Control",
      actions: chemical,
    });
  }

  // 4. Monitoring
  stages.push({
    stage: "04",
    kind: "check",
    dayLabel: "Day 7 onwards",
    cadence: "Daily check-ins",
    title: "Monitor Recovery",
    actions: [
      "Check for new symptoms on fresh growth",
      "Ensure proper watering and nutrition",
      "Observe if the problem spreads to other plants"
    ],
  });

  // 5. Prevention (hidden in tracker, used for prevention section)
  if (prevention && prevention.length > 0) {
    stages.push({
      stage: "05",
      kind: "prevention",
      dayLabel: "Next Season",
      cadence: "Ongoing",
      title: "Future Prevention",
      actions: prevention,
    });
  }

  return stages;
}

// ─── Sample data builder — replace with real plan parsing ────────────────────
export function buildSampleStages(diseaseName: string): TreatmentStage[] {
  return buildFarmerStages(
    ["Apply neem oil spray", "Use soap water solution"],
    ["Apply recommended fungicide"],
    ["Crop rotation", "Use resistant varieties"],
    false,
    diseaseName
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const tc = StyleSheet.create({
  wrap: { gap: 14 },

  // Plan header
  planHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },
  planEyebrow: { fontSize: 11, fontWeight: "700", color: MUTED, letterSpacing: 0.8, marginBottom: 3 },
  planTitle: { fontSize: 19, fontWeight: "800", color: DARK, fontFamily: "serif", marginBottom: 10 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN_LIGHT,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: { height: "100%", borderRadius: 3, backgroundColor: GREEN_MID },
  planMetaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  planMetaText: { fontSize: 11.5, color: MUTED },

  progressBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GREEN_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  progressBadgeNum: { fontSize: 16, fontWeight: "800", color: GREEN_DARK },
  progressBadgeLabel: { fontSize: 9, color: GREEN_MID, fontWeight: "600", marginTop: -2 },

  // Tabs
  tabRow: { flexDirection: "row", gap: 8 },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
  },
  tabBtnActive: { backgroundColor: GREEN_DARK, borderColor: GREEN_DARK },
  tabBtnText: { fontSize: 12, fontWeight: "700", color: GREEN },
  tabBtnTextActive: { color: WHITE },

  // Track banner
  trackBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 16,
  },
  trackBannerTitle: { fontSize: 13.5, fontWeight: "800", marginBottom: 2 },
  trackBannerSub: { fontSize: 11.5, color: MUTED, lineHeight: 16 },

  // Stage list / card
  stageList: { gap: 10 },
  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  cardDone: { opacity: 0.6 },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  iconChip: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" },
  dayLabel: { fontSize: 12, fontWeight: "800" },
  cadencePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 50,
  },
  cadenceText: { fontSize: 10, fontWeight: "600" },
  stageTitle: { fontSize: 15.5, fontWeight: "800", color: DARK, fontFamily: "serif" },
  actionCount: { fontSize: 11, color: MUTED, marginTop: 1 },

  body: { paddingHorizontal: 14, paddingBottom: 14 },
  actionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  actionNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  actionNumText: { fontSize: 11, fontWeight: "800" },
  actionText: { flex: 1, fontSize: 13, color: DARK, lineHeight: 19 },

  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 10,
  },
  doneBtnText: { fontSize: 13, fontWeight: "800", color: WHITE },

  // Helpline
  helplineCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: GREEN_LIGHT,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  helplineIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  helplineTitle: { fontSize: 13.5, fontWeight: "800", color: DARK, marginBottom: 2 },
  helplineSub: { fontSize: 11.5, color: MUTED, lineHeight: 16 },
  helplineNumber: { fontWeight: "800", color: GREEN_DARK },

  // Other possibilities
  otherSection: { gap: 8 },
  otherTitle: { fontSize: 16, fontWeight: "800", color: DARK, fontFamily: "serif", marginBottom: 4 },
  otherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  otherIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  otherName: { fontSize: 13.5, fontWeight: "700", color: DARK },
  otherPct: { fontSize: 11, fontWeight: "600", marginTop: 2 },
  riskPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 },
  riskPillText: { fontSize: 10.5, fontWeight: "700", color: WHITE },
});