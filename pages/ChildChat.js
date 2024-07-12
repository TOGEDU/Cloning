import { Text, View, StyleSheet } from "react-native";

const ChildChat = () => {
  return (
    <View style={styles.container}>
      <Text>ChildChat</Text>
    </View>
  );
};

export default ChildChat;

const styles = StyleSheet.create({
  container: {
    paddingTop: 27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
