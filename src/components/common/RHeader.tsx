import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import React, { FC } from "react";

import { Feather } from "@expo/vector-icons";
import { Text } from "react-native-paper";
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
                    variant="titleLarge"
                    style={styles.title}
                    numberOfLines={1}
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
                            <TouchableOpacity style={[styles.iconBtn, styles.secondaryIcon]} onPress={onPressSecond}>
                                <FontAwesome6 name={iconSecond as any} size={20} color={colors.zinc[200]} />
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
        paddingVertical: 13,
        paddingHorizontal: 12,
    },
    leftSlot: {
        minWidth: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexShrink: 0,
    },
    rightSlot: {
        minWidth: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexShrink: 0,
    },
    backBtn: {
        padding: 6,
        borderRadius: 999,
    },
    titleSlot: {
        flex: 1,
        paddingHorizontal: 8,
    },
    title: {
        fontWeight: '700',
        textAlign: 'left',
        alignSelf: 'stretch',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconBtn: {
        padding: 6,
        borderRadius: 12,
    },
    secondaryIcon: {
        backgroundColor: colors.primary[400],
    },
});
