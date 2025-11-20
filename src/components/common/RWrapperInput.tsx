import { View, Text, StyleProp, ViewStyle } from 'react-native'
import React, { FC, ReactNode } from 'react'
interface props {
    children: ReactNode,
    style?: StyleProp<ViewStyle>
}
const RWrapperInput: FC<props> = ({ children, style }) => {
    return (
        <View style={style}>
            {children}
        </View>
    )
}

export default RWrapperInput