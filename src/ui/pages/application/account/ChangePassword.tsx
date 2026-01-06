import { StyleSheet, View } from 'react-native'
import RHeader from '@/components/common/RHeader'
import { RButton, RInput, Scroller, RErrorMessage } from '@/components/common'
import Animated, { FadeInDown } from 'react-native-reanimated'
import colors from '@/config/colors'
import { Formik } from 'formik'
import { showToast } from '@/core'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { changePasswordSchema } from '@/core/validators/newPasswordValidator'

const ChangePassword = () => {
    const { changePassword } = UseAuth()
    const { isLoading, error } = useSelector(
        (state: RootState) => state.auth
    )

    const initialValues = {
        oldPassword: '',
        password: '',
        confirmPassword: ''
    }

    const handleSubmit = async (values: any) => {
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
        }
    }

    if (error) {
        showToast({
            message: error.message,
            type: "error",
            title: "Error",
            position: "top",
        })
    }

    return (
        <>
            <RHeader name='Change Password' />
            <Scroller style={styles.con}>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.anim}>
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
        </>
    )
}

export default ChangePassword

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
    form: {
        gap: 12
    }
})