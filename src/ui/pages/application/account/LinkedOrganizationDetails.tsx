import React, { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as NativeText,
} from 'react-native'
import { moderateScale, scale } from '@/utils/responsive'
import { SafeArea, RRow } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import {
  useGetOrganizationByIdQuery,
  useGetOrganizationPhysicalAddressQuery,
  useGetOrganizationPostalAddressQuery,
  useGetOrgBankQuery,
} from '@/store/api/api'
import colors from '@/config/colors'
import { OrganisationDto } from '@/core/models/organizationDto'
import { OrganisationPhysicalAddressDto, OrganisationPostalAddressDto } from '@/core/models/MandatoryDto'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Animated, { FadeInDown } from 'react-native-reanimated'
import usePageTransition from '@/hooks/navigation/usePageTransition'

type TabKey = 'details' | 'physical' | 'postal' | 'banking'

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'details', label: 'Details', icon: 'domain' },
  { key: 'physical', label: 'Physical', icon: 'map-marker-outline' },
  { key: 'postal', label: 'Postal', icon: 'mailbox-outline' },
  { key: 'banking', label: 'Banking', icon: 'bank-outline' },
]

const LinkedOrganizationDetails = () => {
  const route = useRoute<RouteProp<navigationTypes, 'organisationDetails'>>()
  const orgId = Number(route.params?.orgId)
  const [activeTab, setActiveTab] = useState<TabKey>('details')

  const { discretionaryGrants, mandatoryGrants } = usePageTransition()

  const { data: org, isLoading: orgLoading } = useGetOrganizationByIdQuery(orgId, { skip: !orgId })
  const { data: physical, isLoading: physLoading } = useGetOrganizationPhysicalAddressQuery(orgId, { skip: !orgId })
  const { data: postal, isLoading: postalLoading } = useGetOrganizationPostalAddressQuery(orgId, { skip: !orgId })
  const { data: bank, isLoading: bankLoading } = useGetOrgBankQuery(orgId, { skip: !orgId })

  const orgData = org as OrganisationDto | null
  const nameParts = (orgData?.organisationTradingName || orgData?.organisationName || '?').split(' ')
  const initials = nameParts.slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? '').join('') || '??'
  const statusActive = (orgData?.status || '').toLowerCase() === 'active'

  if (orgLoading) {
    return (
      <SafeArea>
        <RHeader name='Organisation Details' />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size='large' color={colors.primary[600]} />
          <NativeText style={styles.loadingText}>Loading organisation...</NativeText>
        </View>
      </SafeArea>
    )
  }

  return (
    <SafeArea>
      <RHeader name='Organisation Details' />

      {/* ── Hero Banner ── */}
      <Animated.View entering={FadeInDown.duration(350).springify()} style={styles.heroBanner}>
        <View style={styles.heroLeft}>
          <View style={styles.heroAvatar}>
            <NativeText style={styles.heroAvatarText}>{initials}</NativeText>
          </View>
          <View style={styles.heroInfo}>
            <NativeText style={styles.heroName} numberOfLines={2}>
              {orgData?.organisationTradingName || orgData?.organisationName || 'Organisation'}
            </NativeText>
            <NativeText style={styles.heroSdl}>SDL · {orgData?.sdlNo || '—'}</NativeText>
            <RRow style={styles.heroBadges}>
              <View style={[styles.badge, statusActive ? styles.badgeActive : styles.badgeInactive]}>
                <NativeText style={styles.badgeText}>
                  {(orgData?.status || 'Unknown').toUpperCase()}
                </NativeText>
              </View>
              {(orgData?.bbbeeLevel ?? 0) > 0 && (
                <View style={styles.badgeBbbee}>
                  <NativeText style={styles.badgeBbbeeText}>B-BBEE L{orgData!.bbbeeLevel}</NativeText>
                </View>
              )}
              {orgData?.typeOfEntity ? (
                <View style={styles.badgeEntity}>
                  <NativeText style={styles.badgeEntityText}>{orgData.typeOfEntity}</NativeText>
                </View>
              ) : null}
            </RRow>
          </View>
        </View>
      </Animated.View>

      {/* ── Action Buttons ── */}
      <Animated.View entering={FadeInDown.delay(80).duration(350).springify()} style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnDG]}
          onPress={() => discretionaryGrants({ orgId: String(orgId) })}
          activeOpacity={0.82}
        >
          <MaterialCommunityIcons name='file-chart-outline' size={moderateScale(18)} color={colors.white} />
          <NativeText style={styles.actionBtnText}>Discretionary Grants</NativeText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnMG]}
          onPress={() => mandatoryGrants({ orgId: String(orgId) })}
          activeOpacity={0.82}
        >
          <MaterialCommunityIcons name='clipboard-list-outline' size={moderateScale(18)} color={colors.white} />
          <NativeText style={styles.actionBtnText}>Mandatory Grants</NativeText>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Tab Bar ── */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name={tab.icon as any}
              size={moderateScale(16)}
              color={activeTab === tab.key ? colors.primary[600] : colors.slate[400]}
            />
            <NativeText style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </NativeText>
            {activeTab === tab.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Tab Content ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'details' && <DetailsTab org={orgData} />}
        {activeTab === 'physical' && <AddressTab address={physical as OrganisationPhysicalAddressDto | null} isLoading={physLoading} variant='physical' />}
        {activeTab === 'postal' && <AddressTab address={postal as OrganisationPostalAddressDto | null} isLoading={postalLoading} variant='postal' />}
        {activeTab === 'banking' && <BankingTab bank={bank} isLoading={bankLoading} />}
      </ScrollView>
    </SafeArea>
  )
}

