import React, { FC } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RCol, RRow } from "@/components/common";
import { OrganisationDto } from "@/core/models/organizationDto";
import colors from "@/config/colors";

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
              size={30}
              color={colors.primary[600]}
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.primary[950],
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.slate[100],
  },

  row: {
    gap: 12,
    alignItems: 'flex-start',
  },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary[950],
    flexShrink: 1,
  },

  reg: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.slate[400],
    marginBottom: 4,
    letterSpacing: 0.2,
  },

  desc: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.slate[500],
  },

  badgesRow: {
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: colors.primary[50],
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },

  chipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary[700],
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  newChip: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary[600],
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
