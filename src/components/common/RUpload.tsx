import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";


import Ionicons from '@expo/vector-icons/Ionicons';
import colors from "../../config/colors";

interface props {
  onPress(): void;
  title: string;
}
const RUpload: FC<props> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.con} onPress={onPress}>
      <Ionicons name="cloud-download-outline" size={35} color={colors.slate[600]} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default RUpload;

const styles = StyleSheet.create({
  con: {
    minHeight: 80,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.blue[400],
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
