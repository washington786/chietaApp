import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { RCol, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather';
import colors from '@/config/colors';
import ItemOrgs from './ItemOrgs';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet';

const LinkedOrganizations = () => {
    const { newOrg } = usePageTransition();
    const { open } = useGlobalBottomSheet();
    return (
        <RCol>
            <RRow style={{ alignItems: 'center', gap: 6, marginBottom: 12, justifyContent: 'space-between' }}>
                <Text variant='titleSmall'>my linked organizations</Text>
                <TouchableOpacity style={styles.btn} onPress={newOrg}>
                    <Feather name="link-2" size={16} color="black" style={{ marginLeft: 6 }} />
                    <Text variant='titleSmall'>add new</Text>
                </TouchableOpacity>
            </RRow>
            <RCol>
                <ItemOrgs onPress={() => open(<OrgDetails />, { snapPoints: ["50%"] })} />
                <ItemOrgs isVerified={false} onPress={() => open(<OrgDetails />, { snapPoints: ["50%"] })} />
            </RCol>
        </RCol>
    )
}

function OrgDetails() {
    return <RCol style={{ position: 'relative' }}>
        <Text variant='titleLarge'>TBESS Consulting and Services</Text>
        <Text variant='titleLarge' style={{ fontSize: 11 }}>view applications in categories</Text>
        <TypeDetails title='Mandator grants' />
        <TypeDetails title='Discretionary grants' />
        <TouchableOpacity style={styles.delink}>
            <Feather name="link-2" size={16} color="white" style={{ marginLeft: 6 }} />
            <Text variant='titleSmall' style={[styles.text, { textAlign: 'center', color: colors.slate[50] }]}>delink</Text>
        </TouchableOpacity>
    </RCol>
}

interface TypeDetailsProps {
    title?: string;
}
function TypeDetails({ title }: TypeDetailsProps) {
    return <TouchableOpacity style={[styles.detbtn, { justifyContent: 'space-between' }]}>
        <Text variant='titleSmall' style={styles.text}>{title}</Text>
        <Feather name="chevron-right" size={16} color="black" style={{ marginLeft: 6 }} />
    </TouchableOpacity>
}


export default LinkedOrganizations

const styles = StyleSheet.create({
    btn: {
        backgroundColor: colors.blue[100],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: "center",
        flexDirection: "row",
        gap: 3
    },
    text: {
        flex: 1,
        textTransform: 'capitalize'
    },
    detbtn: {
        backgroundColor: colors.slate[100],
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 3
    },
    delink: {
        justifyContent: 'center', marginTop: 12, position: 'absolute', bottom: -70, right: 0, padding: 10, borderRadius: 100, backgroundColor: colors.red[500], alignItems: 'center'
    }
})