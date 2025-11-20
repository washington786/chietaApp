import { StyleSheet } from "react-native";
import React from "react";
import { Divider } from "react-native-paper";
import colors from "../../config/colors";


const RDivider = () => {
  return <Divider style={styles.div} />;
};

export default RDivider;

const styles = StyleSheet.create({
  div: {
    marginVertical: 3,
    height: 1,
    backgroundColor: colors.slate[200],
  },
});
