import { StyleSheet, Text, View } from 'react-native'
import { moderateScale, scale } from '@/utils/responsive'
import React from 'react'
import RHeader from '@/components/common/RHeader'
import { Scroller } from '@/components/common'
import Animated, { FadeInDown } from 'react-native-reanimated';
import privacyPolicySections from '@/core/helpers/privacy';
import { Text as RText } from 'react-native-paper'
import colors from '@/config/colors';
const PrivacyPage = () => {
    return (
        <>
            <RHeader name='Privacy Policy' />
            <Scroller style={{ paddingHorizontal: 12 }}>
                <Animated.View entering={FadeInDown.duration(500)}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.mainTitle}>Privacy Policy</Text>
                        <Text style={styles.updated}>Last updated: 29 November 2025</Text>
                    </View>

                    {/* Sections */}
                    {privacyPolicySections.map((section, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeInDown.delay(100 + index * 80).duration(500)}
                            style={styles.section}
                        >
                            <RText variant='titleLarge'>{section.title}</RText>
                            <RText variant='bodySmall' style={styles.sectionContent}>{section.content}</RText>
                        </Animated.View>
                    ))}

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Thank you for trusting CHIETA with your information
                        </Text>
                    </View>
                </Animated.View>
            </Scroller>
        </>
    )
}

export default PrivacyPage

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: scale(40),
        marginTop: scale(10),
    },
    mainTitle: { fontSize: moderateScale(28), fontWeight: '800', textAlign: 'center' },
    updated: { fontSize: moderateScale(14), marginTop: scale(8) },
    section: { marginBottom: scale(28) },
    sectionTitle: { fontSize: moderateScale(19), fontWeight: '700', marginBottom: scale(10) },
    sectionContent: { fontSize: moderateScale(10), lineHeight: moderateScale(26), opacity: 0.9, fontWeight: "thin", color: colors.gray[600], textAlign: "justify" },
    footer: { marginTop: scale(30), alignItems: 'center' },
    footerText: {
        fontSize: moderateScale(8), color: colors.gray[600]
    }
})