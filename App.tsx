import { RSplash } from '@/components/common';
import ProviderWraper from '@/components/common/ProviderWraper';
import useLoadAppFonts from '@/hooks/loadfonts/useLoadFonts';
import MainNavigation from '@/navigation/MainNavigation';

export default function App() {

  const { loadedApplicationFonts } = useLoadAppFonts();
  if (!loadedApplicationFonts) return <RSplash />;

  return (
    <ProviderWraper>
      <MainNavigation />
    </ProviderWraper>
  );
}
