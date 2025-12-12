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
import { ProgressTracker, RUploadSuccess } from '@/components/modules/application'
import { RouteProp, useRoute } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { removeLinkedOrganizationAsync, updateAppointmentLetterStatus } from '@/store/slice/thunks/OrganizationThunks';
import { Step } from '@/core/types/steps'
import { Feather } from '@expo/vector-icons'

const steps: Step[] = [
    {
        title: 'Submitted Appointment Letter',
        date: '18/11/2025',
        status: 'completed' as const,
    },
    {
        title: 'Appointment letter Reviewed',
        date: '12/12/2025',
        status: 'pending' as const,
    }
];

const LinkOrgPage = () => {
    const { onBack } = usePageTransition();

    const route = useRoute<RouteProp<navigationTypes, 'orgLinking'>>();
    const { linkedOrganizations } = useSelector((state: RootState) => state.linkedOrganization);

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
        dispatch(updateAppointmentLetterStatus({ isUploaded: true, orgId: Number(orgId) })).unwrap().then(() => {
            showToast({ message: "Successfully submitted your appointment.", title: "Submitted", type: "success", position: "bottom" });
        }).catch((error) => {
            console.log(error);
            showToast({ message: error || "Failed to submit appointment letter.", title: "Error", type: "error", position: "top" });
        });
    }

    const foundOrg = linkedOrganizations.find(org => org.id === Number(orgId));

    function handleRemoveOrg() {
        dispatch(removeLinkedOrganizationAsync(Number(orgId))).unwrap().then(() => {
            showToast({ message: "Organization removed successfully.", title: "Removed", type: "success", position: "bottom" })
            setRemoveVisible(false);
            setTimeout(() => {
                onBack();
            }, 1000);
        }).catch((err) => {
            console.log(err);
            showToast({ message: err || "Failed to remove organization.", title: "Error", type: "error", position: "top" })
        })
    }

    return (
        <>
            <RHeader name='Linking Organization' />
            <Scroller style={{ paddingHorizontal: 12, position: "relative" }}>
                <Animated.View entering={FadeInDown.duration(500)}>
                    {
                        foundOrg && foundOrg.isUploadedAppointmentLetter == false &&
                        <InfoWrapper />
                    }

                    {
                        foundOrg && foundOrg.isUploadedAppointmentLetter == true && <>
                            <Text variant='labelLarge'>Application Details</Text>

                            <RCol style={styles.wrapper}>
                                <Text variant='titleSmall' style={styles.orgTitle}>{foundOrg.organisationTradingName}</Text>
                                <Text variant='bodySmall' style={styles.orgTitle}>{foundOrg.organisationRegistrationNumber}</Text>
                                <RRow style={[styles.rowtFlex, styles.center, styles.gap, styles.row]}>
                                    <Feather name="mail" size={18} color="black" />
                                    <Text variant='labelMedium'>{foundOrg.organisationContactEmailAddress}</Text>
                                </RRow>
                                <RRow style={[styles.rowtFlex, styles.center, styles.gap, styles.row]}>
                                    <Feather name="phone" size={18} color="black" />
                                    <Text variant='labelMedium'>{foundOrg.organisationContactCellNumber}</Text>
                                </RRow>
                                <RRow style={[styles.rowtFlex, styles.center, styles.gap, styles.row]}>
                                    <Feather name="calendar" size={18} color="black" />
                                    <Text variant='labelMedium'>{foundOrg.dateBusinessCommenced.toString()}</Text>
                                </RRow>
                            </RCol>
                        </>
                    }

                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(500)} >
                    {
                        foundOrg && foundOrg.isUploadedAppointmentLetter == false &&

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
                    }

                    {foundOrg && foundOrg.isUploadedAppointmentLetter == true &&
                        <>
                            <Text variant='labelLarge'>Application Status</Text>
                            <RCol>
                                <ProgressTracker steps={steps} />
                            </RCol>
                            <RButton title='cancel linking' onPressButton={handleSubmit} styleBtn={styles.rmbtn} />
                        </>
                    }
                </Animated.View>
                {foundOrg && foundOrg.isUploadedAppointmentLetter == false &&

                    <FAB
                        mode='flat'
                        icon="delete"
                        style={styles.fab}
                        onPress={() => setRemoveVisible(true)}
                        color='white'
                    />
                }
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
    rowtFlex: {
        flex: 1
    },
    row: {
        marginTop: 5,
        paddingVertical: 4
    },
    center: {
        alignItems: "center"
    },
    gap: {
        gap: 8
    },
    orgTitle: {
        textTransform: "capitalize"
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
        backgroundColor: colors.red[600]
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 100,
        backgroundColor: colors.red[500]
    },
    wrapper: {
        backgroundColor: colors.primary[50],
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 10,
        marginVertical: 10
    }
})