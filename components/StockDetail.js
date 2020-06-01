import React from 'react';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { scaleSize } from '../constants/Layout';

export const StockDetail = ({ item, touchFn, navigation }) => {
  return (
    <TouchableHighlight style={styles.stockItem} onPress={() => {
      touchFn(item.symbol);
      navigation.navigate('Stocks')
    }}>
      <View>
        <Text style={styles.stockSymbol}>{item.symbol}</Text>
        <Text style={styles.stockName}>{item.name}</Text>
      </View>
    </TouchableHighlight>)
};

const styles = StyleSheet.create({
  stockItem: {
    borderWidth: 1,
    height: 60,
    padding: 10,
    backgroundColor: '#000',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.2,
  },
  stockName: {
    color: '#fff',
    fontSize: scaleSize(10),
  },
  stockSymbol: {
    color: '#fff',
    fontSize: scaleSize(12),
  },
});