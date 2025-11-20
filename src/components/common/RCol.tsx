import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { FC, ReactNode } from 'react'

const RCol: FC<{ children: ReactNode, style?: StyleProp<ViewStyle> }> = ({ children, style }) => {
    return (
        <View style={[styles.con, style]}>
            {children}
        </View>
    )
}

export default RCol

const styles = StyleSheet.create({
    con: {
        flexDirection: "column",
        gap: 4
    }
})