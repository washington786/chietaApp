import { FlatList, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { RDivider } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors';
import { Expandable, TextWrap } from '@/components/modules/application';

const DetailsPage = () => {

    const [expandSdf, setExpandSdf] = useState(false);
    const [expandOrg, setExpandOrg] = useState(false);
    const [expandBank, setExpandBank] = useState(false);

    return (
        <FlatList data={[]}
            style={{ paddingHorizontal: 12, paddingVertical: 6, flex: 1, flexGrow: 1 }}
            renderItem={null}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListFooterComponentStyle={{ paddingBottom: 30 }}
            ListFooterComponent={() => {
                return (
                    <>
                        <Expandable title='bank details' isExpanded={expandBank} onPress={() => setExpandBank(!expandBank)}>
                            <TextWrap desc='Bank' title='Standard Bank' />
                            <TextWrap desc='Branch Name' title='Standard Bank' />
                            <TextWrap desc='code' title='051001' />
                            <TextWrap desc='Account number' title='00000000000' />
                            <TextWrap desc='Account holder' title='Retlhonolofetse Trading And ' />
                            <TextWrap desc='Type' title='cheque' />
                        </Expandable>

                        <Expandable title='sdf details' isExpanded={expandSdf} onPress={() => setExpandSdf(!expandSdf)}>
                            <TextWrap desc='Designation' title='Director' />
                            <TextWrap desc='title' title='Mrs' />
                            <TextWrap desc='Fullnames' title='Lydia Motaung' />
                            <TextWrap desc='ID Numbber' title='00000000000000' />
                            <TextWrap desc='Phone' title='(+27)81 276 7830' />
                            <TextWrap desc='cell phone' title='(+27)81 276 7830' />
                            <TextWrap desc='Email' title='(+27)81 276 7830' />
                            <RDivider />
                            <Text>Demographics</Text>
                            <RDivider />
                            <TextWrap desc='DOB' title='0000-00-00' />
                            <TextWrap desc='gender' title='0000-00-00' />
                            <TextWrap desc='Language' title='english' />
                            <TextWrap desc='Equity' title='African' />
                            <TextWrap desc='Nationality' title='South African' />
                            <TextWrap desc='citizenship' title='South Africa' />
                        </Expandable>

                        <Expandable title='organization details' isExpanded={expandOrg} onPress={() => setExpandOrg(!expandOrg)}>
                            <TextWrap desc='SDL No' title='Director' />
                            <TextWrap desc='Org No' title='Mrs' />
                            <TextWrap desc='trade name' title='Lydia Motaung' />
                            <TextWrap desc='sic code' title='00000000000000' />
                            <TextWrap desc='core business' title='(+27)81 276 7830' />
                            <TextWrap desc='No of Emps' title='(+27)81 276 7830' />
                            <TextWrap desc='company size' title='(+27)81 276 7830' />
                            <TextWrap desc='BBBEE status' title='0000-00-00' />
                            <TextWrap desc='BBEE Level' title='0000-00-00' />
                            <TextWrap desc='sub sector' title='english' />
                            <TextWrap desc='registration no' title='African' />
                            <RDivider />
                            <Text>Organization Contact Details</Text>
                            <RDivider />
                            <TextWrap desc='Phone' title='(+27)00 000 0000' />
                            <TextWrap desc='Cellphone' title='(+27)00 000 0000' />
                            <TextWrap desc='Email' title='admin@retlhonolofetse.co.za' />
                            <RDivider />
                            <Text>CEO Details</Text>
                            <RDivider />
                            <TextWrap desc='Fullname' title='Lydia Tseke' />
                            <TextWrap desc='Email' title='lydia@retlhonolofetse.co.za' />
                            <TextWrap desc='Race' title='African' />
                            <TextWrap desc='Gender' title='Female' />
                            <Text>CFO Details</Text>
                            <RDivider />
                            <TextWrap desc='Fullname' title='Lucy Hakunavhanu' />
                            <TextWrap desc='Email' title='lucy@retlhonolofetse.co.za' />
                            <TextWrap desc='Race' title='African' />
                            <TextWrap desc='Gender' title='Female' />
                        </Expandable>
                    </>
                )
            }}
        />
    )
}

export default DetailsPage

const styles = StyleSheet.create({
    text: {
        textTransform: "capitalize"
    },
    wrap: {
        alignItems: "center",
        justifyContent: "space-between"
    },
    appTitle: {
        fontSize: 10
    },
    lbl: {
        color: colors.gray[400],
        textTransform: "capitalize"
    },
    capText: {
        textTransform: "capitalize"
    }
})