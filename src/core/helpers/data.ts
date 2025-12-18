import { DiscretionaryStatus } from "../models/DiscretionaryDto";
import { MandatoryStatus } from "../models/MandatoryDto";

export const provinces = [
    'Eastern Cape', 'Free State', 'Gauteng',
    'KwaZulu-Natal', 'Limpopo', 'Mpumalanga',
    'North West', 'Northern Cape', 'Western Cape'
];
export const mainDistricts: Record<string, string[]> = {
    "Eastern Cape": [
        "Alfred Nzo",
        "Amathole",
        "Buffalo City (Metro)",
        "Chris Hani",
        "Joe Gqabi",
        "Nelson Mandela Bay (Metro)",
        "OR Tambo",
        "Sarah Baartman"
    ],
    "Free State": [
        "Fezile Dabi",
        "Lejweleputswa",
        "Mangaung (Metro)",
        "Thabo Mofutsanyana",
        "Xhariep"
    ],
    "Gauteng": [
        "City of Johannesburg (Metro)",
        "City of Tshwane (Metro)",
        "Ekurhuleni (Metro)",
        "Sedibeng",
        "West Rand"
    ],
    "KwaZulu-Natal": [
        "Amajuba",
        "eThekwini (Metro)",
        "Harry Gwala",
        "iLembe",
        "King Cetshwayo",
        "Ugu",
        "uMgungundlovu",
        "uMkhanyakude",
        "uMzinyathi",
        "uThukela",
        "Zululand"
    ],
    "Limpopo": [
        "Capricorn",
        "Mopani",
        "Sekhukhune",
        "Vhembe",
        "Waterberg"
    ],
    "Mpumalanga": [
        "Ehlanzeni",
        "Gert Sibande",
        "Nkangala"
    ],
    "Northern Cape": [
        "Frances Baard",
        "John Taolo Gaetsewe",
        "Namakwa",
        "Pixley Ka Seme",
        "ZF Mgcawu"
    ],
    "North West": [
        "Bojanala Platinum",
        "Dr Kenneth Kaunda",
        "Dr Ruth Segomotsi Mompati",
        "Ngaka Modiri Molema"
    ],
    "Western Cape": [
        "Cape Winelands",
        "Central Karoo",
        "City of Cape Town (Metro)",
        "Eden",
        "Overberg",
        "West Coast"
    ]
};

export const ageGroups = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6'];

export const main_manicipalities: Record<string, string[]> = {
    "Eastern Cape": [
        "Alfred Nzo District Municipality",
        "Amathole District Municipality",
        "Buffalo City Metropolitan Municipality",
        "Chris Hani District Municipality",
        "Joe Gqabi District Municipality",
        "Nelson Mandela Bay Metropolitan Municipality",
        "OR Tambo District Municipality",
        "Sarah Baartman District Municipality"
    ],
    "Free State": [
        "Fezile Dabi District Municipality",
        "Lejweleputswa District Municipality",
        "Mangaung Metropolitan Municipality",
        "Thabo Mofutsanyana District Municipality",
        "Xhariep District Municipality"
    ],
    "Gauteng": [
        "City of Johannesburg Metropolitan Municipality",
        "City of Tshwane Metropolitan Municipality",
        "Ekurhuleni Metropolitan Municipality",
        "Sedibeng District Municipality",
        "West Rand District Municipality"
    ],
    "KwaZulu-Natal": [
        "Amajuba District Municipality",
        "eThekwini Metropolitan Municipality",
        "Harry Gwala District Municipality",
        "iLembe District Municipality",
        "King Cetshwayo District Municipality",
        "Ugu District Municipality",
        "uMgungundlovu District Municipality",
        "uMkhanyakude District Municipality",
        "uMzinyathi District Municipality",
        "uThukela District Municipality",
        "Zululand District Municipality"
    ],
    "Limpopo": [
        "Capricorn District Municipality",
        "Mopani District Municipality",
        "Sekhukhune District Municipality",
        "Vhembe District Municipality",
        "Waterberg District Municipality"
    ],
    "Mpumalanga": [
        "Ehlanzeni District Municipality",
        "Gert Sibande District Municipality",
        "Nkangala District Municipality"
    ],
    "Northern Cape": [
        "Frances Baard District Municipality",
        "John Taolo Gaetsewe District Municipality",
        "Namakwa District Municipality",
        "Pixley Ka Seme District Municipality",
        "ZF Mgcawu District Municipality"
    ],
    "North West": [
        "Bojanala Platinum District Municipality",
        "Dr Kenneth Kaunda District Municipality",
        "Dr Ruth Segomotsi Mompati District Municipality",
        "Ngaka Modiri Molema District Municipality"
    ],
    "Western Cape": [
        "Cape Winelands District Municipality",
        "Central Karoo District Municipality",
        "City of Cape Town Metropolitan Municipality",
        "Garden Route District Municipality",
        "Overberg District Municipality",
        "West Coast District Municipality"
    ]
}

