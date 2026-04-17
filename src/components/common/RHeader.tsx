import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { moderateScale, scale, verticalScale } from '@/utils/responsive';
import React, { FC } from "react";

import { Feather } from "@expo/vector-icons";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import RRow from "./RRow";
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from "@/config/colors";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface prop {
    name: string;
    hasRightIcon?: boolean;
    iconRight?: 'search';
    onPressRight?(): void;
    showBack?: boolean;
    hasSecondIcon?: boolean;
    iconSecond?: string;
    onPressSecond?(): void;
}

const RHeader: FC<prop> = ({ name, hasRightIcon = false, onPressRight, iconRight, showBack = true, hasSecondIcon = false, onPressSecond, iconSecond }) => {
    const { onBack } = usePageTransition();
    return (
        <RRow style={styles.con}>
            {showBack && (
                <View style={styles.leftSlot}>
                    <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                        <Feather
                            name={Platform.OS === "ios" ? "chevron-left" : "arrow-left"}
                            size={24}
                        />
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.titleSlot}>
                <Text
                    style={styles.title}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.72}
                >
                    {name}
                </Text>
            </View>

            <View style={styles.rightSlot}>
                {hasRightIcon && (
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.iconBtn} onPress={onPressRight}>
                            <Ionicons name={(iconRight ?? 'search') as any} size={24} color={colors.gray[600]} />
                        </TouchableOpacity>
                        {hasSecondIcon && (
                            <TouchableOpacity style={[styles.secondaryIcon]} onPress={onPressSecond}>
                                <FontAwesome6 name={iconSecond as any} size={18} color={colors.white} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </RRow>
    );
};

export default RHeader;

const styles = StyleSheet.create({
    con: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: verticalScale(13),
        paddingHorizontal: scale(12),
    },
    leftSlot: {
        minWidth: scale(56),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexShrink: 0,
    },
    rightSlot: {
        minWidth: scale(56),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexShrink: 0,
    },
    backBtn: {
        padding: scale(6),
        borderRadius: 999,
    },
    titleSlot: {
        flex: 1,
        paddingHorizontal: scale(8),
    },
    title: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        textAlign: 'left',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(8),
    },
    iconBtn: {
        padding: scale(6),
        borderRadius: scale(8),
    },
    secondaryIcon: {
        backgroundColor: colors.primary[600],
        borderRadius: 999,
        padding: scale(7),
    },
});
