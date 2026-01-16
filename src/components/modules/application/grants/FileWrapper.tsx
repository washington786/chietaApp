import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/config/colors';
import { RRow } from '@/components/common';

interface FileProps {
    fileName?: string;
    onPress?: () => void;
    fileSize?: string;
    date?: string;
}

export function FileWrapper({
    onPress,
    fileName = 'document',
    fileSize,
    date
}: FileProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={styles.container}
        >
            <View style={styles.card}>
                {/* Left: Icon + Name */}
                <RRow style={styles.leftContent}>
                    <MaterialCommunityIcons
                        name="file-pdf-box"
                        size={32}
                        color={colors.red[600] || '#dc2626'}
                    />

                    <View style={styles.textContainer}>
                        <Text
                            style={styles.fileName}
                            numberOfLines={1}
                            ellipsizeMode="middle"
                        >
                            {fileName}
                            <Text style={styles.extension}>.pdf</Text>
                        </Text>

                        {/* Optional metadata */}
                        {(fileSize || date) && (
                            <Text style={styles.meta}>
                                {fileSize && `${fileSize} • `}
                                {date && date}
                            </Text>
                        )}
                    </View>
                </RRow>

                {/* Right: Download icon */}
                <MaterialCommunityIcons
                    name="download-circle-outline"
                    size={28}
                    color={colors.primary[600] || '#6366f1'}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 6,
        marginHorizontal: 4,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 1,
    },
    leftContent: {
        flex: 1,
        alignItems: 'center',
        gap: 12,
    },
    textContainer: {
        flex: 1,
    },
    fileName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    extension: {
        fontWeight: '400',
        color: '#6b7280',
    },
    meta: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 2,
    },
});

export default FileWrapper;