import { StyleSheet, View } from 'react-native'
import React, { FC } from 'react'
import { RCol, RRow } from '@/components/common'
import colors from '@/config/colors'
import Feather from '@expo/vector-icons/Feather';
import { Text } from 'react-native-paper';

interface props {
    isNew?: boolean
}
const ItemNotification: FC<props> = ({ isNew = false }) => {
    return (
        <RCol style={styles.con}>
            <RRow style={{ position: "relative", padding: 8 }}>
                <RRow style={styles.center}>
                    <Feather name="bell" size={24} color="black" />
                    <Text variant='titleMedium' style={{ marginLeft: 6, color: colors.slate[700] }}>Application successful</Text>
                </RRow>
                {isNew &&
                    <View style={styles.newBadge}>
                        <Text variant='labelSmall' style={{ color: "white", paddingHorizontal: 6, paddingVertical: 2 }}>new</Text>
                    </View>
                }
            </RRow>
            <RCol style={{ paddingHorizontal: 8 }}>
                <Text variant='labelSmall' style={[styles.dteTxt, { paddingHorizontal: 6, paddingVertical: 2 }]}>20-12-2025 | 20:09 PM</Text>
                <Text variant='bodySmall' style={[styles.messageTxt, { paddingHorizontal: 6, paddingVertical: 2 }]}>congratulations! you have successfully applied for the mandatory grant. You'll be notified when its ready.</Text>
            </RCol>
        </RCol>
    )
}

export default ItemNotification

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.slate[50],
        borderWidth: 0.5,
        borderColor: colors.slate[200],
        borderRadius: 10,
        marginBottom: 12,
        overflow: "hidden"
    },
    newBadge: {
        backgroundColor: colors.blue[600],
        position: "absolute",
        top: 10,
        right: 10,
        borderRadius: 100,
    },
    center: {
        alignItems: "center",
        gap: 5
    },
    messageTxt: {
        color: colors.slate[600],
        fontSize: 8
    },
    dteTxt: {
        color: colors.slate[600],
        fontSize: 12
    }
})