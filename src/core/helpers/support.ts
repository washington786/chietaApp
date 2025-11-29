import { Linking } from "react-native";

export const contactOptions = [
    {
        icon: 'phone' as const,
        title: 'Call Us',
        subtitle: '011 628 7000',
        action: () => Linking.openURL('tel:0116287000'),
    },
    {
        icon: 'mail' as const,
        title: 'Email Support',
        subtitle: 'info@chieta.org.za',
        action: () => Linking.openURL('mailto:info@chieta.org.za'),
    },
    {
        icon: 'message-square' as const,
        title: 'WhatsApp',
        subtitle: '+27 87 095 0000',
        action: () => Linking.openURL('https://wa.me/27870950000'),
    },
    {
        icon: 'globe' as const,
        title: 'Visit Website',
        subtitle: 'www.chieta.org.za',
        action: () => Linking.openURL('https://www.chieta.org.za'),
    },
];

export const faqs = [
    {
        question: 'How do I link my organisation?',
        answer: 'Go to Profile → My Organisations → "Add new" and enter your SDL/levy number.',
    },
    {
        question: 'When do grant cycles open?',
        answer: 'Mandatory grants: annually in April\nDiscretionary grants: multiple cycles — check the home screen.',
    },
    {
        question: 'I forgot my password',
        answer: 'Use "Forgot Password" on the login screen. A reset link will be sent to your registered email.',
    },
    {
        question: 'My application shows "unverified"',
        answer: 'CHIETA is still reviewing your organisation documents. This usually takes 3–7 working days.',
    },
];