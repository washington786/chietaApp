export interface privacy {
    title: string;
    content: string;
}

const privacyPolicySections: privacy[] = [
    {
        title: "Introduction",
        content: "The Chemical Industries Education and Training Authority (CHIETA) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use the CHIETA Mobile Application."
    },
    {
        title: "Information We Collect",
        content: "When you use the CHIETA Mobile App, we may collect:\n• Personal details (name, surname, ID number, email, phone number)\n• Employment and training records\n• Organisation details (when applying for grants or linking an organisation)\n• Device information (device type, operating system, unique device ID)\n• Log-in credentials and usage data"
    },
    {
        title: "How We Use Your Information",
        content: "We use your information to:\n• Verify your identity and organisation\n• Process grant applications and discretionary funding requests\n• Communicate important updates and deadlines\n• Improve the app experience and fix bugs\n• Comply with legal and auditing requirements"
    },
    {
        title: "Data Sharing",
        content: "We do not sell your personal information. We may share your data only with:\n• Authorised CHIETA staff and auditors\n• Government departments when required by law\n• Third-party service providers (e.g., cloud hosting, analytics) who are contractually bound to protect your data"
    },
    {
        title: "Data Security",
        content: "We use industry-standard encryption and security measures to protect your information. Access is restricted to authorised personnel only."
    },
    {
        title: "Your Rights",
        content: "You have the right to:\n• Access your personal information\n• Request correction of inaccurate data\n• Request deletion of your data (where legally allowed)\n• Withdraw consent where applicable\n\nContact us at privacy@chieta.org.za for any of these requests."
    },
    {
        title: "Data Retention",
        content: "We keep your information only as long as required for legal, auditing, or operational purposes. Grant-related records are retained for a minimum of 7 years as required by South African law."
    },
    {
        title: "Changes to This Policy",
        content: "We may update this Privacy Policy from time to time. You will be notified of major changes inside the app and on the CHIETA website."
    }
];

export default privacyPolicySections;