import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { RCol, RRow } from '@/components/common'
import colors from '@/config/colors'
import Feather from '@expo/vector-icons/Feather';
import { Text } from 'react-native-paper';
import { AppNotification } from '@/core/types/notifications';
import { useDispatch } from 'react-redux'
import { markAsRead } from '@/store/slice/NotificationSlice'

interface props extends AppNotification {
    notification: AppNotification;
}
const ItemNotification: FC<props> = ({ notification }) => {
    const dispatch = useDispatch();
    const isNew = !notification.read;

    const handlePress = () => {
        if (isNew) {
            dispatch(markAsRead(notification.id));
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
            <RCol style={styles.con}>
                <RRow style={{ position: "relative", padding: 8 }}>
                    <RRow style={styles.center}>
                        <Feather name="bell" size={24} color="black" />
                        <Text variant='titleMedium' style={{ marginLeft: 6, color: colors.slate[700] }}>{notification.title}</Text>
                    </RRow>
                    {isNew &&
                        <View style={styles.newBadge}>
                            <Text variant='labelSmall' style={{ color: "white", paddingHorizontal: 6, paddingVertical: 2 }}>new</Text>
                        </View>
                    }
                </RRow>
                <RCol style={{ paddingHorizontal: 8 }}>
                    <Text variant='labelSmall' style={[styles.dteTxt, { paddingHorizontal: 6, paddingVertical: 2 }]}>{notification.timestamp}</Text>
                    <Text variant='bodySmall' style={[styles.messageTxt, { paddingHorizontal: 6, paddingVertical: 2 }]}>{notification.body}</Text>
                </RCol>
            </RCol>
        </TouchableOpacity>
    )
}

export default ItemNotification

const styles = StyleSheet.create({
    con: {
        backgroundColor: colors.slate[100],
        borderWidth: 0.5,
        borderColor: colors.slate[200],
        borderRadius: 10,
        marginBottom: 12,
        overflow: "hidden"
    },
    newBadge: {
        backgroundColor: colors.blue[600],
        position: "absolute",
        top: 10,
        right: 10,
        borderRadius: 100,
    },
    center: {
        alignItems: "center",
        gap: 5
    },
    messageTxt: {
        color: colors.slate[600],
        fontSize: 8
    },
    dteTxt: {
        color: colors.slate[600],
        fontSize: 12
    }
})