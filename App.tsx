/**
 * App entry with Navigation, Redux and SVG demo
 */
import React from 'react';
import { StatusBar, StyleSheet, Text, View, Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './src/store/store';
import AppNavigation from './src/navigation/AppNavigation';
import { NavigationContainer } from '@react-navigation/native';

function AppInner() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: { fontSize: 20, marginBottom: 8 },
  counter: { fontSize: 18, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  svgWrap: { marginTop: 16 },
});
