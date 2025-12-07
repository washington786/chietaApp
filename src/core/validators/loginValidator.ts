import * as Yup from 'yup';
import { passwordRules } from './registorValidator';

export const loginSchema = Yup.object().shape({
    email: Yup.string().email("invalid email address").required("email is required"),
    password: Yup.string().matches(passwordRules, "Password too weak.").required("Password is required.")
});