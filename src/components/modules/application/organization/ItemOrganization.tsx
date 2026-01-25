import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native'
import React, { FC, useRef } from 'react'
import colors from '@/config/colors'
import { RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather';
import { OrganisationDto } from '@/core/models/organizationDto'

interface props {
    onPress?: () => void;
    item?: OrganisationDto
}
const ItemOrganization: FC<props> = ({ onPress, item }) => {
    const { organisationName, organisationRegistrationNumber, status, organisationTradingName } = item || {};
    const isActive = status?.toLocaleLowerCase() === "active";

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
            <View style={styles.content}>
                <Text variant='titleLarge' style={styles.itemText}>{organisationTradingName}</Text>
                <Text variant='titleLarge' style={[styles.itemText, styles.trdeName]}>{organisationName}</Text>
                <Text variant='labelLarge' style={[styles.regTxt, styles.txt]}>#{organisationRegistrationNumber}</Text>
                <RRow style={styles.row}>
                    <Feather name={isActive ? "check-circle" : "x-circle"} size={18} color={isActive ? colors.green[600] : colors.red[600]} />
                    <Text variant='labelMedium' style={[styles.regTxt, { color: isActive ? colors.green[600] : colors.red[600] }]}>{isActive ? "active" : "inactive"}</Text>
                </RRow>
            </View>
            <TouchableOpacity
                style={styles.abBtn}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Feather name={"plus"} size={24} color={colors.slate[50]} />
            </TouchableOpacity>
        </Animated.View>
    )
}

export default ItemOrganization

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.slate[50],
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        position: "relative",
        borderWidth: 0, // Removed border for cleaner look
    },
    content: {
        gap: 6,
    },
    itemText: {
        color: colors.slate[800],
        fontSize: 20,
        fontWeight: '700',
    },
    regTxt: {
        fontSize: 14,
        fontWeight: '500',
    },
    txt: {
        color: colors.gray[500],
        fontSize: 13,
        fontWeight: '400',
    },
    row: {
        alignItems: "center",
        gap: 6,
        marginTop: 8,
    },
    abBtn: {
        position: "absolute",
        bottom: -10,
        right: 10,
        backgroundColor: colors.violet[900],
        padding: 12,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    trdeName: {
        fontSize: 14,
        color: colors.slate[600],
        fontWeight: '500',
    }
})