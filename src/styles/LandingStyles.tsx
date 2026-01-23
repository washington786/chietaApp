import { StyleSheet } from "react-native";

export const landing_styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },

    logo: {
        width: 140,
        height: 140,
        alignSelf: "center",
        marginVertical: 30,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#4c1d95",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 40,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 16,
    },

    card: {
        width: "47%",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    cardDisabled: {
        opacity: 0.6,
    },

    icon: {
        marginBottom: 12,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 8,
    },
    cardTitleDisabled: {
        color: "#6b7280",
    },

    badge: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginVertical: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#4c1d95",
    },

    cardDesc: {
        fontSize: 13,
        color: "#4b5563",
        textAlign: "center",
    },
    cardDescDisabled: {
        color: "#9ca3af",
    },

    footer: {
        color: "#6b7280",
        fontSize: 12,
        textAlign: "center",
        marginTop: "auto",
        marginBottom: 40,
    },

    fab: {
        position: "absolute",
        bottom: 32,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#6d28d9",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#6d28d9",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
});