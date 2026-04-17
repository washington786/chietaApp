import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale, scale } from '@/utils/responsive';
import { DGProjectDetailsAppItem } from '@/core/models/DiscretionaryDto';
import colors from '@/config/colors';

const ProjectDetailRenderItem = ({ item }: { item: DGProjectDetailsAppItem }) => {
  const project = item.projectDetails;

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
    marginHorizontal: scale(16),
    marginVertical: scale(10),
    borderRadius: scale(16),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gradientBackground: {
    padding: scale(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(20),
  },
  statusText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: scale(12),
  },
  detailsGrid: {
    gap: scale(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCompact: {
    marginTop: scale(4),
  },
  label: {
    fontSize: moderateScale(14),
    color: '#555',
    flex: 1,
  },
  labelCompact: {
    fontSize: moderateScale(13),
  },
  value: {
    fontSize: moderateScale(14),
    color: '#222',
    fontWeight: '500',
    textAlign: 'right',
  },
  valueHighlight: {
    color: colors.gray[500],
  },
  valueBold: {
    fontWeight: '700',
    fontSize: moderateScale(15),
  },
});

export default ProjectDetailRenderItem;