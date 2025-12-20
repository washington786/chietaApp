import React, { useCallback, useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

import { RSplash } from '@/components/common'
import ProviderWraper from '@/components/common/ProviderWraper'
import { BottomSheetWrapper } from '@/components/modules/application'
import useLoadAppFonts from '@/hooks/loadfonts/useLoadFonts'
import MainNavigation from '@/navigation/MainNavigation'
import Toast from 'react-native-toast-message'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@/store/store'
import colors from '@/config/colors'

SplashScreen.preventAutoHideAsync().catch(() => {
  let tm = setTimeout(() => SplashScreen.preventAutoHideAsync(), 100)
  clearTimeout(tm);
})

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const { loadedApplicationFonts } = useLoadAppFonts();

  useEffect(() => {
    if (loadedApplicationFonts) {
      const timer = setTimeout(() => {
        setAppIsReady(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [loadedApplicationFonts]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!loadedApplicationFonts || !appIsReady) {
    return <RSplash />
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BottomSheetWrapper>
            <ProviderWraper>
              <MainNavigation />
              <Toast />
            </ProviderWraper>
          </BottomSheetWrapper>
        </PersistGate>
      </Provider>
      <StatusBar backgroundColor={colors.primary[950]} barStyle={"default"} networkActivityIndicatorVisible={true} animated={true} />
    </View>
  )
}