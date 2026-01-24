import colors from "@/config/colors";
import { StyleSheet } from "react-native";

export const home_styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 48,
    },

    /* Header */
    header: {
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: "relative"
    },
    greeting: {
        fontSize: 30,
        fontWeight: '300',
        color: '#374151',
        textTransform: "capitalize"
    },
    userName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginTop: 4,
    },
    subtitle: {
        fontSize: 15,
        color: colors.slate[50],
        paddingLeft: 16,
        paddingVertical: 10
    },
    headerActions: {
        flexDirection: 'row',
        gap: 20,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 14,
        height: 14,
        borderRadius: 100,
        backgroundColor: colors.red[500],
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center"
    },

    /* Stats */
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 32,
    },

    statWrapper: {
        width: '49%',
        marginBottom: 10,
        position: "relative"
    },

    statCard: {
        borderRadius: 10,
        elevation: 6,
    },

    statContent: {
        paddingVertical: 22,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    statValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        marginTop: 8,
    },

    statLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginTop: 4,
        opacity: 0.95,
        textAlign: 'center',
    },


    /* Sections */
    section: {
        paddingHorizontal: 15,
        marginBottom: 32,
        paddingVertical: 10,
        backgroundColor: colors.slate[100],
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 10,
    },

    /* Timeline */
    timelineGrid: {
        flexDirection: 'row',
        gap: 8,
    },
    timelineCard: {
        flex: 1,
        backgroundColor: colors.primary[950],
        borderRadius: 10,
        padding: 26,
        alignItems: 'center',
    },
    timelineLabel: {
        color: colors.zinc[50],
        fontWeight: '600',
        marginBottom: 5,
        fontSize: 12,
        textAlign: "center"
    },
    countdownContainer: {
        alignItems: 'center',
    },
    countdownValue: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.secondary[200],
        letterSpacing: 2,
        marginVertical: 10,
    },
    countdownUnit: {
        fontSize: 12,
        color: colors.secondary[400],
    },
    statusBadge: {
        marginTop: 18,
        paddingHorizontal: 18,
        paddingVertical: 8,
        backgroundColor: colors.red[600],
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    statusText: {
        color: colors.zinc[50],
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },

    /* Orgs */
    sectionHeader: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15
    },
    viewAllText: {
        color: colors.blue[700],
        fontWeight: '600',
    }
});