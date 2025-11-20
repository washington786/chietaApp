import {
    MD3LightTheme as DefaultTheme,
    MD3Theme,
} from 'react-native-paper';
import colors from '../config/colors';


const appTheme: MD3Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary[300],
        secondary: colors.secondary[300],
        tertiary: colors.slate[300]
    },
};


export default appTheme;