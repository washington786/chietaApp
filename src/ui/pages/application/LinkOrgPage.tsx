import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import RHeader from '@/components/common/RHeader'
import { RButton, RCol, RRow, RUpload, Scroller } from '@/components/common'
import { ActivityIndicator, Text } from 'react-native-paper'
import colors from '@/config/colors'
import appFonts from '@/config/fonts'
import AntDesign from '@expo/vector-icons/AntDesign';
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { showToast } from '@/core'
import Animated, { FadeInDown } from 'react-native-reanimated'
import useDocumentPicker from '@/hooks/main/UseDocumentPicker'
import { DocumentPickerResult } from 'expo-document-picker'
import { RUploadSuccess } from '@/components/modules/application'

const LinkOrgPage = () => {
    const { onBack } = usePageTransition();

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

    return (
        <>
            <RHeader name='Linking Organization' />
            <Scroller style={{ paddingHorizontal: 12 }}>
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

})