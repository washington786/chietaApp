export type navigationTypes = {
    login: undefined;
    register: undefined;
    reset: undefined;
    otp: undefined;
    home: undefined;
    history: undefined;
    profile: undefined;
    app: undefined;
    notifications: undefined;
    newOrgLink: undefined;
    newApplication: undefined;
    newDgApplication: undefined;

    account: undefined;
    privacy: undefined;
    support: undefined;
    newPassword: undefined;
    changePassword: undefined;
    linkedOrganizationsProfile: undefined;

    orgLinking: {
        orgId: string;
    };
    historyDetails: {
        appId: string | number;
        item?: any;
    };
    applicationDetails: {
        orgId?: string;
        appId?: string;
        type?: string;
    };
    orgDetail: {
        orgId: string;
        org?: any;
    };
    mandatory: {
        orgId?: string;
    };
    discretionary: {
        orgId?: string;
    };
}