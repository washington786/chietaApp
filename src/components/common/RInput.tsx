import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import React, { forwardRef } from "react";

import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";
import { moderateScale, scale, verticalScale } from "@/utils/responsive";

interface RInputProps extends TextInputProps {
  icon?: any;
  iconColor?: string;
  customStyle?: StyleProp<ViewStyle>;
}

const RInput = forwardRef<TextInput, RInputProps>(({ icon, iconColor, customStyle, style, ...rest }, ref) => {
  return (
    <View style={[styles.inputCon, customStyle]}>
      {icon && (
        <Feather size={20} name={icon} color={iconColor ?? colors.gray[400]} />
      )}
      <TextInput ref={ref} {...rest} style={[styles.input, style]} autoCapitalize="none" />
    </View>
  );
});

RInput.displayName = 'RInput';
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
