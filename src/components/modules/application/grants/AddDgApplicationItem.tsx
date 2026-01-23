import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import { Text } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { RCol, RDivider, RRow } from '@/components/common';
import colors from '@/config/colors';
import { activeWindow, DiscretionaryProjectDto } from '@/core/models/DiscretionaryDto';

interface AddDgApplicationItemProps {
  onPress: (id?: number) => void;
  item?: activeWindow;
}

const AddDgApplicationItem: FC<AddDgApplicationItemProps> = ({ onPress, item }) => {
  if (!item) return null;

  const {
    id,
    focusArea,
    title, intervention,
    subCategory,
    activeYN, projType
  } = item;

  const statusColor = activeYN ? colors.green[600] : colors.red[600];
  const statusIcon = activeYN ? 'check-circle' : 'x-circle';
  const statusText = activeYN ? 'active' : 'inactive';

  return (
    <RCol style={styles.container}>
      {/* Header */}
      <RRow style={styles.header}>
        <MaterialCommunityIcons name="application-outline" size={20} color={colors.slate[700]} />
        <Text variant="titleMedium" style={styles.headerText}>
          {title || 'Unnamed Application'}
        </Text>
      </RRow>

      <RDivider />

      {/* Content rows */}
      <View style={styles.fields}>
        <Field label="Focus Area" value={focusArea} />
        <Field label="Type" value={projType ? projType : 'unknown'} />
        <Field label="Intervention" value={intervention ? intervention : 'unknown'} />
        <Field label="Sub-Category" value={subCategory ? subCategory : 'unknown'} last />
      </View>

      {/* Status */}
      <RRow style={styles.statusRow}>
        <Feather name={statusIcon} size={16} color={statusColor} />
        <Text variant="labelMedium" style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </Text>
      </RRow>

      {/* Floating action button */}
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={() => onPress(id)}
      >
        <Feather name="plus" size={22} color="white" />
      </TouchableOpacity>
    </RCol>
  );
};

export default AddDgApplicationItem;

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

type FieldProps = {
  label: string;
  value?: string;
  last?: boolean;
};

const Field: FC<FieldProps> = ({ label, value, last }) => (
  <RRow style={[styles.fieldRow, last && styles.lastField]}>
    <Text variant="labelSmall" style={styles.label}>
      {label}
    </Text>
    <Text variant="bodyMedium" style={styles.value}>
      {value || '—'}
    </Text>
  </RRow>
);

// ────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.slate[200],
    padding: 14,
    paddingTop: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    marginTop: 8
  },

  header: {
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    color: colors.slate[800],
    flex: 1,
    fontWeight: '600',
  },

  fields: {
    gap: 8,
  },
  fieldRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  lastField: {
    marginBottom: 4,
  },
  label: {
    color: colors.slate[500],
    fontSize: 13,
    letterSpacing: 0.2,
  },
  value: {
    color: colors.slate[800],
    fontSize: 13.5,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    flexWrap: 'wrap',
  },

  statusRow: {
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.slate[100],
  },
  statusText: {
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  addButton: {
    position: 'absolute',
    top: -18,
    right: -12,
    backgroundColor: colors.primary[700],
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.primary[900],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 5,
  },
});