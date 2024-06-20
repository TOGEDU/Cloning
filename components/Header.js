import { View, Text, StyleSheet, Image } from "react-native";
const logoImg = require("../assets/logo.png");

const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={logoImg} style={styles.logo} />
      <Text style={styles.logotext}>CLONING</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    height: 44,
  },
  logo: {
    width: 29,
    height: 25,
    marginRight: 4,
  },
  logotext: {
    fontSize: 20,
    fontFamily: "Luckiest Guy",
    color: "#6269D4",
    lineHeight: "19.36",
  },
});
