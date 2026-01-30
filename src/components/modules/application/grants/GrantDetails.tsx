import { StyleSheet, View } from 'react-native'
import React from 'react'
import { RCol, RDivider, RRow } from '@/components/common'
import { Expandable } from './Expandable'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'

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
                </RCol>
            </Expandable>
        </RCol>
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