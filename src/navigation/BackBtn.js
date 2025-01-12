// src/components/CustomBackButton.js
import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const CustomBackButton = ({title}) => {
  const navigation = useNavigation();

  return (
    <View
      style={styles.container}>
      <Icon name="arrowleft" size={27} color="#333" style={styles.IconCon} onPress={() => navigation.goBack()}
 />
      <Text style={styles.titleCon}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    // padding: 10,
    // marginLeft: 10,
    // borderRadius: 8,
    // backgroundColor: '#FFF',
  
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  IconCon: {
    flex: 1,
    paddingLeft:20,
    fontWeight:"600",



  },
  titleCon: {
    flex: 6,
    fontSize:20,
fontWeight:"600",

  },
});

export default CustomBackButton;
