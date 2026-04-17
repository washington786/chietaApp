import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  ImageBackground,
} from "react-native";
import { moderateScale } from "@/utils/responsive";
import { Ionicons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalBottomSheet } from "@/hooks/navigation/BottomSheet";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import colors from "@/config/colors";
import { landingBg } from "@/components/loadAssets";
import usePageEnterAnimation from '@/hooks/animations/usePageEnterAnimation';
import { ChatBot } from "@/components/common/ChietaBot";
import { l_styles as styles } from "@/styles/LandingStyles";

const overlayGradient = [
  `${colors.primary[900]}CC`,
  `${colors.primary[800]}B3`,
  `${colors.primary[600]}99`,
];

export default function LandingScreen() {
  const { login, careers } = usePageTransition();
  const { open, close } = useGlobalBottomSheet();
  const { animatedStyle } = usePageEnterAnimation({ initialOffset: 28 });

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
    open(<ChatBot close={close} />, { snapPoints: ["92%"] });
  }

  return (
    <ImageBackground
      source={landingBg}
      style={[styles.container]}
      imageStyle={styles.backgroundImage}
    >
      <LinearGradient
        colors={overlayGradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.scrollWrapper, animatedStyle]}>
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

            <Text style={styles.title}>Welcome To The{"\n"}CHIETA Portal</Text>

            <Animated.Text
              style={[styles.attentionMessage, { opacity: messageOpacity }]}
            >
              Discover Jobs, Grants & Skills – All in One App!
            </Animated.Text>

            <Animated.View style={{ transform: [{ translateY: exploreTranslateY }] }}>
              <Icon
                name="chevron-down"
                size={moderateScale(24)}
                color={colors.secondary[400] || "#6d28d9"}
              />
            </Animated.View>

            {/* 2 cards per row */}
            <View style={styles.grid}>
              <Card
                icon="business"
                title="IMS"
                badge="Login to IMS Portal"
                desc="Grants Applications"
                onPress={login}
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
                icon="school"
                title="SSDD"
                badge="Coming Soon"
                desc="Learner Opportunities"
                disabled
                color="#9ca3af"
              />
              <Card
                icon="briefcase"
                title="Careers"
                badge="View Options"
                desc="Help & Opportunities"
                onPress={careers}
                color={colors.primary[700] || "#6d28d9"}
              />
            </View>
          </ScrollView>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footer}>
            &copy; {new Date().getFullYear()} CHIETA. All rights reserved.
          </Text>
        </View>

        {/* Floating action button */}
        <TouchableOpacity style={styles.fab} onPress={openInfoSheet}>
          <Icon name="chatbubble-ellipses" size={moderateScale(26)} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}

// ================= CARD =================
interface CardProps {
  icon: string;
  title: string;
  badge: string;
  desc: string;
  onPress?: () => void;
  disabled?: boolean;
  color: string;
}

function Card({ icon, title, badge, desc, onPress, disabled = false, color }: CardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        disabled && styles.cardDisabled,
        pressed && !disabled && { transform: [{ scale: 0.97 }] },
      ]}
      onPress={!disabled ? onPress : undefined}
    >
      <LinearGradient
        colors={disabled ? ["#e5e7eb", "#d1d5db"] : [`${color}22`, `${color}10`]}
        style={styles.iconWrapper}
      >
        <Icon name={icon as any} size={moderateScale(26)} color={disabled ? "#9ca3af" : color} />
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

