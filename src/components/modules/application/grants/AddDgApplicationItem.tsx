import { StyleSheet, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import colors from '@/config/colors'
import { RCol, RDivider, RRow } from '@/components/common';
import { Text } from 'react-native-paper';

import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface props {
  isActive?: boolean;
  onPress?: () => void;
}
const AddDgApplicationItem: FC<props> = ({ isActive, onPress }) => {
  return (
    <RCol style={styles.con}>
      <RRow style={styles.title}>
        <MaterialCommunityIcons name="application-outline" size={18} color="black" />
        <Text>DG2026-2027 Cycle 1</Text>
      </RRow>
      <RDivider />
      <RRow style={styles.wrap}>
        <Text variant='labelSmall' style={[styles.text]}>Focus Area</Text>
        <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>Work Integrated Learning</Text>
      </RRow>
      <RRow style={styles.wrap}>
        <Text variant='labelSmall' style={[styles.text]}>Type</Text>
        <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>Learning Projects</Text>
      </RRow>
      <RRow style={styles.wrap}>
        <Text variant='labelSmall' style={[styles.text]}>Intervention</Text>
        <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>Learning Projects</Text>
      </RRow>
      <RRow style={styles.wrap}>
        <Text variant='labelSmall' style={[styles.text]}>Sub-Category</Text>
        <Text variant='titleMedium' style={[styles.text, styles.appTitle]}>Learning Projects</Text>
      </RRow>
      <RRow style={styles.row}>
        <Feather name={isActive ? "check-square" : "x-square"} size={16} color={isActive ? colors.green[600] : colors.red[600]} />
        <Text variant='labelMedium' style={[styles.regTxt, { color: isActive ? colors.green[600] : colors.red[600] }]}>{isActive ? "active" : "inactive"}</Text>
      </RRow>
      <TouchableOpacity style={styles.abBtn} onPress={onPress}>
        <Feather name={"plus"} size={20} color={colors.slate[50]} />
      </TouchableOpacity>
    </RCol>
  )
}

export default AddDgApplicationItem

const styles = StyleSheet.create({
  con: {
    backgroundColor: colors.slate[100], flex: 1, borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.slate[200],
    position: "relative",
    marginTop: 10
  },
  itemText: {
    color: colors.slate[600],
    fontSize: 18
  },
  regTxt: {
    fontSize: 14
  },
  txt: {
    color: colors.gray[400],
    fontSize: 12,
    fontWeight: "thin"
  },
  row: {
    alignItems: "center",
    gap: 4,
    marginVertical: 4
  },
  abBtn: {
    position: "absolute", top: -15, right: -6, backgroundColor: colors.violet[900], padding: 10, borderRadius: 100
  },
  trdeName: {
    fontSize: 11,
  },
  title: {
    alignItems: "center",
    gap: 4
  },
  text: {
    textTransform: "capitalize"
  },
  wrap: {
    alignItems: "center",
    justifyContent: "space-between"
  },
  appTitle: {
    fontSize: 12
  },
  statusTxt: {
    backgroundColor: colors.emerald[100],
    borderRadius: 5,
    padding: 4
  }
})