import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React, { FC, ReactNode } from 'react'

interface props {
    children: ReactNode,
    style?: StyleProp<ViewStyle>
}
const RRow: FC<props> = ({ children, style }) => {
    return (
        <View style={[style, styles.con]}>
            {children}
        </View>
    )
}

export default RRow

const styles = StyleSheet.create({
    con: {
        flexDirection: "row",
        // flexGrow: 1,
        width: "100%"
    }
})