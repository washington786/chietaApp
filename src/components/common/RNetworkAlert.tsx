import { StyleSheet, View } from "react-native";
import React from "react";


import { Feather } from "@expo/vector-icons";

import { Text } from "react-native-paper";
import colors from "../../config/colors";

const RNetworkAlert = () => {
  return (
    <View style={styles.con}>
      <Feather name="alert-triangle" size={25} color={"white"} />
      <Text variant="bodySmall" style={styles.txt}>
        Unstable Network Connection
      </Text>
    </View>
  );
};

export default RNetworkAlert;

const styles = StyleSheet.create({
  con: {
    backgroundColor: colors.primary[500],
    paddingVertical: 12,
    minHeight: 20,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  txt: {
    color: colors.slate[50],
  },
});