export const discretionaryStatus_Grant: DiscretionaryStatus[] = [
    { id: 86, status: 1, statusDesc: "Registered in error", typ: "Grant", dteUpd: "2010-07-28T11:24:27.790Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 87, status: 2, statusDesc: "Rejected after Admin", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 88, status: 3, statusDesc: "Rejected after Concept Note", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 89, status: 4, statusDesc: "Rejected after Full Assessment", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 90, status: 7, statusDesc: "received after deadline", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 91, status: 8, statusDesc: "RFP rejection", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 92, status: 9, statusDesc: "Duplicate project", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 93, status: 10, statusDesc: "Rejected ceiling status", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 94, status: 11, statusDesc: "Registered", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 95, status: 12, statusDesc: "Submitted by online user", typ: "Grant", dteUpd: "2010-08-05T09:39:46.827Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 96, status: 21, statusDesc: "Submitted by online user", typ: "Grant", dteUpd: "2010-07-28T09:42:15.983Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 97, status: 19, statusDesc: "Allocated to Project Manager", typ: "Grant", dteUpd: "2010-07-28T09:42:03.493Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 98, status: 24, statusDesc: "Technical review done", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 99, status: 31, statusDesc: "Board Meeting", typ: "Grant", dteUpd: "2010-08-18T10:22:12.160Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 100, status: 32, statusDesc: "Passed Admin Assessment", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 101, status: 34, statusDesc: "Admin Appr Letter sent", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 102, status: 35, statusDesc: "Concept Note Approved", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 103, status: 41, statusDesc: "Concept Approval Letter sent", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 104, status: 44, statusDesc: "Full assessment complete", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 105, status: 45, statusDesc: "Assessment Letter Sent", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 106, status: 46, statusDesc: "Provisionally Approved", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 107, status: 47, statusDesc: "Despatched to Funder", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 108, status: 49, statusDesc: "Funding Approved", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 109, status: 50, statusDesc: "Approved by Funder", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 110, status: 54, statusDesc: "Contract despatched", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 111, status: 55, statusDesc: "Contract returned & signed", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 112, status: 61, statusDesc: "Funding in Progress", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 113, status: 62, statusDesc: "First  Report Received", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 114, status: 63, statusDesc: "Report Accepted", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 115, status: 64, statusDesc: "Site Visit Done", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 116, status: 65, statusDesc: "Site Visit Report Completed", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 117, status: 66, statusDesc: "Second payment withheld", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 118, status: 71, statusDesc: "Final tranche", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 119, status: 72, statusDesc: "Final Report Received", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 120, status: 73, statusDesc: "Final Report Accepted", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 121, status: 74, statusDesc: "Final Monitoring Complete", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 122, status: 75, statusDesc: "Audited Statement Received", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 123, status: 76, statusDesc: "Audited Statement Accepted", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 124, status: 77, statusDesc: "Audited Statement Unacceptable", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 125, status: 81, statusDesc: "Satisfactory Closure", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 126, status: 82, statusDesc: "Cancelled", typ: "Grant", dteUpd: "2010-03-09T17:31:14.960Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 127, status: 83, statusDesc: "Unsatisfactory Closure", typ: "Grant", dteUpd: "2008-10-29T11:52:35.667Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:53:00Z" },
    { id: 145, status: 84, statusDesc: "Terminated", typ: "Grant", dteUpd: "2010-03-09T17:33:09.647Z", usrUpd: "PrxUsr", dteCreated: "2010-03-09T17:33:00Z" },
    { id: 191, status: 14, statusDesc: "Technical review", typ: "Grant", dteUpd: "2010-08-06T10:46:24.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:46:00Z" },
    { id: 192, status: 20, statusDesc: "First Internal Review", typ: "Grant", dteUpd: "2010-08-06T10:47:59.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:48:00Z" },
    { id: 193, status: 23, statusDesc: "Second Internal Review", typ: "Grant", dteUpd: "2010-08-06T10:48:33.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:49:00Z" },
    { id: 194, status: 27, statusDesc: "Policy review process", typ: "Grant", dteUpd: "2010-08-18T10:21:55.910Z", usrUpd: "PTSAD", dteCreated: "2010-08-06T10:49:00Z" },
    { id: 195, status: 5, statusDesc: "Reject After First Internal Review", typ: "Grant", dteUpd: "2010-08-06T10:52:34.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:53:00Z" },
    { id: 196, status: 6, statusDesc: "Reject After Second Internal Review", typ: "Grant", dteUpd: "2010-08-06T10:53:44.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:54:00Z" },
    { id: 197, status: 29, statusDesc: "Definitely Recommend Accept", typ: "Grant", dteUpd: "2010-08-06T10:56:13.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:56:00Z" },
    { id: 198, status: 26, statusDesc: "Accept With Minor Changes", typ: "Grant", dteUpd: "2010-08-06T10:56:47.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:57:00Z" },
    { id: 221, status: 85, statusDesc: "Grant saved and closed", typ: "grant", dteUpd: "2011-01-11T11:38:56.140Z", usrUpd: "PrxUsr", dteCreated: "2011-01-11T11:39:00Z" },
    { id: 227, status: 15, statusDesc: "Review - Phase  Two", typ: "Grant", dteUpd: "2016-04-26T13:28:40.067Z", usrUpd: "PTSAD", dteCreated: "2010-08-06T10:46:00Z" },
    { id: 239, status: 86, statusDesc: "RSA Review Completed", typ: "Grant", dteUpd: "2020-03-24T00:00:00.000Z", usrUpd: "sa", dteCreated: "2020-03-24T00:00:00Z" },
    { id: 240, status: 86, statusDesc: "Regional Review Completed", typ: "Grant", dteUpd: "2020-03-24T00:00:00.000Z", usrUpd: "sa", dteCreated: "2020-03-24T00:00:00Z" },
    { id: 241, status: 86, statusDesc: "GEC Committee Review Completed", typ: "Grant", dteUpd: "2020-03-24T00:00:00.000Z", usrUpd: "sa", dteCreated: "2020-03-24T00:00:00Z" },
    { id: 243, status: 86, statusDesc: "GAC Committee Review Completed", typ: "Grant", dteUpd: "2020-03-24T00:00:00.000Z", usrUpd: "sa", dteCreated: "2020-03-24T00:00:00Z" },
    { id: 245, status: 86, statusDesc: "GC Committee Review Completed", typ: "Grant", dteUpd: "2020-03-24T00:00:00.000Z", usrUpd: "sa", dteCreated: "2020-03-24T00:00:00Z" },
    { id: 246, status: 86, statusDesc: "Evaluations Complete", typ: "Grant", dteUpd: "2020-03-24T00:00:00.000Z", usrUpd: "sa", dteCreated: "2020-03-24T00:00:00Z" },
    { id: 247, status: 86, statusDesc: "Allocated to RSA", typ: "Grant", dteUpd: "2022-03-24T00:00:00.000Z", usrUpd: "sa", dteCreated: "2022-03-24T00:00:00Z" },
    { id: 250, status: 87, statusDesc: "Withdrawn", typ: "Grant", dteUpd: "2022-11-19T00:00:00.000Z", usrUpd: "sa", dteCreated: "2022-11-19T00:00:00Z" }
];

