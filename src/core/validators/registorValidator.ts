import * as Yup from 'yup';

export const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    userName: Yup.string().required("Username is required"),
    email: Yup.string().email("invalid email address").required("email is required"),
    password: Yup.string().matches(passwordRules, "Use 8+ chars with uppercase, lowercase, number & symbol (e.g., @, !, $)").required("Password is required."),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match.").required("Confirm password is required")
});