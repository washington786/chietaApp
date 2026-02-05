import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StatusBar, View } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'

import { RMainAlerts, RNetworkAlert, RSplash } from '@/components/common'
import ProviderWraper from '@/components/common/ProviderWraper'
import { BottomSheetWrapper } from '@/components/modules/application'
import useLoadAppFonts from '@/hooks/loadfonts/useLoadFonts'
import MainNavigation from '@/navigation/MainNavigation'
import Toast from 'react-native-toast-message'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@/store/store'
import colors from '@/config/colors'
import { useGetActiveWindowsQuery } from '@/store/api/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

SplashScreen.preventAutoHideAsync().catch(() => {
  let tm = setTimeout(() => SplashScreen.preventAutoHideAsync(), 100)
  clearTimeout(tm);
})

const AppContent = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { loadedApplicationFonts } = useLoadAppFonts();
  const { data: apiData } = useGetActiveWindowsQuery(undefined);
  const prevWindowCount = useRef(0);
  const alertKey = useRef<string>('dg-alert-meta');

  const activeWindowCount = useMemo(() => {
    if (!apiData) return 0;
    if (Array.isArray(apiData?.result?.items)) return apiData.result.items.length;
    if (Array.isArray(apiData?.items)) return apiData.items.length;
    if (Array.isArray(apiData)) return apiData.length;
    return 0;
  }, [apiData]);

  const loadAlertMeta = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(alertKey.current);
      if (!raw) {
        return { date: '', count: 0 };
      }
      return JSON.parse(raw);
    } catch (error) {
      console.warn('Failed to read alert meta', error);
      return { date: '', count: 0 };
    }
  }, []);

  const saveAlertMeta = useCallback(async (meta: { date: string; count: number }) => {
    try {
      await AsyncStorage.setItem(alertKey.current, JSON.stringify(meta));
    } catch (error) {
      console.warn('Failed to persist alert meta', error);
    }
  }, []);

  const shouldShowAlert = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    const meta = await loadAlertMeta();
    if (meta.date !== today) {
      const resetMeta = { date: today, count: 0 };
      await saveAlertMeta(resetMeta);
      return true;
    }
    return meta.count < 2;
  }, [loadAlertMeta, saveAlertMeta]);

  const incrementAlertCount = useCallback(async () => {
    const today = new Date().toISOString().slice(0, 10);
    const meta = await loadAlertMeta();
    const nextMeta = {
      date: today,
      count: meta.date === today ? Math.min(meta.count + 1, 2) : 1,
    };
    await saveAlertMeta(nextMeta);
  }, [loadAlertMeta, saveAlertMeta]);

  useEffect(() => {
    if (loadedApplicationFonts) {
      const timer = setTimeout(() => {
        setAppIsReady(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loadedApplicationFonts]);

  useEffect(() => {
    let isMounted = true;
    if (activeWindowCount > 0 && prevWindowCount.current === 0) {
      shouldShowAlert().then(canShow => {
        if (isMounted && canShow) {
          setShowAlert(true);
          incrementAlertCount();
        }
      });
    }
    if (activeWindowCount === 0 && isMounted) {
      setShowAlert(false);
    }
    prevWindowCount.current = activeWindowCount;
    return () => {
      isMounted = false;
    };
  }, [activeWindowCount, incrementAlertCount, shouldShowAlert]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!loadedApplicationFonts || !appIsReady) {
    return <RSplash />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <RMainAlerts
        visible={showAlert && activeWindowCount > 0}
        title='Discretionary Grants Open'
        description={`An active discretionary funding window is now open. We encourage you to submit your application before the closing date.`}
        actionText='Apply Now'
        bgColor={colors.primary[950]}
        onAction={() => { }}
        onDismiss={() => setShowAlert(false)}
      />
      <RNetworkAlert />
      <MainNavigation />
      <Toast />
      <StatusBar backgroundColor={colors.primary[950]} barStyle={'dark-content'} networkActivityIndicatorVisible animated />
    </View>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BottomSheetWrapper>
          <ProviderWraper>
            <AppContent />
          </ProviderWraper>
        </BottomSheetWrapper>
      </PersistGate>
    </Provider>
  );
}