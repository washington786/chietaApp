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

                        <Expandable title='Supporting documents' isExpanded={expandDocs} onPress={() => setDocs(!expandDocs)}>
                            <RUpload title='Tax Compliance' onPress={() => { }} />
                            <RUpload title='Company Registration' onPress={() => { }} />
                            <RUpload title='BBBEE Certificate/Affidavit' onPress={() => { }} />
                            <RUpload title='proof of accredetation' onPress={() => { }} />
                            <RUpload title='Letter of commitment' onPress={() => { }} />
                            <RUpload title='learner schedule' onPress={() => { }} />
                            <RUpload title='organization declaration of interest' onPress={() => { }} />
                            <RUpload title='Proof of banking details' onPress={() => { }} />
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