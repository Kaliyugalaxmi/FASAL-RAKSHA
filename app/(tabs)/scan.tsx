// FILE PATH → app/(tabs)/scan.tsx
//
// Flow:  pick/take photo → send to ML backend (/predict) → get disease name
//        → send disease name to Dify (Knowledge Base search) → get
//        Treatment & Prevention text → save as the "active scan" → navigate
//        to the result screen.
//
// ⚠️ Before this works you MUST fill in the two config values below:
//    ML_API_URL    → your backend's /predict URL (see backend/README.md)
//    DIFY_API_URL / DIFY_API_KEY → from Dify dashboard → API Access

import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { setActiveScan } from '../../lib/activeScanStore';

// ─── Theme ────────────────────────────────────────────────────────────────────
const BG          = '#F5F5EF';
const WHITE       = '#FFFFFF';
const DARK        = '#1A2E1A';
const MUTED       = '#5A7260';
const GREEN       = '#1A5C2A';
const GREEN_LIGHT = '#E8F4EA';
const GREEN_MID   = '#3A7A2A';
const GREEN_DARK  = '#0F3D1A';
const BORDER      = 'rgba(26,92,42,0.12)';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ML_API_URL   = process.env.EXPO_PUBLIC_ML_API_URL || 'http://192.168.1.104:8000/predict';
const DIFY_API_URL = 'https://api.dify.ai/v1/chat-messages';
const DIFY_API_KEY = process.env.EXPO_PUBLIC_DIFY_API_KEY || 'app-xxxxxxxxxxxxxxxxxxxxxxxx';

const PLANT_ILLUSTRATION = require('../../assets/images/crops/plant_illustration.jpg');

// ─── Types ────────────────────────────────────────────────────────────────────
interface MLResult {
  label: string;          // raw: "banana_yb_sigatoka"
  crop: string;           // "Banana"
  disease: string;        // "Yb Sigatoka"
  confidence: number;     // 0.94
  isHealthy: boolean;
  allResults: { name: string; probability: number }[];
}

const PHOTO_TIPS = [
  { icon: 'scan-outline' as const,        text: 'Fill the frame with the leaf' },
  { icon: 'sunny-outline' as const,       text: 'Use daylight, avoid flash' },
  { icon: 'layers-outline' as const,      text: 'Capture both leaf sides' },
  { icon: 'eye-outline' as const,         text: 'Avoid blurry images' },
];

