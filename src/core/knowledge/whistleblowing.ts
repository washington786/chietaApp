import { KnowledgeTopic } from './index';

export const WHISTLE_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(whistle.*blow|report.*fraud|report.*corruption|report.*misconduct|report.*irregularit|anonymous.*report|fraud.*report|corruption.*report|tip.?off|fraudline)\b/,
        ],
        response:
            "CHIETA Whistleblowing Policy\n\n" +
            "CHIETA is committed to clean governance. All stakeholders can report misconduct anonymously.\n\n" +
            "What to report (examples):\n" +
            "\u2022 Misuse or misrepresentation of grant funds\n" +
            "\u2022 Fictitious training (claiming funds for training that did not occur)\n" +
            "\u2022 Bribery or requests for payment to process a claim\n" +
            "\u2022 Irregular procurement or tender manipulation\n" +
            "\u2022 Fraudulent invoices or SETA collusion\n\n" +
            "How to report (anonymous channels):\n" +
            "\u2022 Email: chieta@whistleblowing.co.za\n" +
            "\u2022 Online portal: www.whistleblowing.co.za\n" +
            "\u2022 CHIETA Anti-Fraud Hotline: 0800 333 120 (toll-free, anonymous)\n\n" +
            "Important:\n" +
            "Whistleblowing is for reporting suspected fraud, corruption, or serious misconduct \u2014 NOT for general admin queries or grant complaints. For admin issues, contact info@chieta.org.za.\n\n" +
            "All reports are handled confidentially.\n" +
            "The Protected Disclosures Act protects bona fide whistleblowers.",
    },
];
