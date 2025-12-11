import React, { FC } from 'react'
import { RRow } from '@/components/common'
import { Text } from 'react-native-paper'
import colors from '@/config/colors';
import Ionicons from '@expo/vector-icons/Ionicons';

interface props {
    file: any;
}

const RUploadSuccess: FC<props> = ({ file }) => {
    return (
        <RRow style={{ alignItems: "center", gap: 4 }}>
            <Ionicons name="checkmark-done-circle" size={24} color={colors.green[500]} />
            <Text variant='titleMedium'>{file.assets[0]?.name}</Text>
        </RRow>
    )
}

export default RUploadSuccess