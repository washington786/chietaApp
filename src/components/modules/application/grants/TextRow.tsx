import { RRow } from "@/components/common";
import colors from "@/config/colors";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

interface TextProps {
    desc?: string;
    title?: string;
}
export function TextWrap({ desc, title }: TextProps) {
    return (
        <RRow style={styles.wrap}>
            <Text variant='labelSmall' style={[styles.text, styles.lbl]}>{desc}</Text>
            <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>{title}</Text>
        </RRow>
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
    }
})