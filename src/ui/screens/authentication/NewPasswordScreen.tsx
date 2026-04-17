import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Formik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'

import { SuccessWrapper } from '@/components/modules/authentication'
import AuthScreenLayout, { authScreenStyles } from '@/components/modules/authentication/AuthScreenLayout'
import AuthGradientButton from '@/components/modules/authentication/AuthGradientButton'
import { RErrorMessage, RInput, RLoaderAnimation } from '@/components/common'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { newPasswordSchema, showToast } from '@/core'
import colors from '@/config/colors'
import { RootState, AppDispatch } from '@/store/store'
import { clearResetState } from '@/store/slice/PasswordResetSlice'
import { clearError } from '@/store/slice/AuthSlice'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { moderateScale, scale } from '@/utils/responsive'

interface NewPasswordFormValues {
    password: string
    confirmPassword: string
}

const initialValues: NewPasswordFormValues = {
    password: '',
    confirmPassword: ''
}

// ── Step flow ───────────────────────────────────────────────────────────────────
const STEPS = [{ n: 1, label: 'Email' }, { n: 2, label: 'OTP' }, { n: 3, label: 'Reset' }];
function StepFlow({ current }: { current: number }) {
    return (
        <View style={sfStyles.row}>
            {STEPS.map((step, i) => (
                <React.Fragment key={step.n}>
                    <View style={sfStyles.step}>
                        <View style={[sfStyles.circle, step.n <= current && sfStyles.circleActive]}>
                            {step.n < current
                                ? <MaterialCommunityIcons name='check' size={moderateScale(12)} color='#fff' />
                                : <Text style={[sfStyles.num, step.n === current && sfStyles.numActive]}>{step.n}</Text>
                            }
                        </View>
                        <Text style={[sfStyles.label, step.n === current && sfStyles.labelActive]}>{step.label}</Text>
                    </View>
                    {i < STEPS.length - 1 && (
                        <View style={[sfStyles.connector, step.n < current && sfStyles.connectorDone]} />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
}
const sfStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' },
    step: { alignItems: 'center', gap: scale(6), width: scale(56) },
    circle: { width: scale(30), height: scale(30), borderRadius: scale(15), backgroundColor: '#f3f4f6', borderWidth: 1.5, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
    circleActive: { backgroundColor: colors.primary[700], borderColor: colors.primary[600] },
    num: { fontSize: moderateScale(12), fontWeight: '700', color: '#9ca3af' },
    numActive: { color: '#fff' },
    label: { fontSize: moderateScale(10), fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.4 },
    labelActive: { color: colors.primary[700] },
    connector: { flex: 1, height: 1.5, backgroundColor: '#e5e7eb', marginTop: scale(14) },
    connectorDone: { backgroundColor: colors.primary[600] },
});

// ── Password strength + hints ───────────────────────────────────────────────────
function getStrength(pw: string) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (pw.length >= 12) s++;
    const levels = [
        { label: 'Too short', color: '#ef4444' },
        { label: 'Weak', color: '#f97316' },
        { label: 'Fair', color: '#eab308' },
        { label: 'Good', color: '#22c55e' },
        { label: 'Strong', color: '#16a34a' },
    ];
    return { score: s, ...levels[Math.min(s, 4)] };
}

const PASSWORD_REQUIREMENTS = [
    { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
    { label: 'One uppercase letter (A–Z)', test: (pw: string) => /[A-Z]/.test(pw) },
    { label: 'One number (0–9)', test: (pw: string) => /[0-9]/.test(pw) },
];

function PasswordHints({ password }: { password: string }) {
    if (!password) return null;
    const { score, label, color } = getStrength(password);
    return (
        <View style={phStyles.wrap}>
            <View style={phStyles.barsRow}>
                <View style={phStyles.bars}>
                    {[0, 1, 2, 3, 4].map(i => (
                        <View key={i} style={[phStyles.bar, { backgroundColor: i <= score ? color : '#e5e7eb' }]} />
                    ))}
                </View>
                <Text style={[phStyles.strengthLabel, { color }]}>{label}</Text>
            </View>
            <View style={phStyles.reqs}>
                {PASSWORD_REQUIREMENTS.map((req) => {
                    const met = req.test(password);
                    return (
                        <View key={req.label} style={phStyles.reqRow}>
                            <MaterialCommunityIcons
                                name={met ? 'check-circle-outline' : 'circle-outline'}
                                size={moderateScale(13)}
                                color={met ? '#22c55e' : '#d1d5db'}
                            />
                            <Text style={[phStyles.reqText, { color: met ? '#374151' : '#9ca3af' }]}>{req.label}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
const phStyles = StyleSheet.create({
    wrap: { marginTop: scale(8), gap: scale(6) },
    barsRow: { flexDirection: 'row', alignItems: 'center', gap: scale(8) },
    bars: { flexDirection: 'row', gap: scale(4), flex: 1 },
    bar: { flex: 1, height: scale(3), borderRadius: 3 },
    strengthLabel: { fontSize: moderateScale(11), fontWeight: '700', minWidth: scale(52), textAlign: 'right' },
    reqs: { gap: scale(5) },
    reqRow: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
    reqText: { fontSize: moderateScale(11), fontWeight: '500' },
});

const NewPasswordScreen = () => {
    const { login } = usePageTransition()
    const dispatch = useDispatch<AppDispatch>()
    const { email, otp } = useSelector((state: RootState) => state.passwordReset)
    const { verifyOtp } = UseAuth()
    const { isLoading, error } = useSelector((state: RootState) => state.auth)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (values: NewPasswordFormValues) => {
        const { password } = values

        if (!email || !otp) {
            showToast({
                message: 'Missing email or OTP. Please go through the reset password flow again.',
                type: 'error',
                title: 'Error',
                position: 'top'
            })
            return
        }

        const result = await verifyOtp({
            email,
            otp,
            newPassword: password
        })

        if (result.type === 'auth/verifyOtp/fulfilled') {
            dispatch(clearResetState())
            setSuccess(true)
            showToast({
                message: 'Password reset successfully',
                type: 'success',
                title: 'Success',
                position: 'top'
            })
        }
    }

    useEffect(() => {
        if (error) {
            showToast({
                message: error.message,
                type: 'error',
                title: 'Error',
                position: 'top'
            })
            dispatch(clearError())
        }
    }, [error, dispatch])

    if (!email || !otp) {
        return (
            <AuthScreenLayout title='Error' subtitle='Email or OTP not found. Please start the reset process again.'>
                <View>
                    <RErrorMessage error='Email or OTP not found. Please start the reset process again.' />
                </View>
            </AuthScreenLayout>
        )
    }

    if (success) {
        return (
            <SuccessWrapper
                onPress={login}
                buttonTitle='Go to Login'
                title='Password Updated!'
                description='Your password has been reset successfully. You can now log in with your new password.'
            />
        )
    }

    return (
        <AuthScreenLayout title='New Password' subtitle='Create a strong password to secure your account.'>
            <StepFlow current={3} />
            <Formik
                initialValues={initialValues}
                validationSchema={newPasswordSchema}
                onSubmit={handleSubmit}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={authScreenStyles.formWrapper}>
                        <View>
                            <RInput
                                placeholder='New Password'
                                icon='lock'
                                secureTextEntry
                                onBlur={handleBlur('password')}
                                onChangeText={handleChange('password')}
                                value={values.password}
                                placeholderTextColor='#9ca3af'
                                customStyle={authScreenStyles.inputField}
                                style={styles.inputText}
                            />
                            <PasswordHints password={values.password} />
                        </View>
                        {errors.password && touched.password && <RErrorMessage error={errors.password} />}

                        <View>
                            <RInput
                                placeholder='Confirm Password'
                                icon='lock'
                                secureTextEntry
                                value={values.confirmPassword}
                                onBlur={handleBlur('confirmPassword')}
                                onChangeText={handleChange('confirmPassword')}
                                placeholderTextColor='#9ca3af'
                                customStyle={authScreenStyles.inputField}
                                style={styles.inputText}
                            />
                            {values.confirmPassword.length > 0 && (
                                <View style={styles.matchRow}>
                                    <MaterialCommunityIcons
                                        name={values.password === values.confirmPassword ? 'check-circle-outline' : 'close-circle-outline'}
                                        size={moderateScale(13)}
                                        color={values.password === values.confirmPassword ? '#22c55e' : '#ef4444'}
                                    />
                                    <Text style={[styles.matchText, { color: values.password === values.confirmPassword ? '#22c55e' : '#ef4444' }]}>
                                        {values.password === values.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                    </Text>
                                </View>
                            )}
                        </View>
                        {errors.confirmPassword && touched.confirmPassword && (
                            <RErrorMessage error={errors.confirmPassword} />
                        )}

                        <AuthGradientButton
                            title='Set New Password'
                            onPress={handleSubmit}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                        {isLoading && <RLoaderAnimation />}
                    </View>
                )}
            </Formik>
        </AuthScreenLayout>
    )
}

export default NewPasswordScreen

const styles = StyleSheet.create({
    inputText: { color: '#111827' },
    matchRow: { flexDirection: 'row', alignItems: 'center', gap: scale(5), marginTop: scale(6), marginHorizontal: scale(2) },
    matchText: { fontSize: moderateScale(11), fontWeight: '600' },
})
