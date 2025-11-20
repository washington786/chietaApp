import { View } from 'react-native'
import React, { ReactNode } from 'react'
import { PickerStyle } from '@/styles'

const RPickerContainer = ({ children }: { children: ReactNode }) => {
    return (
        <View style={PickerStyle.pickerContainer}>
            {children}
        </View>
    )
}

export default RPickerContainer