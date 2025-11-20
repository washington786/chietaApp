import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { FC, ReactNode } from "react";
import { Feather } from "@expo/vector-icons";
import colors from "../../config/colors";

const RImageCon: FC<{
  children: ReactNode;
  imageStyle?: StyleProp<ViewStyle>;
  onRemove?(): void;
}> = ({ children, imageStyle, onRemove }) => {
  return (
    <View style={[imageStyle, styles.con]}>
      <TouchableOpacity style={styles.cancel} onPress={onRemove}>
        <Feather name="x" size={20} color={colors.primary[700]} />
      </TouchableOpacity>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default RImageCon;

const styles = StyleSheet.create({
  con: {
    height: 120,
    width: 120,
    position: "relative",
    marginVertical: 5,
  },
  cancel: {
    position: "absolute",
    right: 5,
    top: 5,
    zIndex: 100,
    backgroundColor: colors.zinc[100],
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  content: {
    height: "100%",
    width: "100%",
    overflow: "hidden",
    borderRadius: 10,
  },
});
