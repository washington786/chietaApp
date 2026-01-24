import { StyleSheet } from 'react-native'
import React, { ReactNode, useEffect, useRef } from 'react'
import { RButton, RCol, RErrorMessage, RInput, RListLoading, RRow, Scroller } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import { Formik } from 'formik'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { showToast } from '@/core'
import { UpdateProfileRequest } from '@/core/models/UserDto'
import * as Yup from 'yup'
import { useGetPersonByUserIdQuery } from '@/store/api/api'
import { TextWrap } from '@/components/modules/application'
import { getDesignation } from '@/core/utils/designation'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('First name is required'),
    surname: Yup.string().required('Last name is required'),
    userName: Yup.string().required('Username is required'),
    emailAddress: Yup.string().email('Invalid email').required('Email is required'),
});

const AccountSettingsPage = () => {
    const { user, error, isLoading } = useSelector((state: RootState) => state.auth);

    const { data: sdfData, isLoading: sdfLoading, error: sdfError } = useGetPersonByUserIdQuery(user?.id, { skip: !user?.id });

    const person = sdfData?.result.person;

    const [showForm, setShowForm] = React.useState(false);

    const { open } = useGlobalBottomSheet();

    const { updateProfile } = UseAuth();

    const prevErrorRef = useRef<typeof error | typeof sdfError>(null);

    const initialValues = {
        name: user?.firstName || '',
        surname: user?.lastName || '',
        userName: user?.username || '',
        emailAddress: user?.email || ''
    }

    useEffect(() => {
        if (error && !prevErrorRef.current) {
            showToast({
                message: error.message,
                type: "error",
                title: "Update Failed",
                position: "top",
            })
        }
        if (sdfError && !prevErrorRef.current) {
            showToast({
                message: sdfError.toString(),
                type: "error",
                title: "Fetching Failed",
                position: "top",
            })
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
            showToast({
                message: "Profile updated successfully",
                type: "success",
                title: "Success",
                position: "top",
            });
        }
    }

    if (sdfLoading) {
        return <RListLoading count={4} />;
    }

    return (
        <>
            <RHeader name='Account Settings' />
            <Scroller style={styles.con}>
                <InfoCard title='Personal Identification' icon='person'>
                    <TextWrap desc='Title' title={person?.title || 'N/A'} />
                    <TextWrap desc='First Name' title={person?.firstname || 'N/A'} />
                    <TextWrap desc='Last Name' title={person?.lastname || 'N/A'} />
                    <TextWrap desc='Middle Names' title={person?.middlenames || 'N/A'} />
                    <TextWrap desc='Gender' title={person?.gender ? (person.gender === "M" ? "Male" : "Female") : 'N/A'} />
                    <TextWrap desc='DOB' title={person?.dob ? new Date(person.dob).toLocaleString('en-za', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'} />
                    <TextWrap desc='said number' title={person?.saidnumber || 'N/A'} />
                </InfoCard>

                <InfoCard title='Nationality & Citizenship' icon='public'>
                    <TextWrap desc='Citizenship' title={person?.citizenship || 'N/A'} />
                    <TextWrap desc='Nationality' title={person?.nationality || 'N/A'} />
                    <TextWrap desc='Language' title={person?.language || 'N/A'} />
                </InfoCard>

                <InfoCard title='Contact Information' icon='contacts'>
                    <TextWrap desc='Email' title={person?.email || 'N/A'} />
                    <TextWrap desc='Cellphone' title={person?.cellphone || 'N/A'} />
                    <TextWrap desc='Phone' title={person?.phone || 'N/A'} />
                </InfoCard>

                <InfoCard title='Professional / Organizational Attributes' icon='work'>
                    <TextWrap desc='Designation' title={person?.designation ? getDesignation(person.designation) : 'N/A'} />
                    <TextWrap desc='Equity' title={person?.equity || 'N/A'} />
                </InfoCard>

                {
                    showForm &&
                    <Animated.View entering={FadeInDown.duration(600)} style={styles.anim}>
                        <Formik<UpdateProfileRequest>
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                <>
                                    <RInput
                                        placeholder='First Name'
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                    />
                                    {errors.name && touched.name && <RErrorMessage error={errors.name} />}

                                    <RInput
                                        placeholder='Last Name'
                                        value={values.surname}
                                        onChangeText={handleChange('surname')}
                                        onBlur={handleBlur('surname')}
                                    />
                                    {errors.surname && touched.surname && <RErrorMessage error={errors.surname} />}

                                    <RInput
                                        placeholder='Username'
                                        value={values.userName}
                                        onChangeText={handleChange('userName')}
                                        onBlur={handleBlur('userName')}
                                    />
                                    {errors.userName && touched.userName && <RErrorMessage error={errors.userName} />}

                                    <VerificationContent
                                        state={user && user.isEmailConfirmed ? true : false}
                                        title=''
                                        textState='verified'
                                        textState2='unverified'
                                    />

                                    <RInput
                                        placeholder={user?.email || 'Email address'}
                                        value={values.emailAddress}
                                        onChangeText={handleChange('emailAddress')}
                                        onBlur={handleBlur('emailAddress')}
                                    />
                                    {errors.emailAddress && touched.emailAddress && <RErrorMessage error={errors.emailAddress} />}

                                    <RButton
                                        title='Update profile'
                                        onPressButton={handleSubmit}
                                        styleBtn={styles.btn}
                                        isSubmitting={isLoading}
                                    />
                                </>
                            )}
                        </Formik>
                    </Animated.View>
                }
            </Scroller>
        </>
    )
}

interface props {
    textState?: string;
    textState2?: string;
    state: boolean;
    title: string;
}
function VerificationContent({ state, textState, textState2 }: props) {
    return (
        <RCol>
            <RRow style={styles.verification}>
                <MaterialIcons name="verified" size={24} color={state ? colors.green[500] : colors.red[500]} />
                <Text>{state ? `${textState}` : `${textState2}`}</Text>
            </RRow>
        </RCol>
    )
}

interface InfoCardProps {
    children?: ReactNode;
    title?: string;
    icon?: string;
}
function InfoCard({ children, title, icon }: InfoCardProps) {
    return (
        <>
            {title &&
                <RRow style={{ alignItems: 'center', gap: 8, marginVertical: 5 }}>
                    {icon && <MaterialIcons name={icon as any} size={20} color={colors.slate[500]} />}
                    <Text variant='titleMedium'>{title}</Text>
                </RRow>
            }
            <RCol style={styles.card}>
                {children}
            </RCol>
        </>
    )
}

export default AccountSettingsPage

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 12,
        gap: 8,
        marginTop: 10
    },
    card: {
        padding: 12,
        backgroundColor: colors.zinc[50],
        borderRadius: 8,
        borderWidth: 0.4,
        borderColor: colors.zinc[300],
    },
    btn: {
        backgroundColor: colors.primary[900],
        borderRadius: 5,
        marginTop: 30
    },
    col: {
        marginVertical: 10
    },
    anim: {
        gap: 8
    },
    verification: {
        alignItems: 'center',
        gap: 6,
    },
    errorText: {
        color: colors.red[500],
        fontSize: 12,
        marginTop: -6,
    }
})