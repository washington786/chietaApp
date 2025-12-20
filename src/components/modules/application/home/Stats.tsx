import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Text as RText } from 'react-native-paper';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { RCol } from '@/components/common';
import colors from '@/config/colors';

const Stats = () => {
    return (
        <RCol style={{ backgroundColor: colors.zinc[50], borderRadius: 10, paddingHorizontal: 0, marginBottom: 5 }}>
            <RText variant='labelSmall' style={{ paddingVertical: 10 }}>Here are some of your stats</RText>
            {/* Stats */}
            <View style={styles.statsGrid}>
                <View style={[styles.statBox, { backgroundColor: '#7B61FF' }]}>
                    <FontAwesome5 name="project-diagram" size={24} color="#fff" style={styles.statIcon} />
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statLabel}>linked Orgs</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#0088FF' }]}>
                    <MaterialCommunityIcons name="account-clock" size={24} color="#fff" style={styles.statIcon} />
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statLabel}>Orgs Pending</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#1DD1A1' }]}>
                    <Ionicons name="calendar-outline" size={24} color="#fff" style={styles.statIcon} />
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statLabel}>upcoming events</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#FFB84C' }]}>
                    <MaterialIcons name="assignment" size={24} color="#fff" style={styles.statIcon} />
                    <Text style={styles.statNumber}>4</Text>
                    <Text style={styles.statLabel}>Application</Text>
                </View>
            </View>
        </RCol>
    )
}

export default Stats

const styles = StyleSheet.create({
    statsSection: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18 },
    statBox: { width: '48%', borderRadius: 12, padding: 18, marginBottom: 10 },
    statNumber: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
    statLabel: { fontSize: 14, color: '#fff', marginTop: 4 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 18 },
    statIcon: { marginBottom: 6 },
})