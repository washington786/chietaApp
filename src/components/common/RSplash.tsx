import { Image, StyleSheet, View } from 'react-native'
import React from 'react'
import RWrapper from './RWrapper'
import RLoader from './RLoader'
import colors from '@/config/colors'
import RText from './RText'

const RSplash = () => {
    return (
        <RWrapper style={styles.con}>
            <View style={{ flex: 0.9, justifyContent: "center", alignItems: "center", gap: 8 }} >
                <Image
                    source={require("../../../assets/logo.png")}
                    resizeMode="contain"
                    resizeMethod="resize"
                    style={styles.img}
                />
                <RLoader />
            </View>
            <View style={{ flex: 0.1, width: "100%", alignItems: "center", justifyContent: "center" }} >
                <RText title="version 1.0" style={{ color: colors.gray[600] }} />
            </View>
        </RWrapper>
    )
}

export default RSplash

const styles = StyleSheet.create({
    con: {
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        backgroundColor: colors.primary[50],
        flexWrap: "nowrap",
        flex: 1
    },
    img: {
        height: 120,
        width: 120
    }
})