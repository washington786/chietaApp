import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { moderateScale, scale, verticalScale } from '@/utils/responsive';

const NewTimelines = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Application Timelines</Text>
            <View style={styles.cardsRow}>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Mandatory Grants</Text>
                    <View style={styles.timerBox}>
                        <Ionicons name="time-outline" size={moderateScale(28)} color="#fff" style={{ marginRight: scale(12) }} />
                        <View>
                            <Text style={styles.timerText}>00 00 00 00</Text>
                            <Text style={styles.timerSub}>dd hh mm ss</Text>
                        </View>
                    </View>
                    <View style={styles.closedTag}>
                        <Text style={styles.closedText}>closed</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Discretionary Grants</Text>
                    <View style={styles.timerBox}>
                        <Ionicons name="time-outline" size={moderateScale(28)} color="#fff" style={{ marginRight: scale(12) }} />
                        <View>
                            <Text style={styles.timerText}>00 00 00 00</Text>
                            <Text style={styles.timerSub}>dd hh mm ss</Text>
                        </View>
                    </View>
                    <View style={styles.closedTag}>
                        <Text style={styles.closedText}>closed</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default NewTimelines

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#40004D',
        borderRadius: scale(10),
        padding: scale(5)
    },
    title: {
        color: '#fff',
        fontSize: moderateScale(20),
        fontWeight: '400',
        marginBottom: scale(14),
    },
    cardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#E48C2A',
        borderRadius: scale(10),
        width: '48%',
        padding: scale(10),
        position: 'relative',
        minHeight: verticalScale(140),
        justifyContent: 'flex-start',
    },
    cardLabel: {
        color: '#fff',
        fontSize: moderateScale(18),
        fontWeight: '500',
        marginBottom: scale(18),
        textAlign: 'left',
    },
    timerBox: {
        backgroundColor: '#F4A64C',
        borderRadius: scale(20),
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scale(5),
        paddingHorizontal: scale(5),
        marginBottom: scale(18),
    },
    timerText: {
        color: '#fff',
        fontSize: moderateScale(14),
        fontWeight: '500',
        letterSpacing: 2,
    },
    timerSub: {
        color: '#fff',
        fontSize: moderateScale(13),
        marginTop: scale(2),
    },
    closedTag: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#F24E1E',
        borderBottomRightRadius: scale(10),
        borderTopLeftRadius: scale(10),
        paddingHorizontal: scale(18),
        paddingVertical: scale(6),
    },
    closedText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '500',
    },
});