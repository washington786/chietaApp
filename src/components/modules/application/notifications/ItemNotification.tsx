import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native'
import React, { FC, useRef } from 'react'
import { RCol, RDivider, RRow } from '@/components/common'
import colors from '@/config/colors'
import Feather from '@expo/vector-icons/Feather';
import { Text } from 'react-native-paper';
import { AppNotification } from '@/core/types/notifications';

interface props extends AppNotification {
    notification: AppNotification;
    onPress: () => void;
}
const ItemNotification: FC<props> = ({ notification, onPress }) => {
    const isNew = !notification.read;

    const time = new Date(notification.timestamp).toLocaleString("en-za", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.con, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{ flex: 1 }}
            >
                <RRow style={{ position: "relative", padding: 16, alignItems: 'center' }}>
                    <Feather name="bell" size={28} color={colors.primary[700]} />
                    <Text variant='titleMedium' style={styles.title}>{notification.title}</Text>
                    {isNew && (
                        <View style={styles.newBadge}>
                            <Text variant='labelSmall' style={styles.newBadgeText}>New</Text>
                        </View>
                    )}
                </RRow>
                <RCol style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text variant='labelSmall' style={styles.dteTxt}>{time}</Text>
                    <RDivider />
                    <Text variant='bodySmall' style={styles.messageTxt}>{notification.body}</Text>
                </RCol>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default ItemNotification

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.white,
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 1,
        borderWidth: 0.2,
        borderColor: colors.slate[300],
    },
    title: {
        marginLeft: 12,
        color: colors.slate[800],
        fontWeight: '600',
        fontSize: 18,
    },
    newBadge: {
        backgroundColor: colors.blue[600],
        position: "absolute",
        top: 16,
        right: 16,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    newBadgeText: {
        color: "white",
        fontWeight: '700',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    dteTxt: {
        color: colors.slate[600],
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 6,
    },
    messageTxt: {
        color: colors.slate[700],
        fontSize: 15,
        lineHeight: 22,
    }
})