import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { moderateScale, scale } from '@/utils/responsive'
import React, { ReactNode, useEffect, useRef } from 'react'
import { RButton, RErrorMessage, RInput, RListLoading, RRow, Scroller } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Formik } from 'formik'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { showToast } from '@/core'
import { UpdateProfileRequest } from '@/core/models/UserDto'
import * as Yup from 'yup'
import { useGetPersonByUserIdQuery } from '@/store/api/api'
import { getDesignation } from '@/core/utils/designation'
import { Ionicons } from '@expo/vector-icons';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('First name is required'),
    surname: Yup.string().required('Last name is required'),
    userName: Yup.string().required('Username is required'),
});

const AccountSettingsPage = () => {
    const { user, error, isLoading } = useSelector((state: RootState) => state.auth);

    const { data: sdfData, isLoading: sdfLoading, error: sdfError } = useGetPersonByUserIdQuery(user?.id, { skip: !user?.id });

    const person = sdfData?.result.person;

    const [showForm, setShowForm] = React.useState(false);

    const { updateProfile } = UseAuth();

    const prevErrorRef = useRef<typeof error | typeof sdfError>(null);

    const initials = (
        `${person?.firstname?.[0] ?? user?.firstName?.[0] ?? ''}${person?.lastname?.[0] ?? user?.lastName?.[0] ?? ''}`
    ).toUpperCase() || '?';
    const fullName = person
        ? `${person.firstname ?? ''} ${person.lastname ?? ''}`.trim()
        : user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '';

    const initialValues = {
        name: user?.firstName || '',
        surname: user?.lastName || '',
        userName: user?.username || '',
        emailAddress: user?.email || ''
    }

    useEffect(() => {
        if (error && !prevErrorRef.current) {
            showToast({ message: error.message, type: "error", title: "Update Failed", position: "top" })
        }
        if (sdfError && !prevErrorRef.current) {
            showToast({ message: sdfError.toString(), type: "error", title: "Fetching Failed", position: "top" })
        }
        prevErrorRef.current = error || sdfError;
    }, [error, sdfError])

    async function handleSubmit(values: UpdateProfileRequest) {
        const result = await updateProfile({
            userName: values.userName,
            name: values.name,
            surname: values.surname,
            emailAddress: values.emailAddress
        });

        if (result.type === 'auth/updateProfile/fulfilled') {
            showToast({ message: "Profile updated successfully", type: "success", title: "Success", position: "top" });
            setShowForm(false);
        }
    }

    if (sdfLoading) {
        return <RListLoading count={4} />;
    }

    return (
        <>
            <RHeader name='Account Settings' />

            {/* Profile mini-banner */}
            <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.heroBanner}>
                <View style={styles.heroAvatar}>
                    <Text style={styles.heroInitials}>{initials}</Text>
                </View>
                <View style={styles.heroInfo}>
                    <Text style={styles.heroName}>{fullName || 'My Account'}</Text>
                    <Text style={styles.heroEmail}>{user?.email ?? ''}</Text>
                    {user?.isEmailConfirmed !== undefined && (
                        <View style={[styles.verifiedBadge, !user.isEmailConfirmed && styles.unverifiedBadge]}>
                            <MaterialIcons
                                name={user.isEmailConfirmed ? 'verified' : 'cancel'}
                                size={moderateScale(12)}
                                color={user.isEmailConfirmed ? colors.emerald[600] : colors.red[500]}
                            />
                            <Text style={[styles.verifiedText, !user.isEmailConfirmed && styles.unverifiedText]}>
                                {user.isEmailConfirmed ? 'Email Verified' : 'Email Unverified'}
                            </Text>
                        </View>
                    )}
                </View>
            </Animated.View>

            <Scroller contentContainerStyle={styles.scrollContent}>
                {/* alert */}
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="warning-outline"
                            size={moderateScale(16)}
                            color="#854d0e"
                        />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.message}>Details can't be edited due to company policy.</Text>
                    </View>
                </View>


                {!showForm && (
                    <>
                        <InfoCard title='Personal Identification' icon='person' delay={0}>
                            <FieldRow label='Title' value={person?.title} />
                            <FieldRow label='First Name' value={person?.firstname} />
                            <FieldRow label='Last Name' value={person?.lastname} />
                            <FieldRow label='Middle Names' value={person?.middlenames} />
                            <FieldRow label='Gender' value={person?.gender ? (person.gender === 'M' ? 'Male' : 'Female') : undefined} />
                            <FieldRow label='Date of Birth' value={person?.dob ? new Date(person.dob).toLocaleString('en-za', { day: '2-digit', month: 'short', year: 'numeric' }) : undefined} />
                            <FieldRow label='ID Number' value={person?.saidnumber} last />
                        </InfoCard>

                        <InfoCard title='Nationality & Citizenship' icon='public' delay={60}>
                            <FieldRow label='Citizenship' value={person?.citizenship} />
                            <FieldRow label='Nationality' value={person?.nationality} />
                            <FieldRow label='Language' value={person?.language} last />
                        </InfoCard>

                        <InfoCard title='Contact Information' icon='contacts' delay={120}>
                            <FieldRow label='Email' value={person?.email} />
                            <FieldRow label='Cellphone' value={person?.cellphone} />
                            <FieldRow label='Phone' value={person?.phone} last />
                        </InfoCard>

                        <InfoCard title='Professional Details' icon='work' delay={180}>
                            <FieldRow label='Designation' value={person?.designation ? getDesignation(person.designation) : undefined} />
                            <FieldRow label='Equity' value={person?.equity} last />
                        </InfoCard>
                    </>
                )}

                {/* Edit profile toggle */}
                <Animated.View entering={FadeInDown.delay(220).duration(400).springify()} style={showForm ? styles.editToggleOverlay : undefined}>
                    <TouchableOpacity style={styles.editToggleBtn} onPress={() => setShowForm(v => !v)} activeOpacity={0.75}>
                        <MaterialCommunityIcons
                            name={showForm ? 'chevron-up' : 'pencil-outline'}
                            size={moderateScale(18)}
                            color={colors.primary[600]}
                        />
                        <Text style={styles.editToggleText}>
                            {showForm ? 'Cancel Editing' : 'Edit Login Details'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {showForm && (
                    <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.formSection}>
                        <Text style={styles.formSectionTitle}>Update Login Details</Text>
                        <Formik<UpdateProfileRequest>
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit: formSubmit }) => (
                                <View style={styles.formFields}>
                                    <View>
                                        <Text style={styles.fieldLabel}>First Name</Text>
                                        <RInput
                                            placeholder='First Name'
                                            value={values.name}
                                            onChangeText={handleChange('name')}
                                            onBlur={handleBlur('name')}
                                        />
                                        {errors.name && touched.name && <RErrorMessage error={errors.name} />}
                                    </View>

                                    <View>
                                        <Text style={styles.fieldLabel}>Last Name</Text>
                                        <RInput
                                            placeholder='Last Name'
                                            value={values.surname}
                                            onChangeText={handleChange('surname')}
                                            onBlur={handleBlur('surname')}
                                        />
                                        {errors.surname && touched.surname && <RErrorMessage error={errors.surname} />}
                                    </View>

                                    <View>
                                        <Text style={styles.fieldLabel}>Username</Text>
                                        <RInput
                                            placeholder='Username'
                                            value={values.userName}
                                            onChangeText={handleChange('userName')}
                                            onBlur={handleBlur('userName')}
                                        />
                                        {errors.userName && touched.userName && <RErrorMessage error={errors.userName} />}
                                    </View>

                                    <View>
                                        <RRow style={styles.emailLabelRow}>
                                            <Text style={styles.fieldLabel}>Email Address</Text>
                                            <View style={[styles.verifiedBadge, !user?.isEmailConfirmed && styles.unverifiedBadge]}>
                                                <MaterialIcons
                                                    name={user?.isEmailConfirmed ? 'verified' : 'cancel'}
                                                    size={moderateScale(11)}
                                                    color={user?.isEmailConfirmed ? colors.emerald[600] : colors.red[500]}
                                                />
                                                <Text style={[styles.verifiedText, !user?.isEmailConfirmed && styles.unverifiedText]}>
                                                    {user?.isEmailConfirmed ? 'Verified' : 'Unverified'}
                                                </Text>
                                            </View>
                                        </RRow>
                                        <RInput
                                            placeholder={user?.email || 'Email address'}
                                            value={values.emailAddress}
                                            editable={false}
                                            customStyle={styles.disabledInput}
                                        />
                                        <Text style={styles.disabledHint}>Email cannot be changed here. Contact support.</Text>
                                    </View>

                                    <RButton
                                        title='Save Changes'
                                        onPressButton={formSubmit}
                                        styleBtn={styles.saveBtn}
                                        isSubmitting={isLoading}
                                    />
                                </View>
                            )}
                        </Formik>
                    </Animated.View>
                )}
            </Scroller>
        </>
    )
}

