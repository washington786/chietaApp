import React, { FC } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RCol, RRow } from "@/components/common";
import { OrganisationDto } from "@/core/models/organizationDto";

const { width } = Dimensions.get("window");

interface Props {
  onPress?: () => void;
  isLinkingRequired?: boolean;
  onNewLinking?: () => void;
  org?: OrganisationDto;
}

const ItemOrgs: FC<Props> = ({
  onPress,
  isLinkingRequired = false,
  onNewLinking,
  org,
}) => {
  const handlePress = () => {
    isLinkingRequired ? onNewLinking?.() : onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={styles.touch}
    >
      <View style={styles.card}>
        {/* NEW badge */}
        {isLinkingRequired && (
          <View style={styles.newChip}>
            <Text style={styles.newChipText}>NEW</Text>
          </View>
        )}

        <RRow style={styles.row}>
          {/* Icon */}
          <View style={styles.iconWrap}>
            <MaterialIcons
              name="business"
              size={32}
              color="#7f5af0"
            />
          </View>

          {/* Content */}
          <RCol style={{ flex: 1 }}>
            {/* Title */}
            <RRow style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={1}>
                {org?.organisationName || "Organisation Name"}
              </Text>
              {org?.status && (
                <MaterialIcons
                  name="verified"
                  size={18}
                  color="#27ae60"
                />
              )}
            </RRow>

            {/* Registration */}
            {org?.organisationRegistrationNumber && (
              <Text style={styles.reg}>
                #{org.organisationRegistrationNumber}
              </Text>
            )}

            {/* Trading Name */}
            {org?.organisationTradingName && (
              <Text style={styles.desc} numberOfLines={2}>
                {org.organisationTradingName}
              </Text>
            )}

            {/* Badges */}
            <RRow style={styles.badgesRow}>
              {org?.typeOfEntity && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {org.typeOfEntity}
                  </Text>
                </View>
              )}

              {org?.bbbeeLevel && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    B-BBEE {org.bbbeeLevel}
                  </Text>
                </View>
              )}
            </RRow>
          </RCol>
        </RRow>
      </View>
    </TouchableOpacity>
  );
};

export default ItemOrgs;

//////////////////////
// Styles
//////////////////////
const styles = StyleSheet.create({
  touch: {
    width: width * 0.95,
    alignSelf: "center",
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#f6f3ff", // lavender-tinted white
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    position: "relative",
  },

  row: {
    gap: 14,
    alignItems: "flex-start",
  },

  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2b1c4a",
    flexShrink: 1,
  },

  reg: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7a6f9b",
    marginBottom: 6,
  },

  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5f5a72",
  },

  badgesRow: {
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "rgba(127,90,240,0.12)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  chipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5a3d73",
    textTransform: "uppercase",
  },

  newChip: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#f39c12",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 10,
  },

  newChipText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.6,
  },
});