export const discretionaryStatus_Proj: DiscretionaryStatus[] = [

    { id: 1, status: 1, statusDesc: "Registered in error", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 2, status: 2, statusDesc: "Rejected after Admin", typ: "Proj", dteUpd: "2010-07-28T11:23:52.050Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 5, status: 7, statusDesc: "Received after deadline", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 6, status: 8, statusDesc: "Rejected", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 7, status: 9, statusDesc: "Project Duplicate", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 8, status: 10, statusDesc: "Rejected ceiling status", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 9, status: 11, statusDesc: "Registered", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 10, status: 12, statusDesc: "Submitted by online user", typ: "Proj", dteUpd: "2010-08-05T09:39:53.837Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 12, status: 19, statusDesc: "Allocated to Project Manager", typ: "Proj", dteUpd: "2010-07-28T09:41:40.413Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 14, status: 32, statusDesc: "Passed Admin Compliance", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 18, status: 44, statusDesc: "Full assessment complete", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 24, status: 54, statusDesc: "Contract despatched", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 25, status: 55, statusDesc: "Contract returned & signed", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 26, status: 61, statusDesc: "Funding in progress", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 28, status: 63, statusDesc: "Report Accepted", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 29, status: 64, statusDesc: "Site Visit Done", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 30, status: 65, statusDesc: "Site Visit Report Completed", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 31, status: 66, statusDesc: "Second payment withheld", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 32, status: 71, statusDesc: "Final tranche paid", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 33, status: 72, statusDesc: "Final report Received", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 34, status: 73, statusDesc: "Final report Accepted", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 35, status: 74, statusDesc: "Final Monitoring Completed", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 39, status: 81, statusDesc: "Satisfactory Closure", typ: "Proj", dteUpd: "2008-10-29T11:48:31.583Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 40, status: 82, statusDesc: "Cancelled", typ: "Proj", dteUpd: "2010-03-09T17:31:30.367Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:49:00Z" },

    { id: 143, status: 84, statusDesc: "Terminated", typ: "Proj", dteUpd: "2010-03-09T17:32:47.790Z", usrUpd: "PrxUsr", dteCreated: "2010-03-09T17:33:00Z" },

    { id: 199, status: 24, statusDesc: "Fundable After Major Revisions", typ: "Proj", dteUpd: "2010-08-06T10:58:03.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:58:00Z" },

    { id: 209, status: 14, statusDesc: "Technical review", typ: "Proj", dteUpd: "2010-08-06T10:46:24.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:46:00Z" },

    { id: 210, status: 20, statusDesc: "First Internal Review", typ: "Proj", dteUpd: "2010-08-06T10:47:59.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:48:00Z" },

    { id: 211, status: 23, statusDesc: "Second Internal Review", typ: "Proj", dteUpd: "2010-08-06T10:48:33.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:49:00Z" },

    { id: 212, status: 27, statusDesc: "Peer Review Process", typ: "Proj", dteUpd: "2010-08-06T10:49:01.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:49:00Z" },

    { id: 213, status: 5, statusDesc: "Reject After First Internal Review", typ: "Proj", dteUpd: "2010-08-06T10:52:34.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:53:00Z" },

    { id: 214, status: 6, statusDesc: "Reject After Second Internal Review", typ: "Proj", dteUpd: "2010-08-06T10:53:44.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:54:00Z" },

    { id: 215, status: 29, statusDesc: "Definitely Recommend Accept", typ: "Proj", dteUpd: "2010-08-06T10:56:13.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:56:00Z" },

    { id: 216, status: 26, statusDesc: "Accept With Minor Changes", typ: "Proj", dteUpd: "2010-08-06T10:56:47.000Z", usrUpd: "prxusr", dteCreated: "2010-08-06T10:57:00Z" },

    { id: 228, status: 15, statusDesc: "Evaluation - Phase  Two", typ: "Proj", dteUpd: "2016-06-07T08:56:14.533Z", usrUpd: "PTSAD", dteCreated: "2010-08-06T10:46:00Z" },

    { id: 220, status: 85, statusDesc: "Grant saved and closed", typ: "proj", dteUpd: "2011-01-11T11:38:56.140Z", usrUpd: "PrxUsr", dteCreated: "2011-01-11T11:39:00Z" }

];

