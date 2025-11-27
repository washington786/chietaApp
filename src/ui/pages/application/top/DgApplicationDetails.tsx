import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import { Expandable } from '@/components/modules/application'
import { RUpload } from '@/components/common'
import { BarChart } from 'react-native-gifted-charts'
import { ApplicationRecord, dgData as data } from '@/core/types/dt'

const DgApplicationDetails = () => {
    const [expandDocs, setDocs] = useState(false);
    const [expandProv, setProv] = useState(false);
    const [expandStatus, setStatus] = useState(false);
    const getCountByProvince = (data: ApplicationRecord[]) => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            counts[item.Province] = (counts[item.Province] || 0) + 1;
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };

    const getCountByStatus = (data: ApplicationRecord[]) => {
        const counts: Record<string, number> = {};
        data.forEach(item => {
            if (item.ApprovalStatus != null) {
                const status = String(item.ApprovalStatus);
                counts[status] = (counts[status] || 0) + 1;
            }
        });

        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    };

    const provinceData = getCountByProvince(data);
    const statusData = getCountByStatus(data);

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
                        <Expandable title='Province stats' isExpanded={expandProv} onPress={() => setProv(!expandProv)}>
                            <BarChart data={provinceData}
                                barWidth={20}
                                spacing={12}
                                yAxisThickness={0}
                                xAxisThickness={0}
                                initialSpacing={10}
                                maxValue={Math.max(...provinceData.map(d => d.value)) + 1} />
                        </Expandable>
                        <Expandable title='Status stats' isExpanded={expandStatus} onPress={() => setStatus(!expandStatus)}>
                            <BarChart data={statusData}
                                barWidth={20}
                                spacing={12}
                                yAxisThickness={0}
                                xAxisThickness={0}
                                initialSpacing={10}
                                maxValue={Math.max(...statusData.map(d => d.value)) + 1} />
                        </Expandable>
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