import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import RHeader from '@/components/common/RHeader'
import { Scroller } from '@/components/common'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { contactOptions, faqs } from '@/core/helpers/support'

const SupportPage = () => {

    return (
        <>
            <RHeader name='Support' />
            <Scroller style={{ paddingHorizontal: 12 }}>
                <Animated.View entering={FadeInDown.duration(500)}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <Feather name="headphones" size={42} color="#6c5ce7" />
                        </View>
                        <Text style={styles.mainTitle}>Help & Support</Text>
                        <Text style={styles.subtitle}>We're here to help you</Text>
                    </View>

                    {/* Quick Contact Cards */}
                    <Text style={styles.sectionHeader}>Contact Us</Text>
                    {contactOptions.map((item, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInDown.delay(100 + index * 80).duration(500)}
                        >
                            <TouchableOpacity style={styles.contactCard} onPress={item.action}>
                                <View style={styles.contactLeft}>
                                    <Feather name={item.icon} size={24} color="#6c5ce7" />
                                    <View style={{ marginLeft: 16 }}>
                                        <Text style={styles.contactTitle}>{item.title}</Text>
                                        <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
                                    </View>
                                </View>
                                <MaterialIcons name="arrow-forward-ios" size={18} color="#aaa" />
                            </TouchableOpacity>
                        </Animated.View>
                    ))}

                    {/* FAQs */}
                    <Text style={[styles.sectionHeader, { marginTop: 30 }]}>Frequently Asked Questions</Text>
                    {faqs.map((faq, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInDown.delay(400 + index * 80).duration(500)}
                            style={styles.faqCard}
                        >
                            <Text style={styles.faqQuestion}>{faq.question}</Text>
                            <Text style={styles.faqAnswer}>{faq.answer}</Text>
                        </Animated.View>
                    ))}

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Average response time: less than 24 hours
                        </Text>
                    </View>
                </Animated.View>
            </Scroller>
        </>
    )
}

export default SupportPage

const styles = StyleSheet.create({
    header: { alignItems: 'center', marginBottom: 30 },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#6c5ce7' + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    mainTitle: { fontSize: 28, fontWeight: '800', color: '#2d3436' },
    subtitle: { fontSize: 16, color: '#636e72', marginTop: 6 },
    sectionHeader: { fontSize: 20, fontWeight: '700', color: '#2d3436', marginBottom: 16 },
    contactCard: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    contactLeft: { flexDirection: 'row', alignItems: 'center' },
    contactTitle: { fontSize: 17, fontWeight: '600', color: '#2d3436' },
    contactSubtitle: { fontSize: 15, color: '#636e72', marginTop: 2 },
    faqCard: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    faqQuestion: { fontSize: 16, fontWeight: '700', color: '#2d3436', marginBottom: 6 },
    faqAnswer: { fontSize: 15, color: '#555', lineHeight: 22 },
    footer: { marginTop: 30, alignItems: 'center' },
    footerText: { fontSize: 15, color: '#636e72', fontStyle: 'italic' },
})