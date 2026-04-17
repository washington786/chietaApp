import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import { FadeInDown } from "react-native-reanimated";
import { useGetActiveWindowsQuery, useGetUpcomingEventsQuery, useGetUserPendingTasksQuery } from "@/store/api/api";
import colors from "@/config/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { showToast } from "@/core";
import { RLoaderAnimation } from "@/components/common";
import usePageTransition from "@/hooks/navigation/usePageTransition";

import { Ionicons } from '@expo/vector-icons'
import { moderateScale, scale } from "@/utils/responsive";

const { width } = Dimensions.get("window");

//////////////////////////
// DiscretionaryWindow Interface
//////////////////////////
export interface DiscretionaryWindow {
  id: number;
  progCd: string;
  reference: string;
  description: string;
  title: string;
  launchDte: string;
  deadlineTime: string;
  totBdgt: number;
  contractStartDate: string;
  contractEndDate: string;
  activeYN: boolean;
  dteUpd: string;
  usrUpd: number;
  dteCreated: string;
}

//////////////////////////
// Countdown Hook
//////////////////////////
const useCountdown = (deadline?: Date) => {
  const [timeLeft, setTimeLeft] = React.useState("");

  React.useEffect(() => {
    if (!deadline) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = deadline.getTime() - now;

      if (distance <= 0) {
        setTimeLeft("Closed");
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
// Workflow Card Component
//////////////////////////
const WorkflowCard = ({
  title,
  startDate,
  deadlineTime,
  isUpcoming,
}: {
  title: string;
  startDate?: Date;
  deadlineTime?: Date;
  isUpcoming?: boolean;
}) => {
  const countdown = useCountdown(deadlineTime);
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

  const now = new Date();
  const isClosed = !isUpcoming && deadlineTime ? now > deadlineTime : false;

  return (
    <Animated.View entering={FadeInDown.duration(300).springify()} style={styles.workflowItemWrapper}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.contentWrapper}
      >
        <Animated.View style={animatedStyle}>
          <Text style={[styles.title, isClosed && { color: "#7f8c8d" }]}>{title}</Text>

          <View style={styles.smallCardsContainer}>
            {startDate && (
              <View style={styles.smallCard}>
                <Text style={styles.smallCardTitle}>{isUpcoming ? 'Upcoming Start' : 'Start'}</Text>
                <Text style={styles.smallCardValue}>{startDate.toLocaleDateString()}</Text>
              </View>
            )}
            {!isUpcoming && deadlineTime && (
              <View style={[styles.smallCard, isClosed && { opacity: 0.55 }]}>
                <Text style={styles.smallCardTitle}>Deadline</Text>
                <Text style={styles.smallCardValue}>{countdown}</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

//////////////////////////
// Home Page / Dashboard
//////////////////////////
const AppStats = () => {

  const { upcomingWindows: navigateToUpcomingWindows } = usePageTransition();

  const { data: apiData, isLoading } = useGetActiveWindowsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const { user } = useSelector((state: RootState) => state.auth);

  const { activeWindows, upcomingWindows } = useMemo(() => {
    if (!apiData?.result?.items) return { activeWindows: [], upcomingWindows: [] };

    const now = new Date();

    const allWindows: DiscretionaryWindow[] = apiData.result.items.map((item: any) => item.discretionaryWindow);

    // Active: activeYN true and deadlineTime >= now
    const activeWindows = allWindows.filter(
      (w: DiscretionaryWindow) =>
        w.activeYN && w.deadlineTime && new Date(w.deadlineTime) >= now
    );

    // Upcoming: launchDte in the future
    const upcomingWindows = allWindows.filter(
      (w: DiscretionaryWindow) =>
        w.launchDte && new Date(w.launchDte) > now
    );

    return { activeWindows, upcomingWindows };
  }, [apiData]);

  //pending tasks:

  const { data: pendingTasksData, isLoading: pendingTasksLoading, error: pendingTasksError } = useGetUserPendingTasksQuery(Number(user?.id), {
    skip: !user?.id,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // upcoming events
  const { data: upcomingEventsData, isLoading: upcomingEventsLoading, error: upcomingEventsError } = useGetUpcomingEventsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (upcomingEventsError || pendingTasksError) {
    showToast({ message: 'Failed to load some dashboard data', title: "Dashboard Error", type: "error", position: "top" });
    return;
  }




  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[colors.primary[800], colors.primary[950]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Your Dashboard</Text>

        <Text style={styles.subtitle}>Active Windows</Text>
        {isLoading ? (
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Loading windows…</Text>
        ) : activeWindows.length ? (
          activeWindows.map((w: DiscretionaryWindow) => (
            <WorkflowCard
              key={w.id}
              title={w.title}
              startDate={w.launchDte ? new Date(w.launchDte) : undefined}
              deadlineTime={w.deadlineTime ? new Date(w.deadlineTime) : undefined}
            />
          ))
        ) : (
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontStyle: 'italic' }}>No active windows at this time.</Text>
        )}

        <Text style={[styles.subtitle, { marginTop: 16 }]}>Upcoming Windows</Text>
        {
          upcomingEventsLoading && <RLoaderAnimation customStyle={styles.loader} />
        }
        {
          !upcomingEventsLoading && <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{upcomingEventsData?.items?.length > 0 ? `${upcomingEventsData?.items?.length} upcoming windows` : `No upcoming windows`}</Text>
        }
        {/* {upcomingWindows.length ? (
          upcomingWindows.map((w: DiscretionaryWindow) => (
            <WorkflowCard
              key={w.id}
              title={w.title}
              startDate={w.launchDte ? new Date(w.launchDte) : undefined}
              isUpcoming
            />
          ))
        ) : (
          <Text style={{ color: "#fff" }}>No upcoming windows</Text>
        )} */}
      </LinearGradient>

      <View style={styles.quickStatsContainer}>
        <View style={[styles.quickStatCard, { backgroundColor: colors.primary[700] }]}>
          <Text style={styles.statTitle}>Active Grants</Text>
          {isLoading && <RLoaderAnimation customStyle={styles.loader} />}
          {
            !isLoading &&
            <Text style={styles.statValue}>{activeWindows.length}</Text>
          }
        </View>

        <View style={[styles.quickStatCard, { backgroundColor: colors.primary[500] }]}>
          <Text style={styles.statTitle}>Pending Tasks</Text>
          {pendingTasksLoading && <RLoaderAnimation customStyle={styles.loader} />}
          {
            !pendingTasksLoading &&
            <Text style={styles.statValue}>{pendingTasksData?.items?.length || 0}</Text>
          }
        </View>

        <TouchableOpacity onPress={navigateToUpcomingWindows} activeOpacity={0.3} style={[styles.quickStatCard, { backgroundColor: colors.primary[900] }]}>
          <Text style={styles.statTitle}>Upcoming Events</Text>
          {upcomingEventsLoading && <RLoaderAnimation customStyle={styles.loader} />}
          {
            !upcomingEventsLoading && <Text style={styles.statValue}>{upcomingEventsData?.items?.length || 0}</Text>
          }
          <Ionicons name="chevron-forward" size={12} color={colors.primary[200]} style={{ position: 'absolute', bottom: 8, right: 8 }} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

//////////////////////////
// Styles
//////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  contentContainer: { paddingBottom: 24 },
  sectionContainer: {
    marginHorizontal: scale(12),
    marginTop: scale(12),
    marginBottom: 8,
    borderRadius: 20,
    padding: scale(16),
    shadowColor: colors.primary[950],
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  sectionTitle: { fontSize: moderateScale(20), fontWeight: '700', color: '#fff', marginBottom: 6, letterSpacing: 0.2 },
  subtitle: { fontSize: moderateScale(11), fontWeight: '600', color: 'rgba(255,255,255,0.55)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 },
  workflowItemWrapper: { marginBottom: 12 },
  contentWrapper: { flex: 1 },
  title: { fontSize: moderateScale(15), fontWeight: "700", color: "#fff", marginBottom: 2 },
  smallCardsContainer: { flexDirection: "row", gap: 8, marginTop: 4 },
  smallCard: { flex: 1, borderRadius: 12, paddingVertical: scale(6), paddingHorizontal: scale(8), alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
  smallCardTitle: { fontSize: moderateScale(10), color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 2, letterSpacing: 0.4, textTransform: 'uppercase' },
  smallCardValue: { fontSize: moderateScale(12), fontWeight: '700', color: '#fff' },
  quickStatsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: scale(12), marginTop: 8, marginBottom: 4 },
  quickStatCard: {
    flex: 1, marginHorizontal: scale(3), borderRadius: 16, paddingVertical: scale(12), alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 3, position: 'relative',
  },
  statTitle: { fontSize: moderateScale(10), color: 'rgba(255,255,255,0.75)', fontWeight: '600', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 },
  statValue: { fontSize: moderateScale(22), fontWeight: '800', color: '#fff' },
  loader: { backgroundColor: 'white', width: 4, height: 4 },
});

export default AppStats;
