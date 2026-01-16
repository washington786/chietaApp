import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/config/colors';
import { RRow } from '@/components/common';
import { DiscretionaryGrantApplication } from '@/core/models/DiscretionaryDto';

interface Props {
    onPress?: () => void;
    item: DiscretionaryGrantApplication;
}

export function AppTrackingItem({ onPress, item }: Props) {
    const { dateCreated, status, project, organisation_Name } = item;

    const getStatusStyle = (status: string = '') => {
        const s = status.toLowerCase().trim();
        if (s.includes('approved')) {
            return { bg: '#d1fae5', text: '#065f46', label: 'Approved' };
        }
        if (s.includes('contract') || s.includes('signed')) {
            return { bg: '#dbeafe', text: '#1e40af', label: 'Contract Signed' };
        }
        if (s.includes('accept') || s.includes('minor')) {
            return { bg: '#fef3c7', text: '#92400e', label: 'Accept with Conditions' };
        }
        if (s.includes('allocated') || s.includes('pro')) {
            return { bg: '#e0f2fe', text: '#0369a1', label: 'Allocated' };
        }
        return { bg: '#f3f4f6', text: '#4b5563', label: status };
    };

    const statusStyle = getStatusStyle(status);

    return (
        <TouchableOpacity
            activeOpacity={0.88}
            onPress={onPress}
            style={styles.card}
        >
            {/* Top Row: Organisation + Status */}
            <RRow style={styles.header}>
                <RRow style={styles.orgRow}>
                    <MaterialCommunityIcons
                        name="domain"
                        size={26}
                        color={colors.primary[700] || '#6d28d9'}
                    />
                    <Text
                        style={styles.orgName}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {organisation_Name || 'Unknown Organisation'}
                    </Text>
                </RRow>
            </RRow>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Middle: Project */}
            <RRow style={styles.detailRow}>
                <MaterialCommunityIcons
                    name="lightbulb-outline"
                    size={22}
                    color="#6b7280"
                />
                <Text
                    style={styles.detailText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    {project || 'No project specified'}
                </Text>
            </RRow>

            {/* Bottom: Date */}
            <RRow style={styles.detailRow}>
                <MaterialCommunityIcons
                    name="calendar-clock-outline"
                    size={22}
                    color="#6b7280"
                />
                <Text style={styles.detailText}>
                    {dateCreated ? new Date(dateCreated).toLocaleDateString('en-ZA') : '—'}
                </Text>
            </RRow>

            {/* status */}
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {statusStyle.label}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orgRow: {
        flex: 1,
        alignItems: 'center',
        gap: 12,
    },
    orgName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
        minWidth: 110,
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 12,
    },
    detailRow: {
        alignItems: 'center',
        gap: 12,
        marginVertical: 6,
    },
    detailText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
});

export default AppTrackingItem;