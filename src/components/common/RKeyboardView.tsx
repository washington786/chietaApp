import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import React, { FC, ReactNode } from 'react'

interface RKeyboardViewProps {
    children: ReactNode
    /**
     * Backwards-compatible style prop applied to the scroll content.
     */
    style?: StyleProp<ViewStyle>
    /**
     * Additional content container style overrides.
     */
    contentContainerStyle?: StyleProp<ViewStyle>
    /**
     * Optional wrapper style for the KeyboardAvoidingView container.
     */
    containerStyle?: StyleProp<ViewStyle>
    /**
     * Allows fine tuning of the keyboard offset (defaults tuned per platform).
     */
    keyboardVerticalOffset?: number
}

const RKeyboardView: FC<RKeyboardViewProps> = ({
    children,
    style,
    contentContainerStyle,
    containerStyle,
    keyboardVerticalOffset,
}) => {
    const behavior = Platform.OS === 'ios' ? 'padding' : 'height'
    const verticalOffset = keyboardVerticalOffset ?? (Platform.OS === 'ios' ? 80 : 0)

    return (
        <KeyboardAvoidingView
            behavior={behavior}
            keyboardVerticalOffset={verticalOffset}
            style={[styles.container, containerStyle]}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.content, style, contentContainerStyle]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                nestedScrollEnabled
                bounces={false}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        width: '100%',
    },
    scroll: {
        flex: 1,
        width: '100%',
    },
    content: {
        flexGrow: 1,
        width: '100%',
        paddingHorizontal: 14,
        paddingTop: 8,
        paddingBottom: 36,
        gap: 12,
    },
})

export default RKeyboardView
