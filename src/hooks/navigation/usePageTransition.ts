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

    function otp({ email }: { email?: string } = {}) {
        navigation.replace("otp", { email });
    }

    function resetPassword() {
        navigation.navigate("reset");
    }

    function newPassword({ email, otp }: { email?: string, otp?: string } = {}) {
        navigation.replace("newPassword", { email, otp });
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
    function linkedOrganizations() {
        navigation.navigate("linkedOrganizationsProfile");
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

    function pdfViewer({ payment }: { payment: any }) {
        navigation.navigate("pdfViewer", { payment: payment });
    }

    function historyItemDetails({ appId, item }: { appId: string | number, item: any }) {
        navigation.navigate("historyDetails", { appId: appId, item: item });
    }

    function discretionaryGrants({ orgId }: { orgId: string }) {
        navigation.navigate("discretionary", { orgId: orgId });
    }

    return { onBack, login, register, otp, resetPassword, getStarted, onAuth, notifications, newOrg, mandatoryGrants, discretionaryGrants, newApplication, newDgApplication, applicationDetails, account, privacy, support, historyItemDetails, linkOrgDoc, newPassword, changePassword, linkedOrganizations, pdfViewer };
}

export default usePageTransition