import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";


import { AntDesign } from "@expo/vector-icons";
import colors from "../../config/colors";

interface props {
  onPress(): void;
  title: string;
}
const RUpload: FC<props> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.con} onPress={onPress}>
      <AntDesign name="upload" size={35} color={colors.slate[600]} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

export default RUpload;

const styles = StyleSheet.create({
  con: {
    minHeight: 120,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.blue[400],
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
});
