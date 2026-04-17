import React from 'react'
import { TouchableOpacity } from 'react-native'
import usePageTransition from '@/hooks/navigation/usePageTransition';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/config/colors';
import { moderateScale, scale } from '@/utils/responsive';

interface BackBtnProps {
    isLogin?: boolean;
}
const BackBtn = ({ isLogin }: BackBtnProps) => {
    const { onBack, landing } = usePageTransition();
    function handlePress() {
        return isLogin ? landing() : onBack();
    }
    return (
        <TouchableOpacity onPress={handlePress} style={{ position: "absolute", top: scale(16), right: scale(16), zIndex: 10, backgroundColor: `rgba(0,0,0,0.09)`, borderRadius: scale(100), padding: scale(6) }}>
            <Ionicons name="close-outline" size={moderateScale(34)} color={colors.gray[100]} />
        </TouchableOpacity>
    )
}

export default BackBtn