import React, { useState, useEffect } from 'react';
import { View, AsyncStorage } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { SearchHeader } from '../components/SearchHeader'
import { StockSymbols } from '../components/StockSymbols'

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState({
    allStocks: [],
    filteredList: []
  });

  const getStocks = (() => {
    fetch(`${ServerURL}/all`)
      .then(response => response.json())
      .then((result) => {
        AsyncStorage.setItem('allStocks', JSON.stringify(result));
        setState((oldState) => ({ ...oldState, allStocks: result }));
      }).catch((err) => {
        throw new Error('Fetch failed:', err);
      });
  });

  const updateFilteredList = ((stocks) => {
    setState((oldState) => ({ ...oldState, filteredList: stocks }));
  })

  const filterStocks = (searchText) => {
    getStocks();
    if (searchText && searchText.length > 0) {
      updateFilteredList(
        state.allStocks.filter((stockItem) => {
          return (
            (stockItem.symbol.indexOf(searchText.toUpperCase()) >= 0 ||
              stockItem.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
          );
        })
      );
    } else {
      updateFilteredList([]);
    }
  }

  useEffect(() => {
    AsyncStorage.getItem('allStocks')
      .then(stocks => JSON.parse(stocks), getStocks())
      .then((allStocksParsed) => {
        setState((oldState) => ({ ...oldState, allStocks: allStocksParsed }));
      })
  }, []);

  return (
    <View>
      <SearchHeader onChangeText={filterStocks}></SearchHeader>
      <StockSymbols filteredLit={state.filteredList} touchFn={addToWatchlist} navigation={navigation}></StockSymbols>
    </View>
  )
}

