import { RCol, RDivider, RRow } from "@/components/common";
import colors from "@/config/colors";
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
        <RCol style={{ backgroundColor: colors.slate[100], marginVertical: 10, padding: 4 }}>
            <TouchableOpacity onPress={onPress}>
                <RRow style={{ alignItems: 'center', justifyContent: "space-between", paddingVertical: 12 }}>
                    <Text variant='titleMedium' style={styles.capText}>{title}</Text>
                    <Entypo name={!isExpanded ? "chevron-down" : "chevron-up"} size={24} color="black" />
                </RRow>
            </TouchableOpacity>
            {
                isExpanded && (
                    <>
                        <RDivider />
                        <RCol>
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
        fontSize: 10
    },
    lbl: {
        color: colors.gray[400],
        textTransform: "capitalize"
    },
    capText: {
        textTransform: "capitalize"
    }
})