// FILE PATH → app/screens/ProductDetailScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Theme (matches all other screens) ──────────────────────────────────────
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
const GOLD        = "#1A5C2A";
const GOLD_LIGHT  = "#E8F4EA";

// ─── Product Data ──────────────────────────────────────────────────────────
const PRODUCTS_MAP: Record<string, any> = {
  "1": {
    id: "1",
    name: "Neem Oil Concentrate",
    category: "Pesticides",
    price: 299,
    rating: 4.8,
    reviews: 342,
    image: "🌿",
    description: "100% organic neem oil for pest control. Safe for organic farming.",
    fullDescription: "Premium quality neem oil concentrate extracted from neem tree seeds. This organic pesticide is effective against a wide range of pests including aphids, mites, whiteflies, and caterpillars. Safe for use on vegetables, fruits, and ornamental plants.",
    benefits: [
      "100% organic and eco-friendly",
      "Effective against 200+ pest species",
      "Safe for beneficial insects",
      "No chemical residue",
      "Can be used up to harvest day",
    ],
    usage: "Mix 5ml per liter of water. Spray on affected plants early morning or late evening.",
    inStock: true,
  },
  "2": {
    id: "2",
    name: "Mancozeb 75% WP",
    category: "Fungicides",
    price: 450,
    rating: 4.6,
    reviews: 218,
    image: "🧪",
    description: "Systemic fungicide for crop disease management. Highly effective.",
    fullDescription: "Mancozeb 75% WP is a broad-spectrum fungicide used for controlling various fungal diseases in crops. It provides both preventive and curative action against diseases like early blight, late blight, and leaf spot.",
    benefits: [
      "Broad-spectrum fungicide",
      "Preventive and curative action",
      "Long residual activity",
      "Compatible with most pesticides",
      "Suitable for vegetables and fruits",
    ],
    usage: "Mix 2g per liter of water. Spray at 7-10 day intervals starting from disease appearance.",
    inStock: true,
  },
  "3": {
    id: "3",
    name: "Potassium Nitrate Fertilizer",
    category: "Fertilizers",
    price: 520,
    rating: 4.7,
    reviews: 156,
    image: "🌾",
    description: "Premium grade fertilizer for enhanced crop yield and quality.",
    fullDescription: "High-quality potassium nitrate fertilizer that provides essential nutrients for plant growth and development. Rich in potassium and nitrogen, it enhances crop yield, improves fruit quality, and increases disease resistance.",
    benefits: [
      "High potassium content (13%)",
      "Improves fruit quality and color",
      "Increases disease resistance",
      "Enhances shelf life of produce",
      "Suitable for all crops",
    ],
    usage: "Apply 10-15 kg per acre. Can be applied through drip irrigation or as foliar spray.",
    inStock: true,
  },
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { productId } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);

  const product = PRODUCTS_MAP[productId as string];

  if (!product) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.errorContainer}>
          <Text style={s.errorText}>Product not found</Text>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
          >
            <Text style={s.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    setInCart(true);
    setTimeout(() => {
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={DARK} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Product Details</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image Card */}
        <View style={s.imageCard}>
          <Text style={s.productImage}>{product.image}</Text>
          <View style={s.categoryBadge}>
            <Text style={s.categoryBadgeText}>{product.category}</Text>
          </View>
        </View>

        {/* Product Info Card */}
        <View style={s.card}>
          <Text style={s.productName}>{product.name}</Text>
          <View style={s.ratingRow}>
            <View style={s.ratingStars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(product.rating) ? "star" : "star-outline"}
                  size={14}
                  color="#F9A825"
                />
              ))}
              <Text style={s.ratingText}>
                {product.rating} ({product.reviews} reviews)
              </Text>
            </View>
          </View>

          <View style={s.priceRow}>
            <View>
              <Text style={s.priceLabel}>Price</Text>
              <Text style={s.price}>₹{product.price}</Text>
            </View>
            <View style={s.stockBadge}>
              <Ionicons name="checkmark-circle" size={16} color={GREEN} />
              <Text style={s.stockText}>In Stock</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>About This Product</Text>
          <Text style={s.description}>{product.fullDescription}</Text>
        </View>

        {/* Benefits */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Key Benefits</Text>
          <View style={s.benefitsList}>
            {product.benefits.map((benefit, index) => (
              <View key={index} style={s.benefitItem}>
                <View style={s.benefitDot} />
                <Text style={s.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Usage Instructions */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>How to Use</Text>
          <View style={s.usageBox}>
            <Ionicons name="information-circle-outline" size={16} color={AMBER} />
            <Text style={s.usageText}>{product.usage}</Text>
          </View>
        </View>

        {/* Safety & Storage */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Safety & Storage</Text>
          <View style={s.safetyItem}>
            <Text style={s.safetyLabel}>Storage:</Text>
            <Text style={s.safetyValue}>Keep in cool, dry place away from sunlight</Text>
          </View>
          <View style={s.safetyItem}>
            <Text style={s.safetyLabel}>Shelf Life:</Text>
            <Text style={s.safetyValue}>2 years from manufacturing date</Text>
          </View>
          <View style={s.safetyItem}>
            <Text style={s.safetyLabel}>Precautions:</Text>
            <Text style={s.safetyValue}>Wear gloves and mask while handling. Avoid contact with eyes.</Text>
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={s.card}>
          <Text style={s.sectionTitle}>Quantity</Text>
          <View style={s.quantityRow}>
            <TouchableOpacity
              style={s.quantityBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={s.quantityBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={s.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={s.quantityBtn}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={s.quantityBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.totalPrice}>
            Total: ₹{product.price * quantity}
          </Text>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={[s.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[s.addBtn, inCart && { backgroundColor: GREEN }]}
          onPress={handleAddToCart}
        >
          <Ionicons
            name={inCart ? "checkmark" : "cart-outline"}
            size={20}
            color={WHITE}
          />
          <Text style={s.addBtnText}>
            {inCart ? "Added to Cart" : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: DARK,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: GREEN,
  },
  headerSpacer: {
    width: 40,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  imageCard: {
    height: 200,
    backgroundColor: GOLD_LIGHT,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  productImage: {
    fontSize: 80,
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: GOLD,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: WHITE,
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  productName: {
    fontSize: 20,
    fontWeight: "700",
    color: DARK,
    marginBottom: 8,
  },
  ratingRow: {
    marginBottom: 12,
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "600",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  priceLabel: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "600",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: GREEN_DARK,
    marginTop: 4,
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: GREEN_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "700",
    color: GREEN,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: DARK,
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: MUTED,
    lineHeight: 20,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GREEN,
    marginTop: 6,
  },
  benefitText: {
    fontSize: 13,
    color: DARK,
    flex: 1,
    lineHeight: 18,
  },
  usageBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: AMBER + "10",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: AMBER,
  },
  usageText: {
    fontSize: 13,
    color: DARK,
    flex: 1,
    lineHeight: 18,
  },
  safetyItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  safetyLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: DARK,
    marginBottom: 4,
  },
  safetyValue: {
    fontSize: 12,
    color: MUTED,
    lineHeight: 16,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: GOLD_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: GOLD,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "700",
    color: DARK,
    flex: 1,
    textAlign: "center",
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: GREEN_DARK,
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: GOLD,
    paddingVertical: 14,
    borderRadius: 10,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: WHITE,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: DARK,
    marginBottom: 16,
  },
});
