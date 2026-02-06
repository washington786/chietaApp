import { Animated, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AuthWrapper } from '@/components/modules/authentication';
import { RButton, RErrorMessage, RKeyboardView, RLogo, SafeArea, Scroller } from '@/components/common';

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

interface OtpFormValues {
    otp: string
}

const initialValues: OtpFormValues = {
    otp: ''
}

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

    return (
        <Scroller>
            <AuthWrapper>
                <SafeArea>
                    <RLogo stylesLogo={{ alignContent: "center", marginTop: 40, marginBottom: 20, width: "auto" }} />
                    <Animated.View style={[styles.content, animatedStyle]}>
                        <Text style={[styles.title, { fontFamily: `${appFonts.bold}`, fontWeight: "bold", textTransform: "capitalize" }]}>
                            verify one time password
                        </Text>
                        <Text style={[styles.description]}>
                            enter the 6-digit code sent to {email}
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
                                <RKeyboardView style={{ gap: 8 }}>
                                    <OtpInput
                                        numberOfDigits={6}
                                        onTextChange={(text) => setFieldValue('otp', text)}
                                        onBlur={() => handleBlur('otp')}
                                        focusColor={colors.primary[600]}
                                        type='numeric'
                                        disabled={isLoading}
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
                                        disabled={isLoading || timeRemaining === 0}
                                    />
                                </RKeyboardView>
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
        </Scroller >
    )
}

export default OtpScreen