// ─────────────────────────────────────────────────
// Shared card + row primitives
// ─────────────────────────────────────────────────
const InfoCard = ({
  title,
  icon,
  children,
  delay = 0,
}: {
  title: string
  icon: string
  children: React.ReactNode
  delay?: number
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(380).springify()} style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardIconChip}>
        <MaterialCommunityIcons name={icon as any} size={moderateScale(15)} color={colors.primary[600]} />
      </View>
      <NativeText style={styles.cardTitle}>{title}</NativeText>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </Animated.View>
)

const InfoRow = ({
  label,
  value,
  last,
}: {
  label: string
  value: string | number | null | undefined
  last?: boolean
}) => (
  <>
    <View style={styles.infoRow}>
      <NativeText style={styles.infoLabel}>{label}</NativeText>
      <NativeText style={styles.infoValue} numberOfLines={2}>
        {value != null && String(value).trim() !== '' ? String(value) : '—'}
      </NativeText>
    </View>
    {!last && <View style={styles.infoRowDivider} />}
  </>
)

const TabLoader = () => (
  <View style={styles.tabLoader}>
    <ActivityIndicator size='large' color={colors.primary[600]} />
  </View>
)

const EmptyState = ({ label }: { label: string }) => (
  <View style={styles.emptyState}>
    <MaterialCommunityIcons name='folder-open-outline' size={moderateScale(48)} color={colors.slate[300]} />
    <NativeText style={styles.emptyStateText}>{label}</NativeText>
  </View>
)

