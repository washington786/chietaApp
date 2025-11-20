import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import colors from "../../config/colors";


const RLoader = () => {
  return <ActivityIndicator size={30} color={colors.primary[400]} />;
};

export default RLoader;

const styles = StyleSheet.create({});
