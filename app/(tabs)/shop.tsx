// FILE PATH → app/(tabs)/shop.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Theme ────────────────────────────────────────────────────────────────────
const BG          = "#F5F5EF";
const WHITE       = "#FFFFFF";
const DARK        = "#1A2E1A";
const MUTED       = "#5A7260";
const GREEN       = "#1A5C2A";
const GREEN_LIGHT = "#E8F4EA";
const GREEN_MID   = "#3A7A2A";
const GREEN_DARK  = "#0F3D1A";
const BORDER      = "rgba(26,92,42,0.12)";
const AMBER       = "#B8680A";
const RED         = "#C0392B";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  image: any;
  badge?: string;
  badgeColor?: string;
  inStock: boolean;
  fallbackEmoji: string;
}

// ─── Products ────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  // ── SEEDS ──
  { id: "s1", name: "Tomato Hybrid Seeds (Arka Rakshak)", subtitle: "IIHR Hybrid • Triple Disease Resistant", category: "Seeds", price: 320, unit: "10g", rating: 4.6, reviews: 128, image: require("../../assets/images/crops/tomato_hybrid_seeds.png"), badge: "Best Seller", badgeColor: GREEN, inStock: true, fallbackEmoji: "🍅" },
  { id: "s2", name: "Tomato Seeds (Pusa Ruby)", subtitle: "Open Pollinated • Early Maturing", category: "Seeds", price: 120, unit: "50g", rating: 4.5, reviews: 94, image: require("../../assets/images/crops/tomato_pusa_ruby.png"), badge: "Organic", badgeColor: GREEN_MID, inStock: true, fallbackEmoji: "🍅" },
  { id: "s3", name: "Wheat Seeds (HD-2967)", subtitle: "High Protein • Rust Resistant • ICAR", category: "Seeds", price: 280, unit: "5 kg", rating: 4.8, reviews: 312, image: require("../../assets/images/crops/wheat_hd2967.png"), badge: "Popular", badgeColor: AMBER, inStock: true, fallbackEmoji: "🌾" },
  { id: "s4", name: "Paddy Seeds (IR-64)", subtitle: "Short Duration • High Yield • Fine Grain", category: "Seeds", price: 350, unit: "5 kg", rating: 4.6, reviews: 187, image: require("../../assets/images/crops/paddy_ir64.png"), inStock: true, fallbackEmoji: "🌾" },
  { id: "s5", name: "Brinjal Hybrid Seeds (Pusa Hybrid 6)", subtitle: "Long Purple • Bacterial Wilt Tolerant", category: "Seeds", price: 180, unit: "10g", rating: 4.4, reviews: 76, image: require("../../assets/images/crops/brinjal_pusa_hybrid6.png"), inStock: true, fallbackEmoji: "🍆" },
  { id: "s6", name: "Chilli Seeds (Byadgi)", subtitle: "Deep Red • High Colour Value • Karnataka", category: "Seeds", price: 150, unit: "10g", rating: 4.7, reviews: 203, image: require("../../assets/images/crops/chilli_byadgi.png"), inStock: true, fallbackEmoji: "🌶️" },
  { id: "s7", name: "Onion Seeds (Bhima Super)", subtitle: "Dark Red • Long Storage • NHRDF", category: "Seeds", price: 260, unit: "100g", rating: 4.5, reviews: 145, image: require("../../assets/images/crops/onion_bhima_super.png"), inStock: true, fallbackEmoji: "🧅" },
  { id: "s8", name: "Okra Seeds (Arka Anamika)", subtitle: "Yellow Vein Mosaic Resistant • IIHR", category: "Seeds", price: 140, unit: "100g", rating: 4.3, reviews: 58, image: require("../../assets/images/crops/okra_arka_anamika.png"), inStock: true, fallbackEmoji: "🥬" },
  { id: "s9", name: "Cotton Hybrid BG-II Seeds", subtitle: "Bollgard II • Bollworm Protected", category: "Seeds", price: 850, unit: "475g packet", rating: 4.4, reviews: 89, image: require("../../assets/images/crops/cotton_bg2.png"), inStock: false, fallbackEmoji: "☁️" },

  // ── FERTILIZERS ──
  { id: "f1", name: "IFFCO NPK 12:32:16", subtitle: "Complex Fertilizer • For All Crops", category: "Fertilizers", price: 450, unit: "50 kg bag", rating: 4.7, reviews: 256, image: require("../../assets/images/crops/iffco_npk_123216.png"), badge: "Best Seller", badgeColor: AMBER, inStock: true, fallbackEmoji: "🌾" },
  { id: "f2", name: "IFFCO Urea 46% N (Neem Coated)", subtitle: "Nitrogen Rich • Slow Release", category: "Fertilizers", price: 310, unit: "45 kg bag", rating: 4.5, reviews: 198, image: require("../../assets/images/crops/iffco_urea.png"), inStock: true, fallbackEmoji: "💧" },
  { id: "f3", name: "IFFCO DAP (18:46:0)", subtitle: "Diammonium Phosphate • Root & Flower Growth", category: "Fertilizers", price: 1350, unit: "50 kg bag", rating: 4.8, reviews: 342, image: require("../../assets/images/crops/iffco_dap.png"), badge: "Popular", badgeColor: GREEN, inStock: true, fallbackEmoji: "🌱" },
  { id: "f4", name: "Coromandel Gromor 28:28:0", subtitle: "Nitrogen-Phosphorus Complex • Enhanced Yield", category: "Fertilizers", price: 480, unit: "50 kg bag", rating: 4.7, reviews: 156, image: require("../../assets/images/crops/gromor_28280.png"), inStock: true, fallbackEmoji: "🟡" },
  { id: "f5", name: "Organic Compost (Farmyard Manure)", subtitle: "Rich Humus • Soil Enrichment", category: "Fertilizers", price: 350, unit: "40 kg bag", rating: 4.6, reviews: 178, image: require("../../assets/images/crops/organic_compost.png"), badge: "Organic", badgeColor: GREEN_MID, inStock: true, fallbackEmoji: "🌿" },
  { id: "f6", name: "Vermicompost", subtitle: "Earthworm Castings • Nutrient Dense", category: "Fertilizers", price: 290, unit: "10 kg bag", rating: 4.8, reviews: 224, image: require("../../assets/images/crops/vermicompost.png"), badge: "Organic", badgeColor: GREEN_MID, inStock: true, fallbackEmoji: "🪱" },
  { id: "f7", name: "Chambal Uttam MOP (0:0:60)", subtitle: "Muriate of Potash • Fruit & Grain Quality", category: "Fertilizers", price: 1700, unit: "50 kg bag", rating: 4.5, reviews: 112, image: require("../../assets/images/crops/chambal_mop.png"), inStock: true, fallbackEmoji: "⬜" },
  { id: "f8", name: "Zinc Sulphate 21%", subtitle: "Micronutrient • Prevents Khaira Disease", category: "Fertilizers", price: 220, unit: "1 kg", rating: 4.4, reviews: 87, image: require("../../assets/images/crops/zinc_sulphate.png"), inStock: true, fallbackEmoji: "🔷" },
  { id: "f9", name: "IFFCO Nano Urea Plus (Liquid)", subtitle: "Foliar Spray • Reduces Conventional Urea Use", category: "Fertilizers", price: 240, unit: "500 ml bottle", rating: 4.3, reviews: 64, image: require("../../assets/images/crops/nano_urea.png"), badge: "New", badgeColor: GREEN, inStock: false, fallbackEmoji: "🟢" },

  // ── PESTICIDES ──
  { id: "p1", name: "Neem Oil Pesticide (Coromandel)", subtitle: "Natural • Eco-Friendly • Cold Pressed", category: "Pesticides", price: 280, unit: "500 ml", rating: 4.5, reviews: 189, image: require("../../assets/images/crops/neem_oil.png"), badge: "Organic", badgeColor: GREEN_MID, inStock: true, fallbackEmoji: "🌿" },
  { id: "p2", name: "Tata Takumi (Flubendiamide 20% WG)", subtitle: "Controls Fruit Borer & Caterpillars", category: "Pesticides", price: 420, unit: "100g", rating: 4.6, reviews: 234, image: require("../../assets/images/crops/tata_takumi.png"), badge: "Popular", badgeColor: AMBER, inStock: true, fallbackEmoji: "🧴" },
  { id: "p3", name: "Dhanuka Confidor (Imidacloprid 17.8% SL)", subtitle: "Systemic • Controls Sucking Pests", category: "Pesticides", price: 380, unit: "250 ml", rating: 4.7, reviews: 167, image: require("../../assets/images/crops/dhanuka_confidor.png"), inStock: true, fallbackEmoji: "🐛" },
  { id: "p4", name: "UPL Tracer (Spinosad 45% SC)", subtitle: "Bio-Pesticide • Thrips & Caterpillars", category: "Pesticides", price: 650, unit: "100 ml", rating: 4.8, reviews: 98, image: require("../../assets/images/crops/upl_tracer.png"), badge: "Bio", badgeColor: GREEN, inStock: true, fallbackEmoji: "🍃" },
  { id: "p5", name: "Syngenta Ampligo", subtitle: "Fast Knockdown • Wide Spectrum", category: "Pesticides", price: 340, unit: "100 ml", rating: 4.4, reviews: 143, image: require("../../assets/images/crops/syngenta_ampligo.png"), inStock: true, fallbackEmoji: "💊" },
  { id: "p6", name: "Tata Sentry (Lambda Cyhalothrin)", subtitle: "Ready to Use • Broad Spectrum Insecticide", category: "Pesticides", price: 199, unit: "1 L", rating: 4.3, reviews: 76, image: require("../../assets/images/crops/tata_sentry.png"), inStock: false, fallbackEmoji: "🚿" },

  // ── FUNGICIDES ──
  { id: "fn1", name: "Indofil M-45 (Mancozeb 75% WP)", subtitle: "Broad Spectrum • Preventive & Curative", category: "Fungicides", price: 450, unit: "1 kg", rating: 4.6, reviews: 218, image: require("../../assets/images/crops/indofil_m45.png"), badge: "Best Seller", badgeColor: AMBER, inStock: true, fallbackEmoji: "🧪" },
  { id: "fn2", name: "Blue Copper (Copper Oxychloride 50% WP)", subtitle: "Broad Spectrum • Bacterial & Fungal Diseases", category: "Fungicides", price: 380, unit: "1 kg", rating: 4.9, reviews: 267, image: require("../../assets/images/crops/blue_copper.png"), badge: "Popular", badgeColor: GREEN, inStock: true, fallbackEmoji: "🔵" },
  { id: "fn3", name: "Tata Bavistin (Carbendazim 50% WP)", subtitle: "Systemic • Powdery Mildew Control", category: "Fungicides", price: 290, unit: "500g", rating: 4.5, reviews: 134, image: require("../../assets/images/crops/tata_bavistin.png"), inStock: true, fallbackEmoji: "🟦" },
  { id: "fn4", name: "Sulfex (Sulphur 80% WDG)", subtitle: "Powdery Mildew • Mite Control", category: "Fungicides", price: 180, unit: "1 kg", rating: 4.5, reviews: 89, image: require("../../assets/images/crops/sulfex.png"), inStock: true, fallbackEmoji: "💛" },
  { id: "fn5", name: "Syngenta Amistar Top", subtitle: "Broad Disease Control • Grapes, Veg", category: "Fungicides", price: 720, unit: "100 ml", rating: 4.7, reviews: 112, image: require("../../assets/images/crops/syngenta_amistar.png"), inStock: true, fallbackEmoji: "🟩" },
  { id: "fn6", name: "Dhanuka Tilt (Propiconazole 25% EC)", subtitle: "Systemic • Rust & Blight Control in Wheat", category: "Fungicides", price: 410, unit: "500 ml", rating: 4.6, reviews: 156, image: require("../../assets/images/crops/dhanuka_tilt.png"), inStock: false, fallbackEmoji: "🔴" },
];

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",         name: "All",         emoji: "🛒", bgColor: "#E8F0E8" },
  { id: "Seeds",       name: "Seeds",       emoji: "🌱", bgColor: "#E8F4EA" },
  { id: "Fertilizers", name: "Fertilizers", emoji: "🧪", bgColor: "#FFF8E8" },
  { id: "Pesticides",  name: "Pesticides",  emoji: "🐛", bgColor: "#FFF0E8" },
  { id: "Fungicides",  name: "Fungicides",  emoji: "🍄", bgColor: "#F0E8FF" },
];

