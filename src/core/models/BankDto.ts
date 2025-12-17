export interface BankDetail {
    id: number;
    organisationId: number;
    accountHolder: string | null;
    branchCode: string | null;
    accountNumber: string | null;
    accountType: string | null;
    branchName: string | null;
    bankName: string | null;
    dateCreated: string;
    userId: string | null;
}