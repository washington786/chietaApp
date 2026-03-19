import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import React, { FC, ReactNode } from "react";

interface ScrollerProps {
  children: ReactNode;
  /**
   * Backwards-compatible content styling.
   * Use `contentContainerStyle` for clarity going forward.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the ScrollView's content container.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the outer ScrollView itself.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Override default indicator visibility.
   */
  showsVerticalScrollIndicator?: boolean;
  /**
   * Control how taps are handled while scrolling forms.
   */
  keyboardShouldPersistTaps?: "always" | "never" | "handled";
}

const Scroller: FC<ScrollerProps> = ({
  children,
  style,
  contentContainerStyle,
  containerStyle,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = "handled",
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      style={[styles.scrollView, containerStyle]}
      contentContainerStyle={[styles.contentContainer, style, contentContainerStyle]}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      keyboardDismissMode="on-drag"
      overScrollMode="always"
      nestedScrollEnabled
      contentInsetAdjustmentBehavior="automatic"
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  );
};

export default Scroller;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
});
