import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { RErrorMessage, RInput, RLoaderAnimation } from '@/components/common';
import colors from '@/config/colors';
import { Formik } from 'formik';
import { resetPasswordSchema, showToast } from '@/core';
import UseAuth from '@/hooks/main/auth/UseAuth';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { ResetPasswordRequest } from '@/core/models/UserDto';
import { initializeReset } from '@/store/slice/PasswordResetSlice';
import AuthScreenLayout, { authScreenStyles } from '@/components/modules/authentication/AuthScreenLayout';
import AuthGradientButton from '@/components/modules/authentication/AuthGradientButton';
import { clearError } from '@/store/slice/AuthSlice';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
                                ? <MaterialCommunityIcons name='check' size={12} color='#fff' />
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
    step: { alignItems: 'center', gap: 6, width: 56 },
    circle: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
    circleActive: { backgroundColor: 'rgba(255,255,255,0.9)', borderColor: '#fff' },
    num: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.55)' },
    numActive: { color: colors.primary[800] },
    label: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.4 },
    labelActive: { color: 'rgba(255,255,255,0.9)' },
    connector: { flex: 1, height: 1.5, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 14 },
    connectorDone: { backgroundColor: 'rgba(255,255,255,0.7)' },
});

const ForgotPasswordScreen = () => {
    const { otp } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();

    const { resetPassword } = UseAuth();
    const { isLoading, error } = useSelector(
        (state: RootState) => state.auth
    );

    useEffect(() => {
        if (error) {
            showToast({
                message: error.message,
                type: "error",
                title: "Login Error",
                position: "top",
            });
            dispatch(clearError());
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
                        <RInput
                            placeholder='Email address'
                            icon={'mail'}
                            onChangeText={handleChange('email')}
                            placeholderTextColor='rgba(255,255,255,0.32)'
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType='email-address'
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />

                        {errors.email && touched.email && <RErrorMessage error={errors.email} />}

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
    inputText: {
        color: '#fff',
    },
});
