import React from 'react';
import { StatusBar, StyleSheet, View} from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigation from './src/navigation/AppNavigation';
import { NavigationContainer } from '@react-navigation/native';

function AppInner() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </View>
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
