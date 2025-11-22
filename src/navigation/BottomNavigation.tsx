import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RCustomTabBarButton, RTabBarIcon } from "@/components/modules/application";
import { navigationTypes } from "@/core/types/navigationTypes";
import { AccountScreen, HistoryScreen, HomeScreen } from "@/ui/screens";
import { BottomTabStyles as styles } from "@/styles/BottomTabStyles";

const Tab = createBottomTabNavigator<navigationTypes>();

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tab.Screen
                name="home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "",
                    tabBarButton: (props) => <RCustomTabBarButton {...props} />,
                    tabBarIcon: ({ focused }) => (
                        <RTabBarIcon focused={focused} iconName="grid" label="Home" />
                    ),
                }}
            />
            <Tab.Screen
                name="history"
                component={HistoryScreen}
                options={{
                    tabBarLabel: "",
                    tabBarButton: (props) => <RCustomTabBarButton {...props} />,
                    tabBarIcon: ({ focused }) => (
                        <RTabBarIcon focused={focused} iconName="time" label="history" />
                    ),
                }}
            />
            {/* <Tab.Screen
                name="reports"
                component={ReportsScreen}
                options={{
                    tabBarLabel: "",
                    tabBarButton: (props) => <RCustomTabBarButton {...props} />,
                    tabBarIcon: ({ focused }) => (
                        <RTabBarIcon focused={focused} iconName="stats-chart" label="stats" />
                    ),
                }}
            /> */}
            <Tab.Screen
                name="profile"
                component={AccountScreen}
                options={{
                    tabBarLabel: "",
                    tabBarButton: (props) => <RCustomTabBarButton {...props} />,
                    tabBarIcon: ({ focused }) => (
                        <RTabBarIcon focused={focused} iconName="person" label="Profile" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;