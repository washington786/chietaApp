import { Image, StyleSheet } from 'react-native'
import React from 'react'
import RWrapper from './RWrapper'
import RLoader from './RLoader'
import colors from '@/colors'

const RSplash = () => {
    return (
        <RWrapper style={styles.con}>
            <Image
                source={require("../../../assets/logo.png")}
                resizeMode="contain"
                resizeMethod="resize"
                style={styles.img}
            />
            <RLoader />
        </RWrapper>
    )
}

export default RSplash

const styles = StyleSheet.create({
    con: {
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        backgroundColor: colors.primary[50]
    },
    img: {
        height: 120,
        width: 120
    }
})