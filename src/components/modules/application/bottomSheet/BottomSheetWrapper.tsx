import React, { FC, ReactNode } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GlobalBottomSheet } from '@/hooks/navigation/BottomSheet'

interface props {
    children: ReactNode
}
const BottomSheetWrapper: FC<props> = ({ children }) => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <GlobalBottomSheet>
                    {children}
                </GlobalBottomSheet>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default BottomSheetWrapper