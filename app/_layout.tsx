// app/_layout.tsx
import { Session } from '@supabase/supabase-js';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from "../lib/LanguageContext";
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ✅ FIX: Single return — LanguageProvider ALWAYS wraps everything
  // No more early return without LanguageProvider
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        {!checked ? (
          // Loading spinner while Supabase checks auth
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5EF' }}>
            <ActivityIndicator size="large" color="#1A5C2A" />
          </View>
        ) : (
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName={session ? "(tabs)" : "index"}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="screens/Onboardingscreen" />
            <Stack.Screen name="screens/SplashScreen" />
            <Stack.Screen name="screens/Loginscreen" />
            <Stack.Screen name="screens/Signupscreen" />
            <Stack.Screen name="screens/LanguageSelectScreen" />
            <Stack.Screen name="screens/Dashboardscreen" />
            <Stack.Screen name="screens/CropResultScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/Forgotpasswordscreen" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ animationEnabled: true }} />
          </Stack>
        )}
      </LanguageProvider>
    </SafeAreaProvider>
  );
}