// ─── Field row ───────────────────────────────────────────────────────────────
interface FieldRowProps { label: string; value?: string | null; last?: boolean }
function FieldRow({ label, value, last }: FieldRowProps) {
    return (
        <>
            <View style={fieldRowStyles.row}>
                <Text style={fieldRowStyles.label}>{label}</Text>
                <Text style={fieldRowStyles.value} numberOfLines={1}>{value || 'N/A'}</Text>
            </View>
            {!last && <View style={fieldRowStyles.divider} />}
        </>
    )
}
const fieldRowStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: scale(11),
        paddingHorizontal: scale(16),
        gap: scale(12),
    },
    label: {
        fontSize: moderateScale(13),
        color: colors.slate[500],
        fontWeight: '500',
        flex: 1,
    },
    value: {
        fontSize: moderateScale(13),
        color: colors.slate[900],
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
        textTransform: 'capitalize',
    },
    divider: {
        height: 1,
        backgroundColor: colors.slate[100],
        marginLeft: scale(16),
    },
})

// ─── Info card ────────────────────────────────────────────────────────────────
interface InfoCardProps { children?: ReactNode; title?: string; icon?: string; delay?: number }
function InfoCard({ children, title, icon, delay = 0 }: InfoCardProps) {
    return (
        <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()} style={infoCardStyles.card}>
            {title && (
                <View style={infoCardStyles.header}>
                    {icon && (
                        <View style={infoCardStyles.iconWrap}>
                            <MaterialIcons name={icon as any} size={moderateScale(16)} color={colors.primary[600]} />
                        </View>
                    )}
                    <Text style={infoCardStyles.title}>{title}</Text>
                </View>
            )}
            {children}
        </Animated.View>
    )
}
const infoCardStyles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: colors.slate[100],
        overflow: 'hidden',
        shadowColor: colors.slate[900],
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(10),
        paddingHorizontal: scale(16),
        paddingVertical: scale(12),
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
        backgroundColor: colors.slate[50],
    },
    iconWrap: {
        width: scale(30),
        height: scale(30),
        borderRadius: scale(8),
        backgroundColor: colors.primary[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: colors.slate[800],
    },
})

