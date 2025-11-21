import React, { FC, ReactNode } from "react";
import { NavigationContainer } from "@react-navigation/native";
import navigationTheme from "@/theme/themeConfig";

const ParentNavigation: FC<{ children: ReactNode }> = ({ children }) => {
    return <NavigationContainer theme={navigationTheme}>{children}</NavigationContainer>;
};

export default ParentNavigation;