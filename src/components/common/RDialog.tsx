import { StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { Button, Dialog, Portal, Text } from 'react-native-paper'
import colors from '@/config/colors';

interface RDialogProps {
    visible: boolean;
    hideDialog: () => void;
    onContinue?: () => void;
    title?: string;
    message?: string;
}
const RDialog: FC<RDialogProps> = ({ hideDialog, visible, onContinue, message, title }) => {
    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: colors.slate[50] }}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{message}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button textColor='red' mode='text' onPress={hideDialog}>cancel</Button>
                    <Button mode='contained-tonal' textColor={"white"} onPress={onContinue} style={styles.btn}>continue</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default RDialog

const styles = StyleSheet.create({
    btn: {
        borderRadius: 5,
        backgroundColor: colors.primary[900]
    }
})