import { navigationTypes } from "@/core/types/navigationTypes";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const usePageTransition = () => {
    const navigation = useNavigation<NativeStackNavigationProp<navigationTypes>>();

    function onBack() {
        navigation.goBack();
    }

    function getStarted() {
        navigation.replace("login")
    }

    function login() {
        navigation.navigate("login");
    }

    function register() {
        navigation.navigate("register");
    }
    function otp() {
        navigation.replace("otp");
    }
    function resetPassword() {
        navigation.navigate("reset");
    }

    // function goToChildProfile({ childId }: { childId: string }) {
    //     navigation.navigate("ChildProfile", { childId: childId });
    // }

    return { onBack, login, register, otp, resetPassword, getStarted };
}

export default usePageTransition