// FILE PATH → app/screens/Loginscreen.tsx
//
// Design updated to match AgriScan AI reference:
// - App name + logo at top (outside card)
// - Clean white card with icon-prefixed inputs
// - Rounded pill CTA button
// - "Or sign in with" + Google/Apple social buttons
// - All Fasal Raksha branding + existing auth logic preserved

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { saveSession } from "../../lib/session";
import { supabase } from "../../lib/supabase";
import { saveFarmerName } from "../../lib/userProfile";

// ─── Theme ────────────────────────────────────────────────────────────────────
const BG          = "#FFFFFF";
const WHITE       = "#FFFFFF";
const DARK        = "#1A2E1A";
const MUTED       = "#7A9080";
const GREEN       = "#1A5C2A";
const GREEN_MID   = "#2E7D32";
const GREEN_DARK  = "#0F3D1A";
const BORDER      = "#D8E8DA";
const RED         = "#C0392B";

const { width } = Dimensions.get("window");

// ─── Icons ────────────────────────────────────────────────────────────────────
function PhoneIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.06 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"
        stroke={MUTED} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" stroke={MUTED} strokeWidth={2} />
      <Path d="M7 11V7a5 5 0 0110 0v4" stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
          <Circle cx="12" cy="12" r="3" stroke={MUTED} strokeWidth={2} />
        </>
      ) : (
        <>
          <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
            stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
          <Path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"
            stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
          <Path d="M1 1l22 22" stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [mobile, setMobile]     = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const [mobileFocused, setMobileFocused] = useState(false);
  const [passFocused, setPassFocused]     = useState(false);

  const isMobileValid = /^[6-9]\d{9}$/.test(mobile.trim());
  const isReady = isMobileValid && password.length >= 6;

  const handleLogin = async () => {
    if (!isReady || loading) return;
    setLoading(true);
    setError("");
    try {
      const cleanMobile = mobile.trim();
      const { data, error: rpcError } = await supabase.rpc("login_farmer", {
        p_mobile: cleanMobile,
        p_password: password,
      });
      if (rpcError || !data) {
        setError("Incorrect mobile number or password.");
        setLoading(false);
        return;
      }
      await AsyncStorage.setItem("farmer_id", data.id);
      await saveSession(cleanMobile);
      await saveFarmerName(data.full_name ?? "Farmer");
      router.replace("/screens/Dashboardscreen");
    } catch (e: any) {
      setError(e?.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[s.scroll, { paddingTop: insets.top + 24, paddingBottom: 48 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand header — outside the card, like the reference */}
          <View style={s.brandRow}>
            <Image
              source={require("../../assets/images/LOGO.png")}
              style={s.logoImg}
              resizeMode="contain"
            />
            <Text style={s.brandName}>Fasal Raksha</Text>
          </View>

          {/* Page title block */}
          <View style={s.titleBlock}>
            <Text style={s.pageTitle}>Sign In</Text>
            <Text style={s.pageSubtitle}>
              Welcome back! Protect your harvest with precision insights.
            </Text>
          </View>

          {/* Card */}
          <View style={s.card}>

            {/* Mobile */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Mobile Number</Text>
              <View style={[s.inputRow, mobileFocused && s.inputRowFocused]}>
                <View style={s.iconWrap}><PhoneIcon /></View>
                <Text style={s.prefixText}>+91</Text>
                <TextInput
                  style={s.input}
                  placeholder="9876543210"
                  placeholderTextColor={MUTED}
                  keyboardType="number-pad"
                  value={mobile}
                  onChangeText={(t) => { setMobile(t.replace(/[^0-9]/g, "")); setError(""); }}
                  onFocus={() => setMobileFocused(true)}
                  onBlur={() => setMobileFocused(false)}
                  maxLength={10}
                />
              </View>
            </View>

            {/* Password */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Password</Text>
              <View style={[s.inputRow, passFocused && s.inputRowFocused]}>
                <View style={s.iconWrap}><LockIcon /></View>
                <TextInput
                  style={[s.input, { flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor={MUTED}
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={(t) => { setPassword(t); setError(""); }}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                />
                <Pressable onPress={() => setShowPass(p => !p)} style={s.eyeBtn}>
                  <EyeIcon visible={showPass} />
                </Pressable>
              </View>
            </View>

            {!!error && <Text style={s.errorText}>{error}</Text>}

            {/* Forgot password */}
            <Pressable
              onPress={() => router.push("/screens/Forgotpasswordscreen" as any)}
              style={s.forgotWrap}
            >
              <Text style={s.forgotText}>Forgot Password?</Text>
            </Pressable>

            {/* Sign in CTA */}
            <Pressable
              style={({ pressed }) => [
                s.btn,
                (!isReady || loading) && s.btnOff,
                pressed && isReady && !loading && { opacity: 0.88 },
              ]}
              onPress={handleLogin}
              disabled={!isReady || loading}
            >
              <Text style={s.btnText}>
                {loading ? "Signing in…" : "Sign In  →"}
              </Text>
            </Pressable>


          </View>

          {/* Sign up link */}
          <View style={s.bottomRow}>
            <Text style={s.bottomText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push("/screens/Signupscreen" as any)}>
              <Text style={s.bottomLink}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  scroll: { flexGrow: 1, paddingHorizontal: 22 },

  brandRow: {
    flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 36,
  },
  logoImg: { width: 36, height: 36 },
  brandName: {
    fontSize: 20, fontWeight: "800", color: GREEN, letterSpacing: -0.3,
  },

  titleBlock: { alignItems: "center", marginBottom: 28, paddingHorizontal: 8 },
  pageTitle: {
    fontSize: 30, fontWeight: "800", color: DARK, letterSpacing: -0.5, marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14.5, color: MUTED, textAlign: "center", lineHeight: 22,
  },

  card: {
    backgroundColor: WHITE, borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 4,
  },

  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "700", color: DARK, marginBottom: 8 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F7FAF7", borderRadius: 12,
    borderWidth: 1.5, borderColor: BORDER,
    height: 54, paddingHorizontal: 14, gap: 8,
  },
  inputRowFocused: { borderColor: GREEN_MID, backgroundColor: "#EDF5EE" },
  iconWrap: { width: 22, alignItems: "center" },
  prefixText: { fontSize: 14, fontWeight: "700", color: DARK },
  input: { flex: 1, fontSize: 15, color: DARK },
  eyeBtn: { padding: 6 },

  errorText: {
    fontSize: 12, color: RED, marginBottom: 8,
    textAlign: "center", fontWeight: "600",
  },

  forgotWrap: { alignItems: "flex-end", marginBottom: 20, marginTop: 4 },
  forgotText: { fontSize: 13, color: GREEN_MID, fontWeight: "600" },

  btn: {
    backgroundColor: GREEN_DARK, borderRadius: 30, height: 54,
    alignItems: "center", justifyContent: "center",
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  btnOff: { opacity: 0.38 },
  btnText: { color: WHITE, fontSize: 16, fontWeight: "700", letterSpacing: 0.4 },

  bottomRow: {
    flexDirection: "row", justifyContent: "center", alignItems: "center",
    marginTop: 24,
  },
  bottomText: { fontSize: 14, color: MUTED },
  bottomLink: { fontSize: 14, fontWeight: "700", color: GREEN },
});