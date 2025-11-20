import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import React, { FC, ReactNode } from "react";
import colors from "../../config/colors";

interface prop {
  children: ReactNode;
  style?: StyleProp<ViewStyle>
}
const Scroller: FC<prop> = ({ children, style }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.con]}
      contentContainerStyle={[style, { flexGrow: 1 }]}
    >
      {children}
    </ScrollView>
  );
};

export default Scroller;

const styles = StyleSheet.create({
  con: {
    flex: 1,
    backgroundColor: colors.zinc[50],
    flexGrow: 1,
  },
});