export default AccountSettingsPage

const styles = StyleSheet.create({
    // Hero banner
    heroBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(14),
        paddingHorizontal: scale(16),
        paddingVertical: scale(16),
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
    },
    heroAvatar: {
        width: scale(52),
        height: scale(52),
        borderRadius: scale(26),
        backgroundColor: colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary[300],
    },
    heroInitials: {
        fontSize: moderateScale(18),
        fontWeight: '700',
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
        color: colors.slate[900],
    },
    heroEmail: {
        fontSize: moderateScale(12),
        color: colors.slate[500],
        fontWeight: '500',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scale(4),
        alignSelf: 'flex-start',
        backgroundColor: colors.emerald[50],
        borderWidth: 1,
        borderColor: colors.emerald[200],
        borderRadius: scale(20),
        paddingHorizontal: scale(7),
        paddingVertical: scale(2),
        marginTop: scale(4),
    },
    unverifiedBadge: {
        backgroundColor: colors.red[50],
        borderColor: colors.red[200],
    },
    verifiedText: {
        fontSize: moderateScale(10),
        fontWeight: '700',
        color: colors.emerald[600],
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    unverifiedText: {
        color: colors.red[500],
    },
    // Scroll
    scrollContent: {
        paddingHorizontal: scale(16),
        paddingTop: scale(16),
        paddingBottom: scale(40),
        gap: scale(12),
    },
    // Edit toggle button
    editToggleOverlay: {
        marginTop: scale(16),
        shadowColor: colors.slate[900],
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
        elevation: 0,
    },
    editToggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: scale(8),
        paddingVertical: scale(14),
        borderRadius: scale(12),
        borderWidth: 1.5,
        borderColor: colors.primary[300],
        borderStyle: 'dashed',
        backgroundColor: colors.primary[50],
    },
    editToggleText: {
        fontSize: moderateScale(14),
        fontWeight: '600',
        color: colors.primary[600],
    },
    disabledInput: {
        backgroundColor: colors.slate[100],
        borderColor: colors.slate[200],
        opacity: 0.7,
    },
    disabledHint: {
        fontSize: moderateScale(11),
        color: colors.slate[400],
        marginTop: scale(4),
        fontStyle: 'italic',
    },
    // Form section
    formSection: {
        backgroundColor: colors.white,
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: colors.slate[100],
        overflow: 'hidden',
        shadowColor: colors.slate[900],
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
        padding: scale(16),
    },
    formSectionTitle: {
        fontSize: moderateScale(14),
        fontWeight: '700',
        color: colors.slate[800],
        marginBottom: scale(16),
    },
    formFields: {
        gap: scale(12),
    },
    fieldLabel: {
        fontSize: moderateScale(12),
        fontWeight: '600',
        color: colors.slate[500],
        marginBottom: scale(6),
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    emailLabelRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: scale(6),
    },
    saveBtn: {
        backgroundColor: colors.primary[600],
        borderRadius: scale(10),
        marginTop: scale(8),
    },
    //alert
    container: {
        backgroundColor: colors.secondary[50],
        borderLeftWidth: 5,
        borderLeftColor: colors.secondary[500],
        borderRadius: scale(12),
        padding: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 0,
        marginVertical: scale(8),
    },
    iconContainer: {
        marginRight: scale(12),
        backgroundColor: colors.secondary[200],
        width: scale(20),
        height: scale(20),
        borderRadius: scale(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: '#854d0e',
        marginBottom: scale(2),
    },
    message: {
        fontSize: moderateScale(15),
        color: '#713f12',
        lineHeight: moderateScale(22),
    },
    closeButton: {
        padding: scale(4),
        marginLeft: scale(8),
    },
})