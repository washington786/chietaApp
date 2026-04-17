import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { moderateScale, scale } from '@/utils/responsive'
import React, { useState } from 'react'
import RHeader from '@/components/common/RHeader'
import { RCol, RDivider, RToggleInfo, Scroller } from '@/components/common'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { contactOptions, faqs } from '@/core/helpers/support'
import colors from '@/config/colors'
import { Expandable } from '@/components/modules/application'

const SupportPage = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    return (
        <>
            <RHeader name='Help and Support' />
            <Scroller style={{ paddingHorizontal: 12 }}>
                <Animated.View entering={FadeInDown.duration(500)}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <Feather name="headphones" size={moderateScale(42)} color={colors.primary[800]} />
                        </View>
                        <Text style={styles.mainTitle}>Help & Support</Text>
                        <Text style={styles.subtitle}>We're here to help you</Text>
                    </View>

                    {/* Toggle between Contact Us and FAQs */}
                    <RToggleInfo
                        button1Label="Contact Us"
                        button2Label="FAQs"
                        defaultActive={1}
                        containerStyle={{ marginTop: 20 }}
                        buttonContainerStyle={{ marginBottom: 20 }}
                        content1={
                            <RCol style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray[200], padding: 16, borderRadius: 8, }}>
                                {contactOptions.map((item, index) => (
                                    <Animated.View
                                        key={index}
                                        entering={FadeInDown.delay(100 + index * 80).duration(500)}
                                    >
                                        <TouchableOpacity style={styles.contactCard} onPress={item.action}>
                                            <View style={styles.contactLeft}>
                                                <Feather name={item.icon} size={moderateScale(14)} color={colors.primary[800]} />
                                                <View style={{ marginLeft: 16 }}>
                                                    <Text style={styles.contactTitle}>{item.title}</Text>
                                                    <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
                                                </View>
                                            </View>
                                            <MaterialIcons name="arrow-forward-ios" size={moderateScale(18)} color="#aaa" />
                                        </TouchableOpacity>
                                    </Animated.View>
                                ))}
                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>
                                        Average response time: less than 24 hours
                                    </Text>
                                </View>
                            </RCol>
                        }
                        content2={
                            <View>
                                <RDivider />
                                {faqs.map((faq, index) => (
                                    <Expandable isExpanded={expandedIndex === index} key={index} title={faq.question} onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                                        <Animated.View
                                            key={index}
                                            entering={FadeInDown.delay(400 + index * 80).duration(500)}
                                            style={styles.faqCard}
                                        >
                                            <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                        </Animated.View>
                                    </Expandable>
                                ))}
                            </View>
                        }
                    />
                </Animated.View>
            </Scroller>
        </>
    )
}

export default SupportPage

const styles = StyleSheet.create({
    header: { alignItems: 'center', marginBottom: scale(30) },
    iconCircle: {
        width: scale(90),
        height: scale(90),
        borderRadius: scale(45),
        backgroundColor: '#6c5ce7' + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(20),
    },
    mainTitle: { fontSize: moderateScale(28), fontWeight: '800', color: '#2d3436' },
    subtitle: { fontSize: moderateScale(16), color: '#636e72', marginTop: scale(6) },
    sectionHeader: { fontSize: moderateScale(20), fontWeight: '700', color: '#2d3436', marginBottom: scale(16) },
    contactCard: {
        backgroundColor: colors.slate[100],
        padding: scale(18),
        borderRadius: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: scale(12),
    },
    contactLeft: { flexDirection: 'row', alignItems: 'center' },
    contactTitle: { fontSize: moderateScale(17), fontWeight: '600', color: '#2d3436' },
    contactSubtitle: { fontSize: moderateScale(15), color: '#636e72', marginTop: scale(2) },
    faqCard: {
        padding: scale(18),
        borderRadius: scale(16),
        marginBottom: scale(12),
    },
    faqQuestion: { fontSize: moderateScale(16), fontWeight: '700', color: '#2d3436', marginBottom: scale(6) },
    faqAnswer: { fontSize: moderateScale(12), color: colors.slate[600], lineHeight: moderateScale(22) },
    footer: { marginTop: scale(30), alignItems: 'center' },
    footerText: { fontSize: moderateScale(8), color: '#636e72' },
})