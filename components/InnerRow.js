import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scaleSize } from '../constants/Layout';

export const InnerRow = ({ stock, value }) => {
  if (value) {
    return (<View style={styles.innerRow}>
      <Text style={styles.label}>{value.toUpperCase()}</Text>
      <Text style={styles.value}>{stock[value].toFixed(2)}</Text>
    </View>)
  } else {
    return (<View style={styles.innerRow}>
      <Text style={styles.label}></Text>
      <Text style={styles.value}></Text>
    </View>)
  }
}

const styles = StyleSheet.create({
  innerRow: {
    flexDirection: 'row',
    flex: 2,
    height: scaleSize(25),
  },
  label: {
    lineHeight: scaleSize(20),
    fontSize: scaleSize(10),
    flex: 1,
    color: '#666',
    backgroundColor: '#222',
  },
  value: {
    fontSize: scaleSize(14),
    lineHeight: scaleSize(20),
    color: '#fff',
    marginRight: scaleSize(10),
    backgroundColor: '#222',
  },
});