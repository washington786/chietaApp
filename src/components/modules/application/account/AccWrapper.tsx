import { RRow } from "@/components/common";
import { StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from '@expo/vector-icons/Ionicons';
import { moderateScale, scale } from '@/utils/responsive';
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
        <TouchableOpacity onPress={onPress} activeOpacity={0.65}>
            <RRow style={styles.wrap}>
                <RRow style={styles.rw}>
                    <View style={[
                        styles.iconWrap,
                        isDanger ? styles.iconWrapDanger : styles.iconWrapDefault,
                        dangerStyle,
                    ]}>
                        <Ionicons
                            name={icon}
                            size={moderateScale(20)}
                            color={isDanger ? colors.red[600] : colors.primary[700]}
                        />
                    </View>
                    <Text
                        variant='titleMedium'
                        style={[styles.label, isDanger && styles.labelDanger, dangerTextStyle]}
                    >
                        {title}
                    </Text>
                </RRow>
                <Ionicons
                    name="chevron-forward"
                    size={moderateScale(18)}
                    color={isDanger ? colors.red[400] : colors.slate[400]}
                />
            </RRow>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    wrap: {
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: scale(16),
        paddingVertical: scale(14),
    },
    rw: {
        alignItems: "center",
        gap: scale(12),
        flex: 1,
    },
    iconWrap: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconWrapDefault: {
        backgroundColor: colors.primary[100],
    },
    iconWrapDanger: {
        backgroundColor: colors.red[100],
    },
    label: {
        fontSize: moderateScale(15),
        fontWeight: '500',
        color: colors.slate[800],
        textTransform: 'capitalize',
    },
    labelDanger: {
        color: colors.red[600],
    },
})