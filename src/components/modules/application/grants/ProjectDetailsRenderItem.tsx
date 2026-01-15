import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DGProjectDetailsAppItem } from '@/core/models/DiscretionaryDto';
import colors from '@/config/colors';

const ProjectDetailRenderItem = ({ item }: { item: DGProjectDetailsAppItem }) => {
  const project = item.projectDetails;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'registered':
        return '#4CAF50'; // green
      case 'pending':
        return '#FF9800'; // orange
      case 'approved':
        return '#2196F3'; // blue
      default:
        return '#757575'; // gray
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.cardContainer}
    >
      <LinearGradient
        colors={[`${colors.primary[50]}`, `${colors.slate[100]}`]}
        style={styles.gradientBackground}
      >
        {/* Header / Title */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {project.intervention}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(project.status) + '22' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(project.status) }
            ]}>
              {project.status}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content Grid */}
        <View style={styles.detailsGrid}>
          <DetailRow
            label="Focus Area"
            value={project.focusArea}
          />
          <DetailRow
            label="New Learners"
            value={project.number_New.toString()}
            highlight
          />
          <DetailRow
            label="Continuing"
            value={project.number_Continuing.toString()}
            highlight
          />
          <DetailRow
            label="Cost per Learner"
            value={`R ${project.costPerLearner.toLocaleString()}`}
            highlight
            bold
          />
          <DetailRow
            label="HDI | Female | Youth"
            value={`${project.hdi} | ${project.female} | ${project.youth}`}
            compact
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Reusable row component
const DetailRow = ({
  label,
  value,
  highlight = false,
  bold = false,
  compact = false
}: {
  label: string;
  value: string;
  highlight?: boolean;
  bold?: boolean;
  compact?: boolean;
}) => (
  <View style={[
    styles.row,
    compact && styles.rowCompact
  ]}>
    <Text style={[
      styles.label,
      compact && styles.labelCompact
    ]}>
      {label}:
    </Text>
    <Text style={[
      styles.value,
      highlight && styles.valueHighlight,
      bold && styles.valueBold
    ]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradientBackground: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  detailsGrid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCompact: {
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  labelCompact: {
    fontSize: 13,
  },
  value: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    textAlign: 'right',
  },
  valueHighlight: {
    color: '#1976d2',
  },
  valueBold: {
    fontWeight: '700',
    fontSize: 15,
  },
});

export default ProjectDetailRenderItem;