import { Pressable } from 'react-native'
import React from 'react'
import colors from '@/config/colors';

const RCustomTabBarButton = (props: any) => {
    return (
        <Pressable
            {...props}
            android_ripple={{ color: colors.primary[50], borderless: true }}
            style={({ pressed }) => [
                props.style,
                pressed && { opacity: 0.1 },
            ]}
        />
    );
};

export default RCustomTabBarButton