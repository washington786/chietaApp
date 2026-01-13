import Toast from "react-native-toast-message";

interface type {
    type: "success" | "error" | "info";
    message: string;
    title: string;
    position?: "bottom" | "top";
}
const showToast = ({ message, title, type, position }: type) => {
    Toast.show({
        type: type,
        autoHide: true,
        text1: title,
        text2: message,
        swipeable: true,
        visibilityTime: 5000,
        position: position ?? "bottom",
    });
};
export default showToast;