import React from 'react';
import { FlatList } from 'react-native';
import { StockDetail } from './StockDetail';

export const StockSymbols = ({ filteredLit, touchFn, navigation }) => {
  return (<FlatList keyboardShouldPersistTaps='always'
    data={filteredLit}
    renderItem={({ item }) => <StockDetail item={item} touchFn={touchFn} navigation={navigation} />}
    keyExtractor={(item) => item.symbol}></FlatList>)
}