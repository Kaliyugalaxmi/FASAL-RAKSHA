

import { Ionicons } from "@expo/vector-icons";
import * as Print from 'expo-print';
import { useFocusEffect, useRouter } from "expo-router";
import * as Sharing from 'expo-sharing';
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActiveScan, getActiveScan, saveActiveScanToHistory } from "../../lib/activeScanStore";

// ─── Theme — EXACT same tokens as Dashboard / Scan / Profile ──────────────
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

// Fallback hero photo — only used if the scan didn't carry its own photo.
const PLANT_ILLUSTRATION = require("../../assets/images/crops/plant_illustration.jpg");

// ─── Helpers ────────────────────────────────────────────────────────────────
function getSeverity(probability: number): { label: string; color: string } {
  if (probability >= 70) return { label: "Severe", color: RED };
  if (probability >= 40) return { label: "Moderate", color: AMBER };
  return { label: "Mild", color: GREEN_MID };
}

function riskColor(p: number) {
  if (p >= 60) return RED;
  if (p >= 30) return AMBER;
  return GREEN_MID;
}

export default function CropResultScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [scan, setScan] = useState<ActiveScan | null>(null);
  const [activeTab, setActiveTab] = useState<"organic" | "chemical">("organic");

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        setLoading(true);
        const data = await getActiveScan();
        if (isActive) {
          setScan(data);
          setLoading(false);
        }
      })();
      return () => { isActive = false; };
    }, [])
  );

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={st.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <View style={st.centerFill}>
          <ActivityIndicator size="large" color={GREEN_DARK} />
          <Text style={st.loadingText}>Loading result…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── No scan found ───────────────────────────────────────────────────────
  if (!scan || !scan.activeDisease) {
    return (
      <SafeAreaView style={st.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <View style={st.centerFill}>
          <Ionicons name="leaf-outline" size={40} color={MUTED} />
          <Text style={st.emptyTitle}>No scan result found</Text>
          <Text style={st.emptySub}>
            Scan a leaf or plant photo first to see its treatment plan here.
          </Text>
          <Pressable style={st.primaryBtn} onPress={() => router.replace("/(tabs)/scan")}>
            <Ionicons name="scan-outline" size={16} color={WHITE} />
            <Text style={st.primaryBtnText}>Go to Scan</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Healthy plant ───────────────────────────────────────────────────────
  if (scan.isHealthy) {
    return (
      <SafeAreaView style={st.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <View style={st.centerFill}>
          <Ionicons name="checkmark-circle" size={48} color={GREEN_MID} />
          <Text style={st.emptyTitle}>Plant looks healthy!</Text>
          <Text style={st.emptySub}>
            No disease was detected in this scan. Keep up the good care.
          </Text>
          <Pressable style={st.primaryBtn} onPress={() => router.replace("/(tabs)/scan")}>
            <Ionicons name="scan-outline" size={16} color={WHITE} />
            <Text style={st.primaryBtnText}>Scan Another</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── Build display data from the saved scan ─────────────────────────────
  const disease = scan.activeDisease;
  const severity = getSeverity(disease.probability);

  // Real scanned photo if available (see the ⚠️ note at the top of this
  // file for the 2-line change needed to start saving it), else fallback.
  const heroImage = (scan as any).imageUri
    ? { uri: (scan as any).imageUri }
    : PLANT_ILLUSTRATION;

  const cropName = (disease as any).crop?.trim() || "Your Crop";
  const cropScientificName = (disease as any).cropScientificName?.trim() || null;
  const diseaseScientificName = (disease as any).scientificName?.trim() || null;

  const description =
    (disease as any).description?.trim() ||
    `${disease.name} was detected with ${disease.probability}% confidence. If left untreated it can spread to nearby plants and reduce yield, so early treatment is recommended.`;

  // TODO: wire real structured symptoms from the backend/Dify response —
  // these are placeholder bullets until that data is available.
  const symptoms: string[] = (disease as any).symptoms?.length
    ? (disease as any).symptoms
    : [
        "Discoloured or water-soaked spots on leaves",
        "Wilting, curling, or stunted growth",
        "Visible lesions, mould, or fungal growth",
      ];

  const organicList = disease.treatment.biological?.length
    ? disease.treatment.biological
    : ["Remove and destroy infected leaves, improve airflow, and spray neem oil every 7 days."];

  const chemicalList = disease.treatment.chemical?.length
    ? disease.treatment.chemical
    : [`Consult a local agronomist for a suitable fungicide/pesticide dosage for ${disease.name}.`];

  const preventionText =
    disease.treatment.prevention?.join("\n\n") ||
    "Improve air circulation by spacing plants well apart. Use drip irrigation instead of overhead watering to keep foliage dry.";

  const precautionsText =
    (disease as any).precautions?.trim() ||
    "Sanitize tools after handling infected plants to prevent cross-contamination to healthy crops. Avoid composting infected plant material.";

  const otherPossibilities = (scan.allDiseases ?? [])
    .filter((d) => d.name !== disease.name)
    .map((d) => ({
      name: d.name,
      confidence: d.probability,
      risk: d.probability >= 60 ? "High" : d.probability >= 30 ? "Moderate" : "Low",
    }));

  const onShare = () => {
    Share.share({
      message: `Fasal Raksha scan result: ${disease.name} (${disease.probability}% match, ${severity.label} severity).`,
    }).catch(() => {});
  };

  const onDownloadPDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #1A2E1A; }
              .header { text-align: center; border-bottom: 2px solid #1A5C2A; padding-bottom: 10px; }
              .title { font-size: 24px; color: #0F3D1A; font-weight: bold; }
              .section { margin-top: 20px; }
              .label { font-weight: bold; color: #5A7260; font-size: 12px; text-transform: uppercase; }
              .value { font-size: 18px; margin-top: 5px; }
              .card { background: #F5F5EF; padding: 15px; border-radius: 10px; margin-top: 10px; }
              .footer { margin-top: 30px; font-size: 10px; color: #5A7260; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">Fasal Raksha Diagnostic Report</div>
              <p>Scanned on: ${scan.scannedAt}</p>
            </div>
            <div class="section">
              <div class="label">Crop Name</div>
              <div class="value">${cropName}</div>
            </div>
            <div class="section">
              <div class="card">
                <div class="label">Detected Disease</div>
                <div class="value" style="color: ${severity.color}">${disease.name}</div>
                <p>Match Confidence: ${disease.probability}% (${severity.label})</p>
              </div>
            </div>
            <div class="section">
              <div class="label">About the Disease</div>
              <p>${description}</p>
            </div>
            <div class="section">
              <div class="label">Treatment Plan</div>
              <ul>
                ${list.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
            <div class="footer">
              Generated by Fasal Raksha App — Surakshit Fasal, Samruddh Kisan
            </div>
          </body>
        </html>
      `;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (err) {
      Alert.alert("Error", "Could not generate PDF report.");
    }
  };

  const onSaveReport = async () => {
    if (scan) {
      await saveActiveScanToHistory(scan);
      Alert.alert("Report Saved", "This diagnostic report has been saved to your history.");
    }
  };

  const list = activeTab === "organic" ? organicList : chemicalList;
  const tabIcon = activeTab === "organic" ? "leaf-outline" : "flask-outline";

  return (
    <SafeAreaView style={st.safe} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Header ── */}
      <View style={st.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={GREEN_DARK} />
        </Pressable>
        <Text style={st.headerTitle}>Diagnostic Report</Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <Pressable onPress={onDownloadPDF} hitSlop={10}>
            <Ionicons name="download-outline" size={20} color={GREEN_DARK} />
          </Pressable>
          <Pressable onPress={onShare} hitSlop={10}>
            <Ionicons name="share-outline" size={20} color={GREEN_DARK} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={st.scroll}
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero photo — the actual scanned image ── */}
        <Image source={heroImage} style={st.heroImage} resizeMode="cover" />

        <View style={st.content}>
          {/* ── Crop name + date chip ── */}
          <View style={st.cropRow}>
            <View style={{ flex: 1 }}>
              <Text style={st.cropName}>{cropName}</Text>
              {!!cropScientificName && (
                <Text style={st.cropScientific}>{cropScientificName}</Text>
              )}
            </View>
            <View style={st.dateChip}>
              <Text style={st.dateChipText}>{scan.scannedAt}</Text>
            </View>
          </View>

          {/* ── Disease card ── */}
          <View style={st.diseaseCard}>
            <View style={[st.diseaseAccent, { backgroundColor: severity.color }]} />
            <View style={st.diseaseCardBody}>
              <View style={st.diseaseHeaderRow}>
                <Text style={st.diseaseName}>{disease.name}</Text>
                <View style={[st.severityBadge, { backgroundColor: severity.color + "18" }]}>
                  <Ionicons name="warning-outline" size={12} color={severity.color} />
                  <Text style={[st.severityBadgeText, { color: severity.color }]}>
                    {severity.label}
                  </Text>
                </View>
              </View>
              {!!diseaseScientificName && (
                <Text style={st.diseaseScientific}>{diseaseScientificName}</Text>
              )}
              <View style={st.matchRow}>
                <View style={st.matchBarTrack}>
                  <View
                    style={[
                      st.matchBarFill,
                      { width: `${Math.min(100, Math.max(4, disease.probability))}%` },
                      { backgroundColor: riskColor(disease.probability) }
                    ]}
                  />
                </View>
                <Text style={[st.matchPercentText, { color: riskColor(disease.probability) }]}>
                  {disease.probability}% Match
                </Text>
              </View>

              {disease.probability < 40 && (
                <View style={st.lowConfidenceWarning}>
                  <Ionicons name="information-circle" size={14} color={AMBER} />
                  <Text style={st.lowConfidenceText}>
                    Low confidence. Please retake a clearer photo if possible.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* ── About this Disease ── */}
          <View style={st.aboutCard}>
            <View style={st.aboutHeader}>
              <View style={st.aboutIconBox}>
                <Ionicons name="information-circle-outline" size={16} color={GREEN_DARK} />
              </View>
              <Text style={st.aboutTitle}>About this Disease</Text>
            </View>
            <Text style={st.aboutBody}>{description}</Text>

            <Text style={st.symptomsHeading}>Common Symptoms:</Text>
            {symptoms.map((sym, i) => (
              <View key={i} style={st.symptomRow}>
                <Ionicons name="checkmark-circle" size={15} color={GREEN} />
                <Text style={st.symptomText}>{sym}</Text>
              </View>
            ))}
          </View>

          {/* ── Organic / Chemical tabs ── */}
          <View style={st.tabBar}>
            <Pressable
              style={[st.tabBtn, activeTab === "organic" && st.tabBtnActive]}
              onPress={() => setActiveTab("organic")}
            >
              <Ionicons
                name="leaf-outline"
                size={15}
                color={activeTab === "organic" ? GREEN_DARK : MUTED}
              />
              <Text style={[st.tabBtnText, activeTab === "organic" && st.tabBtnTextActive]}>
                Organic
              </Text>
            </Pressable>
            <Pressable
              style={[st.tabBtn, activeTab === "chemical" && st.tabBtnActive]}
              onPress={() => setActiveTab("chemical")}
            >
              <Ionicons
                name="flask-outline"
                size={15}
                color={activeTab === "chemical" ? GREEN_DARK : MUTED}
              />
              <Text style={[st.tabBtnText, activeTab === "chemical" && st.tabBtnTextActive]}>
                Chemical
              </Text>
            </Pressable>
          </View>

          <Text style={st.treatmentsHeading}>
            {activeTab === "organic" ? "Organic Treatments" : "Chemical Treatments"}
          </Text>
          {list.map((t, i) => (
            <View key={i} style={st.treatmentRow}>
              <View style={st.treatmentIconBox}>
                <Ionicons name={tabIcon} size={15} color={GREEN_DARK} />
              </View>
              <Text style={st.treatmentText}>{t}</Text>
              {/* Removed chevron-forward as it was a false affordance (not clickable) */}
            </View>
          ))}

          {/* ── Prevention Tips ── */}
          <View style={st.preventionCard}>
            <View style={st.preventionHeader}>
              <View style={st.preventionIconBox}>
                <Ionicons name="shield-checkmark-outline" size={16} color={GREEN_DARK} />
              </View>
              <Text style={st.preventionTitle}>Prevention Tips</Text>
            </View>
            <Text style={st.preventionBody}>{preventionText}</Text>
          </View>

          {/* ── Important Precautions ── */}
          <View style={st.precautionCard}>
            <View style={st.precautionHeader}>
              <View style={st.precautionIconBox}>
                <Ionicons name="warning-outline" size={16} color={RED} />
              </View>
              <Text style={st.precautionTitle}>Important Precautions</Text>
            </View>
            <Text style={st.precautionBody}>{precautionsText}</Text>
          </View>

          {/* ── Other possibilities ── */}
          {otherPossibilities.length > 0 && (
            <>
              <Text style={st.treatmentsHeading}>Other Possibilities</Text>
              {otherPossibilities.map((d) => (
                <View key={d.name} style={st.otherRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={st.otherName}>{d.name}</Text>
                    <Text style={st.otherConfidence}>{d.confidence}% confidence</Text>
                  </View>
                  <View
                    style={[st.riskBadge, { backgroundColor: riskColor(d.confidence) + "18" }]}
                  >
                    <View style={[st.riskDot, { backgroundColor: riskColor(d.confidence) }]} />
                    <Text style={[st.riskText, { color: riskColor(d.confidence) }]}>
                      {d.risk}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Sticky footer ── */}
      <View style={st.footerBar}>
        <Pressable style={st.scanAgainBtn} onPress={() => router.replace("/(tabs)/scan")}>
          <Ionicons name="refresh-outline" size={16} color={GREEN_DARK} />
          <Text style={st.scanAgainText}>Scan Again</Text>
        </Pressable>
        <Pressable style={st.saveBtn} onPress={onSaveReport}>
          <Ionicons name="bookmark-outline" size={16} color={WHITE} />
          <Text style={st.saveBtnText}>Save Report</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles (same spacing/scale language as Dashboard & Scan screens) ──────
const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: BG,
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: GREEN_DARK },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },

  centerFill: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 32, gap: 6,
  },
  loadingText: { marginTop: 10, fontSize: 13, color: MUTED, fontWeight: "600" },
  emptyTitle: { fontSize: 17, fontWeight: "800", color: DARK, marginTop: 10 },
  emptySub: {
    fontSize: 13, color: MUTED, textAlign: "center", lineHeight: 18, marginBottom: 8,
  },

  heroImage: { width: "100%", height: 260, backgroundColor: GREEN_LIGHT, marginHorizontal: 16, marginVertical: 12, borderRadius: 12, overflow: "hidden" },

  content: { paddingHorizontal: 18, paddingTop: 16 },

  // ── Crop row ──
  cropRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  cropName: { fontSize: 17, fontWeight: "800", color: DARK },
  cropScientific: { fontSize: 12, color: MUTED, fontStyle: "italic", marginTop: 2 },
  dateChip: { backgroundColor: GREEN_LIGHT, borderRadius: 50, paddingHorizontal: 12, paddingVertical: 7 },
  dateChipText: { fontSize: 11, color: GREEN_DARK, fontWeight: "600" },

  // ── Disease card ──
  diseaseCard: {
    flexDirection: "row", backgroundColor: WHITE, borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: BORDER, overflow: "hidden",
  },
  diseaseAccent: { width: 5 },
  diseaseCardBody: { flex: 1, padding: 14, gap: 4 },
  diseaseHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  diseaseName: { fontSize: 19, fontWeight: "800", color: DARK, flexShrink: 1, paddingRight: 8 },
  severityBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50,
  },
  severityBadgeText: { fontSize: 11, fontWeight: "700" },
  diseaseScientific: { fontSize: 12.5, color: MUTED, fontStyle: "italic" },
  matchRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  matchBarTrack: { flex: 1, height: 7, borderRadius: 4, backgroundColor: GREEN_LIGHT, overflow: "hidden" },
  matchBarFill: { height: 7, borderRadius: 4, backgroundColor: GREEN_DARK },
  matchPercentText: {
    fontSize: 12,
    fontWeight: "700",
    color: GREEN_MID,
  },
  lowConfidenceWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: AMBER + "10",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: AMBER + "20",
  },
  lowConfidenceText: {
    fontSize: 11,
    color: AMBER,
    fontWeight: "600",
    flex: 1,
  },

  // ── About card ──
  aboutCard: {
    backgroundColor: GREEN_LIGHT, borderRadius: 16, padding: 16, marginBottom: 16, gap: 10,
  },
  aboutHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  aboutIconBox: {
    width: 26, height: 26, borderRadius: 9, backgroundColor: WHITE,
    alignItems: "center", justifyContent: "center",
  },
  aboutTitle: { fontSize: 14, fontWeight: "800", color: DARK },
  aboutBody: { fontSize: 12.5, color: DARK, lineHeight: 19 },
  symptomsHeading: { fontSize: 13, fontWeight: "800", color: DARK, marginTop: 4 },
  symptomRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  symptomText: { flex: 1, fontSize: 12.5, color: DARK, lineHeight: 18 },

  // ── Tabs ──
  tabBar: {
    flexDirection: "row", backgroundColor: WHITE, borderRadius: 14, padding: 4,
    borderWidth: 1, borderColor: BORDER, marginBottom: 14,
  },
  tabBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: 9, borderRadius: 10,
  },
  tabBtnActive: { backgroundColor: GREEN_LIGHT },
  tabBtnText: { fontSize: 13, fontWeight: "700", color: MUTED },
  tabBtnTextActive: { color: GREEN_DARK },

  treatmentsHeading: { fontSize: 13, fontWeight: "800", color: DARK, marginBottom: 10, marginTop: 4 },
  treatmentRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: WHITE, borderRadius: 14, padding: 13, marginBottom: 10,
    borderWidth: 1, borderColor: BORDER,
  },
  treatmentIconBox: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: GREEN_LIGHT,
    alignItems: "center", justifyContent: "center",
  },
  treatmentText: { flex: 1, fontSize: 12.5, color: DARK, lineHeight: 18 },

  // ── Prevention ──
  preventionCard: {
    backgroundColor: GREEN_LIGHT, borderRadius: 16, padding: 16, marginTop: 6, marginBottom: 16, gap: 8,
  },
  preventionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  preventionIconBox: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: WHITE,
    alignItems: "center", justifyContent: "center",
  },
  preventionTitle: { fontSize: 14, fontWeight: "800", color: GREEN_DARK },
  preventionBody: { fontSize: 12.5, color: DARK, lineHeight: 19 },

  // ── Precautions ──
  precautionCard: {
    backgroundColor: RED + "12", borderRadius: 16, padding: 16, marginBottom: 16, gap: 8,
    borderWidth: 1, borderColor: RED + "30",
  },
  precautionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  precautionIconBox: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: WHITE,
    alignItems: "center", justifyContent: "center",
  },
  precautionTitle: { fontSize: 14, fontWeight: "800", color: RED },
  precautionBody: { fontSize: 12.5, color: DARK, lineHeight: 19 },

  // ── Other possibilities ──
  otherRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: WHITE, borderRadius: 14, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: BORDER,
  },
  otherName: { fontSize: 13, fontWeight: "700", color: DARK },
  otherConfidence: { fontSize: 11, color: MUTED, marginTop: 2 },
  riskBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50,
  },
  riskDot: { width: 5, height: 5, borderRadius: 3 },
  riskText: { fontSize: 11, fontWeight: "700" },

  // ── Footer ──
  footerBar: {
    flexDirection: "row", gap: 12, backgroundColor: WHITE,
    paddingHorizontal: 18, paddingTop: 12, paddingBottom: 16,
    borderTopWidth: 1, borderTopColor: BORDER,
  },
  scanAgainBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: BG, borderRadius: 50, paddingVertical: 13,
    borderWidth: 1.5, borderColor: BORDER,
  },
  scanAgainText: { fontSize: 14, fontWeight: "700", color: GREEN_DARK },
  saveBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: GREEN_DARK, borderRadius: 50, paddingVertical: 13,
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: WHITE },

  primaryBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: GREEN_DARK, borderRadius: 50,
    paddingHorizontal: 20, paddingVertical: 12, marginTop: 10,
  },
  primaryBtnText: { color: WHITE, fontSize: 14, fontWeight: "700" },
});