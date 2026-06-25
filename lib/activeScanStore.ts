// FILE PATH → lib/activeScanStore.ts
// Yeh poora file banana hai agar nahi hai, ya replace karo agar hai

import AsyncStorage from "@react-native-async-storage/async-storage";

const ACTIVE_SCAN_KEY = "cropguard_active_scan";
const HISTORY_KEY     = "cropguard_scan_history_v2"; // Historyscreen se SAME key

export interface ActiveScan {
  scanId:        string;
  mode:          "crop" | "pest";
  isHealthy:     boolean;
  scannedAt:     string;
  imageUri?:     string;   // ← yeh add karo agar nahi hai
  activeDisease: {
    name:        string;
    probability: number;
    crop?:       string;
    description?:string;
    symptoms?:   string[];
    precautions?:string;
    treatment: {
      biological:  string[];
      chemical:    string[];
      prevention:  string[];
    };
  } | null;
  allDiseases: { name: string; probability: number }[];
}

// Active scan save karo (scan karne ke baad)
export async function setActiveScan(scan: ActiveScan): Promise<void> {
  await AsyncStorage.setItem(ACTIVE_SCAN_KEY, JSON.stringify(scan));
}

// Active scan read karo (result screen par)
export async function getActiveScan(): Promise<ActiveScan | null> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_SCAN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// History mein save karo (Save Report button se)
export async function saveActiveScanToHistory(scan: ActiveScan): Promise<void> {
  try {
    const raw  = await AsyncStorage.getItem(HISTORY_KEY);
    const all  = raw ? JSON.parse(raw) : [];

    // Duplicate check — same scanId dobara save mat karo
    const alreadyExists = all.some((r: any) => r.id === scan.scanId);
    if (alreadyExists) return;

    // Historyscreen ke HistoryRecord format mein convert karo
    const record = {
      id:           scan.scanId,
      timestamp:    Date.now(),
      mode:         scan.mode,
      imageUri:     scan.imageUri ?? "",
      isHealthy:    scan.isHealthy,
      scannedAt:    scan.scannedAt,
      locationName: "Field",   // TODO: baad mein real location add karo
      results: scan.activeDisease
        ? [
            {
              name:        scan.activeDisease.name,
              probability: scan.activeDisease.probability,
              description: scan.activeDisease.description ?? "",
              commonNames: [],
              treatment:   scan.activeDisease.treatment,
            },
          ]
        : [],
    };

    // Naya record sabse upar daalo
    const updated = [record, ...all];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("saveActiveScanToHistory error:", err);
  }
}