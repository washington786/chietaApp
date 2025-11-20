import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import React, { FC, ReactNode } from "react";

interface IAreaProps {
  children: ReactNode;
}
const SafeArea: FC<IAreaProps> = ({ children }) => {
  return <SafeAreaView style={styles.con}>{children}</SafeAreaView>;
};

export default SafeArea;

const styles = StyleSheet.create({
  con: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: "#fff",
  },
});
