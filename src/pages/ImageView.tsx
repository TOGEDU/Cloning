import React from 'react';
import { View, Image, StyleSheet, Text, SafeAreaView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

import smallLogo from '../../assets/smallLogo.png';
import logotext from '../../assets/logotext.png';

type ImageViewRouteParams = {
  imageSource: string | { uri: string };
  date: string;
};

type ImageViewRouteProp = RouteProp<{ params: ImageViewRouteParams }, 'params'>;

const ImageView: React.FC = () => {
  const route = useRoute<ImageViewRouteProp>();
  const { imageSource, date } = route.params;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer} edges={['top']}>
        <View style={styles.header}>
          <Image source={smallLogo} style={styles.smallLogo} />
          <Image source={logotext} style={styles.logotext} />
        </View>
      </SafeAreaView>

      <View style={styles.imgcontainer}>
        <Text style={styles.date}>{date}</Text>
        <Image
          source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
          style={styles.image}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  imgcontainer: {
    paddingTop: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  date: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ccc',
    fontSize: 12,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 490,
    resizeMode: 'contain',
  },
});

export default ImageView;
