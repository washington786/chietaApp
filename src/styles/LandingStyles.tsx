import colors from "@/config/colors";
import { StyleSheet } from "react-native";

export const landing_styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 40,
        backgroundColor: "#FFFFFF"
    },

    logo: {
        width: 260,
        height: 180,
        marginTop: 10,
        marginBottom: 18,
    },

    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#412050",
        marginBottom: 3
    },

    subtitle: {
        fontSize: 13,
        marginBottom: 20,
        color: "#6c757d"
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        width: "95%"
    },

    card: {
        width: "44%",
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 14,
        margin: 8,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#F4B63E"
    },

    cardTitle: {
        fontWeight: "800",
        marginTop: 6,
        color: "#412050"
    },

    cardDesc: {
        fontSize: 12,
        color: "#6c757d",
        textAlign: "center"
    },

    badge: {
        backgroundColor: "#412050",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginVertical: 4
    },

    badgeText: {
        color: "#fff",
        fontSize: 10
    },

    footer: {
        marginTop: 25,
        fontSize: 10,
        color: colors.gray[400],
        position: "absolute",
        bottom: 10
    },

    fab: {
        position: "absolute",
        right: 25,
        bottom: 50,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#F4B63E",
        alignItems: "center",
        justifyContent: "center"
    },

    modalWrap: {
        flex: 1,
        justifyContent: "flex-end"
    },

    chatContainer: {
        flex: 1,
    },

    chatContent: {
        backgroundColor: "#fff",
        borderRadius: 0,
        overflow: "hidden",
        height: "100%",
        flex: 1
    },

    chatHeader: {
        paddingHorizontal: 24,
        paddingVertical: 22,
        backgroundColor: "#412050",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
        borderRadius: 10
    },

    headerTitleWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16
    },

    headerTitle: {
        color: "#fff",
        fontWeight: "900",
        fontSize: 22,
        letterSpacing: 0.3
    },

    chatBodyContent: {
        flex: 1,
        paddingHorizontal: 32,
        paddingVertical: 48,
        alignItems: "center",
        justifyContent: "center"
    },

    comingSoonIcon: {
        marginBottom: 32,
        alignItems: "center",
        justifyContent: "center",
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: "rgba(244, 182, 62, 0.15)",
        borderWidth: 2,
        borderColor: "rgba(244, 182, 62, 0.3)"
    },

    comingSoonTitle: {
        fontSize: 22,
        fontWeight: "900",
        color: "#412050",
        marginBottom: 5,
        textAlign: "center",
        letterSpacing: -0.5
    },

    comingSoonText: {
        fontSize: 16,
        color: colors.gray[400],
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 40,
        fontWeight: "thin"
    },

    stayConnected: {
        width: "100%",
        backgroundColor: "rgba(244, 182, 62, 0.08)",
        borderRadius: 16,
        padding: 22,
        marginBottom: 32,
        gap: 16,
        borderWidth: 1,
        borderColor: "rgba(244, 182, 62, 0.2)"
    },

    connectItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16
    },

    connectText: {
        fontSize: 16,
        color: "#412050",
        fontWeight: "700",
        flex: 1,
        letterSpacing: 0.2
    },

    closeButton: {
        backgroundColor: "#F4B63E",
        paddingVertical: 16,
        paddingHorizontal: 56,
        borderRadius: 12,
        alignItems: "center",
        minWidth: 220,
        shadowColor: "#F4B63E",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },

    closeButtonText: {
        color: "#412050",
        fontWeight: "900",
        fontSize: 17,
        letterSpacing: 0.5
    },

    chatWindow: {
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 16,
        overflow: "hidden"
    },

    chatBody: {
        padding: 16
    }
});