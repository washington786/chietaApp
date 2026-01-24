import React, { memo, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import colors from '@/config/colors';
import { RCol, RDivider, RRow } from '@/components/common';
import LinkedOrganizations from './LinkedOrganizations';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { getTimeOfDay } from '@/core';
import { usePeriodInfo } from '@/hooks/main/UsePeriodInfo';
import { formatCountdown } from '@/core/utils/dayTime';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useGetActiveWindowsParamsQuery } from '@/store/api/api';
import DgActiveWindow from '../grants/ActiveWindow';
import HomeHeader from './HomeHeader';
import AppStatsSection from './AppStats';
import { home_styles as styles } from '@/styles/HomeStyles';

const NewHome = () => {
    const [addLinking, setAdd] = useState<boolean>(false);
    const { newOrg, notifications, linkedOrganizations } = usePageTransition();

    const { user } = useSelector((state: RootState) => state.auth);

    let fullname: string = '';

    if (user && user.firstName && user.lastName) {
        fullname = `${user.firstName} ${user.lastName}`;
    } else if (user && user.username) {
        fullname = user.username;
    } else {
        const name = user?.email.split('@')[0] || '';

        fullname = name.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }

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
                        <HomeHeader currentDayTime={currentDayTime} fullname={fullname} addLinking={addLinking} handleAddLinkNewOrg={handleAddLinkNewOrg} notifications={notifications} handleLinkNewOrg={handleLinkNewOrg} />


                        {/* active windows */}
                        <DgActiveWindow />

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