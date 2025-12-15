import { FlatList, StyleSheet } from 'react-native'
import React, { FC, useMemo } from 'react'
import SkeletonLoader from './SkeletonLoader'

interface props {
    count: number;
}

const RListLoading: FC<props> = ({ count }) => {
    const data = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

    return (
        <FlatList
            keyExtractor={(index) => `skeleton-${index}`}
            data={data} renderItem={
                () => <SkeletonLoader />}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={styles.con}
        />
    )
}

export default RListLoading

const styles = StyleSheet.create({
    con: {
        flex: 1, flexGrow: 1, paddingHorizontal: 12, paddingVertical: 8
    }
})