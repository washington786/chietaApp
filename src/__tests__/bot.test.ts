import { describe, it, expect } from 'vitest'
import { getBotReply, QUICK_CHIPS, SUGGESTIONS, BotMessage } from '../core/helpers/bot'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const reply = (input: string, history: BotMessage[] = []) =>
    getBotReply(input, false, history)

const currentYear = new Date().getFullYear()
const financialYear = `${currentYear}/${String(currentYear + 1).slice(2)}`

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS — structure integrity
// ─────────────────────────────────────────────────────────────────────────────
describe('CHIETA Bot — exports', () => {
    it('SUGGESTIONS has 6 entries each with icon and label', () => {
        expect(SUGGESTIONS).toHaveLength(6)
        for (const s of SUGGESTIONS) {
            expect(s).toHaveProperty('icon')
            expect(s).toHaveProperty('label')
        }
    })

    it('QUICK_CHIPS has exactly 12 string entries', () => {
        expect(QUICK_CHIPS).toHaveLength(12)
        expect(QUICK_CHIPS.every(c => typeof c === 'string')).toBe(true)
    })

    it('getBotReply is a function', () => {
        expect(typeof getBotReply).toBe('function')
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// QUICK CHIPS — every chip triggers the correct handler
// ─────────────────────────────────────────────────────────────────────────────
describe('CHIETA Bot — QUICK_CHIPS routing', () => {
    it('"Tell me more" → topic menu', () => {
        expect(reply('Tell me more')).toContain('I can provide more detail')
    })

    it('"Eligibility requirements" → eligibility handler (not contact)', () => {
        const r = reply('Eligibility requirements')
        expect(r).toContain('Eligibility')
        expect(r).toContain('SIC')
    })

    it('"Application deadlines" → deadlines handler', () => {
        const r = reply('Application deadlines')
        expect(r).toContain('30 April')
        expect(r).toContain('Deadlines')
    })

    it('"Required documents" → documents handler', () => {
        const r = reply('Required documents')
        expect(r).toContain('Required Documents')
        expect(r).toContain('B-BBEE')
    })

    it('"Track my application" → tracking handler', () => {
        const r = reply('Track my application')
        expect(r).toContain('Tracking')
        expect(r).toContain('My Applications')
    })

    it('"Smart Skills Centres" → SSC handler (plural form)', () => {
        const r = reply('Smart Skills Centres')
        expect(r).toContain('Smart Skills Centres')
        expect(r).toContain('9 centres')
    })

    it('"SMME support" → SMME handler (not contact via "support")', () => {
        const r = reply('SMME support')
        expect(r).toContain('SMME')
        expect(r).toContain('630')
    })

    it('"Report fraud" → fraud handler', () => {
        expect(reply('Report fraud')).toContain('0800 333 120')
    })

    it('"What is SDL?" → mandatory grants handler', () => {
        const r = reply('What is SDL?')
        expect(r).toContain('SDL')
        expect(r).toContain('WSP')
    })

    it('"NQF levels explained" → NQF handler (plural "levels" not tripping skills-programme handler)', () => {
        const r = reply('NQF levels explained')
        expect(r).toContain('National Qualifications Framework')
        expect(r).toContain('Level 4')
    })

    it('"Learner stipend" → stipend handler (not learnerships via bare "learner")', () => {
        const r = reply('Learner stipend')
        expect(r).toContain('Stipend')
        expect(r).toContain('allowance')
    })

    it('"IMS portal help" → portal login handler (not contact via "help", not how-to-apply via "ims portal")', () => {
        const r = reply('IMS portal help')
        expect(r).toContain('Portal Login Help')
        expect(r).not.toContain('How to Apply for CHIETA Programmes')
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// PLURAL / NATURAL-LANGUAGE VARIANTS — chips use plural words
// ─────────────────────────────────────────────────────────────────────────────
describe('CHIETA Bot — plural & variant input forms', () => {
    it('"deadlines" (plural) → deadlines handler', () => {
        expect(reply('What are the application deadlines?')).toContain('30 April')
    })

    it('"documents" (plural) → documents handler', () => {
        expect(reply('What documents do I need?')).toContain('B-BBEE')
    })

    it('"Smart Skills Centres" (plural) → SSC handler', () => {
        expect(reply('Tell me about the Smart Skills Centres')).toContain('9 centres')
    })

    it('"eligibility" alone → eligibility handler', () => {
        expect(reply('What are the eligibility requirements?')).toContain('SIC')
    })

    it('"bursaries" (plural) → bursary handler', () => {
        expect(reply('How do I apply for bursaries?')).toContain('Industrial Futures Bursary')
    })

    it('"learnerships" (plural) → learnerships handler', () => {
        expect(reply('Tell me about learnerships')).toContain('work-based learning')
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC HANDLERS — at least one trigger phrase per handler
// ─────────────────────────────────────────────────────────────────────────────
describe('CHIETA Bot — topic handlers', () => {
    it('greeting (hi)', () => {
        expect(reply('Hello')).toContain('CHIETA Assistant')
    })

    it('greeting (howzit)', () => {
        expect(reply('Howzit')).toContain('CHIETA Assistant')
    })

    it('about CHIETA', () => {
        const r = reply('What is CHIETA?')
        expect(r).toContain('Chemical Industries Education')
        expect(r).toContain('Skills Development Act')
    })

    it('sub-sectors', () => {
        const r = reply('Which sectors does CHIETA cover?')
        expect(r).toContain('Petroleum')
        expect(r).toContain('Glass')
    })

    it('mandatory grants / WSP / ATR', () => {
        const r = reply('I need to submit my WSP and ATR')
        expect(r).toContain('WSP/ATR')
        expect(r).toContain('ims.chieta.org.za')
    })

    it('SDL explained', () => {
        const r = reply('What is a skills development levy?')
        expect(r).toContain('SDL')
    })

    it('discretionary grants', () => {
        const r = reply('Tell me about discretionary grants')
        expect(r).toContain('Discretionary Grants')
    })

    it('bursaries', () => {
        const r = reply('How can I get a bursary?')
        expect(r).toContain('R76')
        expect(r).toContain('Bursary@chieta.org.za')
    })

    it('learnerships', () => {
        const r = reply('Learnership opportunities in chemicals')
        expect(r).toContain('work-based learning')
    })

    it('skills programmes', () => {
        const r = reply('Are there accredited skills programmes?')
        expect(r).toContain('Skills Programmes')
    })

    it('ETQA / accreditation', () => {
        const r = reply('How do I get ETQA accreditation?')
        expect(r).toContain('ETQA')
    })

    it('Smart Skills Centres', () => {
        expect(reply('Where is the nearest SSC?')).toContain('ssc.chieta.org.za')
    })

    it('SMME / entrepreneur support', () => {
        expect(reply('SMME funding')).toContain('630')
    })

    it('career opportunities', () => {
        expect(reply('Are there job vacancies at CHIETA?')).toContain('vacancies')
    })

    it('contact / head office (no portal/ims words)', () => {
        const r = reply('How do I contact CHIETA?')
        expect(r).toContain('087 357 6608')
        expect(r).toContain('info@chieta.org.za')
    })

    it('regional offices', () => {
        expect(reply('Where is the Western Cape regional office?')).toContain('Faith Gcali')
    })

    it('fraud reporting', () => {
        expect(reply('I want to report fraud')).toContain('0800 333 120')
    })

    it('deadlines', () => {
        expect(reply('What are the key deadlines?')).toContain('30 April')
    })

    it('required documents', () => {
        expect(reply('What documents are required?')).toContain('B-BBEE certificate')
    })

    it('how to apply', () => {
        const r = reply('How do I apply for a grant?')
        expect(r).toContain('ims.chieta.org.za')
    })

    it('how to apply — "ims portal" without "help" still routes to apply handler', () => {
        const r = reply('I want to submit via the IMS portal')
        expect(r).toContain('ims.chieta.org.za')
    })

    it('track application', () => {
        expect(reply('How do I track my application?')).toContain('My Applications')
    })

    it('NQF levels', () => {
        const r = reply('Explain NQF levels to me')
        expect(r).toContain('Level 4')
        expect(r).toContain('Matric')
    })

    it('SDF (Skills Development Facilitator)', () => {
        expect(reply('What is an SDF?')).toContain('Skills Development Facilitator')
    })

    it('learner stipend', () => {
        const r = reply('Do learners get paid a stipend?')
        expect(r).toContain('allowance')
    })

    it('portal login / forgot password', () => {
        expect(reply('I forgot my portal password')).toContain('Forgot Password')
    })

    it('portal login via "ims portal help"', () => {
        expect(reply('IMS portal help')).toContain('Portal Login Help')
    })

    it('employer registration', () => {
        const r = reply('How do I register my company with CHIETA?')
        expect(r).toContain('SDL')
        expect(r).toContain('ims.chieta.org.za')
    })

    it('programme comparison (learnership vs internship)', () => {
        const r = reply("What's the difference between a learnership and an internship?")
        expect(r).toContain('Learnership')
        expect(r).toContain('Internship')
    })

    it('appeals / declined application', () => {
        const r = reply('My application was declined, how do I appeal?')
        expect(r).toContain('appeal')
        expect(r).toContain('30 days')
    })

    it('POPI / data privacy', () => {
        expect(reply('How does CHIETA handle my personal data?')).toContain('POPIA')
    })

    it('tenders / procurement', () => {
        expect(reply('I want to submit a tender to CHIETA')).toContain('etenders.gov.za')
    })

    it('governance / annual report', () => {
        expect(reply('Who is on the CHIETA board?')).toContain('Accounting Authority')
    })

    it('green skills', () => {
        expect(reply('Does CHIETA fund green skills training?')).toContain('Just Energy Transition')
    })

    it('postgraduate funding', () => {
        expect(reply("I'm doing a Master's degree, can I get funding?")).toContain('Postgraduate')
    })

    it('newsletter / subscribe', () => {
        expect(reply('How do I subscribe to the CHIETA newsletter?')).toContain('get notified about')
    })

    it('SSP / sector skills plan', () => {
        expect(reply('What does the SSP say about scarce skills?')).toContain('Sector Skills Plan')
    })

    it('eligibility / sector check', () => {
        expect(reply('Am I eligible for CHIETA funding?')).toContain('SIC')
    })

    it('TVET colleges', () => {
        expect(reply('I am at a TVET college, can I apply?')).toContain('N3')
    })

    it('B-BBEE / transformation', () => {
        expect(reply('Tell me about broad-based black economic empowerment')).toContain('Broad-Based Black Economic Empowerment')
    })

    it('processing times / turnaround', () => {
        expect(reply('How long does it take to process my application?')).toContain('Processing Times')
    })

    it('events / workshops', () => {
        expect(reply('Are there any CHIETA workshops coming up?')).toContain('Workshops')
    })

    it('CEIBS innovation programme', () => {
        expect(reply('Tell me about CEIBS Africa')).toContain('CEIBS Africa')
    })

    it('tell me more → full topic menu', () => {
        expect(reply('Tell me more')).toContain('I can provide more detail')
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// FUZZY MATCHING — typo tolerance via Levenshtein distance
// ─────────────────────────────────────────────────────────────────────────────
describe('CHIETA Bot — fuzzy typo matching', () => {
    it('"grnat" → suggests grant topic', () => {
        const r = reply('I need a grnat from chieta')
        expect(r).toContain('did you mean')
        expect(r).toContain('grant')
    })

    it('"burserry" → suggests bursary topic', () => {
        const r = reply('I need a burserry')
        expect(r).toContain('did you mean')
        expect(r).toContain('Bursaries')
    })

    it('"dealine" → suggests deadline topic', () => {
        const r = reply('What is the dealine for applications?')
        expect(r).toContain('deadline')
    })

    it('"fraudd" → suggests fraud topic', () => {
        const r = reply('fraudd')
        expect(r.toLowerCase()).toContain('fraud')
    })

    it('"portall" alone → suggests portal topic', () => {
        const r = reply('portall')
        expect(r.toLowerCase()).toContain('portal')
    })

    it('"stipned" → suggests stipend topic', () => {
        const r = reply('stipned')
        expect(r.toLowerCase()).toContain('stipend')
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-TURN CONTEXT — follow-ups expand on the previous bot topic
// ─────────────────────────────────────────────────────────────────────────────
describe('CHIETA Bot — multi-turn follow-ups', () => {
    it('"yes" after bursary message → expands bursary (not fallback)', () => {
        const history: BotMessage[] = [
            { role: 'user', text: 'Tell me about bursaries' },
            { role: 'bot', text: 'CHIETA Industrial Futures Bursary\nFor unemployed SA youth...' },
        ]
        const r = reply('yes', history)
        expect(r).not.toMatch(/^I didn/)
    })

    it('"more" after grants message → expands grants (not generic fallback)', () => {
        const history: BotMessage[] = [
            { role: 'user', text: 'Tell me about discretionary grants' },
            { role: 'bot', text: 'Discretionary Grants (DG) — WSP/ATR funding for employers...' },
        ]
        const r = reply('more', history)
        expect(r).not.toMatch(/^Thank you for your question/)
    })

    it('"ok" without conversation history → returns valid string (not crash)', () => {
        const r = reply('ok', [])
        expect(typeof r).toBe('string')
        expect(r.length).toBeGreaterThan(10)
    })

    it('"continue" follow-up triggers correct expansion', () => {
        const history: BotMessage[] = [
            { role: 'user', text: 'How do I submit WSP?' },
            { role: 'bot', text: 'Mandatory Grants — WSP / ATR\nSubmit before 30 April...' },
        ]
        const r = reply('continue', history)
        expect(r).not.toMatch(/^Thank you for your question/)
    })

    it('"more" after already-shown content → polite "already covered" (no duplicate)', () => {
        const aboutChieta = getBotReply('what is chieta', false)
        const history: BotMessage[] = [
            { role: 'user', text: 'What is CHIETA?' },
            { role: 'bot', text: aboutChieta },
        ]
        const r = reply('more', history)
        expect(r).toContain("I've already shared everything")
        expect(r).toContain('info@chieta.org.za')
    })

    it('"Tell me more" with history still shows topic menu (not multi-turn expansion)', () => {
        const history: BotMessage[] = [
            { role: 'user', text: 'What is CHIETA?' },
            { role: 'bot', text: 'CHIETA stands for the Chemical Industries Education...' },
        ]
        expect(reply('Tell me more', history)).toContain('I can provide more detail')
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC YEARS — responses must use current year, not hardcoded values
// ─────────────────────────────────────────────────────────────────────────────
describe('CHIETA Bot — dynamic year helpers', () => {
    it('deadlines response contains the current year', () => {
        expect(reply('What are the key deadlines?')).toContain(String(currentYear))
    })

    it('mandatory grants response contains the current year', () => {
        expect(reply('WSP ATR submission deadline')).toContain(String(currentYear))
    })

    it('bursary response contains the current year', () => {
        expect(reply('How do I apply for a bursary?')).toContain(String(currentYear))
    })

    it('discretionary grants response contains the correct financial year', () => {
        expect(reply('Tell me about discretionary grants')).toContain(financialYear)
    })

    it('tracking response contains the current year', () => {
        expect(reply('Track my application')).toContain(String(currentYear))
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// FILE ATTACHMENTS — hasAttachments flag overrides all pattern matching
// ─────────────────────────────────────────────────────────────────────────────
describe('CHIETA Bot — file attachment handling', () => {
    it('attachment triggers file acknowledgment', () => {
        const r = getBotReply('Here is my ID document', true, [])
        expect(r).toContain('Thank you for sharing that file')
        expect(r).toContain('info@chieta.org.za')
    })

    it('attachment flag takes priority even over strong keyword matches', () => {
        // Message mentions "bursary" but attachment flag should override everything
        const r = getBotReply('My bursary application documents', true, [])
        expect(r).toContain('Thank you for sharing that file')
    })

    it('no attachment → normal routing', () => {
        const r = getBotReply('My bursary application', false, [])
        expect(r).not.toContain('Thank you for sharing that file')
        expect(r).toContain('Industrial Futures Bursary')
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK — unknown / off-topic inputs get contact info
// ─────────────────────────────────────────────────────────────────────────────
describe('CHIETA Bot — fallback behaviour', () => {
    it('gibberish → fallback with contact details', () => {
        const r = reply('xyzzy qwerty plugh')
        expect(r).toContain('087 357 6608')
    })

    it('off-topic question → fallback with email', () => {
        const r = reply('What is the weather like today?')
        expect(r).toContain('info@chieta.org.za')
    })

    it('empty-ish input → returns non-empty string', () => {
        const r = reply('...')
        expect(typeof r).toBe('string')
        expect(r.length).toBeGreaterThan(0)
    })
})
