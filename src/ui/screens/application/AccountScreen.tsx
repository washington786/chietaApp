import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { RDialog, RDivider, RLoaderAnimation, RVersion, SafeArea, Scroller } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors'
import usePageTransition from '@/hooks/navigation/usePageTransition'
import { showToast } from '@/core'
import { useGlobalBottomSheet } from '@/hooks/navigation/BottomSheet'
import { AccWrapper, DeactivateAccount } from '@/components/modules/application'
import Animated, { FadeInDown } from 'react-native-reanimated'
import UseAuth from '@/hooks/main/auth/UseAuth'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useGetPersonByUserIdQuery } from '@/store/api/api'
import { moderateScale, scale } from '@/utils/responsive'
import { useNavigation, NavigationProp } from '@react-navigation/native'
import { navigationTypes } from '@/core/types/navigationTypes'

const AccountScreen = () => {
    const { account, privacy, support, changePassword, linkedOrganizations } = usePageTransition();
    const { logout, deleteAccount } = UseAuth();
    const navigation = useNavigation<NavigationProp<navigationTypes>>();

    const [visible, setVisible] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const prevErrorRef = useRef<typeof error>(null);

    const { error, isLoading, user } = useSelector((state: RootState) => state.auth);

    const { data: sdfData } = useGetPersonByUserIdQuery(user?.id, { skip: !user?.id });
    const person = sdfData?.result.person;

    const { open, close } = useGlobalBottomSheet();

    const initials = (
        `${person?.firstname?.[0] ?? user?.firstName?.[0] ?? ''}${person?.lastname?.[0] ?? user?.lastName?.[0] ?? ''}`
    ).toUpperCase() || '?';
    const fullName = person
        ? `${person.firstname ?? ''} ${person.lastname ?? ''}`.trim()
        : user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : '';
    const roleLabel = user?.roles?.[0]?.name ?? 'SDF User';

    // Handle errors via useEffect
    useEffect(() => {
        if (error && !prevErrorRef.current) {
            showToast({
                message: error.message,
                type: "error",
                title: "Error",
                position: "top",
            })
        }
        prevErrorRef.current = error;
    }, [error])

    function handleDialog() {
        setVisible(!visible);
    };

    async function handleContinue() {
        setVisible(false);
        setIsSigningOut(true);
        try {
            await logout();
            showToast({ message: "Successfully signed out of your account.", type: "success", title: "Sign out", position: "top" });
            // Navigate directly — do not rely on the useEffect in RootStack to avoid
            // the Android "dark blank screen" race condition between Redux state clearing
            // and the navigation reset completing.
            navigation.reset({ index: 0, routes: [{ name: 'login' }] });
        } catch (err) {
            setIsSigningOut(false);
            console.error('Failed to logout:', err);
            showToast({ message: "Failed to sign out. Please try again.", type: "error", title: "Error", position: "top" });
        }
    }

    async function handleCloseSheet() {
        try {
            await deleteAccount();
            close();
            showToast({ message: "Successfully deactivated your account from CHIETA", type: "success", title: "Deactivated", position: "top" })
        } catch (error) {
            console.error('Failed to delete account:', error)
            showToast({ message: "Failed to deactivate account. Please try again.", type: "error", title: "Error", position: "top" })
        }
    }

    function handleBsheet() {
        open(<DeactivateAccount onCancel={close} onPress={handleCloseSheet} isLoading={isLoading} />, { "snapPoints": ["60%"] });
    }

    return (
        <SafeArea>
            {/* White overlay during sign-out — eliminates the Android dark-blank-screen
                that occurs between Redux state clearing and navigation.reset() completing */}
            {isSigningOut && (
                <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.signOutOverlay]}>
                    <RLoaderAnimation />
                </View>
            )}
            {/* Profile hero card */}
            <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.heroCard}>
                <View style={styles.avatarRing}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                </View>
                <View style={styles.heroInfo}>
                    <Text style={styles.heroName} numberOfLines={1}>{fullName || 'My Account'}</Text>
                    <Text style={styles.heroEmail} numberOfLines={1}>{user?.email ?? ''}</Text>
                    <View style={styles.roleBadge}>
                        <MaterialCommunityIcons name="shield-account" size={12} color={colors.primary[600]} />
                        <Text style={styles.roleBadgeText}>{roleLabel}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={account}>
                    <MaterialCommunityIcons name="pencil-outline" size={18} color={colors.primary[600]} />
                </TouchableOpacity>
            </Animated.View>

            <Scroller contentContainerStyle={styles.scrollContent}>
                {/* Profile section */}
                <Animated.View entering={FadeInDown.delay(80).duration(500).springify()}>
                    <Text style={styles.sectionLabel}>PROFILE</Text>
                    <View style={styles.sectionCard}>
                        <AccWrapper icon='person-sharp' title='Account Settings' onPress={account} />
                        <RDivider style={styles.itemDivider} />
                        <AccWrapper icon='file-tray-outline' title='Linked Organizations' onPress={linkedOrganizations} />
                        <RDivider style={styles.itemDivider} />
                        <AccWrapper icon='lock-closed-outline' title='Change Password' onPress={changePassword} />
                        <RDivider style={styles.itemDivider} />
                        <AccWrapper icon='lock-closed-sharp' title='Privacy' onPress={privacy} />
                        <RDivider style={styles.itemDivider} />
                        <AccWrapper icon='help-circle-sharp' title='Support' onPress={support} />
                    </View>
                </Animated.View>

                {/* Account actions section */}
                <Animated.View entering={FadeInDown.delay(160).duration(500).springify()}>
                    <Text style={styles.sectionLabel}>ACCOUNT ACTIONS</Text>
                    <View style={styles.sectionCard}>
                        <AccWrapper icon='exit-outline' title='Sign Out' onPress={handleDialog} />
                        <RDivider style={styles.itemDivider} />
                        <AccWrapper
                            icon='remove-circle-sharp'
                            title='Deactivate Account'
                            onPress={handleBsheet}
                            dangerStyle={{ backgroundColor: colors.red[100] }}
                            isDanger
                            dangerTextStyle={{ color: colors.red[600] }}
                        />
                    </View>
                    {isLoading && <RLoaderAnimation />}
                </Animated.View>

                {/* Footer */}
                <Animated.View entering={FadeInDown.delay(240).duration(500).springify()}>
                    <RVersion />
                </Animated.View>
            </Scroller>

            <RDialog hideDialog={handleDialog} visible={visible} message='Are you sure you want to sign out of your account?' title='Sign Out' onContinue={handleContinue} />
        </SafeArea>
    )
}

