import React from 'react'
import { TouchableOpacity } from 'react-native'
import usePageTransition from '@/hooks/navigation/usePageTransition';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/config/colors';

const BackBtn = () => {
    const { onBack } = usePageTransition();
    return (
        <TouchableOpacity onPress={onBack} style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}>
            <Ionicons name="close-outline" size={34} color={colors.gray[600]} />
        </TouchableOpacity>
    )
}

export default BackBtn