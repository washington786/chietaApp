import { StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { RButton, RCol, RErrorMessage, RInput, RRow, Scroller } from '@/components/common'
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

const validationSchema = Yup.object().shape({
    name: Yup.string().required('First name is required'),
    surname: Yup.string().required('Last name is required'),
    userName: Yup.string().required('Username is required'),
    emailAddress: Yup.string().email('Invalid email').required('Email is required'),
});

const AccountSettingsPage = () => {
    const { user, error, isLoading } = useSelector((state: RootState) => state.auth);
    const { open } = useGlobalBottomSheet();

    console.log('====================================');
    console.log(user);
    console.log('====================================');

    const { updateProfile } = UseAuth();

    const prevErrorRef = useRef<typeof error>(null);

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
        prevErrorRef.current = error;
    }, [error])

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
            })
        }
    }

    return (
        <>
            <RHeader name='Account Settings' />
            <Scroller style={styles.con}>
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
            {/* <Text variant='labelSmall'>{title}</Text> */}
            <RRow style={styles.verification}>
                <MaterialIcons name="verified" size={24} color={state ? colors.green[500] : colors.red[500]} />
                <Text>{state ? `${textState}` : `${textState2}`}</Text>
            </RRow>
        </RCol>
    )
}

export default AccountSettingsPage

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 12,
        gap: 8,
        marginTop: 10
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