import React, { FC } from "react";
import { StyleProp, StyleSheet, TextStyle, TextProps as TextPaperProps, Text } from "react-native";
import colors from "../../config/colors";

interface Props extends TextPaperProps {
  title: string;
  style?: StyleProp<TextStyle>;
}

const RText: FC<Props> = ({ title, style, ...props }) => {
  return (
    <Text style={[styles.txt, style]} {...props}>
      {title}
    </Text>
  );
};

export default RText;

const styles = StyleSheet.create({
  txt: {
    marginVertical: 5,
    color: colors.primary[700],
  },
});
