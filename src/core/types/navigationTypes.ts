export type navigationTypes = {
    login: undefined;
    register: undefined;
    reset: undefined;

    otp: {
        email?: string;
    } | undefined;

    newPassword: {
        email?: string;
        otp?: string;
    } | undefined;

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
    changePassword: undefined;
    linkedOrganizationsProfile: undefined;

    pdfViewer: {
        payment: any;
    },

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
        item?: any;
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