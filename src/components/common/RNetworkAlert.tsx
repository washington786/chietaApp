import { StyleSheet, Animated, Dimensions } from "react-native";
import React, { useEffect, useRef } from "react";

import Constants from 'expo-constants';

import { Text, useTheme } from "react-native-paper";
import * as Network from 'expo-network';

const { width } = Dimensions.get('window');

const RNetworkAlert = () => {
  const [isConnected, setIsConnected] = React.useState<boolean>(true);
  const theme = useTheme();

  React.useEffect(() => {
    // Initial check
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      setIsConnected(state.isConnected ?? false);
    };
    checkNetwork();

    // Listener for changes
    const subscription = Network.addNetworkStateListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const isOffline = !isConnected;

  // Slide-in animation
  const animatedValue = useRef(new Animated.Value(isOffline ? 0 : -60)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOffline ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOffline]);

  if (!isOffline) return null;

  const statusBarHeight = Constants.statusBarHeight || 0;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: animatedValue }],
          top: statusBarHeight,
          backgroundColor: theme.colors.error,
        },
      ]}
    >
      <Text style={styles.text}>No Internet Connection</Text>
      <Text style={styles.subText}>Some features may be limited offline</Text>
    </Animated.View>
  );
};

export default RNetworkAlert;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});
