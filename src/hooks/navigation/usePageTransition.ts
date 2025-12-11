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
    function onAuth() {
        navigation.navigate("app");
    }
    function notifications() {
        navigation.navigate("notifications");
    }
    function newOrg() {
        navigation.navigate("newOrgLink");
    }
    function newApplication() {
        navigation.navigate("newApplication");
    }
    function newDgApplication() {
        navigation.navigate("newDgApplication");
    }
    function account() {
        navigation.navigate("account");
    }
    function changePassword() {
        navigation.navigate("changePassword");
    }
    function privacy() {
        navigation.navigate("privacy");
    }


    function support() {
        navigation.navigate("support");
    }
    function newPassword() {
        navigation.replace("newPassword");
    }

    function linkOrgDoc({ orgId }: { orgId: string, }) {
        navigation.navigate("orgDetail", { orgId: orgId });
    }

    function applicationDetails({ orgId, appId, type }: { orgId: string, appId: string, type: string }) {
        navigation.navigate("applicationDetails", {
            orgId: orgId,
            appId: appId,
            type: type
        });
    }

    function mandatoryGrants({ orgId }: { orgId: string }) {
        navigation.navigate("mandatory", { orgId: orgId });
    }

    function historyItemDetails({ appId }: { appId: string }) {
        navigation.navigate("historyDetails", { appId: appId });
    }

    function discretionaryGrants({ orgId }: { orgId: string }) {
        navigation.navigate("discretionary", { orgId: orgId });
    }

    return { onBack, login, register, otp, resetPassword, getStarted, onAuth, notifications, newOrg, mandatoryGrants, discretionaryGrants, newApplication, newDgApplication, applicationDetails, account, privacy, support, historyItemDetails, linkOrgDoc, newPassword, changePassword };
}

export default usePageTransition