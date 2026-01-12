import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Linking,
  StyleSheet,
  Modal,
  Image
} from "react-native";
import { Ionicons as Icon } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { navigationTypes } from "@/core/types/navigationTypes";

export default function LandingScreen() {
  const navigation = useNavigation<NavigationProp<navigationTypes>>();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <View style={styles.container}>

      {/* LOGO */}
      <Image
        source={require("../../../../assets/chieta-logo.jpg")}
        style={styles.logo}
        resizeMode="contain"
      />

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
          onPress={() => navigation.navigate("login")}
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

      <Text style={styles.footer}>© 2025 CHIETA. All rights reserved.</Text>

      {/* Chat bubble */}
      <Pressable style={styles.fab} onPress={() => setChatOpen(true)}>
        <Icon name="chatbubble-ellipses" size={26} color="#fff" />
      </Pressable>

      {/* Chat modal */}
      <Modal transparent visible={chatOpen} animationType="fade">
        <View style={styles.modalWrap}>
          <View style={styles.chatWindow}>
            <View style={styles.chatHeader}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                CHIETA Chatbot
              </Text>
            </View>

            <View style={styles.chatBody}>
              <Text>Hi, I am coming soon. Stay tuned!</Text>
            </View>

            <Pressable onPress={() => setChatOpen(false)}>
              <Text style={{ textAlign: "center", padding: 10 }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,              // pushes content slightly down
    backgroundColor: "#FFFFFF"
  },

  logo: {
    width: 260,                  // bigger logo
    height: 180,
    marginTop: 10,
    marginBottom: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#412050",
    marginBottom: 3
  },

  subtitle: {
    fontSize: 13,
    marginBottom: 20,
    color: "#6c757d"
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "95%"
  },

  card: {
    width: "44%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    margin: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F4B63E"
  },

  cardTitle: {
    fontWeight: "800",
    marginTop: 6,
    color: "#412050"
  },

  cardDesc: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center"
  },

  badge: {
    backgroundColor: "#412050",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginVertical: 4
  },

  badgeText: {
    color: "#fff",
    fontSize: 10
  },

  footer: {
    marginTop: 25,
    fontSize: 10,
    color: "#6c757d"
  },

  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F4B63E",
    alignItems: "center",
    justifyContent: "center"
  },

  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end"
  },

  chatWindow: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    overflow: "hidden"
  },

  chatHeader: {
    padding: 12,
    backgroundColor: "#412050"
  },

  chatBody: { padding: 16 }
});
