import { KnowledgeTopic } from './index';

export const PAYMENT_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(payment.*processing|payment.*portal|payment.*timeline|payment.*sla|25.?day|how long.*payment|when.*paid|payment.*status|pay.*grant|grant.*payment|funds.*released)\b/,
        ],
        response:
            "CHIETA Payment Processing\n\n" +
            "All grant and programme payments are processed via the CHIETA Payment Information Portal.\n\n" +
            "Required documents before payment can proceed:\n" +
            "\u2022 Valid tax clearance (TCS pin, verified on SARS website)\n" +
            "\u2022 Valid B-BBEE certificate or sworn affidavit\n" +
            "\u2022 Signed Memorandum of Agreement (MOA)\n" +
            "\u2022 Invoice on official letterhead with company banking details\n" +
            "\u2022 Certified proof of training / evidence of deliverable\n\n" +
            "Payment stages (25-business-day SLA):\n" +
            "Stage 1 \u2014 Verification: Compliance and document check (Days 1\u20135)\n" +
            "Stage 2 \u2014 Processing: Financial systems capture and internal approval (Days 6\u201315)\n" +
            "Stage 3 \u2014 Payment run: EFT processed and payment advice issued (Days 16\u201325)\n\n" +
            "Compliance notes:\n" +
            "\u2022 The clock only starts once ALL required documents are received\n" +
            "\u2022 Incomplete or incorrect submissions restart the SLA\n" +
            "\u2022 Banking details must match SARS records exactly\n\n" +
            "Track your payment:\nwww.chieta.org.za/stakeholder-portals/payment-information-portal/\n\n" +
            "[icon:mail] payments@chieta.org.za | [icon:call] 011\u00a0628\u00a07000",
    },
];
