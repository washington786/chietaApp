import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import colors from '@/config/colors'

interface CrashFallbackProps {
    error: Error
    resetError: () => void
}

const CrashFallback: React.FC<CrashFallbackProps> = ({ error, resetError }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.body}>{error.message}</Text>
            <TouchableOpacity style={styles.button} onPress={resetError}>
                <Text style={styles.buttonText}>Restart session</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CrashFallback

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.primary[950],
        marginBottom: 8,
        textAlign: 'center',
    },
    body: {
        fontSize: 14,
        color: '#4a4a4a',
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: colors.primary[700],
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
})
