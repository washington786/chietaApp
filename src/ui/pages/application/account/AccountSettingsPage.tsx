import { StyleSheet } from 'react-native'
import React from 'react'
import { RButton, RCol, RInput, RRow, Scroller } from '@/components/common'
import RHeader from '@/components/common/RHeader'
import colors from '@/config/colors'
import { Text } from 'react-native-paper'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'

const AccountSettingsPage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { open } = useGlobalBottomSheet();

    function handleUpdatePress() {
        open(
            <RCol style={{ paddingHorizontal: 12, paddingBottom: 20 }}>
                <RCol style={{ alignItems: 'center', marginVertical: 20 }}>
                    <MaterialIcons name="info" size={48} color={colors.primary[900]} />
                </RCol>
                <Text variant='titleMedium' style={{ textAlign: 'center', marginBottom: 12, fontWeight: 'bold' }}>
                    Feature Not Available
                </Text>
                <Text variant='bodyMedium' style={{ textAlign: 'center', color: colors.slate[600] }}>
                    Account profile updates are currently being developed and will be available soon. Please try again later.
                </Text>
            </RCol>,
            { snapPoints: ['40%'] }
        );
    }

    return (
        <>
            <RHeader name='Account Settings' />
            <Scroller style={styles.con}>

                <Animated.View entering={FadeInDown.duration(600)} style={styles.anim}>
                    <RInput placeholder={user && user.firstName ? user.firstName : 'First Name'} editable={false} />
                    <RInput placeholder={user && user.lastName ? user.lastName : 'Last Name'} editable={false} />
                    <RInput placeholder={user && user.username ? user.username : 'Username'} editable={false} />
                    <VerificationContent state={user && user.isEmailConfirmed ? true : false} title='' textState='verified' textState2='unverified' />
                    <RInput placeholder={user && user.email ? user.email : 'Email address'} editable={false} />

                    <RButton title='Update profile' onPressButton={handleUpdatePress} styleBtn={styles.btn} />

                </Animated.View>
            </Scroller>
        </>
    )
}

interface props {
    textState?: string;
    textState2?: string;
    state: boolean;
    title: string;
}
function VerificationContent({ state, textState, textState2, title }: props) {
    return (
        <RCol>
            {/* <Text variant='labelSmall'>{title}</Text> */}
            <RRow style={styles.verification}>
                <MaterialIcons name="verified" size={24} color={state ? colors.green[500] : colors.red[500]} />
                <Text>{state ? `${textState}` : `${textState2}`}</Text>
            </RRow>
        </RCol>
    )
}

export default AccountSettingsPage

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 12,
        gap: 8,
        marginTop: 10
    },
    btn: {
        backgroundColor: colors.primary[900],
        borderRadius: 5,
        marginTop: 30
    },
    col: {
        marginVertical: 10
    },
    anim: {
        gap: 8
    },
    verification: {
        alignItems: 'center',
        gap: 6,
    }
})