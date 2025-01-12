import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomBackButton from './navigation/BackBtn';

const NoteDetail = ({route}) => {
    const { note } = route.params;
console.log("NOteeeee",note);

  return (
    <SafeAreaView>
        <CustomBackButton title={"Note Details"} />
      <Text>{note.title}</Text>
      <Text>{note.totalLectures}</Text>
    </SafeAreaView>
  )
}

export default NoteDetail

const styles = StyleSheet.create({})