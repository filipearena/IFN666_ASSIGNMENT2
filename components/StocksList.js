import React from 'react';
import { FlatList } from 'react-native';
import { StockDeepDetails } from './StockDeepDetails'

export const StocksList = ({ watchList, state, selectStock }) => {
  if (watchList.symbols) {
    return (
      <FlatList
        data={watchList.symbols}
        renderItem={({ item }) => <StockDeepDetails item={item} selectStock={selectStock} state={state} watchList={watchList} />}
        keyExtractor={(item) => item}>
      </FlatList>
    )
  }
}