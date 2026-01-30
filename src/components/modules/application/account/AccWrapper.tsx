import { RRow } from "@/components/common";
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from "@/config/colors";
interface props {
    title?: string;
    icon: 'person-sharp' | 'help-circle-sharp' | 'lock-closed-sharp' | 'exit-outline' | 'remove-circle-sharp' | 'lock-closed-outline' | 'file-tray-outline';
    onPress?: () => void;
    dangerStyle?: ViewStyle
    dangerTextStyle?: TextStyle
    isDanger?: boolean
}

export function AccWrapper({ icon, title, onPress, dangerStyle, dangerTextStyle, isDanger }: props) {
    return (
        <TouchableOpacity onPress={onPress}>
            <RRow style={styles.wrap}>
                <RRow style={styles.rw}>
                    <View style={[{ padding: 8, borderRadius: 100, backgroundColor: colors.primary[800] }, dangerStyle]}>
                        <Ionicons name={icon} size={24} color="white" />
                    </View>
                    <Text variant='titleMedium' style={[{ textTransform: "capitalize" }, dangerTextStyle]}>{title}</Text>
                </RRow>
                <Ionicons name="chevron-forward" size={24} color={isDanger ? "red" : "black"} />
            </RRow>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    wrap: {
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 14
    },
    rw: {
        alignItems: "center",
        gap: 5,
        flex: 1,
        paddingVertical: 2,
    }
})