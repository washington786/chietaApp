import {
  StyleSheet,
} from "react-native";
import React, { FC, ReactNode } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ViewStyle } from "react-native";

interface IAreaProps {
  children: ReactNode;
  style?: ViewStyle
}

const SafeArea: FC<IAreaProps> = ({ children, style }) => {
  return <SafeAreaView style={[styles.con, style]} edges={['top', 'left', 'right']}>{children}</SafeAreaView>
};

export default SafeArea;

const styles = StyleSheet.create({
  con: {
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    // backgroundColor: 'white'
  },
});
