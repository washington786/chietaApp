import { Platform, Dimensions } from 'react-native'

const useCommon = () => {
    const isAndroid = Platform.OS === 'android';
    const isIOS = Platform.OS === 'ios';

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    return {
        isAndroid,
        isIOS,
        width,
        height,
    }
}

export default useCommon