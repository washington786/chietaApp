import React from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalBottomSheet } from "@/hooks/navigation/BottomSheet";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text as RnText } from "react-native-paper";
import { RCol, RRow } from "@/components/common";
import colors from "@/config/colors";
import { landing_styles as styles } from "@/styles/LandingStyles";

export default function LandingScreen() {
  const { login } = usePageTransition();
  const { open, close } = useGlobalBottomSheet();

  function openInfoSheet() {
    open(<ChatBot close={close} />, { snapPoints: ["50%"] });
  }

  return (
    <LinearGradient
      colors={[colors.secondary[300] || "#fff6eb", "#fff6eb", colors.primary[700] || "#6d28d9", "#fff6eb"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Logo */}
      <Image
        source={require("../../../../assets/logov2.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Heading */}
      <Text style={styles.title}>Welcome to CHIETA</Text>
      <Text style={styles.subtitle}>Select a service to continue</Text>

      {/* Cards */}
      <View style={styles.grid}>
        <Card
          icon="briefcase"
          title="Careers"
          badge="Visit Website"
          desc="Jobs & Opportunities"
          onPress={() => Linking.openURL("https://chieta.org.za/careers/vacancies/")}
          color={colors.primary[700] || "#6d28d9"}
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
        />

        <Card
          icon="business"
          title="IMS"
          badge="Login to IMS Portal"
          desc="Grants Applications"
          onPress={login}
          color={colors.primary[700] || "#6d28d9"}
        />

        <Card
          icon="school"
          title="SSDD"
          badge="Coming Soon"
          desc="Learner Opportunities"
          disabled
          color="#9ca3af"
        />
      </View>

      <Text style={styles.footer}>
        &copy; {new Date().getFullYear()} CHIETA. All rights reserved.
      </Text>

      {/* Floating action button */}
      <TouchableOpacity style={styles.fab} onPress={openInfoSheet}>
        <Icon name="chatbubble-ellipses" size={26} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

// Reusable card component
function Card({ icon, title, badge, desc, onPress, disabled = false, color }: { icon: keyof typeof Icon.glyphMap; title: string; badge: string; desc: string; onPress?: () => void; disabled?: boolean; color: string }) {
  return (
    <Pressable
      style={[styles.card, disabled && styles.cardDisabled]}
      onPress={!disabled ? onPress : undefined}
    >
      <Icon
        name={icon}
        size={32}
        color={disabled ? "#9ca3af" : color}
        style={styles.icon}
      />
      <Text style={[styles.cardTitle, disabled && styles.cardTitleDisabled]}>
        {title}
      </Text>
      <View
        style={[
          styles.badge,
          { backgroundColor: disabled ? "#d1d5db" : `${color}22` },
        ]}
      >
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
      <Text style={[styles.cardDesc, disabled && styles.cardDescDisabled]}>
        {desc}
      </Text>
    </Pressable>
  );
}

// ChatBot bottom sheet content (kept simple)
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
        <RnText variant="titleMedium">CHIETA Assistant</RnText>
        <TouchableOpacity onPress={close}>
          <EvilIcons name="close" size={32} color="black" />
        </TouchableOpacity>
      </RRow>

      <RCol style={{ alignItems: "center", gap: 16 }}>
        <AntDesign name="robot" size={64} color={colors.primary[700] || "#6d28d9"} />
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