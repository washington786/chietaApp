import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import React, { FC } from "react";

import { Feather } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import RRow from "./RRow";
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from "@/config/colors";

interface prop {
    name: string;
    hasRightIcon?: boolean;
    iconRight?: 'search';
    onPressRight?(): void;
}

const RHeader: FC<prop> = ({ name, hasRightIcon = false, onPressRight, iconRight }) => {
    const { onBack } = usePageTransition();
    return (
        <RRow style={styles.con}>
            <TouchableWithoutFeedback onPress={onBack}>
                <Feather
                    name={Platform.OS === "ios" ? "chevron-left" : "arrow-left"}
                    size={24}
                />
            </TouchableWithoutFeedback>
            <View
                style={[
                    Platform.OS === "ios" && styles.ios,
                    Platform.OS === "android" && styles.gap,
                ]}
            >
                <Text
                    variant="titleLarge"
                    style={Platform.OS === "android" && styles.android}
                >
                    {name}
                </Text>
            </View>
            {
                hasRightIcon && <TouchableOpacity style={{ alignSelf: "flex-end", alignItems: "flex-end", justifyContent: "flex-end", paddingRight: 12, flex: 1 }} onPress={onPressRight}>
                    <Ionicons name={iconRight} size={28} color={colors.gray[600]} />
                </TouchableOpacity>
            }
        </RRow>
    );
};

export default RHeader;

const styles = StyleSheet.create({
    con: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 13,
        gap: 9,
        paddingLeft: 6,
    },
    ios: {
        textAlign: "center",
        flex: 1,
    },
    android: {
        textAlign: "left",
    },
    gap: {
        gap: 10,
    },
});
