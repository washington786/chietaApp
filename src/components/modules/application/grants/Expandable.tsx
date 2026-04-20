import { RCol, RDivider, RRow } from "@/components/common";
import colors from "@/config/colors";
import { moderateScale, scale } from "@/utils/responsive";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Entypo from '@expo/vector-icons/Entypo';

interface props {
    onPress?: () => void;
    isExpanded?: boolean;
    children: ReactNode;
    title: string;
}

export function Expandable({ onPress, isExpanded = true, children, title }: props) {
    return (
        <RCol style={{ backgroundColor: "#ffffff", marginVertical: scale(10), padding: scale(4), borderColor: colors.gray[200], borderWidth: 0.5, borderRadius: scale(6) }}>
            <TouchableOpacity onPress={onPress}>
                <RRow style={{ alignItems: 'center', justifyContent: "space-between", paddingVertical: scale(12) }}>
                    <Text variant='titleMedium' style={styles.capText}>{title}</Text>
                    <Entypo name={!isExpanded ? "chevron-down" : "chevron-up"} size={moderateScale(24)} color="black" />
                </RRow>
            </TouchableOpacity>
            {
                isExpanded && (
                    <>
                        <RDivider />
                        <RCol style={{ paddingHorizontal: scale(6), paddingVertical: scale(8) }}>
                            {children}
                        </RCol>

                    </>
                )
            }
        </RCol>
    )
}

const styles = StyleSheet.create({
    text: {
        textTransform: "capitalize"
    },
    wrap: {
        alignItems: "center",
        justifyContent: "space-between"
    },
    appTitle: {
        fontSize: moderateScale(10)
    },
    lbl: {
        color: colors.gray[400],
        textTransform: "capitalize"
    },
    capText: {
        textTransform: "capitalize",
        fontSize: moderateScale(14)
    }
})