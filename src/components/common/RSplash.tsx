import React, { useEffect } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { moderateScale, scale, verticalScale } from '@/utils/responsive';
import Animated, {
    FadeIn,
    FadeInDown,
    ZoomIn,
    useSharedValue,
    withTiming,
    useAnimatedStyle
} from 'react-native-reanimated'
import RText from './RText'
import colors from '@/config/colors'
import RLoaderAnimation from './RLoaderAnimation'
import Constants from 'expo-constants'

const RSplash = () => {
    const logoScale = useSharedValue(0.8);
    const version = Constants.expoConfig?.version ?? '—'

    useEffect(() => {
        logoScale.value = withTiming(1, { duration: 800 })
    }, [])

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
    }))
    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(800)} style={styles.content}>
                <Animated.View entering={ZoomIn.duration(800)}>
                    <Animated.View style={animatedLogoStyle}>
                        <Image
                            source={require("../../../assets/logo.png")}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </Animated.View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(800).duration(1000)}>
                    <RLoaderAnimation />
                </Animated.View>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(1200)} style={styles.footer} pointerEvents="none">
                <RText title={`Version ${version}`} style={styles.version} />
                <RText title={`© copyright at CHIETA ${new Date().getFullYear()}`} style={styles.copyright} />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: scale(40),
    },
    logo: {
        width: scale(140),
        height: scale(140),
        marginBottom: verticalScale(32),
    },
    loaderContainer: {
        marginTop: verticalScale(60),
        width: scale(200),
        height: scale(4),
        backgroundColor: colors.primary[900],
        borderRadius: scale(2),
        overflow: 'hidden',
    },
    loaderBar: {
        height: '100%',
        width: '60%',
        backgroundColor: colors.primary[500],
        borderRadius: scale(2),
    },
    footer: {
        position: 'absolute',
        bottom: verticalScale(50),
        alignItems: 'center',
    },
    version: {
        color: colors.primary[900],
        fontSize: moderateScale(13),
    },
    copyright: {
        color: colors.primary[900],
        fontSize: moderateScale(12),
        marginTop: verticalScale(6),
    },
})

export default RSplash