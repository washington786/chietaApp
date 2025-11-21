import React, { FC, ReactNode } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '@/config/colors'

interface childrenProps {
    children?: ReactNode;
}

const AuthWrapper: FC<childrenProps> = ({ children }) => {
    return (
        <LinearGradient colors={[colors.slate['50'], colors.slate['100']]} style={{ flex: 1 }}>
            {children}
        </LinearGradient>
    )
}

export default AuthWrapper