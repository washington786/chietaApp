import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { RCol, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { OrganisationDto } from '@/core/models/organizationDto'

interface props {
    onPress?: () => void;
    isLinkingRequired?: boolean;
    onNewLinking?: () => void;
    org?: OrganisationDto
}

const { width } = Dimensions.get('window');

const ItemOrgs: FC<props> = ({ onPress, isLinkingRequired = false, onNewLinking, org }) => {

    function handlePress() {
        if (isLinkingRequired) {
            onNewLinking?.();
        } else {
            onPress?.();
        }
    }

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={styles.touch}>
            <View style={styles.con}>
                <RRow style={{ gap: 20, alignItems: 'flex-start' }}>
                    {/* Left Icon Container */}
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="business" size={40} color={colors.slate[300]} />
                    </View>

                    {/* Center Content - Full Width */}
                    <RCol style={{ flex: 1 }}>
                        {/* Title with Verified Badge */}
                        <RRow style={{ alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <Text style={styles.itemText} numberOfLines={1}>
                                {org?.organisationName}
                            </Text>
                            {org?.status && (
                                <MaterialIcons name="verified" size={22} color={colors.green[500]} />
                            )}
                        </RRow>

                        {/* Reference Number */}
                        <Text style={styles.regTxt}>#{org?.organisationRegistrationNumber}</Text>

                        {/* Description */}
                        {org?.organisationTradingName && (
                            <Text style={styles.description} numberOfLines={2}>
                                {org.organisationTradingName}
                            </Text>
                        )}

                        {/* Bottom Badges */}
                        <RRow style={{ gap: 12, marginTop: 12 }}>
                            {org?.typeOfEntity && (
                                <Text style={[styles.badge, styles.entityBadge]}>
                                    {org.typeOfEntity}
                                </Text>
                            )}
                            {org?.bbbeeLevel && (
                                <Text style={[styles.badge, styles.bbbeeBadge]}>
                                    B-BBEE: {org.bbbeeLevel}
                                </Text>
                            )}
                        </RRow>
                    </RCol>
                </RRow>

                {/* NEW Badge */}
                {isLinkingRequired && (
                    <Text style={styles.newBadgeAbs}>new</Text>
                )}
            </View>
        </TouchableOpacity>
    )
}

export default ItemOrgs

const styles = StyleSheet.create({
    touch: {
        marginBottom: 12,
        width: (width) * 0.95,
    },
    con: {
        backgroundColor: colors.zinc[50],
        borderRadius: 20,
        padding: 20,
        shadowColor: colors.primary[100],
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.primary[100],
        minHeight: 130,
        width: "100%",
        position: 'relative',
    },
    iconContainer: {
        backgroundColor: colors.slate[100],
        borderRadius: 14,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: 70,
        flexShrink: 0,
    },
    itemText: {
        color: colors.slate[950],
        fontWeight: '800',
        fontSize: 18,
    },
    description: {
        color: colors.slate[600],
        fontSize: 15,
        lineHeight: 21,
        marginTop: 6,
    },
    regTxt: {
        color: colors.slate[500],
        fontSize: 13,
        fontWeight: '600',
        marginTop: 4,
    },
    badge: {
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    entityBadge: {
        backgroundColor: colors.blue[100],
        color: colors.blue[700],
    },
    bbbeeBadge: {
        backgroundColor: colors.green[100],
        color: colors.green[700],
    },
    newBadgeAbs: {
        position: 'absolute',
        bottom: 20,
        right: 16,
        backgroundColor: colors.yellow[600],
        color: '#fff',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        fontSize: 11,
        zIndex: 2,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        fontWeight: '600',
    },
    tradingName: {
        color: colors.slate[500],
        fontSize: 14,
        marginTop: 2,
    },
    verifiedRowInline: {
        backgroundColor: colors.green[300],
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 0,
        minWidth: 80,
        maxWidth: 100,
        alignSelf: 'flex-end',
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 80,
        justifyContent: 'center',
    },
})