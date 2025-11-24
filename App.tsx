import { RSplash } from '@/components/common';
import ProviderWraper from '@/components/common/ProviderWraper';
import { BottomSheetWrapper } from '@/components/modules/application';
import useLoadAppFonts from '@/hooks/loadfonts/useLoadFonts';
import MainNavigation from '@/navigation/MainNavigation';
import Toast from 'react-native-toast-message';

export default function App() {

  const { loadedApplicationFonts } = useLoadAppFonts();
  if (!loadedApplicationFonts) { return <RSplash /> } else {
    return (
      <BottomSheetWrapper>
        <ProviderWraper>
          <MainNavigation />
          <Toast />
        </ProviderWraper>
      </BottomSheetWrapper>
    );
  }

}
