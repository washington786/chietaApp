import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .test('email-or-username', 'Enter a valid email or username', function (value) {
            if (!value) return false;
            // Check if it's a valid email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isEmail = emailRegex.test(value);
            // Check if it's a username (alphanumeric, underscores, dots allowed)
            const isUsername = /^[a-zA-Z0-9._-]+$/.test(value) && value.length >= 3;
            return isEmail || isUsername;
        })
        .required("Email or username is required"),
    password: Yup.string().required("Password is required.")
});