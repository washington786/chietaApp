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
        color: colors.slate['900'],
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: colors.slate['600'],
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: `${appFonts.medium}`
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