// === Inst (Instalment) ===

export const discretionaryStatus_Inst: DiscretionaryStatus[] = [

    { id: 128, status: 61, statusDesc: "Not Current", typ: "Inst", dteUpd: "2008-10-29T11:53:36.150Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:54:00Z" },

    { id: 129, status: 62, statusDesc: "Report Expected", typ: "Inst", dteUpd: "2008-10-29T11:53:36.150Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:54:00Z" },

    { id: 130, status: 63, statusDesc: "Contract Expected", typ: "Inst", dteUpd: "2008-10-29T11:53:36.150Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:54:00Z" },

    { id: 131, status: 64, statusDesc: "Report Received", typ: "Inst", dteUpd: "2008-10-29T11:53:36.150Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:54:00Z" },

    { id: 132, status: 65, statusDesc: "Instalment Document Uploaded", typ: "Inst", dteUpd: "2008-10-29T11:53:36.150Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:54:00Z" },

    { id: 133, status: 67, statusDesc: "Assessment Successful", typ: "Inst", dteUpd: "2008-10-29T11:53:36.150Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:54:00Z" },

    { id: 134, status: 69, statusDesc: "Paid", typ: "Inst", dteUpd: "2008-10-29T11:53:36.150Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:54:00Z" }

];

// === Prog (Programme) ===

