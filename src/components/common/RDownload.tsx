import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from "../../config/colors";
import RRow from "./RRow";

interface Props {
    onPress(): void;
    title: string;
    fileName?: string;
}

const RDownload: FC<Props> = ({ onPress, title, fileName }) => {
    return (
        <TouchableOpacity style={styles.con} onPress={onPress}>
            <Ionicons name="cloud-download-outline" size={35} color={colors.blue[600]} />
            <Text style={styles.title}>{title}</Text>
            {
                fileName &&
                <RRow style={{ gap: 1, alignItems: "center", paddingLeft: 10 }}>
                    <Ionicons name="checkmark-done-sharp" size={12} color={colors.green[600]} />
                    <Text style={styles.fileName} numberOfLines={1}>{fileName?.substring(0, 55)}{fileName && fileName.length > 55 ? "..." : ""}</Text>
                </RRow>
            }
        </TouchableOpacity>
    );
};

export default RDownload;

const styles = StyleSheet.create({
    con: {
        minHeight: 80,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.blue[400],
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        backgroundColor: colors.blue[50],
        overflow: "hidden",
    },
    title: {
        color: colors.slate[700],
        fontWeight: 'bold',
        fontSize: 15,
    },
    fileName: {
        color: colors.slate[500],
        fontSize: 10,
        marginTop: 2,
    },
});
