// import {
//   Modal,
//   StyleSheet,
//   Text,
//   useWindowDimensions,
//   View,
// } from "react-native";
// import React, { FC } from "react";
// import RWrapper from "./RWrapper";
// import SafeArea from "./SafeArea";

// import LottieView from "lottie-react-native";

// import { ProgressBar } from "react-native-paper";

// interface props {
//   progress?: number;
//   isDone?: boolean;
// }
// const RModal: FC<props> = ({ isDone = false, progress }) => {
//   const { width } = useWindowDimensions();
//   return (
//     <Modal animationType="fade" backdropColor={"transparent"}>
//       <SafeArea>
//         <RWrapper style={styles.center}>
//           {isDone ? (
//             <View style={{ width: width / 2 }}>
//               <ProgressBar
//                 style={styles.progress}
//                 progress={progress}
//                 color={colors.primary[500]}
//                 animatedValue={1}
//               />
//             </View>
//           ) : (
//             <LottieView
//               autoPlay
//               loop
//               source={require("../../../assets/done.json")}
//               style={{ height: 100, width: 100 }}
//             />
//           )}
//         </RWrapper>
//       </SafeArea>
//     </Modal>
//   );
// };

// export default RModal;

// const styles = StyleSheet.create({
//   progress: {
//     backgroundColor: colors.slate[100],
//     paddingVertical: 4,
//     borderRadius: 100,
//   },
//   center: {
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
// });
