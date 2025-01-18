import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomBackButton from './navigation/BackBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteDetail = ({route}) => {
  const {note} = route.params;
  console.log('NOteeeee', note);
  const [text, setText] = useState('');
  useEffect(() => {
    const loadText = async () => {
      const savedText = await AsyncStorage.getItem('savedText');
      if (savedText) setText(savedText);
    };
    loadText();
  }, []);
  const saveText = async (newText) => {
    setText(newText);
    await AsyncStorage.setItem('savedText', newText);
  };
  return (
    <SafeAreaView>
      <CustomBackButton title={'Note Details'} />
      <View style={{paddingHorizontal: 25}}>
        <Text style={styles.headingtext}>{note.title}</Text>
        <Text style={styles.date}>{note.date}</Text>
        <View style={styles.inputContanier}>
        <TextInput
        style={styles.input}
        editable={true}
        value={text}
        onChangeText={setText}
        multiline={false} // Single-line input
        scrollEnabled={true} // Enable horizontal scrolling
        numberOfLines={1} // Prevents multi-line wrapping
        textAlignVertical="center"
      />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NoteDetail;

const styles = StyleSheet.create({
  headingtext: {
    fontSize: 30,
    fontWeight: '700',
  },
  date: {
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  inputContanier: {
    // backgroundColor:"red",
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: '40%',
  },
  input: {
    color: '#121212',
    width: '100%',
    height: '100%',
  },
});