export default function CropScanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);

  // ── Image pickers ─────────────────────────────────────────────────────────
  const pickFromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera access needed', 'Please allow camera access to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Gallery access needed', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  // ── Step 1: ML backend ko call karo ───────────────────────────────────────
  const callMLModel = async (uri: string): Promise<MLResult> => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'leaf.jpg',
      type: 'image/jpeg',
    } as any);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    try {
      const res = await fetch(ML_API_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`ML server error (${res.status}): ${text}`);
      }

      const data = await res.json();

      // Backend se milne wala response validate karo
      if (!data.label) {
        throw new Error('Backend ne galat response diya. "label" field nahi mila.');
      }

      // Agar backend old version hai aur crop/disease nahi bheja toh yahan parse karo
      if (!data.crop || !data.disease) {
        const parts = data.label.split('_');
        data.crop = parts[0]
          ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
          : data.label;
        data.disease = parts.slice(1).join(' ').replace(/_/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase()) || 'Unknown';
      }

      if (typeof data.isHealthy === 'undefined') {
        data.isHealthy = data.label.toLowerCase().includes('healthy');
      }

      if (!data.allResults) {
        data.allResults = [];
      }

      return data as MLResult;
    } catch (e: any) {
      clearTimeout(timeoutId);
      if (e.name === 'AbortError') {
        throw new Error(
          `Backend tak pahunch nahi paya (${ML_API_URL}).\n\n` +
          `Check karo:\n` +
          `• Phone aur PC same WiFi pe hain?\n` +
          `• Backend chal raha hai? (uvicorn main:app --host 0.0.0.0 --port 8000)\n` +
          `• .env mein EXPO_PUBLIC_ML_API_URL sahi IP hai?`
        );
      }
      throw e;
    }
  };

  // ── Step 2: Dify se treatment fetch karo ─────────────────────────────────
  const fetchTreatmentFromDify = async (diseaseLabel: string): Promise<string> => {
    try {
      const res = await fetch(DIFY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DIFY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {},
          query: `Give the treatment and prevention steps for ${diseaseLabel.replace(/_/g, ' ')} in crops, using the knowledge base.`,
          response_mode: 'blocking',
          user: 'fasal-raksha-app',
        }),
      });
      if (!res.ok) throw new Error(`Dify error (${res.status})`);
      const data = await res.json();
      return data.answer ?? '';
    } catch {
      // Dify fail ho toh bhi app crash na ho — sirf treatment empty rehegi
      return '';
    }
  };

  // ── Main detect action ────────────────────────────────────────────────────
  const handleDetect = async () => {
    if (!imageUri) return;
    setDetecting(true);

    try {
      // 1. ML model se prediction lo
      const mlResult = await callMLModel(imageUri);

      // 2. Dify se treatment lo (optional — fail hone pe empty string)
      const treatmentText = await fetchTreatmentFromDify(mlResult.label);

      // Treatment text ko lines mein split karo
      const treatmentLines = treatmentText
        .split('\n')
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 0);

      // 3. Active scan store mein save karo
      await setActiveScan({
        scanId: Date.now().toString(),
        mode: 'crop',
        isHealthy: mlResult.isHealthy,
        scannedAt: new Date().toLocaleString(),
        imageUri: imageUri,
        // crop + disease info store karo
        cropName: mlResult.crop,
        activeDisease: {
          name: `${mlResult.crop} – ${mlResult.disease}`,
          probability: Math.round(mlResult.confidence * 100),
          treatment: {
            biological: treatmentLines.length > 0 ? treatmentLines : [
              mlResult.isHealthy
                ? 'Plant healthy hai! Koi bimari nahi mili.'
                : `${mlResult.disease} detected. Kisi krishi expert se salah lein.`
            ],
            chemical: [],
            prevention: [],
          },
        },
        allDiseases: mlResult.allResults.map(r => ({
          name: r.name,
          probability: Math.round(r.probability * 100),
        })),
      });

      // 4. Result screen pe bhejo
      router.push('/screens/CropResultScreen');

    } catch (err: any) {
      Alert.alert('Detection Failed', err?.message ?? 'Backend se connect nahi ho paya.');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <SafeAreaView style={st.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Header ── */}
      <View style={st.header}>
        <Text style={st.headerTitle}>Crop Disease Scan</Text>
        <View style={st.instantBadge}>
          <Ionicons name="flash" size={12} color={GREEN} />
          <Text style={st.instantBadgeText}>Instant</Text>
        </View>
      </View>

      {/* ── Body ── */}
      <View style={st.body}>
        {/* ── Hero image / preview ── */}
        {imageUri ? (
          <View style={st.heroCard}>
            <Image source={{ uri: imageUri }} style={st.heroImage} />
            <Pressable style={st.retakeBtn} onPress={() => setImageUri(null)}>
              <Ionicons name="close" size={16} color={WHITE} />
              <Text style={st.retakeText}>Remove</Text>
            </Pressable>
          </View>
        ) : (
          <ImageBackground
            source={PLANT_ILLUSTRATION}
            style={st.heroPlaceholder}
            imageStyle={st.heroPlaceholderImage}
          >
            <View style={st.heroOverlay} />
            <Text style={st.heroTitle}>Add a leaf or plant photo</Text>
            <Text style={st.heroSub}>Close-up of affected area works best</Text>
          </ImageBackground>
        )}

        {/* ── Tip banner ── */}
        <View style={st.tipBanner}>
          <Text style={{ fontSize: 16 }}>🌿</Text>
          <Text style={st.tipBannerText}>
            Supported crops: Banana, Groundnut, Radish. Photograph an affected leaf for best results.
          </Text>
        </View>

        {/* ── Camera / Gallery buttons ── */}
        <View style={st.actionRow}>
          <Pressable style={st.actionBtn} onPress={pickFromCamera}>
            <Ionicons name="camera-outline" size={17} color={GREEN_DARK} />
            <Text style={st.actionBtnText}>Camera</Text>
          </Pressable>
          <Pressable style={st.actionBtn} onPress={pickFromGallery}>
            <Ionicons name="images-outline" size={17} color={GREEN_DARK} />
            <Text style={st.actionBtnText}>Gallery</Text>
          </Pressable>
        </View>

        {/* ── Photo tips card ── */}
        <View style={st.tipsCard}>
          <View style={st.tipsCardHeader}>
            <View style={st.tipsCardIconBox}>
              <Ionicons name="camera" size={14} color={GREEN_DARK} />
            </View>
            <Text style={st.tipsCardTitle}>Photo Tips</Text>
          </View>
          <View style={st.tipsGrid}>
            {PHOTO_TIPS.map((tip) => (
              <View key={tip.text} style={st.tipItem}>
                <View style={st.tipIconBox}>
                  <Ionicons name={tip.icon} size={14} color={GREEN_MID} />
                </View>
                <Text style={st.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Detect button ── */}
        <Pressable
          style={[st.detectBtn, (!imageUri || detecting) && st.detectBtnDisabled]}
          onPress={handleDetect}
          disabled={!imageUri || detecting}
        >
          {detecting ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <Ionicons name="scan-outline" size={18} color={WHITE} />
          )}
          <Text style={st.detectBtnText}>
            {detecting ? 'Analyzing…' : 'Detect Disease'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: BG,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: GREEN_DARK, fontFamily: 'serif', letterSpacing: -0.4 },
  instantBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: GREEN_LIGHT, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 50, borderWidth: 1, borderColor: BORDER,
  },
  instantBadgeText: { fontSize: 12, fontWeight: '700', color: GREEN },

  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    justifyContent: 'space-between',
    gap: 8,
  },

  heroPlaceholder: {
    flex: 1, minHeight: 150, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30,
    overflow: 'hidden',
  },
  heroPlaceholderImage: { borderRadius: 22, resizeMode: 'cover' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,61,26,0.45)',
    borderRadius: 22,
  },
  heroTitle: { fontSize: 18, fontWeight: '800', color: WHITE, textAlign: 'center', marginBottom: 4 },
  heroSub: { fontSize: 12.5, color: GREEN_LIGHT, textAlign: 'center' },

  heroCard: { flex: 1, minHeight: 150, borderRadius: 22, overflow: 'hidden', backgroundColor: DARK },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  retakeBtn: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 50,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  retakeText: { fontSize: 12, fontWeight: '700', color: WHITE },

  tipBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: GREEN_LIGHT, borderRadius: 14, padding: 12,
  },
  tipBannerText: { flex: 1, fontSize: 12, color: DARK, lineHeight: 16, fontWeight: '500' },

  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: WHITE, borderRadius: 14, paddingVertical: 13,
    borderWidth: 1.5, borderColor: BORDER,
  },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: GREEN_DARK },

  tipsCard: {
    backgroundColor: WHITE, borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: BORDER,
  },
  tipsCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  tipsCardIconBox: {
    width: 26, height: 26, borderRadius: 9, backgroundColor: GREEN_LIGHT,
    alignItems: 'center', justifyContent: 'center',
  },
  tipsCardTitle: { fontSize: 14, fontWeight: '800', color: DARK },
  tipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tipItem: { width: '46%', flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipIconBox: {
    width: 26, height: 26, borderRadius: 9, backgroundColor: GREEN_LIGHT,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tipText: { flex: 1, fontSize: 11.5, color: DARK, lineHeight: 15, fontWeight: '500' },

  detectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: GREEN_DARK, borderRadius: 50, height: 52,
  },
  detectBtnDisabled: { backgroundColor: MUTED, opacity: 0.5 },
  detectBtnText: { fontSize: 16, fontWeight: '700', color: WHITE },
});