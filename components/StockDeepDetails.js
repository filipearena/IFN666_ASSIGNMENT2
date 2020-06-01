import React from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { scaleSize, getPercentageSinceOpen, GREEN_COLOR, RED_COLOR, DARK_GREY, MEDIUM_GREY } from '../constants/Layout';

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

export const StockDeepDetails = ({ item, state, watchList, selectStock }) => {
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


const styles = StyleSheet.create({
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
});