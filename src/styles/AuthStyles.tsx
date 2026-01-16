import colors from "@/config/colors";
import appFonts from "@/config/fonts";
import { StyleSheet } from "react-native";

export const Authstyles = StyleSheet.create({
    content: {
        flex: 1,
        gap: 12,
    },
    title: {
        fontSize: 28,
        color: colors.primary['900'],
        textAlign: 'center',
        fontWeight: "black"
    },
    description: {
        fontSize: 16,
        color: colors.slate['600'],
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: `${appFonts.medium}`,
        fontWeight: "thin"
    },
    button: {
        marginTop: 8,
        paddingVertical: 4,
        backgroundColor: colors.primary['900'],
    },
    textButton: {
        marginTop: 8,
        alignSelf: 'center',
    },
    backButton: {
        textTransform: "capitalize", color: colors.slate['700']
    }
})