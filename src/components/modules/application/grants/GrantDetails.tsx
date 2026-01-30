import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { RCol, RDivider, RRow, RUpload } from '@/components/common'
import { Expandable } from './Expandable'
import { Button, Text } from 'react-native-paper'
import colors from '@/config/colors'
import FontAwesome from '@expo/vector-icons/FontAwesome';

const GrantDetails = () => {
    const [showDetails, setShowDetails] = React.useState<boolean>(true);
    return (
        <RCol style={styles.moduleContainer}>
            {/* title is focus area value */}
            <Expandable title='WIL-Workplacement for employement' isExpanded={showDetails} onPress={() => { setShowDetails(!showDetails) }}>
                <RCol style={{ padding: 5, gap: 4 }}>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Subcategory</Text>
                        <Text variant='bodySmall' style={styles.value} lineBreakMode='tail' numberOfLines={2}>Workplacement for employment-HET</Text>
                    </RRow>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Intervention</Text>
                        <Text variant='bodySmall' style={styles.value} lineBreakMode='tail' numberOfLines={2}>Mechanical Engineering</Text>
                    </RRow>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Approved Learners</Text>
                        <Text variant='bodySmall' style={styles.value} lineBreakMode='tail' numberOfLines={2}>4</Text>
                    </RRow>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Approved Amount/Learner</Text>
                        <Text variant='bodySmall' style={[styles.value, styles.cost]} lineBreakMode='tail' numberOfLines={2}>R60000.00</Text>
                    </RRow>
                    <RRow style={styles.row}>
                        <Text variant='titleSmall'>Contract No</Text>
                        <Text variant='bodySmall' style={[styles.value]} lineBreakMode='tail' numberOfLines={2}>Learner-Contract-DG2025/26-26765</Text>
                    </RRow>
                    <RDivider />
                    <Text variant='bodySmall' style={{ color: colors.primary[800] }}>Memorandum of Agreement (MOA) - (Trench 1a)</Text>

                    <RCol style={{ marginTop: 5 }}>
                        <Text variant='labelSmall' style={{ color: colors.zinc[800] }}>Download Files</Text>
                        <DownloadTemp fileName='Download Evaluation Outcome' />
                        <DownloadTemp fileName='Download MOA upload' />
                    </RCol>

                </RCol>
            </Expandable>
        </RCol>
    )
}


function DownloadTemp({ fileName, onPress }: { fileName: string, onPress?: () => void }) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 5, borderWidth: 0.4, borderColor: colors.blue[300], padding: 8, borderRadius: 20, width: "auto" }}>
            <FontAwesome name="cloud-download" size={24} color={colors.blue[400]} />
            <Text variant='bodySmall' style={{ color: colors.gray[500] }}>{fileName}</Text>
        </TouchableOpacity>
    )
}

export default GrantDetails

const styles = StyleSheet.create({
    moduleContainer: {
        marginVertical: 10,
    },
    row: { justifyContent: 'space-between', alignItems: 'center' },
    value: {
        flex: 1,
        textAlign: 'right',
        fontWeight: 'ultralight',
        fontSize: 10
    },
    cost: {
        fontWeight: 'bold',
        fontSize: 12,
        color: 'green',
    },
})