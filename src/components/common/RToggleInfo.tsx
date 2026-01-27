import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import colors from '@/config/colors';

interface ToggleInfoProps {
    button1Label: string;
    button2Label: string;
    content1: React.ReactNode;
    content2: React.ReactNode;
    defaultActive?: 1 | 2;
    containerStyle?: any;
    buttonContainerStyle?: any;
    contentContainerStyle?: any;
    onToggle?: (activeButton: 1 | 2) => void;
}

/**
 * Reusable toggle component with two buttons and content areas
 * Switches between two different content views
 */
const RToggleInfo = ({
    button1Label,
    button2Label,
    content1,
    content2,
    defaultActive = 1,
    containerStyle,
    buttonContainerStyle,
    contentContainerStyle,
    onToggle,
}: ToggleInfoProps) => {
    const [activeButton, setActiveButton] = useState<1 | 2>(defaultActive);

    const handleToggle = (buttonNumber: 1 | 2) => {
        setActiveButton(buttonNumber);
        onToggle?.(buttonNumber);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Button Toggle */}
            <View style={[styles.buttonContainer, buttonContainerStyle]}>
                <Button
                    mode={activeButton === 1 ? 'contained' : 'outlined'}
                    onPress={() => handleToggle(1)}
                    style={[
                        styles.button,
                        activeButton === 1 ? styles.buttonActive : styles.inactiveBtn,
                    ]}
                    labelStyle={styles.buttonLabel}
                >
                    {button1Label}
                </Button>
                <Button
                    mode={activeButton === 2 ? 'contained' : 'outlined'}
                    onPress={() => handleToggle(2)}
                    style={[
                        styles.button,
                        activeButton === 2 ? styles.buttonActive : styles.inactiveBtn,
                    ]}
                    labelStyle={styles.buttonLabel}
                >
                    {button2Label}
                </Button>
            </View>

            {/* Content Area */}
            <View style={[styles.contentContainer, contentContainerStyle]}>
                {activeButton === 1 ? content1 : content2}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    button: {
        flex: 1,
        borderRadius: 8,
    },
    buttonActive: {
        backgroundColor: colors.primary[700],
    },
    inactiveBtn: {
        borderColor: colors.gray[400],
        borderWidth: 0.4,
    },
    buttonLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    contentContainer: {
        paddingVertical: 8,
    },
});

export default RToggleInfo;
