import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { RErrorMessage, RInput, RLoaderAnimation } from '@/components/common';
import colors from '@/config/colors';
import appFonts from '@/config/fonts';
import { Formik } from 'formik';
import { resetPasswordSchema, showToast } from '@/core';
import UseAuth from '@/hooks/main/auth/UseAuth';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { ResetPasswordRequest } from '@/core/models/UserDto';
import { initializeReset } from '@/store/slice/PasswordResetSlice';
import AuthScreenLayout, { authScreenStyles } from '@/components/modules/authentication/AuthScreenLayout';
import AuthGradientButton from '@/components/modules/authentication/AuthGradientButton';
import { clearResetPasswordError } from '@/store/slice/AuthSlice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { moderateScale, scale } from '@/utils/responsive';

const initialValues = {
    email: ''
}

// ── Step flow indicator ─────────────────────────────────────────────────────────
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

const ForgotPasswordScreen = () => {
    const { otp } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();

    const { resetPassword } = UseAuth();
    const { loading: isLoading, error } = useSelector(
        (state: RootState) => state.auth.resetPasswordOp
    );

    useEffect(() => {
        dispatch(clearResetPasswordError());
        return () => { dispatch(clearResetPasswordError()); };
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showToast({
                message: error.message,
                type: "error",
                title: "Reset Password Error",
                position: "top",
            });
            dispatch(clearResetPasswordError());
        }
    }, [error, dispatch]);

    const handleSubmit = async (values: ResetPasswordRequest) => {
        const { email } = values;
        const result = await resetPassword({
            email: email,
        });

        if (result.type === 'auth/resetPassword/fulfilled') {
            // Store email in Redux state for password reset flow
            dispatch(initializeReset({ email: email }));

            showToast({
                message: "One time pin sent to your email",
                type: "success",
                title: "Success",
                position: "top",
            });

            // Navigate to OTP screen without passing email as param
            otp();
        }
    }

    return (
        <AuthScreenLayout
            title='Reset Password'
            subtitle='Enter your registered email and we’ll send you a one-time PIN.'
        >
            <StepFlow current={1} />
            <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)} validationSchema={resetPasswordSchema}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={authScreenStyles.formWrapper}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <RInput
                                placeholder='Enter your email'
                                icon={'mail'}
                                iconColor={colors.primary[600]}
                                onChangeText={handleChange('email')}
                                placeholderTextColor='#9ca3af'
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType='email-address'
                                autoComplete='email'
                                returnKeyType='done'
                                onSubmitEditing={() => handleSubmit()}
                                customStyle={authScreenStyles.inputField}
                                style={styles.inputText}
                            />
                            {errors.email && touched.email && <RErrorMessage error={errors.email} />}
                        </View>

                        <AuthGradientButton
                            title='Send Reset Code'
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

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    inputGroup: {
        gap: scale(6),
        marginBottom: scale(20),
    },
    inputLabel: {
        fontSize: moderateScale(14),
        fontFamily: `${appFonts.semiBold}`,
        color: '#111827',
    },
    inputText: {
        color: '#111827',
    },
});