// ─────────────────────────────────────────────────
// Tab screens
// ─────────────────────────────────────────────────
const DetailsTab = ({ org }: { org: OrganisationDto | null }) => {
  if (!org) return <EmptyState label='Organisation details not available.' />

  const formatDate = (d: string | Date | undefined) => {
    if (!d) return '—'
    try {
      return new Date(String(d)).toLocaleDateString('en-ZA', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    } catch { return String(d) }
  }

  return (
    <>
      <InfoCard title='Basic Information' icon='information-outline' delay={0}>
        <InfoRow label='Organisation Name' value={org.organisationName} />
        <InfoRow label='Trading Name' value={org.organisationTradingName} />
        <InfoRow label='SDL Number' value={org.sdlNo} />
        <InfoRow label='Reg. Number' value={org.organisationRegistrationNumber} />
        <InfoRow label='Type of Entity' value={org.typeOfEntity} />
        <InfoRow label='Company Size' value={org.companySize} last />
      </InfoCard>

      <InfoCard title='Contact Information' icon='phone-outline' delay={70}>
        <InfoRow label='Contact Person' value={org.organisationContactName} />
        <InfoRow label='Email' value={org.organisationContactEmailAddress} />
        <InfoRow label='Phone' value={org.organisationContactPhoneNumber} />
        <InfoRow label='Cell' value={org.organisationContactCellNumber} />
        <InfoRow label='Fax' value={org.organisationFaxNumber} last />
      </InfoCard>

      <InfoCard title='Business Details' icon='briefcase-outline' delay={140}>
        <InfoRow label='Core Business' value={org.coreBusiness} />
        <InfoRow label='No. of Employees' value={org.numberOfEmployees} />
        <InfoRow label='Date Commenced' value={formatDate(org.dateBusinessCommenced)} />
        <InfoRow label='Chamber' value={org.chamber} />
        <InfoRow label='SIC Code' value={org.sicCode} />
        <InfoRow label='Parent SDL' value={org.parentSdlNumber} last />
      </InfoCard>

      <InfoCard title='Compliance & B-BBEE' icon='shield-check-outline' delay={210}>
        <InfoRow label='BBBEE Status' value={org.bbbeeStatus} />
        <InfoRow label='BBBEE Level' value={org.bbbeeLevel ? `Level ${org.bbbeeLevel}` : '—'} last />
      </InfoCard>

      <InfoCard title='Executive Officers' icon='account-star-outline' delay={280}>
        <InfoRow label='CEO' value={`${org.ceoName || ''} ${org.ceoSurname || ''}`.trim() || '—'} />
        <InfoRow label='CEO Email' value={org.ceoEmail} />
        <InfoRow label='Senior Rep.' value={`${org.seniorRepName || ''} ${org.seniorRepSurname || ''}`.trim() || '—'} />
        <InfoRow label='Rep. Email' value={org.seniorRepEmail} last />
      </InfoCard>
    </>
  )
}

const AddressTab = ({
  address,
  isLoading,
  variant,
}: {
  address: OrganisationPhysicalAddressDto | OrganisationPostalAddressDto | null
  isLoading: boolean
  variant: 'physical' | 'postal'
}) => {
  if (isLoading) return <TabLoader />
  if (!address) return <EmptyState label={`No ${variant} address on record.`} />

  return (
    <InfoCard
      title={variant === 'physical' ? 'Physical Address' : 'Postal Address'}
      icon={variant === 'physical' ? 'map-marker-outline' : 'mailbox-outline'}
      delay={0}
    >
      <InfoRow label='Address Line 1' value={address.addressLine1} />
      <InfoRow label='Address Line 2' value={address.addressLine2} />
      <InfoRow label='Suburb' value={address.suburb} />
      <InfoRow label='Area' value={address.area} />
      <InfoRow label='District' value={address.district} />
      <InfoRow label='Municipality' value={address.municipality} />
      <InfoRow label='Province' value={address.province} />
      <InfoRow label='Postal Code' value={address.postcode} last />
    </InfoCard>
  )
}

const BankingTab = ({ bank, isLoading }: { bank: any; isLoading: boolean }) => {
  if (isLoading) return <TabLoader />
  if (!bank) return <EmptyState label='No banking details on record.' />

  return (
    <InfoCard title='Banking Details' icon='bank-outline' delay={0}>
      <InfoRow label='Bank' value={bank.bankName} />
      <InfoRow label='Account Holder' value={bank.accountHolder} />
      <InfoRow label='Account Number' value={bank.accountNumber} />
      <InfoRow label='Branch Code' value={bank.branchCode} />
      <InfoRow label='Account Type' value={bank.accountType} last />
    </InfoCard>
  )
}

export default LinkedOrganizationDetails

// ─────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  /* Loading */
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(12),
  },
  loadingText: {
    fontSize: moderateScale(14),
    color: colors.slate[400],
    fontStyle: 'italic',
  },

  /* Hero banner */
  heroBanner: {
    backgroundColor: colors.primary[800],
    paddingHorizontal: scale(20),
    paddingVertical: scale(18),
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  heroAvatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  heroAvatarText: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  heroInfo: {
    flex: 1,
    gap: scale(3),
  },
  heroName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.white,
    lineHeight: moderateScale(21),
  },
  heroSdl: {
    fontSize: moderateScale(11),
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: scale(6),
    marginTop: scale(6),
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: scale(20),
    paddingHorizontal: scale(9),
    paddingVertical: scale(3),
  },
  badgeActive: {
    backgroundColor: colors.emerald[500],
  },
  badgeInactive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  badgeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  badgeBbbee: {
    borderRadius: scale(20),
    paddingHorizontal: scale(9),
    paddingVertical: scale(3),
    backgroundColor: colors.primary[500],
  },
  badgeBbbeeText: {
    fontSize: moderateScale(10),
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.4,
  },
  badgeEntity: {
    borderRadius: scale(20),
    paddingHorizontal: scale(9),
    paddingVertical: scale(3),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  badgeEntityText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },

  /* Action buttons */
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: scale(14),
    paddingVertical: scale(12),
    gap: scale(10),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(7),
    paddingVertical: scale(11),
    borderRadius: scale(12),
  },
  actionBtnDG: {
    backgroundColor: colors.primary[600],
  },
  actionBtnMG: {
    backgroundColor: colors.primary[800],
  },
  actionBtnText: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.2,
  },

  /* Tab bar */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(11),
    gap: scale(3),
    position: 'relative',
  },
  tabActive: {
    backgroundColor: colors.primary[50],
  },
  tabText: {
    fontSize: moderateScale(10),
    fontWeight: '600',
    color: colors.slate[400],
  },
  tabTextActive: {
    color: colors.primary[600],
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: scale(8),
    right: scale(8),
    height: 2,
    borderRadius: scale(2),
    backgroundColor: colors.primary[600],
  },

  /* Scroll */
  scroll: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },
  scrollContent: {
    padding: scale(14),
    paddingBottom: scale(32),
    gap: scale(12),
  },

  /* Info card */
  card: {
    backgroundColor: colors.white,
    borderRadius: scale(14),
    shadowColor: colors.slate[900],
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.slate[100],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    backgroundColor: colors.slate[50],
    paddingHorizontal: scale(14),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
  },
  cardIconChip: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(8),
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: moderateScale(12),
    fontWeight: '700',
    color: colors.slate[700],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBody: {
    paddingHorizontal: scale(14),
    paddingTop: scale(4),
    paddingBottom: scale(8),
  },

  /* Info rows */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: scale(11),
    gap: scale(8),
  },
  infoLabel: {
    fontSize: moderateScale(12),
    color: colors.slate[400],
    fontWeight: '500',
    flex: 0.42,
  },
  infoValue: {
    fontSize: moderateScale(13),
    color: colors.slate[800],
    fontWeight: '600',
    flex: 0.58,
    textAlign: 'right',
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: colors.slate[100],
  },

  /* Tab states */
  tabLoader: {
    paddingVertical: scale(48),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(48),
    gap: scale(12),
  },
  emptyStateText: {
    fontSize: moderateScale(13),
    color: colors.slate[400],
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: moderateScale(20),
  },
})
