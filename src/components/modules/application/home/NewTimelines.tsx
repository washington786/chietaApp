import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const NewTimelines = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Application Timelines</Text>
            <View style={styles.cardsRow}>
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Mandatory Grants</Text>
                    <View style={styles.timerBox}>
                        <Ionicons name="time-outline" size={28} color="#fff" style={{ marginRight: 12 }} />
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
                        <Ionicons name="time-outline" size={28} color="#fff" style={{ marginRight: 12 }} />
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
        borderRadius: 10,
        padding: 5
    },
    title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '400',
        marginBottom: 14,
    },
    cardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#E48C2A',
        borderRadius: 10,
        width: '48%',
        padding: 10,
        position: 'relative',
        minHeight: 140,
        justifyContent: 'flex-start',
    },
    cardLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 18,
        textAlign: 'left',
    },
    timerBox: {
        backgroundColor: '#F4A64C',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginBottom: 18,
    },
    timerText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 2,
    },
    timerSub: {
        color: '#fff',
        fontSize: 13,
        marginTop: 2,
    },
    closedTag: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#F24E1E',
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 18,
        paddingVertical: 6,
    },
    closedText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});