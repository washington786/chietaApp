import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import colors from '@/config/colors';

interface Option {
    label: string;
    value: string | number;
}

interface RPickerProps {
    value: string | number;
    onValueChange: (value: string | number) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
}

const RRPicker: FC<RPickerProps> = ({
    value,
    onValueChange,
    options,
    placeholder = 'Select an option',
    disabled = false,
    error = false,
}) => {
    return (
        <View
            style={[
                styles.container,
                disabled && styles.disabled,
                error && styles.errorBorder,
            ]}
        >
            <Picker
                enabled={!disabled}
                selectedValue={value}
                onValueChange={onValueChange}
                dropdownIconColor={colors.gray[500]}
                style={styles.picker}
            >
                {placeholder && (
                    <Picker.Item label={placeholder} value="" enabled={false} />
                )}
                {options.map((option) => (
                    <Picker.Item
                        label={option.label}
                        value={option.value}
                        key={option.value?.toString()}
                    />
                ))}
            </Picker>
        </View>
    );
};

export default RRPicker;

const styles = StyleSheet.create({
    container: {
        minHeight: 45,
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: 5,
        justifyContent: 'center',
    },
    picker: {
        height: '100%',
        width: '100%',
    },
    disabled: {
        backgroundColor: colors.gray[100],
        opacity: 0.7,
    },
    errorBorder: {
        borderColor: colors.red[500],
    },
});