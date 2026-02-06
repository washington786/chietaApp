import React, { FC, ReactNode } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '@/config/colors'

interface childrenProps {
    children?: ReactNode;
}

const AuthWrapper: FC<childrenProps> = ({ children }) => {
    return (
        <LinearGradient
            colors={[
                // `${colors.secondary[100]}E6`,
                // `${colors.slate[50]}F2`,
                `${colors.primary[300]}CC`,
                `${colors.primary[800]}B3`,
                `${colors.primary[600]}99`,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            {children}
        </LinearGradient>
    )
}

export default AuthWrapper