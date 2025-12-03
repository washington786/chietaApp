import { setCredentials } from "@/store/slice/AuthSlice";
import { useDispatch } from "react-redux";

interface login {
    email: string;
    password: string;
}

interface register {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    username: string;
}

interface authResponse {
    user: {
        id: string;
        name: string;
        email: string;
    };
    token: string;
}

interface resetPassword {
    email: string;
}
interface verifyOtpRequest {
    email: string;
    otp: string;
}

const UseAuth = () => {

    const dispatch = useDispatch();

    const login = async (payload: login) => {
        try {
            const response = await fetch("", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Login failed");
            }

            const { user, token }: authResponse = await response.json();

            dispatch(setCredentials({ token: token, user: user }));
        } catch (error) {

            if (error instanceof Error) {
                console.log(`Failed to login: ${error.message}`);

            }
            throw error;
        }
    }

    const register = async (payload: register) => {
        try {
            const response = await fetch("", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => { });
                throw new Error(errorData.message || `Failed to register. with ${response.status}`);
            }

            const { user, token }: authResponse = await response.json();

            dispatch(setCredentials({ token, user }));
        } catch (error) {
            if (error instanceof Error) {
                console.log(`Failed to login: ${error.message}`);

            }
            throw error;
        }
    }

    const resetPassword = async (payload: resetPassword) => {
        try {
            const response = await fetch("", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => { });
                throw new Error(errorData.message || `Failed to reset password. ${response.status}`);
            }

        } catch (error) {
            if (error instanceof Error) {
                console.log(`Failed to reset password: ${error.message}`);
                throw error;
            }
        }
    }

    return { login, register, resetPassword }
}

export default UseAuth