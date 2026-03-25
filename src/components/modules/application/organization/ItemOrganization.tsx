import { ActivityIndicator, Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { FC, useRef } from 'react'
import colors from '@/config/colors'
import appFonts from '@/config/fonts'
import { Text } from 'react-native-paper'
import Ionicons from '@expo/vector-icons/Ionicons'
import { OrganisationDto } from '@/core/models/organizationDto'

interface props {
    onPress?: () => void;
    item?: OrganisationDto;
    isLinked?: boolean;
    isLinking?: boolean;
}

const ItemOrganization: FC<props> = ({ onPress, item, isLinked = false, isLinking = false }) => {
    const { organisationName, organisationRegistrationNumber, status, organisationTradingName } = item || {};
    const isActive = status?.toLowerCase() === 'active';

    // Derive initials for avatar
    const initials = (organisationTradingName ?? organisationName ?? '?')
        .split(' ')
        .slice(0, 2)
        .map((w: string) => w[0]?.toUpperCase() ?? '')
        .join('');

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
    const pressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

    return (
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
            {/* Left accent strip */}
            <View style={[styles.accent, { backgroundColor: isActive ? colors.emerald[500] : colors.red[400] }]} />

            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: isLinked ? colors.primary[100] : colors.slate[100] }]}>
                <Text style={[styles.avatarText, { color: isLinked ? colors.primary[700] : colors.slate[500] }]}>
                    {initials}
                </Text>
            </View>

            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.tradeName} numberOfLines={1}>{organisationTradingName}</Text>
                {organisationName && organisationName !== organisationTradingName && (
                    <Text style={styles.orgName} numberOfLines={1}>{organisationName}</Text>
                )}
                <View style={styles.metaRow}>
                    <View style={styles.regChip}>
                        <Ionicons name='barcode-outline' size={11} color={colors.slate[400]} />
                        <Text style={styles.regText}>{organisationRegistrationNumber ?? 'N/A'}</Text>
                    </View>
                    <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusInactive]}>
                        <View style={[styles.dot, { backgroundColor: isActive ? colors.emerald[500] : colors.red[400] }]} />
                        <Text style={[styles.statusText, { color: isActive ? colors.emerald[700] : colors.red[600] }]}>
                            {isActive ? 'Active' : 'Inactive'}
                        </Text>
                    </View>
                    {isLinked && (
                        <View style={styles.linkedBadge}>
                            <Ionicons name='link' size={11} color={colors.primary[600]} />
                            <Text style={styles.linkedText}>Linked</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Action button */}
            <TouchableOpacity
                onPress={onPress}
                onPressIn={pressIn}
                onPressOut={pressOut}
                disabled={isLinking || isLinked}
                activeOpacity={0.8}
                style={[
                    styles.action,
                    isLinked && styles.actionLinked,
                    isLinking && styles.actionBusy,
                ]}
            >
                {isLinking ? (
                    <ActivityIndicator size={18} color={colors.white} />
                ) : isLinked ? (
                    <Ionicons name='checkmark' size={20} color={colors.primary[600]} />
                ) : (
                    <Ionicons name='add' size={22} color={colors.white} />
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

export default ItemOrganization;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
        gap: 12,
        paddingRight: 14,
        paddingVertical: 12,
    },
    accent: {
        width: 4,
        alignSelf: 'stretch',
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    avatarText: {
        fontSize: 15,
        fontFamily: `${appFonts.bold}`,
    },
    info: {
        flex: 1,
        gap: 4,
    },
    tradeName: {
        fontSize: 14,
        fontFamily: `${appFonts.semiBold}`,
        color: colors.gray[800],
    },
    orgName: {
        fontSize: 12,
        fontFamily: `${appFonts.regular}`,
        color: colors.slate[500],
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    regChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    regText: {
        fontSize: 11,
        fontFamily: `${appFonts.regular}`,
        color: colors.slate[400],
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 20,
    },
    statusActive: { backgroundColor: colors.emerald[50] },
    statusInactive: { backgroundColor: colors.red[50] },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontFamily: `${appFonts.semiBold}`,
    },
    linkedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: colors.primary[50],
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 20,
    },
    linkedText: {
        fontSize: 10,
        fontFamily: `${appFonts.semiBold}`,
        color: colors.primary[600],
    },
    action: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: colors.primary[950],
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    actionLinked: {
        backgroundColor: colors.primary[50],
    },
    actionBusy: {
        backgroundColor: colors.primary[400],
    },
})