export default AccountScreen

const styles = StyleSheet.create({
    // Hero card
    heroCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(14),
        paddingVertical: scale(16),
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.slate[100],
        gap: scale(12),
    },
    avatarRing: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        borderWidth: 2,
        borderColor: colors.primary[300],
        padding: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: scale(54),
        height: scale(54),
        borderRadius: scale(27),
        backgroundColor: colors.primary[600],
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 1,
    },
    heroInfo: {
        flex: 1,
        gap: 3,
        minWidth: 0,
    },
    heroName: {
        fontSize: moderateScale(16),
        fontWeight: '700',
        color: colors.slate[900],
    },
    heroEmail: {
        fontSize: moderateScale(12),
        color: colors.slate[500],
        fontWeight: '500',
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
        backgroundColor: colors.primary[50],
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary[200],
    },
    roleBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.primary[600],
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    editBtn: {
        width: scale(34),
        height: scale(34),
        borderRadius: scale(17),
        backgroundColor: colors.primary[50],
        borderWidth: 1,
        borderColor: colors.primary[200],
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Scroll / sections
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 40,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: colors.slate[400],
        letterSpacing: 0.8,
        marginBottom: 6,
        marginLeft: 4,
    },
    sectionCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.slate[100],
        overflow: 'hidden',
        marginBottom: 24,
        shadowColor: colors.slate[900],
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0,
    },
    itemDivider: {
        marginLeft: 66,
    },
    signOutOverlay: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
})
