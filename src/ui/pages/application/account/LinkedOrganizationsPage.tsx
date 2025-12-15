import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RHeader from '@/components/common/RHeader'
import { Scroller } from '@/components/common'
import Animated, { FadeInDown } from 'react-native-reanimated'

const LinkedOrganizationsPage = () => {
    return (
        <>
            <RHeader name='Account Settings' />
            <Scroller style={styles.con}>
                <Animated.View entering={FadeInDown.duration(600)} style={styles.anim}>
                    <Text>Linked Organizations Page</Text>
                </Animated.View>
            </Scroller>
        </>
    )
}

export default LinkedOrganizationsPage

const styles = StyleSheet.create({
    con: {
        paddingHorizontal: 12,
        gap: 8,
        marginTop: 10
    },
    anim: {
        padding: 5,
    }
})