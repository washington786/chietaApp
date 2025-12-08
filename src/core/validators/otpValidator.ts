import * as Yup from 'yup';
const otpRule = /^\d{6}$/;

export const otpSchema = Yup.object().shape({
    otp: Yup.string().matches(otpRule, "Otp must be 6 digits.").required("one time pin is required!")
});