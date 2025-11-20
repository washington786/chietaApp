import { useFonts } from '@expo-google-fonts/roboto'
import appFonts from '../../config/fonts'

const useLoadAppFonts = () => {
    const loadedApplicationFonts = useFonts(appFonts)
    return { loadedApplicationFonts }
}

export default useLoadAppFonts