import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RHeader from '@/components/common/RHeader'
import { Scroller } from '@/components/common'
import Animated, { FadeInDown } from 'react-native-reanimated';
import privacyPolicySections from '@/core/helpers/privacy';

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
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionContent}>{section.content}</Text>
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
        marginBottom: 40,
        marginTop: 10,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    mainTitle: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
    updated: { fontSize: 14, marginTop: 8 },
    section: { marginBottom: 28 },
    sectionTitle: { fontSize: 19, fontWeight: '700', marginBottom: 10 },
    sectionContent: { fontSize: 16, lineHeight: 26, opacity: 0.9 },
    footer: { marginTop: 30, alignItems: 'center' },
    footerText: {
        fontSize: 16, fontStyle: 'italic'
    }
})