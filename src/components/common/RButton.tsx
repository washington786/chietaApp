import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import React, { FC } from "react";

interface IButton {
  title: string;
  onPressButton(): void;
  styleBtn?: StyleProp<ViewStyle>;
  styleTitle?: StyleProp<TextStyle>;
}
const RButton: FC<IButton> = ({
  onPressButton,
  title,
  styleBtn,
  styleTitle,
}) => {
  return (
    <TouchableOpacity style={[styles.btnCon, styleBtn]} onPress={onPressButton}>
      <Text style={[styles.txt, styleTitle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RButton;

const styles = StyleSheet.create({
  btnCon: {
    borderRadius: 100,
    width: "100%",
    minHeight: 55,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  txt: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    textTransform: "uppercase",
  },
});