export const discretionaryStatus_Prog: DiscretionaryStatus[] = [

    { id: 135, status: 61, statusDesc: "Not Current", typ: "Prog", dteUpd: "2008-10-29T11:54:35.787Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:55:00Z" },

    { id: 136, status: 62, statusDesc: "Report Expected", typ: "Prog", dteUpd: "2008-10-29T11:54:35.787Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:55:00Z" },

    { id: 137, status: 63, statusDesc: "Contract Expected", typ: "Prog", dteUpd: "2010-07-21T15:08:24.557Z", usrUpd: "PTSAD", dteCreated: "2008-10-29T11:55:00Z" },

    { id: 138, status: 64, statusDesc: "Report Received", typ: "Prog", dteUpd: "2008-10-29T11:54:35.787Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:55:00Z" },

    { id: 139, status: 65, statusDesc: "Assessment In Progress", typ: "Prog", dteUpd: "2008-10-29T11:54:35.787Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:55:00Z" },

    { id: 140, status: 67, statusDesc: "Assessment Successful", typ: "Prog", dteUpd: "2008-10-29T11:54:35.787Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:55:00Z" },

    { id: 141, status: 69, statusDesc: "Paid", typ: "Prog", dteUpd: "2008-10-29T11:54:35.787Z", usrUpd: "PrxUsr", dteCreated: "2008-10-29T11:55:00Z" }

];

// === Enq / enq (Enquiry) ===

