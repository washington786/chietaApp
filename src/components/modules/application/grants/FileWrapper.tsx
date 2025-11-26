import { RRow } from "@/components/common";
import { Text } from "react-native-paper";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from "@/config/colors";
import { TouchableOpacity } from "react-native";

interface fileProps {
    fileName?: string;
    onPress?: () => void;
}
export function FileWrapper({ onPress, fileName = 'file' }: fileProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <RRow style={{ alignItems: "center", justifyContent: "space-between", paddingVertical: 12, marginVertical: 5, backgroundColor: colors.slate[100], borderRadius: 10, paddingHorizontal: 4 }}>
                <RRow style={{ alignItems: "center", flex: 0.2, gap: 4 }}>
                    <AntDesign name="file-pdf" size={24} color="black" />
                    <Text variant='labelLarge'>{fileName}.pdf</Text>
                </RRow>
                <Ionicons name="download" size={24} color="black" />
            </RRow>
        </TouchableOpacity>
    )
}