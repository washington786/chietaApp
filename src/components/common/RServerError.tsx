import { Image, StyleSheet } from "react-native";
import React, { FC } from "react";
import RWrapper from "./RWrapper";
import { Button, Text } from "react-native-paper";
import colors from "../../config/colors";


const RServerError: FC<{ title?: string; onPress(): void }> = ({
  title,
  onPress,
}) => {
  return (
    <RWrapper style={styles.con}>
      <Image
        source={require("../../../assets/find.png")}
        resizeMode="contain"
        resizeMethod="resize"
        style={{ height: 200, width: "100%" }}
      />
      <Text variant="titleLarge">{title}</Text>

      <Button mode="text" textColor={colors.blue[500]} onPress={onPress}>
        retry
      </Button>
    </RWrapper>
  );
};

export default RServerError;

const styles = StyleSheet.create({
  con: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});
