import colors from '@/config/colors';
import { Platform, StyleSheet } from 'react-native';
import { moderateScale, scale, verticalScale } from '@/utils/responsive';

export const BottomTabStyles = StyleSheet.create({
    tabBar: {
        height: Math.max(60, verticalScale(70)),
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
        width: scale(76),
        height: scale(38),
        marginBottom: -15,
    },
    activeTab: {
        backgroundColor: colors.primary[100],
        paddingHorizontal: 8,
        borderRadius: 12,
        marginBottom: -15,
    },
    label: {
        fontSize: moderateScale(13),
        color: colors.primary[600],
        fontWeight: "bold",
        marginLeft: 5,
    },
});