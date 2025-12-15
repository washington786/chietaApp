import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import React, { FC } from "react";

import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";

interface props extends TextInputProps {
  icon?: any;
  customStyle?: StyleProp<ViewStyle>
}
const RInput: FC<props> = (props) => {
  return (
    <View style={[styles.inputCon, props.customStyle]}>
      {props.icon && (
        <Feather size={20} name={props.icon} color={colors.gray[400]} />
      )}
      <TextInput {...props} style={styles.input} autoCapitalize="none" />
    </View>
  );
};

export default RInput;

const styles = StyleSheet.create({
  inputCon: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    minHeight: 60,
    borderWidth: 1,
    borderColor: colors.gray[300],
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 5,
  },
  input: {
    height: "100%",
    flex: 1,
    width: "100%",
  },
});