export const discretionaryStatus_Enq: DiscretionaryStatus[] = [

    { id: 146, status: 3, statusDesc: "Cancelled", typ: "Enq", dteUpd: "2010-04-15T14:05:31.087Z", usrUpd: "PTSAD", dteCreated: "2010-04-15T14:06:00Z" },

    { id: 147, status: 5, statusDesc: "Automatic Rejection", typ: "Enq", dteUpd: "2010-04-15T14:05:31.127Z", usrUpd: "PTSAD", dteCreated: "2010-04-15T14:06:00Z" },

    { id: 148, status: 11, statusDesc: "In Development", typ: "Enq", dteUpd: "2010-04-15T14:05:31.127Z", usrUpd: "PTSAD", dteCreated: "2010-04-15T14:06:00Z" },

    { id: 149, status: 21, statusDesc: "Submitted", typ: "Enq", dteUpd: "2010-04-15T14:05:31.130Z", usrUpd: "PTSAD", dteCreated: "2010-04-15T14:06:00Z" },

    { id: 150, status: 49, statusDesc: "Approved", typ: "Enq", dteUpd: "2010-04-15T14:05:31.133Z", usrUpd: "PTSAD", dteCreated: "2010-04-15T14:06:00Z" },

    { id: 161, status: 22, statusDesc: "Not Yet Allocated", typ: "Enq", dteUpd: "2010-06-25T11:38:02.750Z", usrUpd: "PTSAD", dteCreated: "2010-05-03T12:43:00Z" },

    { id: 164, status: 7, statusDesc: "Not Eligible IE", typ: "enq", dteUpd: "2010-05-28T09:17:50.020Z", usrUpd: "PrxUsr", dteCreated: "2010-05-28T09:18:00Z" },

    { id: 166, status: 55, statusDesc: "Converted to grant application", typ: "enq", dteUpd: "2010-05-28T09:17:50.020Z", usrUpd: "PrxUsr", dteCreated: "2010-05-28T09:18:00Z" },

    { id: 167, status: 25, statusDesc: "Allocated for internal review", typ: "enq", dteUpd: "2010-05-28T13:08:23.920Z", usrUpd: "PrxUsr", dteCreated: "2010-05-28T13:08:00Z" },

    { id: 171, status: 27, statusDesc: "Recommend Accepting", typ: "enq", dteUpd: "2010-06-29T12:57:57.887Z", usrUpd: "PTSAD", dteCreated: "2010-06-03T16:35:00Z" },

    { id: 172, status: 28, statusDesc: "On the Margin", typ: "enq", dteUpd: "2010-06-03T16:34:55.127Z", usrUpd: "PrxUsr", dteCreated: "2010-06-03T16:35:00Z" },

    { id: 173, status: 26, statusDesc: "Accept", typ: "enq", dteUpd: "2010-06-29T12:57:33.813Z", usrUpd: "PTSAD", dteCreated: "2010-06-03T16:35:00Z" },

    { id: 174, status: 30, statusDesc: "Allocated for external review", typ: "enq", dteUpd: "2010-06-03T16:35:33.553Z", usrUpd: "PrxUsr", dteCreated: "2010-06-03T16:36:00Z" },

    { id: 175, status: 8, statusDesc: "Reject", typ: "enq", dteUpd: "2010-06-29T12:37:47.373Z", usrUpd: "PrxUsr", dteCreated: "2010-06-29T12:38:00Z" },

    { id: 176, status: 4, statusDesc: "Not Eligible Intervention", typ: "Enq", dteUpd: "2010-07-06T00:00:00.000Z", usrUpd: "prxusr", dteCreated: "2010-07-06T00:00:00Z" },

    { id: 181, status: 6, statusDesc: "Not Eligible Country of Intervention", typ: "Enq", dteUpd: "2010-07-06T00:00:00.000Z", usrUpd: "prxusr", dteCreated: "2010-07-06T00:00:00Z" },

    { id: 222, status: 10, statusDesc: "Auto Rejection letter sent", typ: "enq", dteUpd: "2011-04-13T10:40:17.463Z", usrUpd: "PrxUsr", dteCreated: "2011-04-13T10:40:00Z" },

    { id: 223, status: 56, statusDesc: "Approved to Activity Status – combined activity", typ: "Enq", dteUpd: "2012-01-23T10:31:24.000Z", usrUpd: "prxadm", dteCreated: "2012-01-23T10:31:00Z" }

];

// === AdFnd (Advertised Funding) ===

export const discretionaryStatus_AdFnd: DiscretionaryStatus[] = [

    { id: 188, status: 8, statusDesc: "Rejected", typ: "AdFnd", dteUpd: "2010-07-22T00:00:00.000Z", usrUpd: "prxUser", dteCreated: "2010-07-22T00:00:00Z" },

    { id: 189, status: 20, statusDesc: "Awaiting Decision", typ: "AdFnd", dteUpd: "2010-07-22T11:21:30.000Z", usrUpd: "sa", dteCreated: "2010-07-22T11:22:00Z" },

    { id: 190, status: 30, statusDesc: "Awarded", typ: "AdFnd", dteUpd: "2010-07-22T11:23:01.000Z", usrUpd: "sa", dteCreated: "2010-07-22T11:23:00Z" }

];

// === Reqn (Requisition) ===

