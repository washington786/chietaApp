import { RCol, RRow } from "@/components/common";
import { TouchableOpacity, View } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import colors from "@/config/colors";
import { Text as RnText } from "react-native-paper";

interface props {
    close: () => void;
    title?: string;
    substitle?: string;
    message?: string;
    color: string;
}
function WindowClose({ close, message, substitle, title, color }: props) {
    return <View>

        <RRow style={{ padding: 8, alignItems: 'center', justifyContent: 'space-between' }}>
            <RnText variant='bodyMedium'>{title}</RnText>
            <TouchableOpacity onPress={close}>
                <EvilIcons name="close" size={24} color="black" />
            </TouchableOpacity>
        </RRow>

        <RCol style={{ padding: 12, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <FontAwesome6 name="window-close" size={50} color={colors.red[900]} />
            <RnText variant='titleLarge' style={{ textAlign: 'center', color: color, fontWeight: "bold" }}>{substitle}</RnText>
            <RnText variant='bodySmall' style={{ textAlign: 'center', color: colors.gray[400], fontWeight: "ultralight", width: "80%" }}>{message}</RnText>
        </RCol>
    </View>
}

export default WindowClose