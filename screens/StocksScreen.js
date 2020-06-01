import React, { useState, useEffect } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { StocksList } from '../components/StocksList';
import { StockTable } from '../components/StockTable';
import { scaleSize } from '../constants/Layout';


export default function StocksScreen() {
  const { ServerURL, watchList, selectStock } = useStocksContext();
  const [state, setState] = useState({
    stocksDetails: {},
  });

  useEffect(() => {
    if (watchList && watchList.symbols) {
      watchList.symbols.forEach((symbol) => {
        AsyncStorage.getItem('stocksDetails')
          .then(stocks => JSON.parse(stocks))
          .then((stocksDetails) => {
            setState((oldState) => ({ ...oldState, stocksDetails }));
          })
        if (!state.stocksDetails[symbol]) {
          fetch(`${ServerURL}/history?symbol=${symbol}`)
            .then(response => response.json())
            .then((result) => {
              let stockDetailsUpdated = state.stocksDetails;
              stockDetailsUpdated[symbol] = result[0];
              setState((oldState) => ({ ...oldState, stocksDetails: stockDetailsUpdated }));
              AsyncStorage.setItem('stocksDetails', JSON.stringify(stockDetailsUpdated));
            }).catch((err) => {
              throw new Error('Fetch failed:', err);
            });
        }
      })
    }
  }, [watchList]);

  return (
    <View style={styles.container}>
      <StocksList style={styles.list} watchList={watchList} state={state} selectStock={selectStock}></StocksList>
      <StockTable style={styles.table} selectedStock={watchList.selectedStock} stocksDetails={state.stocksDetails}></StockTable>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    height: scaleSize(80)
  }
});