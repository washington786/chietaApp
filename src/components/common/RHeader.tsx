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
            {showBack &&
                <TouchableWithoutFeedback onPress={onBack}>
                    <Feather
                        name={Platform.OS === "ios" ? "chevron-left" : "arrow-left"}
                        size={24}
                    />
                </TouchableWithoutFeedback>}
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
                hasRightIcon && (<View style={{ alignItems: "center", gap: 4, flexDirection: 'row', marginHorizontal: 5 }}>
                    <TouchableOpacity style={{ alignSelf: "flex-end", alignItems: "flex-end", justifyContent: "flex-end", paddingRight: 12 }} onPress={onPressRight}>
                        <Ionicons name={iconRight} size={28} color={colors.gray[600]} />
                    </TouchableOpacity>
                    {
                        hasSecondIcon && (<TouchableOpacity style={{ alignSelf: "flex-end", alignItems: "flex-end", justifyContent: "flex-end", paddingRight: 6, backgroundColor: colors.primary[400], borderRadius: 10, padding: 4 }} onPress={onPressSecond}>
                            <FontAwesome6 name={iconSecond as any} size={24} color={colors.zinc[200]} />
                        </TouchableOpacity>
                        )
                    }
                </View>
                )
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
        flex: 1
    },
    gap: {
        gap: 10,
    },
});
