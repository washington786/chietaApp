import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { FC } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from "../../config/colors";

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
            {fileName && <Text style={styles.fileName}>{fileName}</Text>}
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
    },
    title: {
        color: colors.slate[700],
        fontWeight: 'bold',
        fontSize: 15,
    },
    fileName: {
        color: colors.slate[500],
        fontSize: 13,
        marginTop: 2,
    },
});
