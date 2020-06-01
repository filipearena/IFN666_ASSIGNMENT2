import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, AsyncStorage, TextInput, FlatList, Text, TouchableHighlight } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { AntDesign } from '@expo/vector-icons';
import apiGET from "../services/api";

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist, selectStock } = useStocksContext();
  const [state, setState] = useState({
    allStocks: [],
    filteredList: []
  });

  const getStocks = (() => {
    apiGET("all")
      .then((result) => {
        AsyncStorage.setItem('allStocks', JSON.stringify(result));
        setState((oldState) => ({ ...oldState, allStocks: result }));
      })
      .catch((err) => {
        throw new Error('Fetch failed:', err.status);
      });
  });

  const updateFilteredList = ((stocks) => {
    setState((oldState) => ({ ...oldState, filteredList: stocks }));
  })

  const filterStocks = ((searchText) => {
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
  })

  function StockDetail({ item }) {
    return (
      <TouchableHighlight style={styles.stockItem} onPress={() => {
        addToWatchlist(item.symbol);
        navigation.navigate('Stocks')
      }}>
        <View>
          <Text style={styles.stockSymbol}>{item.symbol}</Text>
          <Text style={styles.stockName}>{item.name}</Text>
        </View>
      </TouchableHighlight>)
  };

  useEffect(() => {
    AsyncStorage.getItem('allStocks')
      .then(stocks => JSON.parse(stocks), getStocks())
      .then((allStocksParsed) => {
        setState((oldState) => ({ ...oldState, allStocks: allStocksParsed }));
      })
  }, []);

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.fieldInstruction}>Type a company name or stock symbol</Text>
          <View style={styles.searchSection}>
            <AntDesign style={styles.searchIcon} name="search1" size={scaleSize(15)} color="white" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              onChangeText={filterStocks}
            ></TextInput>
          </View>
        </View>
        <FlatList data={state.filteredList} renderItem={StockDetail} keyExtractor={(item) => item.symbol}></FlatList>
      </View>
    </TouchableWithoutFeedback>
  )
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