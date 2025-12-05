import React from 'react'
import { RButton, RCol } from '@/components/common'
import { Text } from 'react-native-paper';
import { View } from 'react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import colors from '@/config/colors';

interface props {
    onPress: () => void;
    title: string;
    description: string;
    buttonTitle: string;
}

export function SuccessWrapper({ onPress, buttonTitle, description, title }: props) {
    return <>
        <View style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24
        }}>
            {/* Success Icon with subtle entrance */}
            <Animated.View entering={FadeInDown.duration(600).springify()}>
                <RCol style={{ alignItems: "center", marginBottom: 8 }}>
                    <RCol style={{ width: 80, height: 80, borderRadius: 100, backgroundColor: colors.green[100], alignItems: "center", justifyContent: "center" }}>
                        <MaterialCommunityIcons name="check-circle" size={70} color={colors.green[800]} />
                    </RCol>
                </RCol>
            </Animated.View>

            {/* Title & Message */}
            <Animated.View entering={FadeInUp.delay(200).duration(600)}>
                <Text variant='headlineMedium' style={{ textAlign: "center", color: colors.slate[900], marginBottom: 3 }}>
                    {title}
                </Text>
                <Text variant='bodySmall' style={{ textAlign: "center", color: colors.slate[900], paddingHorizontal: 6, marginVertical: 8 }}>
                    {description}
                </Text>
            </Animated.View>

            {/* Button */}
            <Animated.View
                entering={FadeInUp.delay(400).duration(600)}
                style={{ width: "100%", marginVertical: 10, paddingHorizontal: 8 }}
            >
                <RButton
                    title={buttonTitle}
                    onPressButton={onPress}
                />
            </Animated.View>
        </View>
    </>
}