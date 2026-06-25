// FILE PATH → app/(tabs)/_layout.tsx
// Single tab bar — consistent across ALL screens: Home, Scan, Shop, History, Profile
// Any extra files inside app/(tabs)/ (e.g. explore.tsx, tips.tsx) are hidden
// from the tab bar via href: null, but still reachable via router.push.

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WHITE  = "#FFFFFF";
const DARK   = "#1A2E1A";
const MUTED  = "#5A7260";
const BORDER = "rgba(26,92,42,0.12)";

// Base (content) height of the tab bar, excluding the device's
// bottom safe-area inset (gesture bar / nav buttons / home indicator).
const TAB_BAR_BASE_HEIGHT = 64;
const TAB_BAR_BASE_PADDING_BOTTOM = 8;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: WHITE,
          borderTopWidth: 1,
          borderTopColor: BORDER,
          // ✅ FIX: add the device's bottom safe-area inset so the tab
          // bar isn't drawn under (and clipped by) the system nav bar.
          height: TAB_BAR_BASE_HEIGHT + insets.bottom,
          paddingBottom: TAB_BAR_BASE_PADDING_BOTTOM + insets.bottom,
          paddingTop: 6,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: DARK,
        tabBarInactiveTintColor: MUTED,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <Ionicons name="home" size={size} color={DARK} />
              : <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <Ionicons name="scan" size={size} color={DARK} />
              : <Ionicons name="scan-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <Ionicons name="bag" size={size} color={DARK} />
              : <Ionicons name="bag-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <Ionicons name="time" size={size} color={DARK} />
              : <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) =>
            focused
              ? <Ionicons name="person" size={size} color={DARK} />
              : <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />

      {/* ── Hidden routes — not part of the 5-tab bar, but still navigable ── */}
      <Tabs.Screen
        name="tips"
        options={{ href: null }}
      />
    </Tabs>
  );
}
