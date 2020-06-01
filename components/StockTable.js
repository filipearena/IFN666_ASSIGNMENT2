import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InnerRow } from './InnerRow'
import { scaleSize } from '../constants/Layout';

export const StockTable = ({ stocksDetails, selectedStock }) => {
  if (selectedStock &&
    stocksDetails &&
    stocksDetails[selectedStock]) {
    return (
      <View style={styles.footerTable}>
        <Text style={styles.tableHeader}>{stocksDetails[selectedStock].name}</Text>
        <View style={styles.tableRow}>
          <InnerRow stock={stocksDetails[selectedStock]} value={'open'}></InnerRow>
          <InnerRow stock={stocksDetails[selectedStock]} value={'low'}></InnerRow>
        </View>
        <View style={styles.tableRow}>
          <InnerRow stock={stocksDetails[selectedStock]} value={'close'}></InnerRow>
          <InnerRow stock={stocksDetails[selectedStock]} value={'high'}></InnerRow>
        </View>
        <View style={styles.tableRow}>
          <InnerRow stock={stocksDetails[selectedStock]} value={'volumes'}></InnerRow>
          <InnerRow></InnerRow>
        </View>
      </View>
    )
  }
  return null
}


const styles = StyleSheet.create({
  tableRow: {
    paddingLeft: scaleSize(5),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#222',
    borderBottomWidth: 0.5,
    borderColor: '#555',
  },
  footerTable: {
    position: 'relative',
    bottom: '0%',
    color: '#000',
    width: '100%',
    backgroundColor: '#ededed'
  },
  tableHeader: {
    textAlign: 'center',
    fontSize: scaleSize(18),
    height: scaleSize(50),
    lineHeight: scaleSize(40),
    color: '#fff',
    backgroundColor: '#222',
    borderBottomWidth: 0.2,
    borderColor: '#eee',
  },
});