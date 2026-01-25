import React, { FC, ReactNode } from "react";
import { NavigationContainer } from "@react-navigation/native";
import navigationTheme from "@/theme/themeConfig";
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ParentNavigation: FC<{ children: ReactNode }> = ({ children }) => {
    return (<SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>{children}</NavigationContainer>
    </SafeAreaProvider>)
};

export default ParentNavigation;