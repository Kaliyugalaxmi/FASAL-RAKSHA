// FILE PATH → app/(tabs)/tips.tsx

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import TreatmentTracker, { buildFarmerStages } from '../../components/TreatmentTracker';
import { getActiveScan, type ActiveScan } from '../../lib/activeScanStore';

// ─── Theme (matches Dashboard) ─────────────────────────────────────────────────
const BG         = '#F5F5EF';
const WHITE      = '#FFFFFF';
const DARK       = '#1A2E1A';
const MUTED      = '#5A7260';
const GREEN      = '#1A5C2A';
const GREEN_LIGHT = '#E8F4EA';
const GREEN_MID  = '#3A7A2A';
const GREEN_DARK = '#0F3D1A';
const BORDER     = 'rgba(26,92,42,0.12)';
const RED        = '#C0392B';
const AMBER      = '#B8680A';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function confidenceColor(pct: number) {
  if (pct >= 70) return RED;
  if (pct >= 40) return AMBER;
  return GREEN_MID;
}
function confidenceLabel(pct: number) {
  if (pct >= 70) return 'High risk';
  if (pct >= 40) return 'Moderate';
  return 'Low risk';
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const Divider = () => <View style={s.divider} />;

const IndexPill = ({ label, color = GREEN }: { label: string; color?: string }) => (
  <View style={[s.indexPill, { backgroundColor: color + '18' }]}>
    <Text style={[s.indexPillText, { color }]}>{label}</Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function TipsScreen() {
  const router = useRouter();
  const insets  = useSafeAreaInsets();
  const [activeScan, setActiveScan] = useState<ActiveScan | null>(null);
  const [loading, setLoading]       = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setLoading(true);
        const scan = await getActiveScan();
        if (!cancelled) { setActiveScan(scan); setLoading(false); }
      })();
      return () => { cancelled = true; };
    }, [])
  );

  // ── Shared top bar ─────────────────────────────────────────────────────────
  const TopBar = () => (
    <View style={s.topBar}>
      <Text style={s.topBarLabel}>Active care plan</Text>
      <Text style={s.topBarTitle}>Treatment Tips</Text>
    </View>
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <TopBar />
        <View style={s.center}>
          <ActivityIndicator size="small" color={GREEN} />
          <Text style={[s.muted, { marginTop: 10 }]}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Empty / Healthy ────────────────────────────────────────────────────────
  if (!activeScan || !activeScan.activeDisease || activeScan.isHealthy) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <TopBar />
        {/* ✅ FIX: padding clears the tab bar (64 + safe-area inset) */}
        <ScrollView
          contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 84 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.card}>
            <View style={s.rowBetween}>
              <View style={{ gap: 4 }}>
                <Text style={s.cardLabel}>Treatment status</Text>
                <Text style={s.cardValue}>No active plan</Text>
                <Text style={s.muted}>Scan a crop or pest to begin</Text>
              </View>
              <View style={[s.iconBox, { backgroundColor: GREEN_LIGHT }]}>
                <Ionicons name="leaf-outline" size={18} color={GREEN} />
              </View>
            </View>
          </View>

          <Text style={s.sectionLabel}>Get started</Text>
          <View style={s.ctaRow}>
            <TouchableOpacity
              style={[s.ctaBtn, s.ctaBtnPrimary]}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/scan')}
            >
              <Text style={[s.ctaBtnTitle, { color: WHITE }]}>Scan crop</Text>
              <Text style={[s.ctaBtnSub, { color: WHITE + '88' }]}>Check health</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.ctaBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/scan')}
            >
              <Text style={s.ctaBtnTitle}>Identify pest</Text>
              <Text style={s.ctaBtnSub}>AI detection</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Active disease ─────────────────────────────────────────────────────────
  const { mode, scannedAt, allDiseases, scanId } = activeScan;
  const topDisease = [...allDiseases].sort((a, b) => b.probability - a.probability)[0];
  const isPest     = mode === 'pest';
  const col        = confidenceColor(topDisease.probability);

  const stages = buildFarmerStages(
    topDisease.treatment.biological,
    topDisease.treatment.chemical,
    topDisease.treatment.prevention,
    isPest,
    topDisease.name
  );
  const preventionActions = stages.find((st) => st.stage === '05')?.actions ?? [];

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <TopBar />

      {/* ✅ FIX: padding clears the tab bar (64 + safe-area inset) */}
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 84 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Detection card ────────────────────────────────────────────────── */}
        <View style={s.card}>
          <View style={s.rowBetween}>
            <View style={{ gap: 4, flex: 1, marginRight: 12 }}>
              <Text style={s.cardLabel}>{isPest ? 'Pest detected' : 'Disease detected'}</Text>
              <Text style={[s.cardValue, { color: col }]}>{topDisease.name}</Text>
              <Text style={s.muted}>{scannedAt}</Text>
            </View>
            <View style={[s.iconBox, { backgroundColor: col + '14' }]}>
              <Ionicons name="alert-circle-outline" size={18} color={col} />
            </View>
          </View>

          <View style={s.pillRow}>
            <View style={[s.pill, { backgroundColor: col + '14' }]}>
              <View style={[s.pillDot, { backgroundColor: col }]} />
              <Text style={[s.pillText, { color: col }]}>
                {topDisease.probability}% · {confidenceLabel(topDisease.probability)}
              </Text>
            </View>
            <View style={s.pill}>
              <Ionicons
                name={isPest ? 'bug-outline' : 'leaf-outline'}
                size={11}
                color={MUTED}
              />
              <Text style={s.pillText}>{isPest ? 'Pest scan' : 'Crop scan'}</Text>
            </View>
          </View>
        </View>

        {/* ── Treatment plan ────────────────────────────────────────────────── */}
        <Text style={s.sectionLabel}>Treatment plan</Text>
        <TreatmentTracker
          stages={stages.filter((st) => st.stage !== '05')}
          scanId={scanId}
          isPest={isPest}
          pestName={topDisease.name}
        />

        {/* ── Prevention ────────────────────────────────────────────────────── */}
        {preventionActions.length > 0 && (
          <>
            <Text style={s.sectionLabel}>Prevention</Text>
            <View style={s.card}>
              {preventionActions.map((action, i, arr) => (
                <View key={i}>
                  <View style={s.listRow}>
                    <IndexPill label={String(i + 1)} />
                    <Text style={s.listText}>{action}</Text>
                  </View>
                  {i < arr.length - 1 && <Divider />}
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Monitoring schedule ───────────────────────────────────────────── */}
        <Text style={s.sectionLabel}>Monitoring schedule</Text>
        <View style={s.card}>
          {[
            { period: 'Daily',    action: 'Quick visual check of leaves for early signs.' },
            { period: 'Weekly',   action: 'Full plant inspection, note any changes.' },
            { period: 'Monthly',  action: 'Soil test and nutrient balance assessment.' },
            { period: 'Seasonal', action: 'Crop rotation and field sanitation.' },
          ].map((row, i, arr) => (
            <View key={i}>
              <View style={s.listRow}>
                <IndexPill label={row.period} />
                <Text style={s.listText}>{row.action}</Text>
              </View>
              {i < arr.length - 1 && <Divider />}
            </View>
          ))}
        </View>

        {/* ── CTAs ─────────────────────────────────────────────────────────── */}
        <View style={s.ctaRow}>
          <TouchableOpacity
            style={[s.ctaBtn, s.ctaBtnPrimary]}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/scan')}
          >
            <Text style={[s.ctaBtnTitle, { color: WHITE }]}>New scan</Text>
            <Text style={[s.ctaBtnSub, { color: WHITE + '88' }]}>Rescan crop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.ctaBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/history')}
          >
            <Text style={s.ctaBtnTitle}>History</Text>
            <Text style={s.ctaBtnSub}>All scans</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: BG },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  topBar: {
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: BORDER,
    backgroundColor: BG,
  },
  topBarLabel: { fontSize: 11, fontWeight: '500', color: MUTED, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 },
  topBarTitle: { fontFamily: 'serif', fontSize: 20, fontWeight: '800', color: GREEN_DARK, letterSpacing: -0.3 },

  scroll: { paddingHorizontal: 20, paddingTop: 16 },

  card: {
    backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: BORDER,
  },

  rowBetween:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardLabel:   { fontSize: 10, fontWeight: '500', color: MUTED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 },
  cardValue:   { fontFamily: 'serif', fontSize: 18, fontWeight: '700', color: DARK, marginBottom: 3 },
  muted:       { fontSize: 12, color: MUTED },

  iconBox: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  pillRow:   { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: GREEN_LIGHT, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 5,
  },
  pillDot:   { width: 5, height: 5, borderRadius: 3 },
  pillText:  { fontSize: 11, fontWeight: '500', color: MUTED },

  sectionLabel: { fontSize: 13, fontWeight: '700', color: DARK, fontFamily: 'serif', marginBottom: 8 },

  listRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10 },
  listText: { flex: 1, fontSize: 12, color: DARK, lineHeight: 19 },
  divider:  { height: 1, backgroundColor: BORDER },

  indexPill: {
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    minWidth: 64, alignItems: 'center', flexShrink: 0, marginTop: 1,
  },
  indexPillText: { fontSize: 11, fontWeight: '600' },

  ctaRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  ctaBtn: {
    flex: 1, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: BORDER,
    backgroundColor: WHITE, gap: 2,
  },
  ctaBtnPrimary: { backgroundColor: DARK, borderColor: DARK },
  ctaBtnTitle:   { fontSize: 13, fontWeight: '700', color: DARK },
  ctaBtnSub:     { fontSize: 11, color: MUTED },
});