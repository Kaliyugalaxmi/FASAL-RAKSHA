// FILE PATH → lib/session.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDED_KEY  = "fasal_raksha_onboarded";
const SESSION_KEY    = "fasal_raksha_user_phone";

export async function isLoggedIn(): Promise<boolean> {
  const phone = await AsyncStorage.getItem(SESSION_KEY);
  return !!phone;
}

export async function currentPhone(): Promise<string | null> {
  return AsyncStorage.getItem(SESSION_KEY);
}

export async function saveSession(phone: string): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, phone);
}

export async function signOut(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

// Unified history key for the whole app
export const HISTORY_KEY = "cropguard_scan_history_v2";

export async function hasOnboarded(): Promise<boolean> {
  const v = await AsyncStorage.getItem(ONBOARDED_KEY);
  return v === "true";
}

export async function markOnboarded(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDED_KEY, "true");
}