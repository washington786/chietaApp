import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalBottomSheet } from "@/hooks/navigation/BottomSheet";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { Text as RnText } from "react-native-paper";
import { RCol, RRow } from "@/components/common";
import colors from "@/config/colors";
import { chatSquare, errorInspect } from "@/components/loadAssets";

const { width } = Dimensions.get("window");
// 2 cards per row with gap
const cardWidth = width < 360 ? width - 32 : (width - 48) / 2; 
// 48 = 16px padding left + 16px padding right + 16px gap between cards

export default function LandingScreen() {
  const { login } = usePageTransition();
  const { open, close } = useGlobalBottomSheet();

  const messageOpacity = useRef(new Animated.Value(0)).current;
  const exploreTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(messageOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(exploreTranslateY, {
          toValue: 6,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(exploreTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  function openInfoSheet() {
    open(<ChatBot close={close} />, { snapPoints: ["50%"] });
  }

  return (
    <LinearGradient
      colors={["#ffffff", "#f7f5fc", "#e6e0f8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={require("../../../../assets/logov2.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome To{"\n"}CHIETA Portal</Text>

        <Animated.Text
          style={[styles.attentionMessage, { opacity: messageOpacity }]}
        >
          Discover Jobs, Grants & Skills – All in One App!
        </Animated.Text>

        <Animated.View style={{ transform: [{ translateY: exploreTranslateY }] }}>
          <Icon
            name="chevron-down"
            size={24}
            color={colors.primary[700] || "#6d28d9"}
          />
        </Animated.View>

        {/* 2 cards per row */}
        <View style={styles.grid}>
          <Card
            icon="briefcase"
            title="Careers"
            badge="Visit Website"
            desc="Jobs & Opportunities"
            onPress={() =>
              Linking.openURL("https://chieta.org.za/careers/vacancies/")
            }
            color={colors.primary[700] || "#6d28d9"}
            style={{ marginRight: 8 }}
          />
          <Card
            icon="bulb"
            title="SSC"
            badge="Visit Website"
            desc="Smart Skills Centres"
            onPress={() =>
              Linking.openURL("https://glittery-pony-b3e00d.netlify.app/")
            }
            color={colors.primary[700] || "#6d28d9"}
            style={{ marginLeft: 8 }}
          />
          <Card
            icon="business"
            title="IMS"
            badge="Login to IMS Portal"
            desc="Grants Applications"
            onPress={login}
            color={colors.primary[700] || "#6d28d9"}
            style={{ marginRight: 8 }}
          />
          <Card
            icon="school"
            title="SSDD"
            badge="Coming Soon"
            desc="Learner Opportunities"
            disabled
            color="#9ca3af"
            style={{ marginLeft: 8 }}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footerContainer}>
        <Text style={styles.footer}>
          &copy; {new Date().getFullYear()} CHIETA. All rights reserved.
        </Text>
      </View>

      {/* Floating action button */}
      <TouchableOpacity style={styles.fab} onPress={openInfoSheet}>
        <Icon name="chatbubble-ellipses" size={26} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

// ================= CARD =================
function Card({
  icon,
  title,
  badge,
  desc,
  onPress,
  disabled = false,
  color,
  style,
}: any) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width: cardWidth },
        disabled && styles.cardDisabled,
        pressed && !disabled && { transform: [{ scale: 0.97 }] },
        style,
      ]}
      onPress={!disabled ? onPress : undefined}
    >
      <LinearGradient
        colors={disabled ? ["#e5e7eb", "#d1d5db"] : [`${color}22`, `${color}10`]}
        style={styles.iconWrapper}
      >
        <Icon name={icon} size={26} color={disabled ? "#9ca3af" : color} />
      </LinearGradient>

      <Text style={[styles.cardTitle, disabled && styles.cardTitleDisabled]}>
        {title}
      </Text>

      <Text style={[styles.cardDesc, disabled && styles.cardDescDisabled]}>
        {desc}
      </Text>

      <View
        style={[
          styles.badge,
          { backgroundColor: disabled ? "#e5e7eb" : `${color}18` },
        ]}
      >
        <Text
          style={[styles.badgeText, { color: disabled ? "#9ca3af" : color }]}
        >
          {badge}
        </Text>
      </View>
    </Pressable>
  );
}

// ================= CHATBOT =================
function ChatBot({ close }: { close: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <RRow
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Image source={chatSquare} style={{ width: 20, height: 20 }} />
          <RnText variant="titleMedium">Chieta Assistant</RnText>
        </View>

        <TouchableOpacity onPress={close}>
          <EvilIcons name="close" size={32} color="black" />
        </TouchableOpacity>
      </RRow>

      <RCol style={{ alignItems: "center", gap: 16 }}>
        <Image source={errorInspect} style={{ width: 64, height: 64 }} />
        <RnText variant="headlineMedium" style={{ fontWeight: "bold" }}>
          Coming Soon
        </RnText>
        <RnText
          variant="bodyMedium"
          style={{ textAlign: "center", color: "#666", lineHeight: 24 }}
        >
          Our helpful assistant is still in development.{"\n"}We’ll notify you
          when it's ready!
        </RnText>
      </RCol>
    </View>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  logo: { width: 220, height: 120, marginBottom: 16 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: colors.primary[700] || "#6d28d9",
    lineHeight: 34,
    marginBottom: 8,
    letterSpacing: 1,
  },
  attentionMessage: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.secondary[700] || "#f97316",
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 20,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 16 },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary[700] || "#6d28d9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f2f6",
  },
  cardDisabled: { opacity: 0.6 },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
    textAlign: "center",
    color: "#111827",
  },
  cardTitleDisabled: { color: "#9ca3af" },
  cardDesc: {
    fontSize: 11,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 6,
  },
  cardDescDisabled: { color: "#9ca3af" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: "600" },
  footerContainer: { paddingVertical: 16, alignItems: "center" },
  footer: { fontSize: 12, color: "#9ca3af", textAlign: "center" },
});
