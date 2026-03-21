import { Animated, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AuthWrapper } from '@/components/modules/authentication';
import { RButton, RErrorMessage, RLogo, SafeArea, Scroller } from '@/components/common';

import usePageTransition from '@/hooks/navigation/usePageTransition';
import { Authstyles as styles } from '@/styles/AuthStyles';
import { Button } from 'react-native-paper';
import colors from '@/config/colors';
import appFonts from '@/config/fonts';
import { OtpInput } from "react-native-otp-entry";
import { Formik } from 'formik';
import { otpSchema, showToast } from '@/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
    setOtp,
    checkOtpExpiry,
    checkLockoutExpiry,
    verifyOtpBackend,
    resendOtpCode,
} from '@/store/slice/PasswordResetSlice';
import usePageEnterAnimation from '@/hooks/animations/usePageEnterAnimation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface OtpFormValues {
    otp: string
}

const initialValues: OtpFormValues = {
    otp: ''
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
    row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginVertical: 8 },
    step: { alignItems: 'center', gap: 6, width: 56 },
    circle: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
    circleActive: { backgroundColor: colors.primary[600], borderColor: colors.primary[500] },
    num: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.55)' },
    numActive: { color: '#fff' },
    label: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.4 },
    labelActive: { color: 'rgba(255,255,255,0.9)' },
    connector: { flex: 1, height: 1.5, backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 14 },
    connectorDone: { backgroundColor: colors.primary[500] },
});

