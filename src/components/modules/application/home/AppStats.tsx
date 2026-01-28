import { View, Text, TouchableOpacity } from 'react-native';
import { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/config/colors';
import { FadeInDown } from 'react-native-reanimated';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface WorkflowItem {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    badge?: string;
    badgeColor?: string;
}

const WORKFLOW_ITEMS: WorkflowItem[] = [
    {
        icon: 'alert-circle',
        title: 'Review 4 Applications',
        description: 'DG2025 Cycle 1 closing soon',
        badge: 'URGENT',
        badgeColor: '#f97316'
    },
    {
        icon: 'briefcase',
        title: '4 Pending Verifications',
        description: 'Check linked organizations',
    },
    {
        icon: 'calendar',
        title: '4 Upcoming Events',
        description: 'Planning for next week',
    },
];

const WorkflowCard = memo(
    ({ item, index, isLast }: { item: WorkflowItem; index: number; isLast: boolean }) => {
        const scaleAnim = useSharedValue(1);

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scaleAnim.value }],
        }));

        const handlePressIn = () => {
            scaleAnim.value = withSpring(0.98);
        };

        const handlePressOut = () => {
            scaleAnim.value = withSpring(1);
        };

        return (
            <Animated.View
                entering={FadeInDown.delay(index * 150).duration(400).springify()}
                style={styles.workflowItemWrapper}
            >
                <View style={styles.timelineContainer}>
                    {/* Timeline Dot */}
                    <View style={styles.dotContainer}>
                        <View style={[styles.dot, { backgroundColor: item.badgeColor || '#8b5cf6' }]}>
                            <Ionicons
                                name={item.icon}
                                size={24}
                                color="#fff"
                            />
                        </View>
                    </View>

                    {/* Timeline Line */}
                    {!isLast && <View style={styles.timelineLine} />}
                </View>

                {/* Content */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={styles.contentWrapper}
                >
                    <Animated.View style={animatedStyle}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{item.title}</Text>
                            {item.badge && (
                                <View style={[styles.badge, { backgroundColor: item.badgeColor || '#8b5cf6' }]}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.description}>{item.description}</Text>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        );
    }
);

const AppStatsSection = () => (
    <LinearGradient
        colors={['#6d28d9', '#4c1d95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sectionContainer}
    >
        <View style={styles.headerSection}>
            <Text style={styles.sectionTitle}>Your Dashboard</Text>
            <Text style={styles.subtitle}>Prioritized overview for grant cycles</Text>
        </View>
        <View style={styles.workflowList}>
            {WORKFLOW_ITEMS.map((item, index) => (
                <WorkflowCard
                    key={item.title}
                    item={item}
                    index={index}
                    isLast={index === WORKFLOW_ITEMS.length - 1}
                />
            ))}
        </View>
    </LinearGradient>
);

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 12,
        borderRadius: 28,
        paddingVertical: 24,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
        marginHorizontal: 8
    },
    headerSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    workflowList: {
        gap: 0,
    },
    workflowItemWrapper: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    timelineContainer: {
        alignItems: 'center',
        marginRight: 16,
        width: 50,
    },
    dotContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: 8,
    },
    contentWrapper: {
        flex: 1,
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 15,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
    },
});

export default AppStatsSection;