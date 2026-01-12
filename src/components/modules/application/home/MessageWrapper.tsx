import { StyleSheet, View } from 'react-native'
import React, { FC } from 'react'
import colors from '@/config/colors'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from 'react-native-paper';

interface props {
    text: string;
}
const MessageWrapper: FC<props> = ({ text }) => {
    return (
        <View style={styles.con}>
            <Ionicons name="information-circle-outline" size={24} color="black" />
            <Text variant='bodySmall' style={styles.txt} numberOfLines={2}>{text}</Text>
        </View>
    )
}

export default MessageWrapper

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.primary[50],
        paddingHorizontal: 4,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 2,
        borderRadius: 6,
        overflow: 'hidden',
        borderColor: colors.yellow[700],
        borderWidth: 0.3,
        flex: 1
        // width: '100%',
        // marginHorizontal: 8
    },
    txt: {
        width: '100%',
        paddingHorizontal: 2
    }
})