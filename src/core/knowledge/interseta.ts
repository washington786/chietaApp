import { KnowledgeTopic } from './index';

export const INTERSETA_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(inter.?seta.*transfer|transfer.*seta|move.*seta|join.*chieta|switch.*seta|change.*seta|inter.?seta)\b/,
        ],
        response:
            "Inter-SETA Transfer Process\n\n" +
            "If your company is currently registered with another SETA and wants to join CHIETA, here is the process:\n\n" +
            "Step-by-step (15 working days):\n" +
            "1. Employer submits a formal transfer request to their current SETA Accountant\n" +
            "2. Current SETA Accountant prepares and sends the company profile to CHIETA\u2019s Grants Manager\n" +
            "3. CHIETA Grants Manager assesses whether the company falls within CHIETA\u2019s primary scope\n" +
            "4. If approved, CHIETA Grants Manager approves and sends to CEO for final sign-off\n" +
            "5. Both SETAs issue formal notification letters\n\n" +
            "Important notes:\n" +
            "\u2022 Only companies within the Chemical Industries scope can join CHIETA\n" +
            "\u2022 DHET (Dept of Higher Education) must approve all SETA scope changes\n" +
            "\u2022 Transfers effective from 1 April each financial year\n\n" +
            "Need help determining if your company falls in CHIETA\u2019s scope?\n" +
            "[icon:mail] info@chieta.org.za | [icon:call] 011\u00a0628\u00a07000",
    },
];
