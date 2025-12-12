import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import RHeader from '@/components/common/RHeader'
import { RButton, RCol, RDialog, RRow, RUpload, Scroller } from '@/components/common'
import { ActivityIndicator, FAB, Text } from 'react-native-paper'
import colors from '@/config/colors'
import appFonts from '@/config/fonts'
import AntDesign from '@expo/vector-icons/AntDesign';
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { showToast } from '@/core'
import Animated, { FadeInDown } from 'react-native-reanimated'
import useDocumentPicker from '@/hooks/main/UseDocumentPicker'
import { DocumentPickerResult } from 'expo-document-picker'
import { RUploadSuccess } from '@/components/modules/application'
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { removeLinkedOrganizationAsync } from '@/store/slice/thunks/OrganizationThunks'

const LinkOrgPage = () => {
    const { onBack } = usePageTransition();

    const route = useRoute<RouteProp<navigationTypes, 'orgLinking'>>();

    const dispatch = useDispatch<AppDispatch>();

    const { orgId } = route.params;

    console.log(orgId);
    const [removeDialog, setRemoveVisible] = useState(false);

    const { pickDocument, error, isLoading } = useDocumentPicker();

    const [file, setFile] = useState<DocumentPickerResult>();

    if (error) {
        console.log(error);
        showToast({ message: error, title: "Upload", type: "error", position: "top" })
    }

    async function handleUpload() {
        try {
            const result = await pickDocument();
            if (result) {
                setFile(result);
            }
        } catch (error) {
            showToast({ message: "failed to upload document", title: "Upload", type: "error", position: "top" })
        }
    }

    function handleSubmit() {
        showToast({ message: "Successfully submitted your appointment.", title: "Submitted", type: "success", position: "bottom" })
        setTimeout(() => {
            onBack();
        }, 1000);
    }

    function handleRemoveOrg() {
        dispatch(removeLinkedOrganizationAsync(Number(orgId))).unwrap().then(() => {
            showToast({ message: "Organization removed successfully.", title: "Removed", type: "success", position: "bottom" })
            setRemoveVisible(false);
            setTimeout(() => {
                onBack();
            }, 1000);
        }).catch((err) => {
            showToast({ message: err || "Failed to remove organization.", title: "Error", type: "error", position: "top" })
        })
    }

    return (
        <>
            <RHeader name='Linking Organization' />
            <Scroller style={{ paddingHorizontal: 12, position: "relative" }}>
                <Animated.View entering={FadeInDown.duration(500)}>
                    <InfoWrapper />
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(500)} >
                    <RCol style={styles.wrap}>
                        {
                            isLoading ? <RCol style={{ alignItems: "center", justifyContent: "center", gap: 8 }}>
                                <ActivityIndicator size={"small"} color={colors.primary[900]} />
                                <Text>uploading application letter</Text>
                            </RCol>
                                : <RUpload onPress={handleUpload} title='Upload Appointment Letter' />
                        }

                        {
                            file && file.assets && <RUploadSuccess file={file} />
                        }

                        <RButton title='submit' onPressButton={handleSubmit} styleBtn={styles.btn} />
                    </RCol>
                </Animated.View>
                <FAB
                    mode='flat'
                    icon="delete"
                    style={styles.fab}
                    onPress={() => setRemoveVisible(true)}
                    color='white'
                />
                <RDialog message='Are you sure you want to remove this organization from linking and uploading documents?' title='Remove Organization' hideDialog={() => setRemoveVisible(false)} visible={removeDialog} onContinue={handleRemoveOrg} />
            </Scroller>
        </>
    )
}

function InfoWrapper() {
    return (
        <RRow style={styles.con}>
            <AntDesign name="info-circle" size={24} color="white" />
            <Text variant='bodySmall' style={styles.txt}>Upload a signed grant application/sdf appointment letter on a company letter head.</Text>
        </RRow>
    )
}

export default LinkOrgPage

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 6,
        paddingVertical: 8,
        backgroundColor: colors.yellow[600],
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 4
    },
    txt: {
        color: colors.blue[50],
        fontFamily: `${appFonts.extaLight}`,
        marginHorizontal: 8
    },
    wrap: {
        marginVertical: 16
    },
    btn: {
        marginTop: 8,
        backgroundColor: colors.primary[900]
    },
    rmbtn: {
        marginTop: 8,
        backgroundColor: colors.red[900]
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100,
        backgroundColor: colors.red[500]
    },

})