const OtpScreen = () => {
    const { newPassword } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();
    const { animatedStyle } = usePageEnterAnimation({ initialOffset: 24 });

    // Get email and reset state from Redux
    const {
        email,
        otp: storedOtp,
        failedAttempts,
        maxAttempts,
        isLockedOut,
        lockoutExpiresAt,
        otpExpiresAt,
        resendAttempts,
        maxResendAttempts,
        lastResendAt,
        resendCooldownSeconds,
        isLoading,
        error: resetError,
    } = useSelector((state: RootState) => state.passwordReset);

    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<number | null>(null);
    const [canResendNow, setCanResendNow] = useState<boolean>(false);

    // Check OTP expiry and lockout status on mount and every second
    useEffect(() => {
        // Update time remaining
        if (otpExpiresAt) {
            const remaining = Math.ceil((otpExpiresAt - Date.now()) / 1000);
            setTimeRemaining(remaining > 0 ? remaining : 0);
        }

        if (isLockedOut && lockoutExpiresAt) {
            const remaining = Math.ceil((lockoutExpiresAt - Date.now()) / 1000);
            setLockoutTimeRemaining(remaining > 0 ? remaining : 0);
        }

        // Check if can resend
        if (resendAttempts < maxResendAttempts && lastResendAt) {
            const timeSinceLastResend = Math.floor(
                (Date.now() - lastResendAt) / 1000
            );
            setCanResendNow(timeSinceLastResend >= resendCooldownSeconds);
        }
    }, [otpExpiresAt, lockoutExpiresAt, isLockedOut, resendAttempts, lastResendAt])

    // Update timers every second
    useEffect(() => {
        const interval = setInterval(() => {
            // Update OTP expiry timer
            if (otpExpiresAt && !isLockedOut) {
                const remaining = Math.ceil((otpExpiresAt - Date.now()) / 1000);
                setTimeRemaining(remaining > 0 ? remaining : 0);
            }

            // Update lockout timer
            if (isLockedOut && lockoutExpiresAt) {
                const remaining = Math.ceil((lockoutExpiresAt - Date.now()) / 1000);
                setLockoutTimeRemaining(remaining > 0 ? remaining : 0);

                // Check if lockout has expired
                if (remaining <= 0) {
                    dispatch(checkLockoutExpiry());
                }
            }

            // Update resend cooldown
            if (lastResendAt && resendAttempts < maxResendAttempts) {
                const timeSinceLastResend = Math.floor(
                    (Date.now() - lastResendAt) / 1000
                );
                setCanResendNow(timeSinceLastResend >= resendCooldownSeconds);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [otpExpiresAt, lockoutExpiresAt, isLockedOut, lastResendAt, resendAttempts]);

    const handleSubmit = async (values: OtpFormValues) => {
        if (!email) {
            showToast({
                message: "Email not found. Please start the reset process again.",
                type: "error",
                title: "Error",
                position: "top",
            });
            return;
        }

        if (isLockedOut) {
            showToast({
                message: `Account locked. Try again in ${lockoutTimeRemaining} seconds.`,
                type: "error",
                title: "Account Locked",
                position: "top",
            });
            return;
        }

        // Verify OTP with backend
        const result = await dispatch(verifyOtpBackend({
            email: email,
            otp: values.otp
        }));

        if (result.type === 'passwordReset/verifyOtp/fulfilled') {
            dispatch(setOtp(values.otp))
            showToast({
                message: "OTP verified successfully. Please enter your new password.",
                type: "success",
                title: "Success",
                position: "top",
            });

            // Navigate to new password screen - email and otp are stored in Redux
            newPassword();
        } else {
            const errorMsg = typeof result.payload === 'string'
                ? result.payload
                : "Invalid OTP. Please try again."

            showToast({
                message: errorMsg,
                type: "error",
                title: "Verification Failed",
                position: "top",
            });
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            showToast({
                message: "Email not found. Please start the reset process again.",
                type: "error",
                title: "Error",
                position: "top",
            });
            return;
        }

        if (resendAttempts >= maxResendAttempts) {
            showToast({
                message: "Maximum resend attempts exceeded. Please try again later.",
                type: "error",
                title: "Too Many Attempts",
                position: "top",
            });
            return;
        }

        const result = await dispatch(resendOtpCode({ email: email }));

        if (result.type === 'passwordReset/resendOtp/fulfilled') {
            showToast({
                message: "OTP resent successfully to your email.",
                type: "success",
                title: "Code Resent",
                position: "top",
            });
        } else {
            const errorMsg = typeof result.payload === 'string'
                ? result.payload
                : "Failed to resend OTP. Please try again."

            showToast({
                message: errorMsg,
                type: "error",
                title: "Resend Failed",
                position: "top",
            });
        }
    };

    // Show error if email is missing
    if (!email) {
        return (
            <Scroller>
                <AuthWrapper>
                    <SafeArea>
                        <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                        <Animated.View style={[styles.content, animatedStyle]}>
                            <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500", textTransform: "capitalize" }]}>
                                Error
                            </Text>
                            <RErrorMessage error="Email not found. Please start the reset process again." />
                        </Animated.View>
                    </SafeArea>
                </AuthWrapper>
            </Scroller>
        );
    }

    // Show lockout message if account is locked
    if (isLockedOut) {
        return (
            <Scroller>
                <AuthWrapper>
                    <SafeArea>
                        <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                        <Animated.View style={[styles.content, animatedStyle]}>
                            <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "500", textTransform: "capitalize", color: colors.red[600] }]}>
                                Account Locked
                            </Text>
                            <Text style={[styles.description]}>
                                Too many failed attempts. Please wait {lockoutTimeRemaining} seconds before trying again.
                            </Text>
                        </Animated.View>
                    </SafeArea>
                </AuthWrapper>
            </Scroller>
        );
    }

    return (<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>        <Scroller>
        <AuthWrapper>
            <SafeArea>
                <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                <Animated.View style={[styles.content, animatedStyle]}>
                    <StepFlow current={2} />
                    <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "bold", textTransform: "capitalize" }]}>
                        Verify One-Time Password
                    </Text>
                    <Text style={[styles.description]}>
                        Enter the 6-digit code sent to {email}
                    </Text>

                    {resetError && (
                        <View style={{ marginBottom: 12 }}>
                            <RErrorMessage error={resetError} />
                        </View>
                    )}

                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => handleSubmit(values)}
                        validationSchema={otpSchema}
                    >
                        {({ setFieldValue, handleBlur, handleSubmit, errors, touched }) => (
                            <View style={{ gap: 8 }}>
                                <OtpInput
                                    numberOfDigits={6}
                                    onTextChange={(text) => setFieldValue('otp', text)}
                                    onBlur={() => handleBlur('otp')}
                                    focusColor={colors.primary[400]}
                                    type='numeric'
                                    disabled={isLoading}
                                    theme={{
                                        containerStyle: { marginVertical: 4 },
                                        inputsContainerStyle: { gap: 8 },
                                        pinCodeContainerStyle: {
                                            backgroundColor: 'rgba(255,255,255,0.08)',
                                            borderRadius: 14,
                                            borderWidth: 1.5,
                                            borderColor: 'rgba(255,255,255,0.22)',
                                            height: 54,
                                            width: 44,
                                        },
                                        pinCodeTextStyle: {
                                            color: '#fff',
                                            fontSize: 22,
                                            fontWeight: '700',
                                        },
                                        focusedPinCodeContainerStyle: {
                                            borderColor: colors.primary[400],
                                            backgroundColor: 'rgba(255,255,255,0.12)',
                                        },
                                    }}
                                />
                                {errors.otp && touched.otp && <RErrorMessage error={errors.otp} />}

                                {/* Attempts remaining */}
                                {failedAttempts > 0 && failedAttempts < maxAttempts && (
                                    <View style={{ marginVertical: 8 }}>
                                        <Text style={{
                                            fontSize: 12,
                                            color: colors.yellow['600'],
                                            fontFamily: `${appFonts.medium}`,
                                        }}>
                                            {maxAttempts - failedAttempts} attempt{maxAttempts - failedAttempts !== 1 ? 's' : ''} remaining
                                        </Text>
                                    </View>
                                )}

                                {/* OTP expiry warning */}
                                {timeRemaining !== null && timeRemaining < 60 && timeRemaining > 0 && (
                                    <View style={{ marginVertical: 8 }}>
                                        <Text style={{
                                            fontSize: 12,
                                            color: colors.yellow['600'],
                                            fontFamily: `${appFonts.medium}`,
                                        }}>
                                            Code expires in {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                                        </Text>
                                    </View>
                                )}

                                {/* OTP expired */}
                                {timeRemaining === 0 && (
                                    <View style={{ marginVertical: 8 }}>
                                        <Text style={{
                                            fontSize: 12,
                                            color: colors.red['600'],
                                            fontFamily: `${appFonts.medium}`,
                                        }}>
                                            Code has expired. Please request a new one.
                                        </Text>
                                    </View>
                                )}

                                <RButton
                                    title='verify pin'
                                    onPressButton={handleSubmit}
                                    styleBtn={styles.button}
                                    isSubmitting={isLoading}
                                    disable={isLoading || timeRemaining === 0}
                                />
                            </View>
                        )}
                    </Formik>

                    {/* Resend button with rate limiting */}
                    <View style={{ marginTop: 16 }}>
                        <Button
                            onPress={handleResendOtp}
                            disabled={!canResendNow || isLoading || resendAttempts >= maxResendAttempts}
                            textColor={canResendNow && resendAttempts < maxResendAttempts ? colors.primary['900'] : colors.slate['400']}
                            labelStyle={{ fontFamily: `${appFonts.medium}` }}
                            style={styles.textButton}
                        >
                            <Text style={{
                                color: canResendNow && resendAttempts < maxResendAttempts ? colors.primary['900'] : colors.slate['400'],
                                fontFamily: `${appFonts.semiBold}`
                            }}>
                                {resendAttempts >= maxResendAttempts
                                    ? 'Max resends reached'
                                    : canResendNow
                                        ? 'Resend Code'
                                        : `Resend in ${resendCooldownSeconds - Math.floor((Date.now() - (lastResendAt || 0)) / 1000)}s`
                                }
                            </Text>
                        </Button>
                    </View>

                </Animated.View>
            </SafeArea>
        </AuthWrapper >
    </Scroller>
    </KeyboardAvoidingView>
    )
}

export default OtpScreen
