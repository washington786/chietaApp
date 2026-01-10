import * as Yup from 'yup';

export const accountUpdateSchema = Yup.object().shape({
    email: Yup.string().email("invalid email address").required("email is required"),
    firstName: Yup.string().required("first name is required!"),
    lastName: Yup.string().required("last name is required!"),
    username: Yup.string().required("username is required!"),
});