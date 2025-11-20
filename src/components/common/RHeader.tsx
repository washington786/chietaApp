// import {
//   Platform,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import React, { FC } from "react";

// import { Feather } from "@expo/vector-icons";
// import { Text } from "react-native-paper";
// import useTransition from "@/hooks/useTransition";

// interface prop {
//   name: string;
// }
// const RHeader: FC<prop> = ({ name }) => {
//   const { goBack } = useTransition();
//   return (
//     <View style={styles.con}>
//       <TouchableWithoutFeedback onPress={goBack}>
//         <Feather
//           name={Platform.OS === "ios" ? "chevron-left" : "arrow-left"}
//           size={24}
//         />
//       </TouchableWithoutFeedback>
//       <View
//         style={[
//           Platform.OS === "ios" && styles.ios,
//           Platform.OS === "android" && styles.gap,
//         ]}
//       >
//         <Text
//           variant="labelSmall"
//           style={Platform.OS === "android" && styles.android}
//         >
//           {name}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default RHeader;

// const styles = StyleSheet.create({
//   con: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     paddingVertical: 13,
//     gap: 9,
//   },
//   ios: {
//     textAlign: "center",
//     flex: 1,
//   },
//   android: {
//     textAlign: "left",
//   },
//   gap: {
//     gap: 10,
//   },
// });
