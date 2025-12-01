import React, { useEffect } from 'react'
import { View, Image, StyleSheet } from 'react-native'
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

const RSplash = () => {
    const logoScale = useSharedValue(0.8);

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
                    <View style={styles.loaderContainer}>
                        <View style={styles.loaderBar} />
                    </View>
                </Animated.View>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(1200)} style={styles.footer} pointerEvents="none">
                <RText title="Version 1.0.0" style={styles.version} />
                <RText title="© 2025 CHIETA" style={styles.copyright} />
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
        paddingHorizontal: 40,
    },
    logo: {
        width: 140,
        height: 140,
        marginBottom: 32,
    },
    loaderContainer: {
        marginTop: 60,
        width: 200,
        height: 4,
        backgroundColor: colors.primary[900],
        borderRadius: 2,
        overflow: 'hidden',
    },
    loaderBar: {
        height: '100%',
        width: '60%',
        backgroundColor: colors.primary[500],
        borderRadius: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    version: {
        color: colors.primary[900],
        fontSize: 13,
    },
    copyright: {
        color: colors.primary[900],
        fontSize: 12,
        marginTop: 6,
    },
})

export default RSplash