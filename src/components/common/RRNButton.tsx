import React, { FC } from 'react'
import { Button, ButtonProps } from 'react-native-paper'

import colors from '@/config/colors';
import { PickerStyle } from '@/styles/PickerStyle';

interface props extends ButtonProps {
    isOutline: boolean;
    title: string;
}

const RRNButton: FC<props> = ({ isOutline, title, ...prop }) => {
    return (
        <Button style={[isOutline ? PickerStyle.outline : PickerStyle.btn]} theme={{ colors: { primary: isOutline ? colors.secondary[500] : colors.green[500] } }} {...prop}>{title}</Button>
    )
}

export default RRNButton