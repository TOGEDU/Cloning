import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const logoImg = require('../../assets/logo.png');

interface HeaderProps {
  backgroundColor: string;
}

const Header: React.FC<HeaderProps> = ({ backgroundColor }) => {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <Image source={logoImg} style={styles.logo} />
      <Text style={styles.logotext}>CLONING</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    height: 44,
  },
  logo: {
    width: 29,
    height: 25,
    marginRight: 4,
  },
  logotext: {
    fontSize: 20,
    fontFamily: 'LuckiestGuy-Regular',
    color: '#6269D4',
    lineHeight: 20,
    marginTop: 4,
  },
});
