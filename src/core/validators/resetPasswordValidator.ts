import * as Yup from 'yup';

export const resetPasswordSchema = Yup.object().shape({
    email: Yup.string().email("invalid email address").required("email is required"),
});