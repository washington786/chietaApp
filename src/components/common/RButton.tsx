import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import React, { FC } from "react";

interface IButton extends TouchableOpacityProps {
  title: string;
  onPressButton(): void;
  styleBtn?: StyleProp<ViewStyle>;
  styleTitle?: StyleProp<TextStyle>;
  disable?: boolean;
}
const RButton: FC<IButton> = ({
  onPressButton,
  title,
  styleBtn,
  styleTitle,
  disable = false
}) => {
  return (
    <TouchableOpacity style={[styles.btnCon, styleBtn]} onPress={onPressButton} disabled={disable}>
      <Text style={[styles.txt, styleTitle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RButton;

const styles = StyleSheet.create({
  btnCon: {
    borderRadius: 10,
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
