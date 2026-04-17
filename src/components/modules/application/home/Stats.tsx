import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Text as RText } from 'react-native-paper';
import { moderateScale, scale } from '@/utils/responsive';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { RCol } from '@/components/common';
import colors from '@/config/colors';

const Stats = () => {
    return (
        <RCol style={{ backgroundColor: colors.zinc[50], borderRadius: scale(10), paddingHorizontal: 0, marginBottom: scale(5) }}>
            <RText variant='labelSmall' style={{ paddingVertical: scale(10) }}>Here are some of your stats</RText>
            {/* Stats */}
            <View style={styles.statsGrid}>
                <View style={[styles.statBox, { backgroundColor: '#7B61FF' }]}>
                    <FontAwesome5 name="project-diagram" size={moderateScale(24)} color="#fff" style={styles.statIcon} />
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statLabel}>linked Orgs</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#0088FF' }]}>
                    <MaterialCommunityIcons name="account-clock" size={moderateScale(24)} color="#fff" style={styles.statIcon} />
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statLabel}>Orgs Pending</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#1DD1A1' }]}>
                    <Ionicons name="calendar-outline" size={moderateScale(24)} color="#fff" style={styles.statIcon} />
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statLabel}>upcoming events</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#FFB84C' }]}>
                    <MaterialIcons name="assignment" size={moderateScale(24)} color="#fff" style={styles.statIcon} />
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statLabel}>Application</Text>
                </View>
            </View>
        </RCol>
    )
}

export default Stats

const styles = StyleSheet.create({
    statsSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: scale(18) },
    statBox: { width: '48%', borderRadius: scale(12), padding: scale(18), marginBottom: scale(10) },
    statNumber: { fontSize: moderateScale(22), color: '#fff', fontWeight: 'bold' },
    statLabel: { fontSize: moderateScale(14), color: '#fff', marginTop: scale(4) },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: scale(18) },
    statIcon: { marginBottom: scale(6) },
})