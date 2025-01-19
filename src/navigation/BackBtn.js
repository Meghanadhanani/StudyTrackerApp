// src/components/CustomBackButton.js
import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const CustomBackButton = ({title, showIcon = true}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showIcon && ( // Conditionally render the icon
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.IconCon}>
          <Icon name="arrowleft" size={27} color="#333" style={styles.icon} />
        </TouchableOpacity>
      )}
      <Text
        style={[
          styles.titleCon,
          !showIcon && {
            textAlign: 'center',
            flex: 1,
            fontSize: 22,
            fontWeight: '600',
            color: '#121212',
          },
        ]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 65,
    // padding: 10,
    // marginLeft: 10,
    // borderRadius: 8,
    backgroundColor: '#4B9F89',

    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  IconCon: {
    flex: 1,
    paddingLeft: 20,
    fontWeight: '600',
  },
  titleCon: {
    flex: 6,
    fontSize: 20,
    fontWeight: '600',
    color: '#121212',
  },
});

export default CustomBackButton;
