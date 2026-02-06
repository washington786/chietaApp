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

const { width } = Dimensions.get("window");
const cardWidth = width < 350 ? width - 40 : 140;

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
              <View style={[styles.smallCard, { backgroundColor: isUpcoming ? "#3498db" : "#27ae60" }]}>
                <Text style={styles.smallCardTitle}>{isUpcoming ? "Upcoming Start" : "Start"}</Text>
                <Text style={styles.smallCardValue}>{startDate.toLocaleDateString()}</Text>
              </View>
            )}
            {!isUpcoming && deadlineTime && (
              <View style={[styles.smallCard, { backgroundColor: isClosed ? "#bdc3c7" : "#f39c12" }]}>
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
  const { data: apiData, isLoading } = useGetActiveWindowsQuery(undefined);

  console.log("API Data:", apiData?.result?.items?.length);

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

  const { data: pendingTasksData, isLoading: pendingTasksLoading, error: pendingTasksError } = useGetUserPendingTasksQuery(Number(user?.id), { skip: !user?.id });

  // upcoming events
  const { data: upcomingEventsData, isLoading: upcomingEventsLoading, error: upcomingEventsError } = useGetUpcomingEventsQuery(undefined);

  if (upcomingEventsError || pendingTasksError) {
    showToast({ message: 'Failed to load some dashboard data', title: "Dashboard Error", type: "error", position: "top" });
    return;
  }


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#7f5af0", "#5a3d73"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Your Dashboard</Text>

        <Text style={styles.subtitle}>Active Windows</Text>
        {isLoading ? (
          <Text style={{ color: "#fff" }}>Loading...</Text>
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
          <Text style={{ color: "#fff" }}>No active windows</Text>
        )}

        <Text style={[styles.subtitle, { marginTop: 16 }]}>Upcoming Windows</Text>
        {
          upcomingEventsLoading && <RLoaderAnimation customStyle={styles.loader} />
        }
        {
          !upcomingEventsLoading && <Text style={{ color: colors.white }}>{upcomingEventsData?.items?.length > 0 ? `${upcomingEventsData?.items?.length} upcoming windows` : `No upcoming windows`}</Text>
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
        <View style={[styles.quickStatCard, { backgroundColor: "#27ae60" }]}>
          <Text style={styles.statTitle}>Active Grants</Text>
          {isLoading && <RLoaderAnimation customStyle={styles.loader} />}
          {
            !isLoading &&
            <Text style={styles.statValue}>{activeWindows.length}</Text>
          }
        </View>
        <View style={[styles.quickStatCard, { backgroundColor: "#e74c3c" }]}>
          <Text style={styles.statTitle}>Pending Tasks</Text>
          {pendingTasksLoading && <RLoaderAnimation customStyle={styles.loader} />}
          {
            !pendingTasksLoading &&
            <Text style={styles.statValue}>{pendingTasksData?.items?.length || 0}</Text>
          }
        </View>
        <View style={[styles.quickStatCard, { backgroundColor: "#3498db" }]}>
          <Text style={styles.statTitle}>Upcoming Events</Text>
          {upcomingEventsLoading && <RLoaderAnimation customStyle={styles.loader} />}
          {
            !upcomingEventsLoading && <Text style={styles.statValue}>{upcomingEventsData?.items?.length || 0}</Text>
          }

        </View>
      </View>
    </ScrollView>
  );
};

//////////////////////////
// Styles
//////////////////////////
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7" },
  contentContainer: { paddingBottom: 24 },
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  sectionTitle: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 4 },
  subtitle: { fontSize: 13, fontWeight: "500", color: "#d1c4e9", marginBottom: 8 },
  workflowItemWrapper: { marginBottom: 12 },
  contentWrapper: { flex: 1 },
  title: { fontSize: 15, fontWeight: "700", color: "#fff", marginBottom: 2 },
  smallCardsContainer: { flexDirection: "row", gap: 8, marginTop: 4 },
  smallCard: { flex: 1, borderRadius: 12, paddingVertical: 6, paddingHorizontal: 8, alignItems: "center" },
  smallCardTitle: { fontSize: 11, color: "#e0d6ff", fontWeight: "600", marginBottom: 2 },
  smallCardValue: { fontSize: 12, fontWeight: "700", color: "#fff" },
  quickStatsContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 16 },
  quickStatCard: { flex: 1, marginHorizontal: 4, borderRadius: 16, paddingVertical: 12, alignItems: "center" },
  statTitle: { fontSize: 12, color: "#fff", fontWeight: "600", marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "700", color: "#fff" },
  loader: { backgroundColor: 'white', width: 4, height: 4 },
});

export default AppStats;
