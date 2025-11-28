import { RRow } from "@/components/common";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';

interface props {
    title?: string;
    icon: 'person-sharp' | 'help-circle-sharp' | 'lock-closed-sharp' | 'exit-outline' | 'remove-circle-sharp';
    onPress?: () => void;
}

export function AccWrapper({ icon, title, onPress }: props) {
    return (
        <TouchableOpacity onPress={onPress}>
            <RRow style={styles.wrap}>
                <RRow style={styles.rw}>
                    <Ionicons name={icon} size={24} color="black" />
                    <Text variant='titleMedium' style={{ textTransform: "capitalize" }}>{title}</Text>
                </RRow>
                <Ionicons name="chevron-forward" size={24} color="black" />
            </RRow>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    wrap: {
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 16
    },
    rw: {
        alignItems: "center",
        gap: 5,
        flex: 1,
        paddingVertical: 2
    }
})