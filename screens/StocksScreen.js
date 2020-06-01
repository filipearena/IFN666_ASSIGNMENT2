import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableHighlight, AsyncStorage } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import apiGET from "../services/api";


export default function StocksScreen({ route }) {
  const { ServerURL, watchList, selectStock } = useStocksContext();
  const [state, setState] = useState({
    stocksDetails: {},
  });

  function stockDeepDetails({ item }) {
    if (state.stocksDetails[item]) {
      return (
        <TouchableHighlight style={styles.stockItem} onPress={() => onSelectStock(item)}>
          <View style={styles.stockDetails}>
            <Text style={styles.stockSymbol}>{state.stocksDetails[item].symbol}</Text>
            <Text style={styles.stockClose}> {state.stocksDetails[item].close}</Text>
            <Text style={[styles.stockPercentage,
            { backgroundColor: getPercentageColor(getPercentageSinceOpen(state.stocksDetails[item].close, state.stocksDetails[item].open)) }]}>
              {getPercentageSinceOpen(state.stocksDetails[item].close, state.stocksDetails[item].open)}%</Text>
          </View>
        </TouchableHighlight >)
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

  function getPercentageColor(percentage) {
    if (percentage >= 0) {
      return '#4CD964'
    } else {
      return '#f44336'
    }
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
      {state.stocksDetails && state.stocksDetails[watchList.selectedStock] ?
        <View style={styles.footerTable}>
          <Text style={styles.tableHeader}>{state.stocksDetails[watchList.selectedStock].name}</Text>
          <View style={styles.tableRow}>
            <View style={styles.innerRow}>
              <Text style={styles.label}>OPEN</Text>
              <Text style={styles.value}>{state.stocksDetails[watchList.selectedStock].open.toFixed(2)}</Text>
            </View>
            <View style={styles.innerRow}>
              <Text style={styles.label}>LOW</Text>
              <Text style={styles.value}>{state.stocksDetails[watchList.selectedStock].low.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.innerRow}>
              <Text style={styles.label}>CLOSE</Text>
              <Text style={styles.value}>{state.stocksDetails[watchList.selectedStock].close.toFixed(2)}</Text>
            </View>
            <View style={styles.innerRow}>
              <Text style={styles.label}>HIGH</Text>
              <Text style={styles.value}>{state.stocksDetails[watchList.selectedStock].high.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.innerRow}>
              <Text style={styles.label}>VOLUMES</Text>
              <Text style={styles.value}>{state.stocksDetails[watchList.selectedStock].volumes}</Text>
              <View style={styles.innerRow}>
                <Text style={styles.label}></Text>
                <Text style={styles.value}></Text>
              </View>
            </View>
          </View>
        </View>
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
  },
  innerRow: {
    flexDirection: 'row',
    flex: 2,
    height: scaleSize(25),
  },
  stockDetails: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  stockSymbol: {
    marginLeft: scaleSize(5),
    flex: 1,
    lineHeight: scaleSize(38),
    fontSize: scaleSize(18),
    color: '#fff',
  },
  stockClose: {
    alignSelf: 'flex-end',
    lineHeight: scaleSize(38),
    fontSize: scaleSize(18),
    color: '#fff',
  },
  stockPercentage: {
    marginLeft: scaleSize(25),
    height: scaleSize(38),
    alignSelf: 'flex-end',
    fontSize: scaleSize(18),
    width: scaleSize(110),
    paddingRight: scaleSize(5),
    paddingTop: scaleSize(5),
    paddingBottom: scaleSize(5),
    borderRadius: 10,
    textAlign: 'right',
    color: '#fff',
  },
  tableRow: {
    paddingLeft: scaleSize(5),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#222',
    borderBottomWidth: 0.5,
    borderColor: '#555',
  },
  stockName: {
    color: '#fff',
    backgroundColor: '#ddd'
  },
  footerTable: {
    position: 'absolute',
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