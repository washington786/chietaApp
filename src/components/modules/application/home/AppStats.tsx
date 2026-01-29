import React, { useState, useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { FadeInDown } from 'react-native-reanimated';

//////////////////////////
// Workflow Cards Section
//////////////////////////
interface WorkflowItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  badgeColor?: string;
  startDate?: Date;
  deadline?: Date;
}

const WORKFLOW_ITEMS: WorkflowItem[] = [
  {
    icon: 'briefcase',
    title: 'Discretionary Grants',
    description: 'Check linked organizations',
    startDate: new Date('2025-11-12T08:00:00'),
    deadline: new Date('2026-11-12T23:59:59'),
    badgeColor: '#7f5af0', // primary purple
  },
  {
    icon: 'lock-closed',
    title: 'Mandatory Grants',
    description: 'Review all mandatory requirements',
    startDate: new Date('2025-12-01T09:00:00'),
    deadline: new Date('2025-12-31T23:59:59'),
    badgeColor: '#95a5a6', // gray
  },
  {
    icon: 'calendar',
    title: 'Upcoming Events',
    description: 'Plan your week ahead',
    startDate: new Date('2026-02-14T10:08:00'),
    deadline: new Date('2026-06-30T23:59:59'),
    badgeColor: '#9b59b6', // muted purple
  },
];

//////////////////////////
// Countdown Timer Hook
//////////////////////////
const useCountdown = (deadline?: Date) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!deadline) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadline.getTime() - now;

      if (distance <= 0) {
        setTimeLeft('Closed');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return timeLeft;
};

//////////////////////////
// Workflow Card
//////////////////////////
const WorkflowCard = memo(({ item, index, isLast }: { item: WorkflowItem; index: number; isLast: boolean }) => {
  const scaleAnim = useSharedValue(1);
  const countdown = useCountdown(item.deadline);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  const handlePressIn = () => { scaleAnim.value = withSpring(0.98); };
  const handlePressOut = () => { scaleAnim.value = withSpring(1); };

  const now = new Date();
  const isClosed = item.deadline ? now > item.deadline : false;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(300).springify()}
      style={styles.workflowItemWrapper}
    >
      <View style={styles.timelineContainer}>
        <View style={[styles.dot, { backgroundColor: isClosed ? '#bdc3c7' : item.badgeColor || '#7f5af0' }]}>
          <Ionicons name={item.icon} size={20} color="#fff" />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.contentWrapper}
      >
        <Animated.View style={animatedStyle}>
          <Text style={[styles.title, isClosed && { color: '#7f8c8d' }]}>{item.title}</Text>
          <Text style={[styles.description, isClosed && { color: '#95a5a6' }]}>{item.description}</Text>

          <View style={styles.smallCardsContainer}>
            {item.startDate && (
              <View style={[styles.smallCard, { backgroundColor: isClosed ? '#bdc3c7' : '#27ae60' }]}>
                <Text style={styles.smallCardTitle}>Start</Text>
                <Text style={styles.smallCardValue}>{isClosed ? 'Closed' : item.startDate.toLocaleDateString()}</Text>
              </View>
            )}
            {item.deadline && (
              <View style={[styles.smallCard, { backgroundColor: isClosed ? '#bdc3c7' : '#f39c12' }]}>
                <Text style={styles.smallCardTitle}>Deadline</Text>
                <Text style={styles.smallCardValue}>{isClosed ? 'Closed' : countdown}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
});

//////////////////////////
// Dashboard Section
//////////////////////////
const AppStatsSection = () => (
  <LinearGradient colors={['#7f5af0', '#5a3d73']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Your Dashboard</Text>
    <Text style={styles.subtitle}>Prioritized overview for grant cycles</Text>
    <View style={styles.workflowList}>
      {WORKFLOW_ITEMS.map((item, index) => (
        <WorkflowCard key={item.title} item={item} index={index} isLast={index === WORKFLOW_ITEMS.length - 1} />
      ))}
    </View>
  </LinearGradient>
);

//////////////////////////
// Home Page
//////////////////////////
const HomePage = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <AppStatsSection />

      <View style={styles.quickStatsContainer}>
        <View style={[styles.quickStatCard, { backgroundColor: '#27ae60' }]}>
          <Text style={styles.statTitle}>Active Grants</Text>
          <Text style={styles.statValue}>12</Text>
        </View>
        <View style={[styles.quickStatCard, { backgroundColor: '#e74c3c' }]}>
          <Text style={styles.statTitle}>Pending Tasks</Text>
          <Text style={styles.statValue}>8</Text>
        </View>
        <View style={[styles.quickStatCard, { backgroundColor: '#9b59b6' }]}>
          <Text style={styles.statTitle}>Upcoming Events</Text>
          <Text style={styles.statValue}>4</Text>
        </View>
      </View>

      {/* <View style={styles.footer}>
        <Text style={styles.footerText}>Last update: 29 Jan 2026</Text>
      </View> */}
    </ScrollView>
  );
};

//////////////////////////
// Styles
//////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  contentContainer: { paddingBottom: 24 },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  sectionTitle: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, fontWeight: '500', color: '#d1c4e9', marginBottom: 12 },
  workflowList: { gap: 12 },
  workflowItemWrapper: { flexDirection: 'row', marginBottom: 12 },
  timelineContainer: { width: 36, alignItems: 'center' },
  dot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  timelineLine: { width: 2, flex: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginTop: 4 },
  contentWrapper: { flex: 1, paddingLeft: 10 },
  title: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 2 },
  description: { fontSize: 13, color: '#f0e6ff', marginBottom: 6 },
  smallCardsContainer: { flexDirection: 'row', gap: 8, marginTop: 4 },
  smallCard: { flex: 1, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 8, alignItems: 'center' },
  smallCardTitle: { fontSize: 11, color: '#e0d6ff', fontWeight: '600', marginBottom: 2 },
  smallCardValue: { fontSize: 12, fontWeight: '700', color: '#fff' },
  quickStatsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 16 },
  quickStatCard: { flex: 1, marginHorizontal: 4, borderRadius: 16, paddingVertical: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  statTitle: { fontSize: 12, color: '#fff', fontWeight: '600', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#fff' },
  footer: { paddingHorizontal: 16, marginTop: 16, alignItems: 'center' },
  footerText: { fontSize: 12, color: '#7f5af0' },
});

export default HomePage;
