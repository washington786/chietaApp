import { RCol, RLoaderAnimation } from "@/components/common";
import colors from "@/config/colors";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Dprops {
    onPress?: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}
export function DeactivateAccount({ onPress, onCancel, isLoading }: Dprops) {
    return (
        <RCol style={styles.wrapperSheet}>
            {/* Warning Icon */}
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="alert" size={48} color={colors.red[600]} />
            </View>

            {/* Title */}
            <Text variant='headlineMedium' style={styles.title}>Deactivate Account</Text>

            {/* Description */}
            <Text variant='bodyMedium' style={styles.description}>
                Your account will be permanently removed and you won't be able to recover it. Please confirm if you wish to proceed.
            </Text>

            {/* Buttons */}
            <Button
                mode='contained'
                style={styles.deactivateBtn}
                labelStyle={styles.deactivateBtnLabel}
                onPress={onPress}
                disabled={isLoading}
            >
                Deactivate Now
            </Button>

            <Button
                mode='outlined'
                style={styles.cancelBtn}
                labelStyle={styles.cancelBtnLabel}
                onPress={onCancel}
                disabled={isLoading}
            >
                Cancel
            </Button>

            {isLoading && <RLoaderAnimation />}
        </RCol>
    )
}
const styles = StyleSheet.create({
    wrapperSheet: {
        gap: 20,
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.red[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        color: colors.slate[900],
        fontWeight: '700',
        fontSize: 24,
        textAlign: 'center',
    },
    description: {
        color: colors.slate[600],
        fontWeight: '500',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
    deactivateBtn: {
        borderRadius: 12,
        backgroundColor: colors.red[600],
        width: '100%',
        paddingVertical: 6,
    },
    deactivateBtnLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
    },
    cancelBtn: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.slate[300],
        width: '100%',
        paddingVertical: 6,
    },
    cancelBtnLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.slate[900],
    },
})