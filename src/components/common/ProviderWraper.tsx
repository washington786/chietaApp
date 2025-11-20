import React, { FC, ReactNode } from 'react'
import { PaperProvider } from 'react-native-paper'
import appTheme from '../../theme/appThemeConfig'
import SafeArea from './SafeArea'

const ProviderWraper: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <SafeArea>
            <PaperProvider theme={appTheme}>
                {children}
            </PaperProvider>
        </SafeArea>
    )
}

export default ProviderWraper