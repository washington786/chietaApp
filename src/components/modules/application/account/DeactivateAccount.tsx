import { RCol, RLoaderAnimation } from "@/components/common";
import colors from "@/config/colors";
import { StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

interface Dprops {
    onPress?: () => void;
    isLoading?: boolean;
}
export function DeactivateAccount({ onPress, isLoading }: Dprops) {
    return (
        <RCol style={styles.wrapperSheet}>
            <Text variant='titleLarge'>Deactivate Account</Text>
            <Text variant='bodySmall'>Your account will be removed from CHIETA and you won't be able to recover it once deactivated. Press the deactivate now button to proceed. </Text>
            <Button mode='contained' style={styles.btn} onPress={onPress} rippleColor={colors.red[500]}>Deactivate Now</Button>
            {isLoading &&
                <RLoaderAnimation />}
        </RCol>
    )
}
const styles = StyleSheet.create({
    btn: {
        borderRadius: 5,
        backgroundColor: colors.red[800],
        marginVertical: 12,
        padding: 4
    },
    wrapperSheet: {
        gap: 5
    }
})