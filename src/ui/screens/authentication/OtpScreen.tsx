import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RErrorMessage } from '@/components/common';
import AuthScreenLayout, { authScreenStyles } from '@/components/modules/authentication/AuthScreenLayout';
import AuthGradientButton from '@/components/modules/authentication/AuthGradientButton';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import colors from '@/config/colors';
import appFonts from '@/config/fonts';
import { OtpInput } from "react-native-otp-entry";
import { Formik } from 'formik';
import { otpSchema, showToast } from '@/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
    setOtp,
    checkLockoutExpiry,
    verifyOtpBackend,
    resendOtpCode,
} from '@/store/slice/PasswordResetSlice';
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
    circle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#f3f4f6', borderWidth: 1.5, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
    circleActive: { backgroundColor: colors.primary[700], borderColor: colors.primary[600] },
    num: { fontSize: 12, fontWeight: '700', color: '#9ca3af' },
    numActive: { color: '#fff' },
    label: { fontSize: 10, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.4 },
    labelActive: { color: colors.primary[700] },
    connector: { flex: 1, height: 1.5, backgroundColor: '#e5e7eb', marginTop: 14 },
    connectorDone: { backgroundColor: colors.primary[600] },
});

const OtpScreen = () => {
    const { newPassword } = usePageTransition();
    const dispatch = useDispatch<AppDispatch>();

    // Get email and reset state from Redux
    const {
        email,
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

    // Sync timers on state changes
    useEffect(() => {
        if (otpExpiresAt) {
            const remaining = Math.ceil((otpExpiresAt - Date.now()) / 1000);
            setTimeRemaining(remaining > 0 ? remaining : 0);
        }
        if (isLockedOut && lockoutExpiresAt) {
            const remaining = Math.ceil((lockoutExpiresAt - Date.now()) / 1000);
            setLockoutTimeRemaining(remaining > 0 ? remaining : 0);
        }
        if (resendAttempts < maxResendAttempts && lastResendAt) {
            const elapsed = Math.floor((Date.now() - lastResendAt) / 1000);
            setCanResendNow(elapsed >= resendCooldownSeconds);
        }
    }, [otpExpiresAt, lockoutExpiresAt, isLockedOut, resendAttempts, lastResendAt]);

    // Tick every second
    useEffect(() => {
        const interval = setInterval(() => {
            if (otpExpiresAt && !isLockedOut) {
                const remaining = Math.ceil((otpExpiresAt - Date.now()) / 1000);
                setTimeRemaining(remaining > 0 ? remaining : 0);
            }
            if (isLockedOut && lockoutExpiresAt) {
                const remaining = Math.ceil((lockoutExpiresAt - Date.now()) / 1000);
                setLockoutTimeRemaining(remaining > 0 ? remaining : 0);
                if (remaining <= 0) dispatch(checkLockoutExpiry());
            }
            if (lastResendAt && resendAttempts < maxResendAttempts) {
                const elapsed = Math.floor((Date.now() - lastResendAt) / 1000);
                setCanResendNow(elapsed >= resendCooldownSeconds);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [otpExpiresAt, lockoutExpiresAt, isLockedOut, lastResendAt, resendAttempts]);

    const handleSubmit = async (values: OtpFormValues) => {
        if (!email) {
            showToast({ message: "Email not found. Please start the reset process again.", type: "error", title: "Error", position: "top" });
            return;
        }
        if (isLockedOut) {
            showToast({ message: `Account locked. Try again in ${lockoutTimeRemaining} seconds.`, type: "error", title: "Account Locked", position: "top" });
            return;
        }

        const result = await dispatch(verifyOtpBackend({ email, otp: values.otp }));

        if (result.type === 'passwordReset/verifyOtp/fulfilled') {
            dispatch(setOtp(values.otp));
            showToast({ message: "OTP verified. Please enter your new password.", type: "success", title: "Success", position: "top" });
            newPassword();
        } else {
            const errorMsg = typeof result.payload === 'string' ? result.payload : "Invalid OTP. Please try again.";
            showToast({ message: errorMsg, type: "error", title: "Verification Failed", position: "top" });
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            showToast({ message: "Email not found. Please start the reset process again.", type: "error", title: "Error", position: "top" });
            return;
        }
        if (resendAttempts >= maxResendAttempts) {
            showToast({ message: "Maximum resend attempts exceeded. Please try again later.", type: "error", title: "Too Many Attempts", position: "top" });
            return;
        }

        const result = await dispatch(resendOtpCode({ email }));
        if (result.type === 'passwordReset/resendOtp/fulfilled') {
            showToast({ message: "OTP resent to your email.", type: "success", title: "Code Resent", position: "top" });
        } else {
            const errorMsg = typeof result.payload === 'string' ? result.payload : "Failed to resend OTP. Please try again.";
            showToast({ message: errorMsg, type: "error", title: "Resend Failed", position: "top" });
        }
    };

    // ── Error state: no email ─────────────────────────────────────────────
    if (!email) {
        return (
            <AuthScreenLayout title='Session Expired' subtitle='Your reset session could not be found.'>
                <View style={styles.centeredState}>
                    <MaterialCommunityIcons name='email-alert-outline' size={48} color='rgba(255,255,255,0.5)' />
                    <Text style={styles.stateText}>Please go back and enter your email again to start the password reset process.</Text>
                    <RErrorMessage error='Email not found. Please start the reset process again.' />
                </View>
            </AuthScreenLayout>
        );
    }

    // ── Lockout state ─────────────────────────────────────────────────────
    if (isLockedOut) {
        return (
            <AuthScreenLayout title='Account Locked' subtitle='Too many failed attempts.'>
                <View style={styles.centeredState}>
                    <View style={styles.lockIconWrap}>
                        <MaterialCommunityIcons name='lock-alert-outline' size={40} color={colors.red[400]} />
                    </View>
                    <Text style={styles.lockText}>
                        Please wait <Text style={styles.lockCountdown}>{lockoutTimeRemaining}s</Text> before trying again.
                    </Text>
                </View>
            </AuthScreenLayout>
        );
    }

    // ── Resend footer ─────────────────────────────────────────────────────
    const resendLabel = resendAttempts >= maxResendAttempts
        ? 'Max resends reached'
        : canResendNow
            ? 'Resend Code'
            : `Resend in ${Math.max(0, resendCooldownSeconds - Math.floor((Date.now() - (lastResendAt || 0)) / 1000))}s`;

    const canResend = canResendNow && resendAttempts < maxResendAttempts && !isLoading;

    const footer = (
        <View style={styles.resendRow}>
            <Text style={styles.resendHint}>Didn't receive the code?</Text>
            <TouchableOpacity onPress={handleResendOtp} disabled={!canResend} activeOpacity={0.7}>
                <Text style={[styles.resendLink, !canResend && styles.resendLinkDisabled]}>
                    {resendLabel}
                </Text>
            </TouchableOpacity>
        </View>
    );

    // ── Main form ─────────────────────────────────────────────────────────
    return (
        <AuthScreenLayout
            title='Verify OTP'
            subtitle={`Enter the 6-digit code sent to ${email}`}
            footer={footer}
        >
            <StepFlow current={2} />

            {resetError && (
                <View style={styles.errorWrap}>
                    <RErrorMessage error={resetError} />
                </View>
            )}

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={otpSchema}
            >
                {({ setFieldValue, handleBlur, handleSubmit, errors, touched }) => (
                    <View style={authScreenStyles.formWrapper}>
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
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 14,
                                    borderWidth: 1.5,
                                    borderColor: '#e5e7eb',
                                    height: 54,
                                    width: 44,
                                },
                                pinCodeTextStyle: {
                                    color: '#111827',
                                    fontSize: 22,
                                    fontWeight: '700',
                                },
                                focusedPinCodeContainerStyle: {
                                    borderColor: colors.primary[600],
                                    backgroundColor: '#f0f4ff',
                                },
                            }}
                        />

                        {errors.otp && touched.otp && <RErrorMessage error={errors.otp} />}

                        {/* Attempts warning */}
                        {failedAttempts > 0 && failedAttempts < maxAttempts && (
                            <View style={styles.statusRow}>
                                <MaterialCommunityIcons name='alert-circle-outline' size={13} color={colors.yellow[500]} />
                                <Text style={[styles.statusText, { color: colors.yellow[500] }]}>
                                    {maxAttempts - failedAttempts} attempt{maxAttempts - failedAttempts !== 1 ? 's' : ''} remaining
                                </Text>
                            </View>
                        )}

                        {/* OTP expiry warning */}
                        {timeRemaining !== null && timeRemaining < 60 && timeRemaining > 0 && (
                            <View style={styles.statusRow}>
                                <MaterialCommunityIcons name='clock-alert-outline' size={13} color={colors.yellow[500]} />
                                <Text style={[styles.statusText, { color: colors.yellow[500] }]}>
                                    Code expires in {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                                </Text>
                            </View>
                        )}

                        {/* OTP expired */}
                        {timeRemaining === 0 && (
                            <View style={styles.statusRow}>
                                <MaterialCommunityIcons name='clock-remove-outline' size={13} color={colors.red[400]} />
                                <Text style={[styles.statusText, { color: colors.red[400] }]}>
                                    Code has expired. Please request a new one.
                                </Text>
                            </View>
                        )}

                        <AuthGradientButton
                            title='Verify Code'
                            onPress={handleSubmit}
                            loading={isLoading}
                            disabled={isLoading || timeRemaining === 0}
                        />
                    </View>
                )}
            </Formik>
        </AuthScreenLayout>
    );
};

export default OtpScreen;

const styles = StyleSheet.create({
    // Status rows inside form
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusText: {
        fontSize: 12,
        fontFamily: `${appFonts.medium}`,
    },
    errorWrap: {
        marginBottom: 4,
    },
    // Resend footer
    resendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 18,
    },
    resendHint: {
        color: '#6b7280',
        fontFamily: `${appFonts.medium}`,
        fontSize: 13,
    },
    resendLink: {
        color: colors.primary[700],
        fontFamily: `${appFonts.semiBold}`,
        fontSize: 13,
    },
    resendLinkDisabled: {
        color: '#d1d5db',
    },
    // Error / lockout states
    centeredState: {
        alignItems: 'center',
        gap: 14,
        paddingVertical: 8,
    },
    stateText: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 13,
        fontFamily: `${appFonts.medium}`,
        textAlign: 'center',
        lineHeight: 20,
    },
    lockIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,0,0,0.2)',
    },
    lockText: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        fontFamily: `${appFonts.medium}`,
        textAlign: 'center',
    },
    lockCountdown: {
        color: colors.red[400],
        fontFamily: `${appFonts.bold}`,
    },
});
