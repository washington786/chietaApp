import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import { Expandable } from '@/components/modules/application'
import { RUpload } from '@/components/common'

const DgApplicationDetails = () => {
    const [expandDocs, setDocs] = useState(false);
    return (
        <FlatList data={[]}
            style={styles.con}
            renderItem={null}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListFooterComponentStyle={{ paddingBottom: 30 }}
            ListFooterComponent={() => {
                return (
                    <>
                        <Text variant='titleMedium' style={styles.title}>All uploaded Mandotory Files</Text>

                        <Expandable title='Banking, training report, & verification' isExpanded={expandDocs} onPress={() => setDocs(!expandDocs)}>
                            <RUpload title='Proof of Banking details' onPress={() => { }} />
                            <RUpload title='Annual training report' onPress={() => { }} />
                            <RUpload title='verification document' onPress={() => { }} />
                        </Expandable>
                    </>
                )
            }}
        />
    )

}

export default DgApplicationDetails

const styles = StyleSheet.create({
    con: { paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1, backgroundColor: "white" },
    title: {
        fontSize: 16,
        color: colors.primary[950],
        marginVertical: 10
    }
})