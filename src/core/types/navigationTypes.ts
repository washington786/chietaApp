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
    orgLinking: {
        orgId: string;
    };
    historyDetails: {
        appId: string;
    };
    applicationDetails: {
        orgId?: string;
        appId?: string;
        type?: string;
    };
    orgDetail: {
        orgId?: string;
    };
    mandatory: {
        orgId?: string;
    };
    discretionary: {
        orgId?: string;
    };
}