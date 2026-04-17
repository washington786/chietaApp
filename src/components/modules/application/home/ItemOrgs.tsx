import React, { FC } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { moderateScale, scale } from "@/utils/responsive";
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
              size={moderateScale(30)}
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
                  size={moderateScale(18)}
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
    marginBottom: scale(14),
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: scale(16),
    padding: scale(16),
    shadowColor: colors.primary[950],
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 0,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.slate[100],
  },

  row: {
    gap: scale(12),
    alignItems: 'flex-start',
  },

  iconWrap: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(12),
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
    gap: scale(5),
    marginBottom: scale(3),
  },

  title: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: colors.primary[950],
    flexShrink: 1,
  },

  reg: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: colors.slate[400],
    marginBottom: scale(4),
    letterSpacing: 0.2,
  },

  desc: {
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),
    color: colors.slate[500],
  },

  badgesRow: {
    gap: scale(6),
    marginTop: scale(8),
    flexWrap: 'wrap',
  },

  chip: {
    backgroundColor: colors.primary[50],
    borderRadius: 999,
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderWidth: 1,
    borderColor: colors.primary[100],
  },

  chipText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: colors.primary[700],
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  newChip: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    backgroundColor: colors.primary[600],
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: 999,
    zIndex: 10,
  },

  newChipText: {
    fontSize: moderateScale(10),
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.6,
  },
});
