// import { StyleSheet, View } from "react-native";
// import React, { FC } from "react";
// import { Picker } from "@react-native-picker/picker";
// import colors from "@/config/colors";
// import { categories } from "@/utils/categories";
// import { useFormikContext } from "formik";

// interface props {
//   category: string;
// }
// const RPicker: FC<props> = ({ category }) => {
//   const { setFieldValue, values } = useFormikContext<any>();
//   return (
//     <View style={styles.con}>
//       <Picker
//         selectedValue={values[category]}
//         onValueChange={(itemValue) => {
//           setFieldValue(category, itemValue);
//         }}
//       >
//         {categories.map((cat) => (
//           <Picker.Item label={cat.label} value={cat.value} key={cat.value} />
//         ))}
//       </Picker>
//     </View>
//   );
// };

// export default RPicker;

// const styles = StyleSheet.create({
//   con: {
//     minHeight: 45,
//     borderWidth: 1,
//     borderColor: colors.gray[300],
//     borderRadius: 5,
//   },
// });
