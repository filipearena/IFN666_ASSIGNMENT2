import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState({
    symbols: [],
    selectedStock: '',
  });

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  function addToWatchlist(newSymbol) {
    if (state.symbols && state.symbols.length > 0) {
      if (state.symbols && state.symbols.indexOf(newSymbol) >= 0) {
        return
      }
      else {
        state.symbols.push(newSymbol);
        const updatedList = state.symbols.sort();
        setState((oldState) => ({ ...oldState, symbols: updatedList }));
        AsyncStorage.setItem('symbols', JSON.stringify(updatedList));
      }
    } else {
      setState((oldState) => ({ ...oldState, symbols: [newSymbol] }));
      AsyncStorage.setItem('symbols', JSON.stringify([newSymbol]));
    }
    selectStock(newSymbol);
  }

  function selectStock(selectedStock) {
    setState((oldState) => ({ ...oldState, selectedStock }));
    AsyncStorage.setItem('selectedStock', JSON.stringify(selectedStock));
  }

  useEffect(() => {
    AsyncStorage.getItem('symbols')
      .then(list => JSON.parse(list))
      .then((list) => {
        if (list) setState((oldState) => ({ ...oldState, symbols: list }));
      });
    AsyncStorage.getItem('selectedStock')
      .then(selectedStock => JSON.parse(selectedStock))
      .then((selectedStock) => {
        if (selectedStock) setState((oldState) => ({ ...oldState, selectedStock }));
      });
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state, addToWatchlist, selectStock };
};
