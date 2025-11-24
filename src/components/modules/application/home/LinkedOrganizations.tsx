import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { RCol, RDialog, RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import Feather from '@expo/vector-icons/Feather';
import colors from '@/config/colors';
import ItemOrgs from './ItemOrgs';
import usePageTransition from '@/hooks/navigation/usePageTransition';
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet';
import { showToast } from '@/core';

const LinkedOrganizations = () => {
    const { newOrg, discretionaryGrants, mandatoryGrants } = usePageTransition();
    const { open, close } = useGlobalBottomSheet();

    const [visible, setVisible] = useState(false);

    function handleDialog() {
        close();
        setVisible(!visible);
    };

    function handleContinue() {
        setVisible(false);
        showToast({ message: "successfully delinked organization from your list.", type: "success", title: "De-linking", position: "top" })
    }

    function handleMandatoryGrants() {
        close();
        mandatoryGrants({ orgId: "1" });
    }
    function handleDiscretionaryGrants() {
        close();
        discretionaryGrants({ orgId: "1" });
    }

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
                <ItemOrgs onPress={() => open(<OrgDetails onDiscretionaryGrants={handleDiscretionaryGrants} onMandatoryGrants={handleMandatoryGrants} onDelink={handleDialog} />, { snapPoints: ["50%"] })} />
                <ItemOrgs isVerified={false} onPress={() => open(<OrgDetails onDiscretionaryGrants={handleDiscretionaryGrants} onMandatoryGrants={handleMandatoryGrants} onDelink={handleDialog} />, { snapPoints: ["50%"] })} />
            </RCol>
            {
                visible && <RDialog hideDialog={handleDialog} visible={visible} message='are you sure you want to de-link this organization?' title='Delink Org' onContinue={handleContinue} />
            }
        </RCol>
    )
}

interface OrgDetailsProps {
    onDiscretionaryGrants?: () => void;
    onMandatoryGrants?: () => void;
    onDelink?: () => void;
}
function OrgDetails({ onDelink, onMandatoryGrants, onDiscretionaryGrants }: OrgDetailsProps) {
    return <RCol style={{ position: 'relative' }}>
        <Text variant='titleLarge'>TBESS Consulting and Services</Text>
        <Text variant='titleLarge' style={{ fontSize: 11 }}>view applications in categories</Text>
        <TypeDetails title='Mandator grants' onpress={onMandatoryGrants} />
        <TypeDetails title='Discretionary grants' onpress={onDiscretionaryGrants} />

        <TouchableOpacity style={styles.delink} onPress={onDelink}>
            <Feather name="link-2" size={16} color="white" style={{ marginLeft: 6 }} />
            <Text variant='titleSmall' style={[styles.text, { textAlign: 'center', color: colors.slate[50] }]}>delink</Text>
        </TouchableOpacity>

    </RCol>
}

interface TypeDetailsProps {
    title?: string;
    onpress?: () => void;
}

function TypeDetails({ title, onpress }: TypeDetailsProps) {
    return <TouchableOpacity style={[styles.detbtn, { justifyContent: 'space-between' }]} onPress={onpress}>
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