import React, { memo, useState, useMemo } from 'react';
import {
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RRow } from '@/components/common';
import LinkedOrganizations from './LinkedOrganizations';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { getTimeOfDay } from '@/core';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import HomeHeader from './HomeHeader';
import AppStatsSection from './AppStats';
import { home_styles as styles } from '@/styles/HomeStyles';
import { useGetNotificationsByUserQuery, useGetPersonByUserIdQuery } from '@/store/api/api';
import { AppNotification } from '@/core/types/notifications';

const NewHome = () => {
    const [addLinking, setAdd] = useState<boolean>(false);
    const { newOrg, notifications, linkedOrganizations } = usePageTransition();

    const { user } = useSelector((state: RootState) => state.auth);

    //sdf
    const { data: sdfData, isLoading: sdfLoading, error: sdfError } = useGetPersonByUserIdQuery(user?.id, { skip: !user?.id });

    // Fetch notifications
    const userId: number = user?.id ? parseInt(String(user.id), 10) : 0;
    const { data: serverNotifications } = useGetNotificationsByUserQuery(userId, {
        skip: userId === 0
    });

    // Count unread notifications
    const unreadNotificationsCount = useMemo(() => {
        const notifications = serverNotifications?.items || [];
        return notifications.filter((n: AppNotification) => !n.read).length;
    }, [serverNotifications]);

    let fullname: string = '';

    if (user && user.firstName && user.lastName) {
        fullname = `${user.firstName} ${user.lastName}`;
    } else if (sdfData?.result?.person) {
        fullname = `${sdfData?.result?.person.firstname} ${sdfData?.result?.person.lastname}`;
    }
    // } else {
    //     const name = user?.email.split('@')[0] || '';

    //     fullname = name.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    // }

    function handleLinkNewOrg() {
        setAdd(!addLinking);
    }

    function handleAddLinkNewOrg() {
        newOrg()
        setAdd(!addLinking);
    }

    const time = new Date().getTime();
    const currentDayTime = getTimeOfDay(new Date(time));

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[]}
                renderItem={null}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <HomeHeader currentDayTime={currentDayTime} fullname={fullname} addLinking={addLinking} handleAddLinkNewOrg={handleAddLinkNewOrg} notifications={notifications} handleLinkNewOrg={handleLinkNewOrg} unreadNotificationsCount={unreadNotificationsCount} />


                        {/* active windows */}
                        {/* <DgActiveWindow />* */}

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
                ListFooterComponentStyle={{ paddingHorizontal: 8 }}
            />
        </SafeAreaView>
    );
};

export default memo(NewHome);