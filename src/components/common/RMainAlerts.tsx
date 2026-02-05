import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import React, { FC } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '@/config/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface RMainAlertsProps {
    visible: boolean;
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
    onDismiss: () => void;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    bgColor?: string;
    backgroundImage?: any;
}

const RMainAlerts: FC<RMainAlertsProps> = ({
    visible,
    title,
    description,
    actionText = "Learn More",
    onAction,
    onDismiss,
    icon = "bell",
    bgColor = colors.primary[900],
    backgroundImage
}) => {
    if (!visible) return null;

    return (
        <ImageBackground
            source={require("../../../assets/bg.jpg") || backgroundImage}
            style={[styles.container]}
            imageStyle={styles.backgroundImage}
        >
            <LinearGradient
                colors={[
                    `${bgColor}E6`,
                    `${bgColor}F2`,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
                    <MaterialCommunityIcons name="close" size={28} color="white" />
                </TouchableOpacity>

                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name={icon} size={56} color="white" />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>

                    {/* {actionText && (
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={onAction}
                        >
                            <Text style={styles.actionBtnText}>{actionText}</Text>
                        </TouchableOpacity>
                    )} */}

                    <TouchableOpacity onPress={onDismiss} style={styles.actionBtn}>
                        <Text style={styles.actionBtnText}>Dismiss</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </ImageBackground>
    )
}

export default RMainAlerts

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
        zIndex: 9999,
    },
    backgroundImage: {
        opacity: 0.3,
        resizeMode: 'cover',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10000,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 24,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.85)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
        maxWidth: 300,
    },
    actionBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 25,
        marginBottom: 24,
        minWidth: 200,
        alignItems: 'center',
    },
    actionBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary[900],
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dismissText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
})