import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { RCol, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather';
import colors from '@/config/colors';
import ItemOrgs from './ItemOrgs';

const LinkedOrganizations = () => {
    return (
        <RCol>
            <RRow style={{ alignItems: 'center', gap: 6, marginBottom: 12, justifyContent: 'space-between' }}>
                <Text variant='titleSmall'>my linked organizations</Text>
                <TouchableOpacity style={styles.btn}>
                    <Feather name="link-2" size={16} color="black" style={{ marginLeft: 6 }} />
                    <Text variant='titleSmall'>add new</Text>
                </TouchableOpacity>
            </RRow>
            <RCol>
                <ItemOrgs />
                <ItemOrgs isVerified={false} />
            </RCol>
        </RCol>
    )
}

export default LinkedOrganizations

const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.blue[100],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: "center",
        flexDirection: "row",
        gap: 3
    }
})