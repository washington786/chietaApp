import { RCol, RLoaderAnimation } from "@/components/common";
import colors from "@/config/colors";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { moderateScale, scale } from '@/utils/responsive';

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
                <MaterialCommunityIcons name="alert" size={moderateScale(48)} color={colors.red[600]} />
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
        gap: scale(20),
        alignItems: 'center',
        padding: scale(16),
    },
    iconContainer: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(50),
        backgroundColor: colors.red[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(12),
    },
    title: {
        color: colors.slate[900],
        fontWeight: '700',
        fontSize: moderateScale(24),
        textAlign: 'center',
    },
    description: {
        color: colors.slate[600],
        fontWeight: '500',
        fontSize: moderateScale(15),
        textAlign: 'center',
        lineHeight: moderateScale(22),
    },
    deactivateBtn: {
        borderRadius: scale(12),
        backgroundColor: colors.red[600],
        width: '100%',
        paddingVertical: scale(6),
    },
    deactivateBtnLabel: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: colors.white,
    },
    cancelBtn: {
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: colors.slate[300],
        width: '100%',
        paddingVertical: scale(6),
    },
    cancelBtnLabel: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: colors.slate[900],
    },
})