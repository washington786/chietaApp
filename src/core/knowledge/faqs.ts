import { KnowledgeTopic } from './index';

export const FAQS_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(faq|frequently asked|common question|most asked)\b/,
        ],
        response:
            "Frequently Asked Questions \u2014 CHIETA\n\n" +
            "Top questions:\n\n" +
            "Q: What is CHIETA?\n" +
            "A: CHIETA is the Chemical Industries Education & Training Authority \u2014 a SETA responsible for skills development in South Africa\u2019s chemical sector.\n\n" +
            "Q: How do I register on the IMS portal?\n" +
            "A: Visit https://ims.chieta.org.za, click \u2018Register\u2019, and follow the guided steps.\n\n" +
            "Q: When is the WSP/ATR deadline?\n" +
            "A: 30 April each year at midnight.\n\n" +
            "Q: When are discretionary grant applications open?\n" +
            "A: Typically between November and March. Watch the CHIETA website for call announcements.\n\n" +
            "Q: How long does payment take?\n" +
            "A: 25 business days from receipt of ALL correct documents.\n\n" +
            "Q: Can I apply for a bursary if I\u2019m unemployed?\n" +
            "A: Yes \u2014 bursaries for unemployed/previously disadvantaged individuals are available.\n\n" +
            "More at: www.chieta.org.za",
    },
    {
        patterns: [
            /\b(what is ofo|ofo code|ofo.*mean|explain.*ofo|ofo.*number)\b/,
        ],
        response:
            "OFO Codes Explained\n\n" +
            "OFO stands for Organising Framework for Occupations.\n\n" +
            "It\u2019s a national coding system used to classify occupations in South Africa. Every job in the WSP/ATR must be assigned the correct OFO code.\n\n" +
            "Finding your OFO code:\n" +
            "\u2022 CHIETA uses the 2021 OFO version\n" +
            "\u2022 Download: https://chieta.org.za/?s=OFO\n" +
            "\u2022 Correct codes are required for WSP/ATR submissions\n\n" +
            "Unsure about your code? Contact: misqueries@chieta.org.za",
    },
    {
        patterns: [
            /\b(portal login|ims.*login|ims.*portal|portal.*password|reset.*password|forgot.*password|can't.*login|cannot.*login|access.*portal)\b/,
        ],
        response:
            "CHIETA Portal Login Help\n\n" +
            "IMS Portal: https://ims.chieta.org.za\n" +
            "MIS Portal: https://mis.chieta.org.za\n\n" +
            "Login issues:\n" +
            "\u2022 Forgot password \u2192 click \u2018Forgot Password\u2019 on the login page\n" +
            "\u2022 Account locked \u2192 email misqueries@chieta.org.za\n" +
            "\u2022 Cannot register \u2192 ensure your company is registered with CHIETA first\n\n" +
            "First time on the portal? Your SDF must be registered and active.\n\n" +
            "IT Support: misqueries@chieta.org.za | 011\u00a0628\u00a07000",
    },
    {
        patterns: [
            /\b(contact.*chieta|chieta.*contact|phone.*chieta|email.*chieta|call.*chieta|reach.*chieta|head.*office)\b/,
        ],
        response:
            "CHIETA Contact Details\n\n" +
            "\ud83c\udfe2 Head Office \u2014 Johannesburg\n" +
            "Ground Floor, 6 Mellis Road, Rivonia, Johannesburg\n" +
            "Tel: 087 357 6608 | 011 628 7000\n" +
            "Email: info@chieta.org.za\n\n" +
            "Regional Offices:\n" +
            "\u2022 Western Cape: capetown@chieta.org.za | 021\u00a0461\u00a07000\n" +
            "\u2022 KwaZulu-Natal: durban@chieta.org.za | 031\u00a0305\u00a07000\n" +
            "\u2022 Eastern Cape: easterncape@chieta.org.za\n" +
            "\u2022 Limpopo: limpopo@chieta.org.za\n" +
            "\u2022 Mpumalanga: mpumalanga@chieta.org.za\n" +
            "\u2022 Northern Cape: northerncape@chieta.org.za\n" +
            "\u2022 Free State: frestate@chieta.org.za\n" +
            "\u2022 North West: northwest@chieta.org.za\n\n" +
            "Website: www.chieta.org.za\n" +
            "Fraud Hotline: 0800\u00a000\u00a0222",
    },
];
