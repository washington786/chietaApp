import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";
import React, { FC } from "react";
import { white_logo } from "../loadAssets";

interface prop {
  stylesLogo?: StyleProp<ImageStyle>;
}
const RLogo: FC<prop> = ({ stylesLogo }) => {
  return (
    <Image
      source={white_logo}
      resizeMode="contain"
      resizeMethod="resize"
      style={[styles.logo, stylesLogo]}
    />
  );
};

export default RLogo;

const styles = StyleSheet.create({
  logo: {
    minHeight: 65,
    minWidth: 65,
  },
});
