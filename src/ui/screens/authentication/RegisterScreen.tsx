import { Text, View } from "react-native";
import React from "react";
import usePageTransition from "@/hooks/navigation/usePageTransition";
import { AuthWrapper } from "@/components/modules/authentication";
import {
    RButton,
    RErrorMessage,
    RInput,
    RKeyboardView,
    RLogo,
    SafeArea,
    Scroller,
} from "@/components/common";
import { Button } from "react-native-paper";
import { Authstyles as styles } from "@/styles/AuthStyles";
import appFonts from "@/config/fonts";
import colors from "@/config/colors";
import { Formik } from "formik";
import { registerSchema, showToast } from "@/core";
import UseAuth from "@/hooks/main/auth/UseAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { RegisterRequest } from "@/core/models/UserDto";

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
    const { isLoading, error } = useSelector(
        (state: RootState) => state.auth
    );

    const handleSubmit = async (values: RegisterRequest) => {
        const { email, firstName, lastName, password, username } = values;
        const result = await register({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            username: username
        });

        if (result.type === 'auth/register/fulfilled') {
            showToast({
                message: "Registration successful",
                type: "success",
                title: "Success",
                position: "top",
            });
            onAuth();
        }
    }

    if (error) {
        showToast({
            message: error.message,
            type: "error",
            title: "Login Error",
            position: "top",
        });
    }
    return (
        <Scroller>
            <AuthWrapper>
                <SafeArea>
                    <RLogo
                        stylesLogo={{
                            alignContent: "center",
                            marginTop: 40,
                            marginBottom: 20,
                            width: "auto",
                        }}
                    />
                    <View style={styles.content}>
                        <Text
                            style={[
                                styles.title,
                                {
                                    fontFamily: `${appFonts.bold}`,
                                    fontWeight: "bold",
                                    textTransform: "capitalize",
                                },
                            ]}
                        >
                            Create new account
                        </Text>
                        <Text style={[styles.description]}>
                            set up username and password.you can always change it later.
                        </Text>

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
                                <RKeyboardView style={{ gap: 8 }}>
                                    <RInput
                                        placeholder="first name"
                                        icon={"user"}
                                        onBlur={handleBlur("firstName")}
                                        onChangeText={handleChange("firstName")}
                                        value={values.firstName}
                                    />
                                    {errors.firstName && touched.firstName && (
                                        <RErrorMessage error={errors.firstName} />
                                    )}

                                    <RInput
                                        placeholder="last name"
                                        icon={"user"}
                                        onBlur={handleBlur("lastName")}
                                        onChangeText={handleChange("lastName")}
                                        value={values.lastName}
                                    />
                                    {errors.lastName && touched.lastName && (
                                        <RErrorMessage error={errors.lastName} />
                                    )}

                                    <RInput
                                        placeholder="username"
                                        icon={"user"}
                                        onBlur={handleBlur("userName")}
                                        onChangeText={handleChange("userName")}
                                        value={values.username}
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
                                    />
                                    {errors.confirmPassword && touched.confirmPassword && (
                                        <RErrorMessage error={errors.confirmPassword} />
                                    )}

                                    <RButton
                                        title="Sign Up"
                                        onPressButton={handleSubmit}
                                        styleBtn={styles.button}
                                        isSubmitting={isLoading}
                                    />
                                </RKeyboardView>
                            )}
                        </Formik>

                        <Button
                            textColor={colors.slate["700"]}
                            labelStyle={{ fontFamily: `${appFonts.medium}` }}
                            style={styles.textButton}
                            onPress={login}
                        >
                            Alreadt have an account?{" "}
                            <Text
                                style={{
                                    color: colors.primary["900"],
                                    fontFamily: `${appFonts.semiBold}`,
                                }}
                            >
                                Sign In
                            </Text>
                        </Button>
                    </View>
                </SafeArea>
            </AuthWrapper>
        </Scroller>
    );
};

export default RegisterScreen;
