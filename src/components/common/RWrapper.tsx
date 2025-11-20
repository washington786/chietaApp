import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React, { FC, ReactNode } from "react";
import colors from "../../config/colors";

interface prop {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
const RWrapper: FC<prop> = ({ children, style }) => {
  return <View style={[styles.con, style]}>{children}</View>;
};

export default RWrapper;

const styles = StyleSheet.create({
  con: {
    backgroundColor: colors.zinc[50],
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 3,
  },
});
