import { View, Text } from 'react-native'
import React from 'react'
import { IonIconName } from '@/types/TabIconName';
import { BottomTabStyles as styles } from '@/styles/BottomTabStyles';

import { Ionicons } from "@expo/vector-icons"
import colors from '@/config/colors';

const RTabBarIcon = ({
    focused,
    iconName,
    label,
}: {
    focused: boolean;
    iconName: IonIconName;
    label: string;
}) => {
    return (
        <View style={[styles.iconContainer, focused && styles.activeTab]}>
            <Ionicons
                name={focused ? iconName : (`${iconName}-outline` as IonIconName)}
                size={28}
                color={focused ? colors.primary[800] : colors.slate[500]}
            />
            {focused && <Text style={styles.label}>{label}</Text>}
        </View>
    );
};

export default RTabBarIcon