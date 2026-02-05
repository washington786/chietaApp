import React from 'react'
import { NewHome } from '@/components/modules/application'
import { usePushNotifications } from '@/hooks/notifications';
import { showToast } from '@/core';
import { RListLoading } from '@/components/common';

const HomeScreen = () => {

    const { pushToken, hasPermission, isLoading, error } = usePushNotifications();

    if (isLoading) {
        return <RListLoading count={4} />
    }

    if (error) {
        showToast({ message: 'Failed to set up push notifications', title: "Notification Error", type: "error", position: "top" });
    }

    console.log('Push notification permission:', hasPermission);
    console.log('Push notification token:', pushToken);
    return (
        <NewHome />
    )
}

export default HomeScreen