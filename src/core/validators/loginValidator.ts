import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    email: Yup.string().email("invalid email address").required("email is required"),
    password: Yup.string().required("Password is required.")
});