// FILE PATH → lib/userProfile.ts
//
// PROBLEM THIS FIXES:
// Dashboard aur Profile screen pe "Rajesh" hardcoded tha. Signup form
// farmerName collect karta tha but kahin store nahi hota tha, isliye
// koi bhi naya farmer signup kare, dashboard pe hamesha "Rajesh" hi
// dikhta. Ye file ek single, shared jagah hai jahan se naam
// save/read hota hai — Login, Signup, Dashboard, Profile sab isi se
// padhenge. Ek hi jagah change karo, sab jagah sahi naam dikhega.

import AsyncStorage from "@react-native-async-storage/async-storage";

const NAME_KEY = "fasal_raksha_farmer_name";
const VILLAGE_KEY = "fasal_raksha_farmer_village";

export async function saveFarmerName(name: string): Promise<void> {
  if (!name?.trim()) return;
  await AsyncStorage.setItem(NAME_KEY, name.trim());
}

export async function getFarmerName(): Promise<string> {
  const name = await AsyncStorage.getItem(NAME_KEY);
  return name && name.trim().length > 0 ? name.trim() : "Farmer";
}

export async function saveFarmerVillage(village: string): Promise<void> {
  if (!village?.trim()) return;
  await AsyncStorage.setItem(VILLAGE_KEY, village.trim());
}

export async function getFarmerVillage(): Promise<string> {
  const v = await AsyncStorage.getItem(VILLAGE_KEY);
  return v && v.trim().length > 0 ? v.trim() : "";
}

// Avatar circle me dikhane wala letter — naam ka first letter, hamesha
// uppercase. Naam available na ho to generic "F" (Farmer) dikhayega,
// "R" hardcoded nahi.
export function getInitial(name: string): string {
  if (!name || name.trim().length === 0) return "F";
  return name.trim().charAt(0).toUpperCase();
}

// Time-based greeting — same logic Dashboard already use kar raha tha,
// ek jagah rakh diya taaki duplicate na ho.
export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning,";
  if (h < 17) return "Good Afternoon,";
  return "Good Evening,";
}

export async function clearFarmerProfile(): Promise<void> {
  await AsyncStorage.multiRemove([NAME_KEY, VILLAGE_KEY]);
}