export const discretionaryStatus_Reqn: DiscretionaryStatus[] = [

    { id: 224, status: 11, statusDesc: "Claim Saved", typ: "Reqn", dteUpd: "2012-01-11T18:38:46.000Z", usrUpd: "sa", dteCreated: "2012-01-11T18:39:00Z" },

    { id: 225, status: 12, statusDesc: "Claim Submitted", typ: "Reqn", dteUpd: "2012-01-11T18:38:46.000Z", usrUpd: "sa", dteCreated: "2012-01-11T18:39:00Z" },

    { id: 226, status: 15, statusDesc: "Claim Approved", typ: "Reqn", dteUpd: "2012-01-24T16:07:46.000Z", usrUpd: "sa", dteCreated: "2012-01-24T16:08:00Z" }

];

// === rvw (Review) ===

export const discretionaryStatus_Rvw: DiscretionaryStatus[] = [

    { id: 229, status: 1, statusDesc: "Review Status 1", typ: "rvw", dteUpd: "2015-05-15T10:59:55.430Z", usrUpd: "sa", dteCreated: "2015-05-15T11:00:00Z" },

    { id: 230, status: 2, statusDesc: "Review Status 2", typ: "rvw", dteUpd: "2015-05-15T11:00:27.863Z", usrUpd: "sa", dteCreated: "2015-05-15T11:00:00Z" },

    { id: 231, status: 3, statusDesc: "Review Status 3", typ: "rvw", dteUpd: "2015-05-15T11:00:27.863Z", usrUpd: "sa", dteCreated: "2015-05-15T11:00:00Z" }

];

// === QR (Query/Request?) ===
export const discretionaryStatus_QR: DiscretionaryStatus[] = [

    { id: 232, status: 11, statusDesc: "PR in progress", typ: "QR", dteUpd: "2012-10-12T16:08:01.000Z", usrUpd: "PrxUsr", dteCreated: "2012-10-12T16:08:00Z" },

    { id: 233, status: 12, statusDesc: "Submitted by Applicant", typ: "QR", dteUpd: "2013-01-25T15:39:53.947Z", usrUpd: "PrxUsr", dteCreated: "2013-01-25T15:40:00Z" },

    { id: 234, status: 14, statusDesc: "Submitted by Supervisor", typ: "QR", dteUpd: "2013-01-25T15:39:54.133Z", usrUpd: "PrxUsr", dteCreated: "2013-01-25T15:40:00Z" }

];

export const discretionary_status: DiscretionaryStatus[] = discretionaryStatus_Grant.concat(discretionaryStatus_Proj).concat(discretionaryStatus_Inst).concat(discretionaryStatus_Prog).concat(discretionaryStatus_Enq).concat(discretionaryStatus_AdFnd).concat(discretionaryStatus_Reqn).concat(discretionaryStatus_Rvw).concat(discretionaryStatus_QR);

//statuses
export const mandatoryStatuses: MandatoryStatus[] = [
    {
        id: 1,
        statusDesc: "Application",
        typ: "Grants",
        dateCreated: "2023-02-15T07:49:21.517Z",
    },
    {
        id: 2,
        statusDesc: "Submitted by Online User",
        typ: "Grants",
        dateCreated: "2023-02-15T07:50:37.610Z",
    },
    {
        id: 3,
        statusDesc: "Extension Granted",
        typ: "Grants",
        dateCreated: "2023-05-01T10:11:21.300Z",
    },
    {
        id: 4,
        statusDesc: "RSA Review Completed",
        typ: "Grants",
        dateCreated: "2023-06-27T06:13:36.160Z",
    },
    {
        id: 5,
        statusDesc: "RM Review Completed",
        typ: "Grants",
        dateCreated: "2023-06-27T06:13:47.930Z",
    },
    {
        id: 6,
        statusDesc: "Exec Review Completed",
        typ: "Grants",
        dateCreated: "2023-06-27T06:13:57.397Z",
    },
    {
        id: 7,
        statusDesc: "Evaluations Complete",
        typ: "Grants",
        dateCreated: "2023-06-27T06:14:07.943Z",
    },
    {
        id: 8,
        statusDesc: "Rejected after Full Assessment",
        typ: "Grants",
        dateCreated: "2023-06-27T06:14:16.630Z",
    },
    {
        id: 9,
        statusDesc: "Approved",
        typ: "Grants",
        dateCreated: "2024-10-09T00:00:00.000Z",
    }
];