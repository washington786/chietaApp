import colors from '@/config/colors';
import { Platform, StyleSheet } from 'react-native'

export const BottomTabStyles = StyleSheet.create({
    tabBar: {
        height: 70,
        backgroundColor: colors.slate[50],
        borderTopWidth: 0.6,
        elevation: Platform.OS === "android" ? 10 : 8,
        shadowOpacity: 0.02,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 40,
        marginBottom: -15,
    },
    activeTab: {
        backgroundColor: colors.primary[100],
        paddingHorizontal: 8,
        borderRadius: 12,
        marginBottom: -15,
    },
    label: {
        fontSize: 14,
        color: colors.primary[600],
        fontWeight: "bold",
        marginLeft: 5,
    },
});