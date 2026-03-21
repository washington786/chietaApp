import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import { RErrorMessage, RInput, RLoaderAnimation } from "@/components/common";
import colors from "@/config/colors";
import { Formik } from "formik";
import { registerSchema, showToast } from "@/core";
import UseAuth from "@/hooks/main/auth/UseAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { RegisterRequest } from "@/core/models/UserDto";
import AuthScreenLayout, { authScreenStyles } from "@/components/modules/authentication/AuthScreenLayout";
import AuthGradientButton from "@/components/modules/authentication/AuthGradientButton";
import { clearError } from "@/store/slice/AuthSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
};

// ── Password strength ─────────────────────────────────────────────────────────
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

function PasswordStrength({ password }: { password: string }) {
    if (!password) return null;
    const { score, label, color } = getStrength(password);
    return (
        <View style={pStyles.wrap}>
            <View style={pStyles.bars}>
                {[0, 1, 2, 3, 4].map(i => (
                    <View key={i} style={[pStyles.bar, { backgroundColor: i <= score ? color : 'rgba(255,255,255,0.12)' }]} />
                ))}
            </View>
            <Text style={[pStyles.label, { color }]}>{label}</Text>
        </View>
    );
}
const pStyles = StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, marginHorizontal: 2 },
    bars: { flexDirection: 'row', gap: 4, flex: 1 },
    bar: { flex: 1, height: 3, borderRadius: 3 },
    label: { fontSize: 11, fontWeight: '700', minWidth: 52, textAlign: 'right' },
});

const RegisterScreen = () => {
    const { login, onAuth } = usePageTransition();

    const { register } = UseAuth();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector(
        (state: RootState) => state.auth
    );

    const handleSubmit = async (values: RegisterRequest) => {
        const { email, firstName, lastName, password, username } = values;
        const result = await register({
            email,
            password,
            firstName,
            lastName,
            username,
        });

        if (result.type === 'auth/register/fulfilled') {
            showToast({
                message: "Registration successful! Welcome aboard.",
                type: "success",
                title: "Account Created",
                position: "top",
            });
            onAuth();
        }
    };

    useEffect(() => {
        if (error) {
            showToast({
                message: error.message,
                type: "error",
                title: "Registration Error",
                position: "top",
            });
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const footer = (
        <View style={authScreenStyles.footerRow}>
            <Text style={authScreenStyles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={login}>
                <Text style={authScreenStyles.footerLink}>Sign In</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <AuthScreenLayout
            title="Create Account"
            subtitle="Join CHIETA IMS as an SDF professional."
            footer={footer}
            showBackButton={false}
        >
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => handleSubmit(values)}
                validationSchema={registerSchema}
            >
                {({
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    values,
                }) => (
                    <View style={authScreenStyles.formWrapper}>
                        <View style={styles.nameRow}>
                            <View style={styles.halfWrap}>
                                <RInput
                                    placeholder="First name"
                                    onBlur={handleBlur("firstName")}
                                    onChangeText={handleChange("firstName")}
                                    value={values.firstName}
                                    placeholderTextColor="rgba(255,255,255,0.32)"
                                    customStyle={authScreenStyles.inputField}
                                    style={styles.inputText}
                                />
                                {errors.firstName && touched.firstName && <RErrorMessage error={errors.firstName} />}
                            </View>
                            <View style={styles.halfWrap}>
                                <RInput
                                    placeholder="Last name"
                                    onBlur={handleBlur("lastName")}
                                    onChangeText={handleChange("lastName")}
                                    value={values.lastName}
                                    placeholderTextColor="rgba(255,255,255,0.32)"
                                    customStyle={authScreenStyles.inputField}
                                    style={styles.inputText}
                                />
                                {errors.lastName && touched.lastName && <RErrorMessage error={errors.lastName} />}
                            </View>
                        </View>

                        <RInput
                            placeholder="Username"
                            onBlur={handleBlur("username")}
                            onChangeText={handleChange("username")}
                            value={values.username}
                            placeholderTextColor="rgba(255,255,255,0.32)"
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.username && touched.username && <RErrorMessage error={errors.username} />}

                        <RInput
                            placeholder="Email address"
                            icon={"mail"}
                            onBlur={handleBlur("email")}
                            onChangeText={handleChange("email")}
                            value={values.email}
                            placeholderTextColor="rgba(255,255,255,0.32)"
                            keyboardType="email-address"
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.email && touched.email && <RErrorMessage error={errors.email} />}

                        <View>
                            <RInput
                                placeholder="Password"
                                icon={"lock"}
                                secureTextEntry
                                onBlur={handleBlur("password")}
                                onChangeText={handleChange("password")}
                                value={values.password}
                                placeholderTextColor="rgba(255,255,255,0.32)"
                                customStyle={authScreenStyles.inputField}
                                style={styles.inputText}
                            />
                            <PasswordStrength password={values.password} />
                        </View>
                        {errors.password && touched.password && <RErrorMessage error={errors.password} />}

                        <View>
                            <RInput
                                placeholder="Confirm password"
                                icon={"lock"}
                                secureTextEntry
                                onBlur={handleBlur("confirmPassword")}
                                onChangeText={handleChange("confirmPassword")}
                                value={values.confirmPassword}
                                placeholderTextColor="rgba(255,255,255,0.32)"
                                customStyle={authScreenStyles.inputField}
                                style={styles.inputText}
                            />
                            {values.confirmPassword.length > 0 && (
                                <View style={styles.matchRow}>
                                    <MaterialCommunityIcons
                                        name={values.password === values.confirmPassword ? 'check-circle-outline' : 'close-circle-outline'}
                                        size={13}
                                        color={values.password === values.confirmPassword ? '#22c55e' : '#ef4444'}
                                    />
                                    <Text style={[styles.matchText, { color: values.password === values.confirmPassword ? '#22c55e' : '#ef4444' }]}>
                                        {values.password === values.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                    </Text>
                                </View>
                            )}
                        </View>
                        {errors.confirmPassword && touched.confirmPassword && <RErrorMessage error={errors.confirmPassword} />}

                        <Text style={styles.popiaText}>
                            By creating an account, you agree to CHIETA’s{' '}
                            <Text style={styles.popiaLink}>Terms of Service</Text>,{' '}
                            <Text style={styles.popiaLink}>Privacy Policy</Text>, and consent to the processing of your personal information in accordance with the{' '}
                            <Text style={styles.popiaLink}>Protection of Personal Information Act (POPIA)</Text>.
                        </Text>

                        <AuthGradientButton
                            title="Create Account"
                            onPress={handleSubmit}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                        {isLoading && <RLoaderAnimation />}
                    </View>
                )}
            </Formik>
        </AuthScreenLayout>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    inputText: { color: '#fff' },
    nameRow: { flexDirection: 'row', gap: 10 },
    halfWrap: { flex: 1 },
    matchRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6, marginHorizontal: 2 },
    matchText: { fontSize: 11, fontWeight: '600' },
    popiaText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.42)',
        textAlign: 'center',
        lineHeight: 17,
        paddingHorizontal: 4,
    },
    popiaLink: {
        color: 'rgba(255,255,255,0.72)',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
