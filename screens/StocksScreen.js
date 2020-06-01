import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableHighlight, AsyncStorage } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import apiGET from "../services/api";


export default function StocksScreen({ route }) {
  const { ServerURL, watchList, selectStock } = useStocksContext();
  const [state, setState] = useState({
    stocksDetails: {},
    selectedStock: {},
  });

  function stockDeepDetails({ item }) {
    if (state.stocksDetails[item]) {
      return (
        <TouchableHighlight style={styles.stockItem} onPress={() => onSelectStock(state.stocksDetails[item])}>
          <View>
            <Text style={styles.stockSymbol}>
              {state.stocksDetails[item].symbol}
              {state.stocksDetails[item].close}
              {getPercentageSinceOpen(state.stocksDetails[item].close, state.stocksDetails[item].open)}</Text>
            <Text style={styles.stockName}>{state.stocksDetails[item].name}</Text>
          </View>
        </TouchableHighlight>)
    } else {
      return null
    }
  };

  const onSelectStock = (stockSelected) => {
    selectStock(stockSelected)
  }

  function getPercentageSinceOpen(close, open) {
    return ((100 * (close - open)) / open).toFixed(2);
  }

  useEffect(() => {
    if (watchList && watchList.symbols) {
      watchList.symbols.forEach((symbol) => {
        AsyncStorage.getItem('stocksDetails')
          .then(stocks => JSON.parse(stocks))
          .then((stocksDetails) => {
            setState((oldState) => ({ ...oldState, stocksDetails }));
          })
        if (!state.stocksDetails[symbol]) {
          apiGET(`history?symbol=${symbol}`)
            .then((result) => {
              let stockDetailsUpdated = state.stocksDetails;
              stockDetailsUpdated[symbol] = result[0];
              setState((oldState) => ({ ...oldState, stocksDetails: stockDetailsUpdated }));
              AsyncStorage.setItem('stocksDetails', JSON.stringify(stockDetailsUpdated));
            })
            .catch((err) => {
              throw new Error('Fetch failed:', err.status);
            });
        }
      })
    }
  }, [watchList]);

  return (
    <View style={styles.container}>
      <FlatList data={watchList.symbols} renderItem={stockDeepDetails} keyExtractor={(item, index) => item}></FlatList>
      <View>
        <Text style={styles.footerTable}>{watchList.selectedStock ? watchList.selectedStock.name : ''}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textTest: {
    backgroundColor: '#ddd',
    color: '#000'
  },
  stockSymbol: {
    color: '#fff',
    backgroundColor: '#ddd'
  },
  stockName: {
    color: '#fff',
    backgroundColor: '#ddd'
  },
  footerTable: {
    height: 100,
    color: '#000',
    backgroundColor: '#ededed'
  }
  // use scaleSize(x) to adjust sizes for small/large screens
});