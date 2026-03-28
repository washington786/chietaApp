import React, { memo, useMemo, useState } from 'react';
import {
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons as Icon } from '@expo/vector-icons';
import { RRow } from '@/components/common';
import LinkedOrganizations from './LinkedOrganizations';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { getTimeOfDay } from '@/core';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import HomeHeader from './HomeHeader';
import AppStatsSection from './AppStats';
import { home_styles as styles } from '@/styles/HomeStyles';
import { useGetPersonByUserIdQuery, useGetOrganizationsBySdfIdQuery } from '@/store/api/api';
import { useCombinedNotifications } from '@/hooks/notifications';
import IncompleteProfileGate from './IncompleteProfileGate';
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet';
import { ChatBot } from '@/components/common/ChietaBot';

const NewHome = () => {
    const [addLinking, setAdd] = useState<boolean>(false);
    const [listHeight, setListHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const { newOrg, notifications, linkedOrganizations } = usePageTransition();
    const { open, close } = useGlobalBottomSheet();

    const { user } = useSelector((state: RootState) => state.auth);

    //sdf
    const { data: sdfData, isLoading: sdfLoading, error: sdfError } = useGetPersonByUserIdQuery(user?.id, { skip: !user?.id });

    // Gate: orgs for profile-completeness check
    const { data: orgs, isLoading: orgsLoading } = useGetOrganizationsBySdfIdQuery(user?.sdfId || 0, { skip: !user?.sdfId });
    const emailUnverified = !user?.isEmailConfirmed;
    const noSdfProfile = !user?.sdfId;
    const noOrgsLinked = !orgsLoading && (!orgs || orgs.length === 0);
    const showProfileGate = emailUnverified || noSdfProfile || noOrgsLinked;

    // Fetch notifications
    const userId: number = user?.id ? parseInt(String(user.id), 10) : 0;
    const { unreadTotal: unreadNotificationsCount } = useCombinedNotifications(userId || undefined);

    let fullname: string = '';

    if (user && user.firstName && user.lastName) {
        fullname = `${user.firstName} ${user.lastName}`;
    } else if (sdfData?.result?.person) {
        fullname = `${sdfData?.result?.person.firstname} ${sdfData?.result?.person.lastname}`;
    }

    function handleLinkNewOrg() {
        setAdd(!addLinking);
    }

    function handleAddLinkNewOrg() {
        newOrg()
        setAdd(!addLinking);
    }

    function openChatBot() {
        open(<ChatBot close={close} />, { snapPoints: ["92%"] });
    }

    const time = new Date().getTime();
    const currentDayTime = getTimeOfDay(new Date(time));
    const shouldScroll = useMemo(() => listHeight > 0 && contentHeight > listHeight + 1, [contentHeight, listHeight]);

    if (showProfileGate) {
        return <IncompleteProfileGate />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[]}
                renderItem={null}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                ListFooterComponentStyle={styles.footerSpacing}
                scrollEnabled={shouldScroll}
                bounces={false}
                alwaysBounceVertical={false}
                overScrollMode="never"
                contentInsetAdjustmentBehavior="never"
                onLayout={({ nativeEvent }) => setListHeight(nativeEvent.layout.height)}
                onContentSizeChange={(_, height) => setContentHeight(height)}
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <HomeHeader currentDayTime={currentDayTime} fullname={fullname} addLinking={addLinking} handleAddLinkNewOrg={handleAddLinkNewOrg} notifications={notifications} handleLinkNewOrg={handleLinkNewOrg} unreadNotificationsCount={unreadNotificationsCount} />

                        {/* Stats */}
                        <AppStatsSection />

                        {/* Linked Orgs Header */}
                        <RRow style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>My Linked Organizations</Text>
                            <TouchableOpacity onPress={linkedOrganizations}>
                                <Text style={styles.viewAllText}>View all</Text>
                            </TouchableOpacity>
                        </RRow>
                    </>
                }
                ListFooterComponent={<LinkedOrganizations />}
            />

            {/* Floating chatbot button */}
            <TouchableOpacity style={styles.fab} onPress={openChatBot}>
                <Icon name="chatbubble-ellipses" size={26} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default memo(NewHome);
