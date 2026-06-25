import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { supabase } from '../../lib/supabase'; // up 2 levels to root
const { width } = Dimensions.get('window');

function MailIcon({ size = 32, color = '#a8d6aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth={1.8} />
      <Path d="M2 8l10 6 10-6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function CheckCircleIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" fill="none">
      <Circle cx="32" cy="32" r="30" fill="#e8f7e8" stroke="#a8d6aa" strokeWidth={2} />
      <Path d="M18 32l10 10 18-18" stroke="#a8d6aa" strokeWidth={3}
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const BG          = "#F5F5EF";
  const GREEN       = "#1A5C2A";
  const GREEN_LIGHT = "#E8F4EA";
  const GREEN_DARK  = "#0F3D1A";
  const MUTED       = "#5A7260";

  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Top wave */}
      <View style={styles.topWave} pointerEvents="none">
        <Svg width={width} height={110} viewBox={`0 0 ${width} 110`}>
          <Path
            d={`M0,60 Q${width * 0.25},20 ${width * 0.5},55 Q${width * 0.75},90 ${width},50 L${width},0 L0,0 Z`}
            fill={GREEN} opacity="0.18" />
          <Path
            d={`M0,80 Q${width * 0.3},45 ${width * 0.55},72 Q${width * 0.8},100 ${width},68 L${width},0 L0,0 Z`}
            fill={GREEN} opacity="0.10" />
        </Svg>
      </View>

      {/* Back button */}
      <Pressable style={[styles.backBtn, { top: insets.top + 12 }]} onPress={() => router.back()}>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#3a4e34" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Pressable>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!sent ? (
            <>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <MailIcon size={30} />
                </View>
                <Text style={styles.title}>Forgot password?</Text>
                <Text style={styles.subtitle}>
                  No worries! Enter your email and we'll{'\n'}send you a reset link.
                </Text>
              </View>

              {/* Card */}
              <View style={styles.card}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email address</Text>
                  <View style={[styles.inputWrap, emailFocused && styles.inputWrapFocused]}>
                    <TextInput
                      style={styles.input}
                      placeholder="you@example.com"
                      placeholderTextColor="#b8c8b8"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.btnPrimary,
                    (!email.trim() || loading) && styles.btnDisabled,
                    pressed && email.trim() && !loading && { opacity: 0.88 },
                  ]}
                  onPress={handleSend}
                  disabled={!email.trim() || loading}
                >
                  <Text style={styles.btnPrimaryText}>
                    {loading ? 'Sending…' : 'Send Reset Link'}
                  </Text>
                </Pressable>
              </View>

              {/* Info note */}
              <View style={styles.infoBox}>
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={{ marginTop: 1 }}>
                  <Circle cx="12" cy="12" r="10" stroke="#a8d6aa" strokeWidth={1.8} />
                  <Path d="M12 8v4M12 16h.01" stroke="#a8d6aa" strokeWidth={2} strokeLinecap="round" />
                </Svg>
                <Text style={styles.infoText}>
                  Check your spam folder if you don't see the email within a few minutes.
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* Success view */}
              <View style={styles.successWrapper}>
                <CheckCircleIcon />
                <Text style={styles.successTitle}>Check your inbox</Text>
                <Text style={styles.successSubtitle}>
                  We sent a password reset link to{'\n'}
                  <Text style={styles.successEmail}>{email}</Text>
                </Text>

                <Pressable
                  style={({ pressed }) => [styles.btnPrimary, styles.btnWide, pressed && { opacity: 0.88 }]}
                  onPress={() => {}}
                >
                  <MailIcon size={18} color="#fff" />
                  <Text style={[styles.btnPrimaryText, { marginLeft: 8 }]}>Open Email App</Text>
                </Pressable>

                <View style={styles.resendRow}>
                  <Text style={styles.bottomText}>Didn't receive it? </Text>
                  <Pressable onPress={() => setSent(false)}>
                    <Text style={styles.bottomLink}>Resend</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}

          {/* Back to login */}
          <View style={styles.bottomRow}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5M5 12l7 7M5 12l7-7" stroke="#6a8060" strokeWidth={2}
                strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Pressable onPress={() => router.replace('/screens/Loginscreen')}>
              <Text style={styles.bottomLink}> Back to Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom scene */}
      <View style={styles.scene} pointerEvents="none">
        <Svg width={width} height={90} viewBox="0 0 390 90" preserveAspectRatio="xMidYMax meet">
          <Ellipse cx="195" cy="130" rx="290" ry="80" fill="#a8d6aa" opacity="0.12" />
          <G transform="translate(30,64)" opacity="0.3">
            <Rect x="-2" y="8" width="4" height="16" rx="2" fill="#a8d6aa" />
            <Ellipse cx="-6" cy="11" rx="6" ry="4" rotation="-22" originX="-6" originY="11" fill="#c0e2c0" />
            <Ellipse cx="6" cy="11" rx="6" ry="4" rotation="22" originX="6" originY="11" fill="#c0e2c0" />
          </G>
          <G transform="translate(120,28)" opacity="0.3">
            <Rect x="-4" y="36" width="8" height="30" rx="3" fill="#a8d6aa" />
            <Circle cx="0" cy="18" r="24" fill="#b8deb8" />
            <Circle cx="-12" cy="28" r="15" fill="#cceacc" />
            <Circle cx="12" cy="28" r="15" fill="#cceacc" />
            <Circle cx="0" cy="6" r="18" fill="#d8f0d8" />
          </G>
          <G transform="translate(230,58)" opacity="0.3">
            <Rect x="-2" y="8" width="4" height="16" rx="2" fill="#a8d6aa" />
            <Ellipse cx="-7" cy="11" rx="7" ry="5" rotation="-22" originX="-7" originY="11" fill="#c0e2c0" />
            <Ellipse cx="7" cy="11" rx="7" ry="5" rotation="22" originX="7" originY="11" fill="#c0e2c0" />
          </G>
          <G transform="translate(325,32)" opacity="0.3">
            <Rect x="-3" y="30" width="6" height="26" rx="3" fill="#a8d6aa" />
            <Circle cx="0" cy="16" r="20" fill="#b8deb8" />
            <Circle cx="-10" cy="24" r="13" fill="#cceacc" />
            <Circle cx="10" cy="24" r="13" fill="#cceacc" />
          </G>
        </Svg>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5EF' },
  topWave: { position: 'absolute', top: 0, left: 0, right: 0 },
  backBtn: {
    position: 'absolute', left: 20, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 72 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#E8F4EA', alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, borderWidth: 1.5, borderColor: 'rgba(26,92,42,0.12)',
  },
  title: { fontFamily: 'serif', fontSize: 30, fontWeight: '800', color: '#0F3D1A', letterSpacing: -0.5, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#5A7260', textAlign: 'center', lineHeight: 22 },
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 24,
    shadowColor: '#0F3D1A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 4, marginBottom: 16,
  },
  fieldGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#1A2E1A', marginBottom: 8, letterSpacing: 0.2 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5EF',
    borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(26,92,42,0.12)', paddingHorizontal: 16, height: 52,
  },
  inputWrapFocused: { borderColor: '#1A5C2A', backgroundColor: '#E8F4EA' },
  input: { flex: 1, fontSize: 15, color: '#1A2E1A' },
  btnPrimary: {
    backgroundColor: '#1A5C2A', borderRadius: 14, height: 54,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1A5C2A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 5,
  },
  btnWide: { width: '100%', marginTop: 8 },
  btnDisabled: { backgroundColor: '#c8e4c8', shadowOpacity: 0.1, elevation: 1 },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  infoBox: {
    flexDirection: 'row', gap: 10, backgroundColor: '#f0faf0',
    borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#d0ecd0', marginBottom: 8,
  },
  infoText: { flex: 1, fontSize: 13, color: '#6a8060', lineHeight: 19 },
  successWrapper: { alignItems: 'center', paddingTop: 20, marginBottom: 32 },
  successTitle: { fontFamily: 'serif', fontSize: 28, fontWeight: '800', color: '#111c0d', letterSpacing: -0.5, marginTop: 20, marginBottom: 10 },
  successSubtitle: { fontSize: 15, color: '#6a8060', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  successEmail: { fontWeight: '700', color: '#3a5a34' },
  resendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 100 },
  bottomText: { fontSize: 14, color: '#6a8060' },
  bottomLink: { fontSize: 14, fontWeight: '700', color: '#1A5C2A' },
  scene: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 90 },
});