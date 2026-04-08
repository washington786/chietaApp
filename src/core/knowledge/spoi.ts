import { KnowledgeTopic } from './index';

export const SPOI_TOPICS: KnowledgeTopic[] = [
    {
        patterns: [
            /\b(spoi|scarce.*occupation|priority occupation|in.demand.*occupation|scarce.*skills.*list|priority.*skills.*list|spoi.*2025|spoi.*2026)\b/,
        ],
        response:
            "CHIETA SPOI List 2025\u20132026 \u2014 Scarce & Priority Occupations\n\n" +
            "Top scarce/priority occupations in the chemical industries sector:\n\n" +
            "NQF Level 1\u20133 (Artisan / Trade):\n" +
            "\u2022 Welder (NQF 2)\n" +
            "\u2022 Chemical Plant Controller / Operator (NQF 2\u20133)\n\n" +
            "NQF Level 4\u20135 (Technical):\n" +
            "\u2022 Boilermaker (NQF 4)\n" +
            "\u2022 Electrician (NQF 4)\n" +
            "\u2022 Instrument Mechanician (NQF 4)\n" +
            "\u2022 Millwright / Electromechanician (NQF 4)\n" +
            "\u2022 Fitter & Turner (NQF 4)\n" +
            "\u2022 Laboratory Analyst / Technician (NQF 4\u20135)\n\n" +
            "NQF Level 6+ (Professional):\n" +
            "\u2022 Chemical Engineer (NQF 7)\n" +
            "\u2022 Safety, Health, Environment & Quality (SHEQ) Practitioner (NQF 6)\n" +
            "\u2022 Industrial / Occupational Pharmacist (NQF 8)\n" +
            "\u2022 Environmental Specialist / Scientist (NQF 6\u20137)\n" +
            "\u2022 Biofuels / Petrochemical Engineer (NQF 7)\n" +
            "\u2022 Project Manager \u2014 Chemical Sector (NQF 6)\n\n" +
            "CHIETA prioritises funding for learnerships, apprenticeships, and bursaries in these occupations.\n\n" +
            "Full SPOI document: www.chieta.org.za/about-us/research-and-publications/ssp/\n[icon:mail] research@chieta.org.za",
    },
];
