import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SearchInput } from './SearchInput';
import { scaleSize } from '../constants/Layout';

export const SearchHeader = ({ onChangeText }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.fieldInstruction}>Type a company name or stock symbol</Text>
      <SearchInput onChangeText={onChangeText}></SearchInput>
    </View>)
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#111',
  },
  fieldInstruction: {
    margin: 2,
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: scaleSize(10),
  },
});