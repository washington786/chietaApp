import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import { RErrorMessage, RInput, RKeyboardView, RLoaderAnimation } from "@/components/common";
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

const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
};

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
            title="Create new account"
            subtitle=""
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
                    <RKeyboardView style={authScreenStyles.formWrapper}>
                        <RInput
                            placeholder="First name"
                            icon={"user"}
                            onBlur={handleBlur("firstName")}
                            onChangeText={handleChange("firstName")}
                            value={values.firstName}
                            placeholderTextColor={colors.slate[200]}
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.firstName && touched.firstName && (
                            <RErrorMessage error={errors.firstName} />
                        )}

                        <RInput
                            placeholder="Last name"
                            icon={"user"}
                            onBlur={handleBlur("lastName")}
                            onChangeText={handleChange("lastName")}
                            value={values.lastName}
                            placeholderTextColor={colors.slate[200]}
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.lastName && touched.lastName && (
                            <RErrorMessage error={errors.lastName} />
                        )}

                        <RInput
                            placeholder="Username"
                            icon={"user"}
                            onBlur={handleBlur("username")}
                            onChangeText={handleChange("username")}
                            value={values.username}
                            placeholderTextColor={colors.slate[200]}
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.username && touched.username && (
                            <RErrorMessage error={errors.username} />
                        )}

                        <RInput
                            placeholder="Email"
                            icon={"mail"}
                            onBlur={handleBlur("email")}
                            onChangeText={handleChange("email")}
                            value={values.email}
                            placeholderTextColor={colors.slate[200]}
                            keyboardType="email-address"
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.email && touched.email && (
                            <RErrorMessage error={errors.email} />
                        )}

                        <RInput
                            placeholder="Password"
                            icon={"lock"}
                            secureTextEntry
                            onBlur={handleBlur("password")}
                            onChangeText={handleChange("password")}
                            value={values.password}
                            placeholderTextColor={colors.slate[200]}
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.password && touched.password && (
                            <RErrorMessage error={errors.password} />
                        )}

                        <RInput
                            placeholder="Confirm Password"
                            icon={"lock"}
                            secureTextEntry
                            onBlur={handleBlur("confirmPassword")}
                            onChangeText={handleChange("confirmPassword")}
                            value={values.confirmPassword}
                            placeholderTextColor={colors.slate[200]}
                            customStyle={authScreenStyles.inputField}
                            style={styles.inputText}
                        />
                        {errors.confirmPassword && touched.confirmPassword && (
                            <RErrorMessage error={errors.confirmPassword} />
                        )}

                        <AuthGradientButton
                            title="Sign Up"
                            onPress={handleSubmit}
                            loading={isLoading}
                        />
                        {isLoading && <RLoaderAnimation />}
                    </RKeyboardView>
                )}
            </Formik>
        </AuthScreenLayout>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    inputText: {
        color: '#fff',
    },
});
