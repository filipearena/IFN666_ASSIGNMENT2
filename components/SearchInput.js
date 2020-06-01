import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { scaleSize } from '../constants/Layout';
import { AntDesign } from '@expo/vector-icons';

export const SearchInput = ({ onChangeText }) => {
  return (<View style={styles.searchSection}>
    <AntDesign style={styles.searchIcon} name="search1" size={scaleSize(15)} color="white" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search"
      onChangeText={onChangeText}
    ></TextInput>
  </View>)
}

const styles = StyleSheet.create({
  searchSection: {
    height: scaleSize(40),
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    backgroundColor: '#222',
  },
  searchIcon: {
    color: '#fff',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 20,
    backgroundColor: '#222',
    color: '#fff',
  },
});