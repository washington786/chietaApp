// Shared type for every knowledge topic.
// - patterns: one or more RegExp tested against the normalised user query
// - response: a static string, or a function accepting (financialYear, currentYear) for dynamic content
export type KnowledgeResponse = string | ((fy: string, yr: number) => string);

export interface KnowledgeTopic {
    patterns: RegExp[];
    response: KnowledgeResponse;
}

export { ABOUT_TOPICS }       from './about';
export { GRANTS_TOPICS }      from './grants';
export { SDF_TOPICS }         from './sdf';
export { WSP_TOPICS }         from './wsp';
export { CAREERS_TOPICS }     from './careers';
export { MONITORING_TOPICS }  from './monitoring';
export { PAYMENT_TOPICS }     from './payment';
export { WHISTLE_TOPICS }     from './whistleblowing';
export { INTERSETA_TOPICS }   from './interseta';
export { SPOI_TOPICS }        from './spoi';
export { PHARMA_TOPICS }      from './pharma';
export { GOVERNANCE_TOPICS }  from './governance';
export { RESEARCH_TOPICS }    from './research';
export { FAQS_TOPICS }        from './faqs';

import { ABOUT_TOPICS }       from './about';
import { GRANTS_TOPICS }      from './grants';
import { SDF_TOPICS }         from './sdf';
import { WSP_TOPICS }         from './wsp';
import { CAREERS_TOPICS }     from './careers';
import { MONITORING_TOPICS }  from './monitoring';
import { PAYMENT_TOPICS }     from './payment';
import { WHISTLE_TOPICS }     from './whistleblowing';
import { INTERSETA_TOPICS }   from './interseta';
import { SPOI_TOPICS }        from './spoi';
import { PHARMA_TOPICS }      from './pharma';
import { GOVERNANCE_TOPICS }  from './governance';
import { RESEARCH_TOPICS }    from './research';
import { FAQS_TOPICS }        from './faqs';

/**
 * Master ordered list of all topics.
 * Bot.ts iterates this array and returns the first match — order matters for priority.
 */
export const ALL_TOPICS: KnowledgeTopic[] = [
    // Grants (most queried — place first)
    ...GRANTS_TOPICS,
    // WSP / ATR detail
    ...WSP_TOPICS,
    // SDF guide
    ...SDF_TOPICS,
    // Careers
    ...CAREERS_TOPICS,
    // About & sub-sectors
    ...ABOUT_TOPICS,
    // FAQs
    ...FAQS_TOPICS,
    // Operational: monitoring, payment, whistleblowing, inter-SETA
    ...MONITORING_TOPICS,
    ...PAYMENT_TOPICS,
    ...WHISTLE_TOPICS,
    ...INTERSETA_TOPICS,
    // SPOI / priority occupations
    ...SPOI_TOPICS,
    // Pharma subsector
    ...PHARMA_TOPICS,
    // Governance & risk
    ...GOVERNANCE_TOPICS,
    // Research, RPL, qualifications
    ...RESEARCH_TOPICS,
];
