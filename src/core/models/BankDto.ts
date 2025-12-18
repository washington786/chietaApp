// export interface BankDetail {
//     id: number;
//     organisationId: number;
//     accountHolder: string | null;
//     branchCode: string | null;
//     accountNumber: string | null;
//     accountType: string | null;
//     branchName: string | null;
//     bankName: string | null;
//     dateCreated: string;
//     userId: string | null;
// }

export interface BankDetail {
    id: number;
    organisationId: number;
    account_Holder: string;
    branch_Code: string;
    account_Number: string;
    branch_Name: string;
    bank_Name: string;
    accountType: number;
    userId: number;
}