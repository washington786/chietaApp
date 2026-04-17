import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '@/config/colors';
import { useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { moderateScale, scale } from '@/utils/responsive';

interface HeaderProps {
    currentDayTime: string;
    fullname: string;
    addLinking: boolean;
    handleAddLinkNewOrg: () => void;
    notifications: () => void;
    handleLinkNewOrg: () => void;
    unreadNotificationsCount?: number;
}

const HomeHeader = ({ currentDayTime, fullname, addLinking, handleAddLinkNewOrg, notifications, handleLinkNewOrg, unreadNotificationsCount = 0 }: HeaderProps) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
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
        <View style={styles.header}>
            <View>
                <Text style={styles.greeting}>Good {currentDayTime},</Text>
                <Text style={styles.userName}>{fullname}</Text>
            </View>

            {addLinking && (
                <Animated.View style={[styles.linkButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={handleAddLinkNewOrg}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <Text style={styles.linkButtonText}>Link New Organization</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}

            <View style={styles.headerActions}>
                {!addLinking && (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Notifications"
                        onPress={notifications}
                        style={styles.iconButton}
                    >
                        {unreadNotificationsCount > 0 && <View style={styles.badge} />}
                        <Ionicons name="notifications-outline" size={28} color={colors.primary[950]} />
                    </TouchableOpacity>
                )}

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={addLinking ? "Cancel add organization" : "Add organization"}
                        style={styles.addButton}
                        onPress={handleLinkNewOrg}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <Feather name={addLinking ? "x" : "plus"} size={24} color={colors.zinc[50]} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 16,
        backgroundColor: 'transparent',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.slate[200],
    },
    greeting: {
        fontSize: moderateScale(14),
        fontWeight: '400',
        color: colors.slate[500],
        textTransform: 'capitalize',
        letterSpacing: 0.3,
    },
    userName: {
        fontSize: moderateScale(21),
        fontWeight: '800',
        color: colors.primary[950],
        marginTop: 2,
        flexShrink: 1,
    },
    linkButtonContainer: {
        position: 'absolute',
        top: 20,
        right: scale(56),
        zIndex: 1,
    },
    linkButton: {
        backgroundColor: colors.primary[950],
        height: scale(38),
        paddingHorizontal: scale(14),
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    linkButtonText: {
        color: colors.zinc[50],
        fontSize: moderateScale(13),
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(12),
    },
    iconButton: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        backgroundColor: colors.red[500],
        borderWidth: 2,
        borderColor: '#fff',
        zIndex: 1,
    },
    addButton: {
        backgroundColor: colors.primary[900],
        borderRadius: scale(12),
        height: scale(40),
        width: scale(40),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary[950],
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
});

export default HomeHeader;