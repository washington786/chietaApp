import React from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
  Image
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useGlobalBottomSheet } from "@/hooks/navigation/BottomSheet";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import { landing_styles as styles } from "@/styles/LandingStyles";
import colors from "@/config/colors";

import { Text as RnText } from 'react-native-paper'

export default function LandingScreen() {
  const { login } = usePageTransition();

  const { open } = useGlobalBottomSheet();

  function openInfoSheet() {
    open(
      <View style={styles.chatContainer}>
        <View style={styles.chatContent}>
          {/* Header */}
          <View style={styles.chatHeader}>
            <View style={styles.headerTitleWrap}>
              <Icon name="chatbubble-ellipses" size={24} color={colors.slate[50]} />
              <RnText variant="titleLarge" style={styles.headerTitle}>CHIETA Chatbot</RnText>
            </View>
          </View>

          {/* Body */}
          <View style={styles.chatBodyContent}>
            {/* Icon */}
            <View style={styles.comingSoonIcon}>
              <Icon name="hourglass" size={48} color={colors.secondary[400]} />
            </View>

            {/* Message */}
            <RnText variant="titleSmall" style={styles.comingSoonTitle}>Coming Soon</RnText>

            <RnText style={styles.comingSoonText} variant="bodySmall">
              Our chatbot feature is not available yet. We're working hard to bring you an intelligent assistant to help with your queries.
            </RnText>
          </View>
        </View>
      </View>,
      { snapPoints: ['50%'] }
    );
  }

  return (
    <View style={styles.container}>

      {/* LOGO */}
      <Image
        source={require("../../../../assets/chieta-logo.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* <RLogo stylesLogo={styles.logo} /> */}

      {/* Heading */}
      <Text style={styles.title}>Welcome to CHIETA</Text>
      <Text style={styles.subtitle}>Select a service to continue</Text>

      {/* Options grid */}
      <View style={styles.grid}>

        {/* Careers */}
        <Pressable
          style={styles.card}
          onPress={() =>
            Linking.openURL("https://chieta.org.za/careers/vacancies/")
          }
        >
          <Icon name="briefcase" size={28} color="#412050" />
          <Text style={styles.cardTitle}>Careers</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Visit Website</Text>
          </View>
          <Text style={styles.cardDesc}>Jobs & Opportunities</Text>
        </Pressable>

        {/* SSC */}
        <Pressable
          style={styles.card}
          onPress={() =>
            Linking.openURL("https://glittery-pony-b3e00d.netlify.app/")
          }
        >
          <Icon name="bulb" size={28} color="#412050" />
          <Text style={styles.cardTitle}>SSC</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Visit Website</Text>
          </View>
          <Text style={styles.cardDesc}>Smart Skills Centres</Text>
        </Pressable>

        {/* IMS -> login */}
        <Pressable
          style={styles.card}
          onPress={login}
        >
          <Icon name="business" size={28} color="#412050" />
          <Text style={styles.cardTitle}>IMS</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Login to IMS Portal</Text>
          </View>
          <Text style={styles.cardDesc}>Grants Applications</Text>
        </Pressable>

        {/* Coming soon */}
        <View style={styles.card}>
          <Icon name="school" size={28} color="#9E9E9E" />
          <Text style={styles.cardTitle}>SSDD</Text>
          <View style={[styles.badge, { backgroundColor: "#9E9E9E" }]}>
            <Text style={styles.badgeText}>Coming Soon</Text>
          </View>
          <Text style={styles.cardDesc}>Learner Opportunities</Text>
        </View>
      </View>

      <Text style={styles.footer}>&copy; {new Date().getFullYear()} CHIETA. All rights reserved.</Text>

      {/* Chat bubble */}
      <Pressable style={styles.fab} onPress={openInfoSheet}>
        <Icon name="chatbubble-ellipses" size={26} color="#fff" />
      </Pressable>
    </View>
  );
}