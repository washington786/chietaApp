import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";
import React, { FC } from "react";

interface prop {
  stylesLogo?: StyleProp<ImageStyle>;
}
const RLogo: FC<prop> = ({ stylesLogo }) => {
  return (
    <Image
      source={require("../../../assets/logo.png")}
      resizeMode="contain"
      resizeMethod="resize"
      style={[styles.logo, stylesLogo]}
    />
  );
};

export default RLogo;

const styles = StyleSheet.create({
  logo: {
    minHeight: 60,
    minWidth: 60,
  },
});
