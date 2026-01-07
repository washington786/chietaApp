import * as Yup from 'yup';
import { passwordRules } from './registorValidator';

export const newPasswordSchema = Yup.object().shape({
    password: Yup.string().matches(passwordRules, "Password too weak.").required("Password is required."),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match.").required("Confirm password is required."),
});

export const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required."),
    password: Yup.string().matches(passwordRules, "Password too weak.").required("Password is required."),
    confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match.").required("Confirm password is required."),
});