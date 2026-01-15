import React, { FC } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/config/colors';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { MandatoryApplicationDto } from '@/core/models/MandatoryDto';

interface Props {
    item: MandatoryApplicationDto;
}

const ApplicationItem: FC<Props> = ({ item }) => {
    const { applicationDetails } = usePageTransition();
    const { description, referenceNo, submissionDte, grantStatus, organisationId, id } = item;

    // Format date nicely (South Africa style)
    const formattedDate = submissionDte
        ? new Date(submissionDte).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(',', '')
        : '—';

    // Extract clean title
    const title = description?.split('-')[0]?.trim() || 'Mandatory Grant';

    // Dynamic status styling
    const getStatusStyle = (status: string = '') => {
        const s = status.toLowerCase().trim();
        if (s.includes('approved') || s.includes('completed') || s.includes('review completed')) {
            return { bg: '#d1fae5', text: '#065f46' }; // emerald/green
        }
        if (s.includes('submitted') || s.includes('pending')) {
            return { bg: '#fef3c7', text: '#92400e' }; // amber
        }
        if (s.includes('rejected') || s.includes('declined')) {
            return { bg: '#fee2e2', text: '#991b1b' }; // red
        }
        return { bg: '#f3f4f6', text: '#4b5563' }; // gray
    };

    const statusStyle = getStatusStyle(grantStatus);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => applicationDetails({
                appId: String(id),
                orgId: String(organisationId),
                type: "mg-app"
            })}
            style={styles.card}
        >
            {/* Header with icon + title */}
            <View style={styles.header}>
                <MaterialCommunityIcons
                    name="file-document-multiple-outline"
                    size={22}
                    color={colors.primary[500] || '#6366f1'}
                />
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                    {title}
                </Text>
            </View>

            {/* Status badge */}
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {grantStatus || 'Unknown'}
                </Text>
            </View>

            <View style={styles.divider} />

            {/* Details grid */}
            <View style={styles.details}>
                <DetailRow
                    label="Reference"
                    value={referenceNo || '—'}
                />
                <DetailRow
                    label="Title"
                    value={description || '—'}
                />
                <DetailRow
                    label="Date Submitted"
                    value={formattedDate}
                />
            </View>

            {/* Optional: subtle chevron to indicate tappable */}
            <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#9ca3af"
                style={styles.chevron}
            />
        </TouchableOpacity>
    );
};

// Reusable row component
const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
            {value}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        position: 'relative', // for chevron
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 999,
        marginBottom: 16,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginBottom: 16,
    },
    details: {
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        color: '#6b7280',
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },
    chevron: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
});

export default ApplicationItem;