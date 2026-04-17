import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import React, { FC } from "react";

import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";
import { moderateScale, scale, verticalScale } from "@/utils/responsive";

interface props extends TextInputProps {
  icon?: any;
  iconColor?: string;
  customStyle?: StyleProp<ViewStyle>
}
const RInput: FC<props> = ({ icon, iconColor, customStyle, style, ...rest }) => {
  return (
    <View style={[styles.inputCon, customStyle]}>
      {icon && (
        <Feather size={20} name={icon} color={iconColor ?? colors.gray[400]} />
      )}
      <TextInput {...rest} style={[styles.input, style]} autoCapitalize="none" />
    </View>
  );
};

export default RInput;

const styles = StyleSheet.create({
  inputCon: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(12),
    minHeight: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.gray[300],
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    borderRadius: 5,
  },
  input: {
    height: "100%",
    flex: 1,
    width: "100%",
    fontSize: moderateScale(14),
  },
});
