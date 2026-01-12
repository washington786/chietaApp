import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { RCol, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import Feather from '@expo/vector-icons/Feather';
import { OrganisationDto } from '@/core/models/organizationDto'

interface props {
    onPress?: () => void;
    isLinkingRequired?: boolean;
    onNewLinking?: () => void;
    org?: OrganisationDto
}

const ItemOrgs: FC<props> = ({ onPress, isLinkingRequired = false, onNewLinking, org }) => {

    function handlePress() {
        if (isLinkingRequired) {
            onNewLinking?.();
        } else {
            onPress?.();
        }
    }

    const isVerified = org?.status ? "verified" : "unverified";

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={styles.touch}>
            <RCol style={[styles.con, { position: 'relative' }]}>
                {/* Absolute NEW badge at top right */}
                {isLinkingRequired && (
                    <Text style={styles.newBadgeAbs}>new</Text>
                )}
                <Text variant='titleLarge' style={styles.itemText}>{org?.organisationName}</Text>
                {org?.organisationTradingName ? (
                    <Text style={styles.tradingName}>{org.organisationTradingName}</Text>
                ) : null}
                <Text variant='labelLarge' style={styles.regTxt}>#{org?.organisationRegistrationNumber}</Text>
                <RRow style={{ gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    {org?.companySize && (
                        <Text style={styles.badge}>{org.companySize}</Text>
                    )}
                    {org?.typeOfEntity && (
                        <Text style={[styles.badge, styles.entityBadge]}>{org.typeOfEntity}</Text>
                    )}
                    {org?.bbbeeLevel ? (
                        <Text style={[styles.badge, styles.bbbeeBadge]}>B-BBEE: {org.bbbeeLevel}</Text>
                    ) : null}
                    {/* Verified/unverified badge with other badges */}
                    <RRow style={styles.verifiedRowInline}>
                        <Feather
                            name={isVerified === "verified" ? "check-circle" : "x-circle"}
                            size={16}
                            color={isVerified === "verified" ? colors.green[600] : colors.red[600]}
                        />
                        <Text style={{
                            color: isVerified === "verified" ? colors.green[600] : colors.red[600],
                            fontWeight: 'bold',
                            fontSize: 13
                        }}>
                            {isVerified}
                        </Text>
                    </RRow>
                </RRow>
            </RCol>
        </TouchableOpacity>
    )
}

export default ItemOrgs

const styles = StyleSheet.create({
    touch: {
        marginBottom: 10,
    },
    con: {
        backgroundColor: colors.zinc[50],
        borderRadius: 4,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.slate[200],
    },
    itemText: {
        color: colors.slate[800],
        fontWeight: 'bold',
        fontSize: 18,
    },
    tradingName: {
        color: colors.slate[500],
        fontSize: 14,
        marginTop: 2,
    },
    regTxt: {
        color: colors.gray[400],
        fontSize: 12,
        marginTop: 2,
    },
    badge: {
        backgroundColor: colors.slate[200],
        color: colors.slate[700],
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        fontSize: 12,
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
        top: 8,
        right: 16,
        backgroundColor: colors.yellow[600],
        color: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 2,
        fontSize: 12,
        zIndex: 2,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
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