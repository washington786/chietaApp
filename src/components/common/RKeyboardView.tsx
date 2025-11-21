import { KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from 'react-native'
import React, { FC, ReactNode } from 'react'

const RKeyboardView: FC<{ children: ReactNode, style?: StyleProp<ViewStyle> }> = ({ children, style }) => {
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "android" ? "padding" : "height"} style={[{ width: "100%", paddingHorizontal: 14, gap: 12 }, style]}>
            {children}
        </KeyboardAvoidingView>
    )
}

export default RKeyboardView