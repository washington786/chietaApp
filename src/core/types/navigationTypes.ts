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
    applicationDetails: {
        orgId?: string;
        appId?: string;
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