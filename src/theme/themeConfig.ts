import { DefaultTheme } from "@react-navigation/native";
import colors from "../config/colors";

const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary[500],
        background: colors.zinc[50],
    },
};


export default navigationTheme;