const TRUST = [
  { icon: "shield-checkmark-outline", label: "100% Genuine",  sub: "Quality Products" },
  { icon: "car-outline",              label: "Fast Delivery",  sub: "Across India"     },
  { icon: "pricetag-outline",         label: "Best Prices",    sub: "For Farmers"      },
  { icon: "headset-outline",          label: "Expert Support", sub: "7 Days a Week"    },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (id: string) => {
    if (!cart.includes(id)) setCart((prev) => [...prev, id]);
  };

  // ── Product Card ──────────────────────────────────────────────────────────
  const renderCard = ({ item }: { item: Product }) => {
    const inCart = cart.includes(item.id);
    return (
      <TouchableOpacity
        style={[s.card, !item.inStock && { opacity: 0.5 }]}
        activeOpacity={0.85}
        onPress={() =>
          router.push({
            pathname: "/screens/ProductDetailScreen",
            params: { productId: item.id },
          })
        }
      >
        <View style={s.imageWrap}>
          {item.image ? (
            <Image source={item.image} style={s.productImg} resizeMode="contain" />
          ) : (
            <Text style={s.fallbackEmoji}>{item.fallbackEmoji}</Text>
          )}
          {item.badge && (
            <View style={[s.badge, { backgroundColor: item.badgeColor ?? GREEN }]}>
              <Text style={s.badgeText}>{item.badge}</Text>
            </View>
          )}
          {!item.inStock && (
            <View style={s.outOfStockWrap}>
              <Text style={s.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        <View style={s.cardBody}>
          <Text style={s.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={s.productSub} numberOfLines={1}>{item.subtitle}</Text>
          <View style={s.ratingRow}>
            <Ionicons name="star" size={11} color="#F9A825" />
            <Text style={s.ratingText}>{item.rating} ({item.reviews})</Text>
          </View>
          <View style={s.cardFooter}>
            <View>
              <Text style={s.price}>₹{item.price}</Text>
              <Text style={s.unit}>{item.unit}</Text>
            </View>
            <TouchableOpacity
              style={[s.addBtn, !item.inStock && { backgroundColor: MUTED }, inCart && { backgroundColor: GREEN_MID }]}
              onPress={() => addToCart(item.id)}
              disabled={!item.inStock}
            >
              <Ionicons name={inCart ? "checkmark" : "cart-outline"} size={14} color={WHITE} />
              <Text style={s.addBtnText}>{inCart ? "Added" : "Add"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Image source={require("../../assets/images/LOGO.png")} style={s.logo} resizeMode="contain" />
          <View>
            <Text style={s.appName}>Fasal Raksha</Text>
            <Text style={s.tagline}>हर फ़सल, हमारी रक्षा</Text>
          </View>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={DARK} />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}>
            <Ionicons name="cart-outline" size={22} color={DARK} />
            {cart.length > 0 && (
              <View style={s.cartDot}>
                <Text style={s.cartDotText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={s.gridRow}
        showsVerticalScrollIndicator={false}
        // ✅ FIX: removed insets.bottom — tab bar is outside this component,
        //    so we don't add extra bottom inset. Just a small bottom pad.
        contentContainerStyle={[s.gridContent, { paddingBottom: 8 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"

        ListHeaderComponent={
          <>
            {/* ── Title & Search ── */}
            <View style={s.titleSection}>
              <Text style={s.pageTitle}>Agri-Store</Text>
              <Text style={s.pageSub}>Quality products for healthy crops and better yield</Text>

              <View style={s.searchRow}>
                <View style={s.searchBar}>
                  <Ionicons name="search-outline" size={16} color={MUTED} />
                  <TextInput
                    style={s.searchInput}
                    placeholder="Search"
                    placeholderTextColor={MUTED}
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    returnKeyType="search"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Ionicons name="close-circle" size={16} color={MUTED} />
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity style={s.filterBtn}>
                  <Ionicons name="filter-outline" size={16} color={WHITE} />
                  <Text style={s.filterText}>Filter</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Top Categories ── */}
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Top Categories</Text>
              <TouchableOpacity>
                <Text style={s.viewAll}>View All  ›</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.catScroll}
            >
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={s.catCard}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.75}
                  >
                    <View style={[
                      s.catImageBox,
                      { backgroundColor: cat.bgColor },
                      active && s.catImageBoxActive,
                    ]}>
                      <Text style={s.catEmoji}>{cat.emoji}</Text>
                    </View>
                    <Text style={[s.catLabel, active && s.catLabelActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* ── Product Grid Header ── */}
            <View style={[s.sectionHeader, { marginTop: 8 }]}>
              <Text style={s.sectionTitle}>
                {selectedCategory === "all" ? "All Products" : selectedCategory}
              </Text>
              <Text style={s.productCount}>{filtered.length} products</Text>
            </View>
          </>
        }

        ListFooterComponent={
          <View style={s.trustBar}>
            {TRUST.map((t, i) => (
              <View key={i} style={s.trustItem}>
                <Ionicons name={t.icon as any} size={22} color={GREEN} />
                <Text style={s.trustLabel}>{t.label}</Text>
                <Text style={s.trustSub}>{t.sub}</Text>
              </View>
            ))}
          </View>
        }

        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 44 }}>🔍</Text>
            <Text style={s.emptyText}>
              {searchQuery ? `No results for "${searchQuery}"` : "No products found"}
            </Text>
            <Text style={s.emptySub}>Try a different search or category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12,
    backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  headerLeft:  { flexDirection: "row", alignItems: "center", gap: 10 },
  logo:        { width: 44, height: 44, borderRadius: 22 },
  appName:     { fontSize: 18, fontWeight: "800", color: GREEN_DARK, letterSpacing: -0.3 },
  tagline:     { fontSize: 11, color: GREEN, marginTop: 1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    justifyContent: "center", alignItems: "center", position: "relative",
  },
  cartDot: {
    position: "absolute", top: 4, right: 4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: RED, justifyContent: "center", alignItems: "center",
  },
  cartDotText: { fontSize: 9, fontWeight: "700", color: WHITE },

  titleSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14 },
  pageTitle:    { fontSize: 28, fontWeight: "800", color: GREEN_DARK, letterSpacing: -0.5 },
  pageSub:      { fontSize: 13, color: MUTED, marginTop: 2, marginBottom: 14 },
  searchRow:    { flexDirection: "row", gap: 10, alignItems: "center" },

  searchBar: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: WHITE, borderRadius: 12,
    borderWidth: 1, borderColor: BORDER,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: DARK,
    paddingVertical: 0,
    minHeight: 20,
  },
  filterBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 16, paddingVertical: 11,
    backgroundColor: GREEN, borderRadius: 12,
  },
  filterText: { fontSize: 13, fontWeight: "700", color: WHITE },

  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: DARK },
  viewAll:      { fontSize: 13, color: GREEN, fontWeight: "600" },
  productCount: { fontSize: 13, color: MUTED, fontWeight: "500" },

  catScroll:  { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  catCard:    { alignItems: "center", gap: 8, width: 76 },
  catImageBox: {
    width: 72, height: 72,
    borderRadius: 18,
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "transparent",
  },
  catImageBoxActive: {
    borderColor: GREEN,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  catEmoji:      { fontSize: 34 },
  catLabel:      { fontSize: 12, fontWeight: "600", color: MUTED, textAlign: "center" },
  catLabelActive:{ color: GREEN, fontWeight: "800" },

  gridContent: { paddingTop: 4 },
  gridRow: {
    justifyContent: "space-between",
    paddingHorizontal: 16, gap: 12, marginBottom: 14,
  },

  card: {
    flex: 1, backgroundColor: WHITE, borderRadius: 16, overflow: "hidden",
    borderWidth: 1, borderColor: BORDER,
    elevation: 2,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4,
  },
  imageWrap: {
    height: 130, backgroundColor: GREEN_LIGHT,
    justifyContent: "center", alignItems: "center", position: "relative",
  },
  productImg:     { width: "85%", height: "85%" },
  fallbackEmoji:  { fontSize: 52 },
  badge: {
    position: "absolute", top: 6, left: 6,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  badgeText:      { fontSize: 9, fontWeight: "700", color: WHITE },
  outOfStockWrap: {
    position: "absolute", top: 6, right: 6,
    backgroundColor: RED, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4,
  },
  outOfStockText: { fontSize: 9, fontWeight: "600", color: WHITE },

  cardBody:    { padding: 10, gap: 4 },
  productName: { fontSize: 13, fontWeight: "700", color: DARK, lineHeight: 17 },
  productSub:  { fontSize: 10, color: MUTED },
  ratingRow:   { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 },
  ratingText:  { fontSize: 10, color: MUTED, fontWeight: "600" },

  cardFooter: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: 6,
  },
  price:      { fontSize: 15, fontWeight: "800", color: GREEN_DARK },
  unit:       { fontSize: 9, color: MUTED, marginTop: 1 },
  addBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 7,
    backgroundColor: GREEN, borderRadius: 8,
  },
  addBtnText: { fontSize: 11, fontWeight: "700", color: WHITE },

  // ✅ FIX: removed marginBottom from trustBar so it sits flush above the tab bar
  trustBar: {
    flexDirection: "row", flexWrap: "wrap",
    marginHorizontal: 16, marginTop: 8, marginBottom: 0,
    backgroundColor: WHITE, borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: BORDER, gap: 8,
  },
  trustItem:  { width: "45%", alignItems: "center", gap: 3, paddingVertical: 8 },
  trustLabel: { fontSize: 12, fontWeight: "700", color: GREEN_DARK, textAlign: "center" },
  trustSub:   { fontSize: 10, color: MUTED, textAlign: "center" },

  empty:     { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { fontSize: 15, fontWeight: "700", color: DARK, marginTop: 10, textAlign: "center" },
  emptySub:  { fontSize: 12, color: MUTED, marginTop: 4 },
});