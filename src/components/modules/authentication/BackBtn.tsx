import React from 'react'
import { TouchableOpacity } from 'react-native'
import usePageTransition from '@/hooks/navigation/usePageTransition';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/config/colors';

const BackBtn = () => {
    const { onBack } = usePageTransition();
    return (
        <TouchableOpacity onPress={onBack} style={{ position: "absolute", top: 16, right: 16, zIndex: 10, backgroundColor: `rgba(0,0,0,0.09)`, borderRadius: 100, padding: 6 }}>
            <Ionicons name="close-outline" size={34} color={colors.gray[100]} />
        </TouchableOpacity>
    )
}

export default BackBtn