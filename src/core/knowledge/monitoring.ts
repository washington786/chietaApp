import { KnowledgeTopic } from './index';

export const MONITORING_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(monitoring.*evaluation|m&e system|m&e walkthrough|m&e.*chieta|evaluation system|rsa.*evaluation|google form.*chieta|live dashboard|completion score|project score)\b/,
        ],
        response:
            "CHIETA Monitoring & Evaluation (M&E) System\n\n" +
            "The M&E system provides real-time oversight of funded projects.\n\n" +
            "How the system works:\n" +
            "1. RSAs submit evaluations via a Google Form (accessed through the Process Navigator hub)\n" +
            "2. Data flows into a structured Google Sheet (Columns A\u2013AI)\n" +
            "3. The system automatically calculates scores, statuses, and alert triggers\n" +
            "4. Managers view results through a Live Dashboard and Process Navigator\n\n" +
            "Key metrics:\n" +
            "\u2022 Completion Score: compliance % for each project (Column AF)\n" +
            "\u2022 Status: \u2018On Track\u2019, \u2018Needs Attention\u2019, or \u2018At Risk\u2019 (Column AG)\n" +
            "\u2022 Automated alert: if project score falls below 60%, M&E Lead is notified (Column AI)\n\n" +
            "Submission steps:\n" +
            "1. Navigate to the Google Form via the Process Navigator\n" +
            "2. Complete all project details and RSA assessments accurately\n" +
            "3. Check the Live Dashboard for updated results after submission\n\n" +
            "Common troubleshooting:\n" +
            "\u2022 REF! Error: clear manually entered data blocking the automated array\n" +
            "\u2022 Blank charts: ensure data is formatted as numeric percentages\n" +
            "\u2022 Email errors: check that all email addresses in the form are valid\n\n" +
            "For M&E queries: info@chieta.org.za",
    },
];
