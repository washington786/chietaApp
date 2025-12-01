import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

import { RSplash } from '@/components/common'
import ProviderWraper from '@/components/common/ProviderWraper'
import { BottomSheetWrapper } from '@/components/modules/application'
import useLoadAppFonts from '@/hooks/loadfonts/useLoadFonts'
import MainNavigation from '@/navigation/MainNavigation'
import Toast from 'react-native-toast-message'

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
  }, [loadedApplicationFonts])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync()
    }
  }, [appIsReady])

  console.log(`fonts: ${loadedApplicationFonts}`);
  console.log(`app ready: ${appIsReady}`);


  if (!loadedApplicationFonts || !appIsReady) {
    return <RSplash />
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <BottomSheetWrapper>
        <ProviderWraper>
          <MainNavigation />
          <Toast />
        </ProviderWraper>
      </BottomSheetWrapper>
    </View>
  )
}