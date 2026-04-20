import { StyleSheet, View } from 'react-native'
import { scale } from '@/utils/responsive'
import RHeader from '@/components/common/RHeader'
import { RButton, RInput, Scroller, RErrorMessage, SafeArea } from '@/components/common'
import Animated, { FadeInDown } from 'react-native-reanimated'
import colors from '@/config/colors'
import { Formik, FormikHelpers } from 'formik'
import { showToast } from '@/core'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { clearChangePasswordError } from '@/store/slice/AuthSlice'
import { changePasswordSchema } from '@/core/validators/newPasswordValidator'
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native-paper'

const ChangePassword = () => {
    const { changePassword } = UseAuth()
    const navigation = useNavigation()
    const dispatch = useDispatch<AppDispatch>()
    const { loading: isLoading, error } = useSelector(
        (state: RootState) => state.auth.changePasswordOp
    )
    // Clear stale errors on mount and unmount
    useEffect(() => {
        dispatch(clearChangePasswordError());
        return () => { dispatch(clearChangePasswordError()); };
    }, [dispatch]);

    const initialValues = {
        oldPassword: '',
        password: '',
        confirmPassword: ''
    }

    // Handle errors
    useEffect(() => {
        if (error) {
            showToast({
                message: error.message,
                type: "error",
                title: "Change Password Error",
                position: "top",
            })
        }
    }, [error])

    const handleSubmit = async (
        values: typeof initialValues,
        { resetForm }: FormikHelpers<typeof initialValues>
    ) => {
        const result = await changePassword({
            oldPassword: values.oldPassword,
            password: values.password,
            confirmPassword: values.confirmPassword
        })

        if (result.type === 'auth/changePassword/fulfilled') {
            showToast({
                message: "Password changed successfully",
                type: "success",
                title: "Success",
                position: "top",
            })
            resetForm()
            navigation.goBack()
        }
    }

    return (
        <SafeArea>
            <RHeader name='Change Password' />
            <Scroller style={styles.con}>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.anim}>

                    <View style={{ alignItems: 'center', gap: scale(8), backgroundColor: colors.secondary[100], borderRadius: scale(5), flexDirection: 'row', overflow: 'hidden', marginHorizontal: scale(0), padding: scale(12),marginBottom:scale(10) }}>
                        <Ionicons name='information-circle' size={24} color={colors.secondary[700]} />
                        <Text variant='bodySmall' style={{ color: colors.secondary[700], paddingRight: scale(12), width: '97%' }}>Please note once you've reset your password. You'll need to start using the new password to login to the IMS Portal</Text>
                    </View>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={changePasswordSchema}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                            <View style={styles.form}>
                                <RInput
                                    placeholder='Old Password'
                                    icon='lock'
                                    secureTextEntry
                                    onChangeText={handleChange('oldPassword')}
                                    onBlur={handleBlur('oldPassword')}
                                    value={values.oldPassword}
                                />
                                {errors.oldPassword && touched.oldPassword && (
                                    <RErrorMessage error={errors.oldPassword} />
                                )}

                                <RInput
                                    placeholder='New Password'
                                    icon='lock'
                                    secureTextEntry
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                />
                                {errors.password && touched.password && (
                                    <RErrorMessage error={errors.password} />
                                )}

                                <RInput
                                    placeholder='Confirm Password'
                                    icon='lock'
                                    secureTextEntry
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                />
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <RErrorMessage error={errors.confirmPassword} />
                                )}

                                <RButton
                                    title='Update Password'
                                    onPressButton={handleSubmit}
                                    styleBtn={styles.btn}
                                    isSubmitting={isLoading}
                                />
                            </View>
                        )}
                    </Formik>
                </Animated.View>
            </Scroller>
        </SafeArea>
    )
}

export default ChangePassword

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: scale(12),
        gap: scale(8),
        marginTop: scale(10)
    },
    btn: {
        backgroundColor: colors.primary[900],
        borderRadius: scale(5),
        marginTop: scale(30)
    },
    col: {
        marginVertical: scale(10)
    },
    anim: {
        gap: scale(8)
    },
    form: {
        gap: scale(12)
    }
})