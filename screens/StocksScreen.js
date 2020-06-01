import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableHighlight, AsyncStorage } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize, getPercentageSinceOpen, RED_COLOR, GREEN_COLOR, DARK_GREY, MEDIUM_GREY } from '../constants/Layout';

function getSelectedStockBg(item, watchList) {
  if (item === watchList.selectedStock) {
    return MEDIUM_GREY
  } else {
    return DARK_GREY
  }
}

function getPercentageColor(percentage) {
  if (percentage >= 0) {
    return GREEN_COLOR;
  } else {
    return RED_COLOR;
  }
}

const InnerRow = ({ stock, value }) => {
  return (<View style={styles.innerRow}>
    <Text style={styles.label}>{value.toUpperCase()}</Text>
    <Text style={styles.value}>{stock[value].toFixed(2)}</Text>
  </View>)
}

const StockTable = ({ stocksDetails, selectedStock }) => {
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
          <View style={styles.innerRow}>
            <Text style={styles.label}></Text>
            <Text style={styles.value}></Text>
          </View>
        </View>
      </View>
    )
  }
  return null
}

const StockDeepDetails = ({ item, state, watchList, selectStock }) => {
  if (state.stocksDetails && state.stocksDetails[item]) {
    const stockObj = state.stocksDetails[item];
    return (
      <TouchableHighlight style={styles.stockItem} onPress={() => selectStock(item)}>
        <View style={[styles.stockDetails, { backgroundColor: getSelectedStockBg(item, watchList) }]}>
          <Text style={styles.stockSymbol}>{stockObj.symbol}</Text>
          <Text style={styles.stockClose}> {stockObj.close}</Text>
          <Text style={[styles.stockPercentage,
          { backgroundColor: getPercentageColor(getPercentageSinceOpen(stockObj.close, stockObj.open)) }]}>
            {getPercentageSinceOpen(stockObj.close, stockObj.open)}%</Text>
        </View>
      </TouchableHighlight >)
  } else {
    return null
  }
};

const StocksList = ({ watchList, state, selectStock }) => {
  if (watchList.symbols) {
    return (
      <FlatList
        data={watchList.symbols}
        renderItem={({ item }) => <StockDeepDetails item={item} selectStock={selectStock} state={state} watchList={watchList} />}
        keyExtractor={(item, index) => item}>
      </FlatList>
    )
  }
}

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
              throw new Error('Fetch failed:', err.status);
            });
        }
      })
    }
  }, [watchList]);

  return (
    <View style={styles.container}>
      <StocksList watchList={watchList} state={state} selectStock={selectStock}></StocksList>
      <StockTable selectedStock={watchList.selectedStock} stocksDetails={state.stocksDetails}></StockTable>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
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
  innerRow: {
    flexDirection: 'row',
    flex: 2,
    height: scaleSize(25),
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