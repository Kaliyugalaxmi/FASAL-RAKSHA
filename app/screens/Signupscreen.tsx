// FILE PATH → app/screens/Signupscreen.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

// ─── Theme ────────────────────────────────────────────────────────────────────
const BG        = "#FFFFFF";
const WHITE     = "#FFFFFF";
const DARK      = "#1A2E1A";
const MUTED     = "#7A9080";
const GREEN     = "#1A5C2A";
const GREEN_MID = "#2E7D32";
const GREEN_DARK= "#0F3D1A";
const BORDER    = "#D8E8DA";
const AMBER     = "#B8680A";
const RED       = "#C0392B";

// ─── Icons ────────────────────────────────────────────────────────────────────
function PersonIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
      <Circle cx="12" cy="7" r="4" stroke={MUTED} strokeWidth={2} />
    </Svg>
  );
}
function PhoneIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.06 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"
        stroke={MUTED} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function MapPinIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" stroke={MUTED} strokeWidth={2} />
      <Circle cx="12" cy="10" r="3" stroke={MUTED} strokeWidth={2} />
    </Svg>
  );
}
function LockIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" stroke={MUTED} strokeWidth={2} />
      <Path d="M7 11V7a5 5 0 0110 0v4" stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
function EyeIcon({ visible }: { visible: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
          <Circle cx="12" cy="12" r="3" stroke={MUTED} strokeWidth={2} />
        </>
      ) : (
        <>
          <Path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
          <Path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
          <Path d="M1 1l22 22" stroke={MUTED} strokeWidth={2} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}
function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Rect x="1" y="1" width="18" height="18" rx="5"
        fill={checked ? GREEN_DARK : "transparent"}
        stroke={checked ? GREEN_DARK : BORDER} strokeWidth={1.5} />
      {checked && (
        <Path d="M5 10l3.5 3.5L15 6.5" stroke={WHITE} strokeWidth={2}
          strokeLinecap="round" strokeLinejoin="round" />
      )}
    </Svg>
  );
}

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [farmerName, setFarmerName] = useState("");
  const [mobile, setMobile]         = useState("");
  const [village, setVillage]       = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]         = useState(false);
  const [loading, setLoading]       = useState(false);

  const [nameFocused, setNameFocused]       = useState(false);
  const [mobileFocused, setMobileFocused]   = useState(false);
  const [villageFocused, setVillageFocused] = useState(false);
  const [passFocused, setPassFocused]       = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = [BORDER, AMBER, "#D4A017", GREEN_MID];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  const passwordsMatch = confirm.length === 0 || password === confirm;
  const isMobileValid  = /^[6-9]\d{9}$/.test(mobile.trim());

  const isReady =
    farmerName.trim().length > 0 &&
    isMobileValid &&
    village.trim().length > 0 &&
    password.length >= 6 &&
    password === confirm &&
    agreed;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/screens/Onboardingscreen");
  };

  const handleSignUp = async () => {
    if (!isReady) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("signup_farmer", {
      p_mobile: mobile.trim(),
      p_password: password,
      p_full_name: farmerName.trim(),
      p_village: village.trim(),
    });
    setLoading(false);
    if (error) {
      if (error.message.includes("duplicate key") || error.code === "23505") {
        Alert.alert("Sign up failed", "This mobile number is already registered.");
      } else {
        Alert.alert("Sign up failed", error.message);
      }
      return;
    }
    try {
      await AsyncStorage.setItem("farmer_id", data);
      await saveSession(mobile.trim());
      const { saveFarmerName, saveFarmerVillage } = require("../../lib/userProfile");
      await saveFarmerName(farmerName.trim());
      await saveFarmerVillage(village.trim());
    } catch (e) {
      console.warn("Could not save profile info locally:", e);
    }
    router.replace("/screens/Dashboardscreen");
  };

  return (
    <SafeAreaView style={s.root} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />
      <KeyboardAvoidingView
        style={s.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[s.inner, { paddingTop: insets.top + 16 }]}>

          {/* Brand row */}
          <View style={s.brandRow}>
            <Pressable onPress={handleBack} style={s.backBtn} hitSlop={8}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path d="M19 12H5M5 12l7 7M5 12l7-7"
                  stroke={DARK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </Pressable>
            <View style={s.brandCenter}>
              <Image
                source={require("../../assets/images/LOGO.png")}
                style={s.logoImg}
                resizeMode="contain"
              />
              <Text style={s.brandName}>Fasal Raksha</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          {/* Title */}
          <View style={s.titleBlock}>
            <Text style={s.pageTitle}>Create Account</Text>
            <Text style={s.pageSubtitle}>Join farmers protecting their yields with AI.</Text>
          </View>

          {/* Card */}
          <View style={s.card}>

            {/* Full Name */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Full Name</Text>
              <View style={[s.inputRow, nameFocused && s.inputRowFocused]}>
                <View style={s.iconWrap}><PersonIcon /></View>
                <TextInput style={s.input} placeholder="Ramesh Patil" placeholderTextColor={MUTED}
                  autoCapitalize="words" value={farmerName} onChangeText={setFarmerName}
                  onFocus={() => setNameFocused(true)} onBlur={() => setNameFocused(false)} />
              </View>
            </View>

            {/* Mobile */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Mobile Number</Text>
              <View style={[s.inputRow, mobileFocused && s.inputRowFocused]}>
                <View style={s.iconWrap}><PhoneIcon /></View>
                <Text style={s.prefixText}>+91</Text>
                <TextInput style={[s.input, { flex: 1 }]} placeholder="9876543210"
                  placeholderTextColor={MUTED} keyboardType="number-pad" maxLength={10}
                  value={mobile} onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, ""))}
                  onFocus={() => setMobileFocused(true)} onBlur={() => setMobileFocused(false)} />
              </View>
              {mobile.length > 0 && !isMobileValid && (
                <Text style={s.errorText}>Enter a valid 10-digit mobile number</Text>
              )}
            </View>

            {/* Village */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Village</Text>
              <View style={[s.inputRow, villageFocused && s.inputRowFocused]}>
                <View style={s.iconWrap}><MapPinIcon /></View>
                <TextInput style={s.input} placeholder="Virar" placeholderTextColor={MUTED}
                  autoCapitalize="words" value={village} onChangeText={setVillage}
                  onFocus={() => setVillageFocused(true)} onBlur={() => setVillageFocused(false)} />
              </View>
            </View>

            {/* Password */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Password</Text>
              <View style={[s.inputRow, passFocused && s.inputRowFocused]}>
                <View style={s.iconWrap}><LockIcon /></View>
                <TextInput style={[s.input, { flex: 1 }]} placeholder="Min. 6 characters"
                  placeholderTextColor={MUTED} secureTextEntry={!showPass}
                  value={password} onChangeText={setPassword}
                  onFocus={() => setPassFocused(true)} onBlur={() => setPassFocused(false)} />
                <Pressable onPress={() => setShowPass(p => !p)} style={s.eyeBtn}>
                  <EyeIcon visible={showPass} />
                </Pressable>
              </View>
              {password.length > 0 && (
                <View style={s.strengthRow}>
                  {[1, 2, 3].map(i => (
                    <View key={i} style={[s.strengthBar,
                      { backgroundColor: strength >= i ? strengthColors[strength] : BORDER }]} />
                  ))}
                  <Text style={[s.strengthLabel, { color: strengthColors[strength] }]}>
                    {strengthLabels[strength]}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <View style={s.fieldGroup}>
              <Text style={s.label}>Confirm Password</Text>
              <View style={[s.inputRow, confirmFocused && s.inputRowFocused]}>
                <View style={s.iconWrap}><LockIcon /></View>
                <TextInput style={[s.input, { flex: 1 }]} placeholder="Re-enter password"
                  placeholderTextColor={MUTED} secureTextEntry={!showConfirm}
                  value={confirm} onChangeText={setConfirm}
                  onFocus={() => setConfirmFocused(true)} onBlur={() => setConfirmFocused(false)} />
                <Pressable onPress={() => setShowConfirm(p => !p)} style={s.eyeBtn}>
                  <EyeIcon visible={showConfirm} />
                </Pressable>
              </View>
              {!passwordsMatch && (
                <Text style={s.errorText}>Passwords don't match</Text>
              )}
            </View>

            {/* Terms */}
            <Pressable style={s.checkRow} onPress={() => setAgreed(a => !a)}>
              <CheckIcon checked={agreed} />
              <Text style={s.checkText}>
                I agree to the <Text style={s.linkText}>Terms and Conditions</Text>
                {" "}and <Text style={s.linkText}>Privacy Policy</Text> of Fasal Raksha.
              </Text>
            </Pressable>

            {/* Register CTA */}
            <Pressable
              style={({ pressed }) => [
                s.btn,
                (!isReady || loading) && s.btnOff,
                pressed && isReady && !loading && { opacity: 0.88 },
              ]}
              onPress={handleSignUp}
              disabled={!isReady || loading}
            >
              <Text style={s.btnText}>{loading ? "Creating account…" : "Register  →"}</Text>
            </Pressable>
          </View>

          {/* Sign in link */}
          <View style={s.bottomRow}>
            <Text style={s.bottomText}>Already have an account? </Text>
            <Pressable onPress={() => router.replace("/screens/Loginscreen")}>
              <Text style={s.bottomLink}>Sign In</Text>
            </Pressable>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  kav:  { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: "center",
  },

  // Brand
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: WHITE, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: BORDER,
  },
  brandCenter: {
    flex: 1, flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 10,
  },
  logoImg: { width: 32, height: 32 },
  brandName: { fontSize: 18, fontWeight: "800", color: GREEN, letterSpacing: -0.3 },

  // Title
  titleBlock: { alignItems: "center", marginBottom: 16 },
  pageTitle: { fontSize: 24, fontWeight: "800", color: DARK, letterSpacing: -0.5, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: MUTED, textAlign: "center" },

  // Card
  card: {
    backgroundColor: WHITE, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 4,
  },

  // Fields
  fieldGroup: { marginBottom: 10 },
  label: { fontSize: 12, fontWeight: "700", color: DARK, marginBottom: 6 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F7FAF7", borderRadius: 10,
    borderWidth: 1.5, borderColor: BORDER,
    height: 46, paddingHorizontal: 12, gap: 8,
  },
  inputRowFocused: { borderColor: GREEN_MID, backgroundColor: "#EDF5EE" },
  iconWrap: { width: 20, alignItems: "center" },
  prefixText: { fontSize: 14, fontWeight: "700", color: DARK },
  input: { flex: 1, fontSize: 14, color: DARK },
  eyeBtn: { padding: 4 },

  strengthRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthLabel: { fontSize: 10, fontWeight: "700", width: 40, textAlign: "right" },
  errorText: { fontSize: 11, color: RED, marginTop: 4, marginLeft: 2 },

  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 14, marginTop: 2 },
  checkText: { flex: 1, fontSize: 12, color: MUTED, lineHeight: 18 },
  linkText: { color: GREEN, fontWeight: "700" },

  btn: {
    backgroundColor: GREEN_DARK, borderRadius: 30, height: 50,
    alignItems: "center", justifyContent: "center",
    shadowColor: GREEN_DARK, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  btnOff: { opacity: 0.38 },
  btnText: { color: WHITE, fontSize: 15, fontWeight: "700", letterSpacing: 0.4 },

  bottomRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16 },
  bottomText: { fontSize: 13, color: MUTED },
  bottomLink: { fontSize: 13, fontWeight: "700", color: GREEN },
});