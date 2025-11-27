import { StyleSheet, View } from 'react-native'
import React from 'react'
import colors from '@/config/colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from 'react-native-paper';

const MessageWrapper = () => {
    return (
        <View style={styles.con}>
            <Ionicons name="information-circle-outline" size={24} color="black" />
            <Text variant='bodySmall' style={styles.txt}>please ensure you are linked to an organization to begin grant application</Text>
        </View>
    )
}

export default MessageWrapper

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.violet[50],
        paddingHorizontal: 4,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 2,
        borderRadius: 6,
        overflow: 'hidden',
        // borderColor: colors.yellow[700],
        // borderWidth: 1
    },
    txt: {
        width: "95%",
        paddingHorizontal: 2
    }
})