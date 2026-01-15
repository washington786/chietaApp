import React, { FC } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '@/config/colors'; // your color config
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { dgProject } from '@/core/models/DiscretionaryDto';
import { useDispatch } from 'react-redux';
import { setSelectedProject } from '@/store/slice/DiscretionarySlice';
import { isProjectClosed } from '@/core/utils/CheckClosed';

interface Props {
  item: dgProject;
}

const DgApplicationItem: FC<Props> = ({ item }) => {
  const { focusArea, sdlNo, projectStatus, projectEndDate: endDate, projType, projectNam: title, id, organisationId } = item;

  const { applicationDetails } = usePageTransition();
  const dispatch = useDispatch();

  const handlePress = () => {
    const isClosed = isProjectClosed(endDate);
    dispatch(setSelectedProject({ project: item, isClosed }));
    applicationDetails({ type: "dg-app", appId: `${id}`, orgId: `${organisationId}` });
  };

  // Dynamic status color
  const getStatusStyle = (status: string = '') => {
    const lower = status.toLowerCase();
    if (lower.includes('registered')) return { bg: colors.emerald[100], text: colors.emerald[700] };
    if (lower.includes('pending') || lower.includes('submitted')) return { bg: colors.secondary[100], text: colors.secondary[700] };
    if (lower.includes('approved')) return { bg: colors.blue[100], text: colors.blue[700] };
    if (lower.includes('closed') || lower.includes('rejected')) return { bg: colors.red[100], text: colors.red[700] };
    return { bg: colors.gray[200], text: colors.gray[700] };
  };

  const statusStyle = getStatusStyle(projectStatus);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={styles.card}
    >
      {/* Title Row */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="application-outline"
          size={20}
          color={colors.primary[400] || '#6366f1'}
        />
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title || 'Untitled Project'}
        </Text>
      </View>

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.statusText, { color: statusStyle.text }]}>
          {projectStatus || 'Unknown'}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Details */}
      <View style={styles.details}>
        <DetailRow label="SDL No" value={sdlNo || '-'} />
        <DetailRow
          label="Focus Area"
          value={
            focusArea && focusArea.length > 60
              ? focusArea.substring(0, 57) + '...'
              : focusArea || '-'
          }
        />
        <DetailRow label="Type" value={projType || '-'} />
        <DetailRow label="Closing Date" value={endDate || '-'} />
      </View>
    </TouchableOpacity>
  );
};

// Reusable row
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.slate?.[200] || '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    backgroundColor: colors.slate?.[200] || '#e2e8f0',
    marginVertical: 12,
  },
  details: {
    gap: 10,
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
    flexShrink: 1,
  },
});

export default DgApplicationItem;