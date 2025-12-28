import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { increment, decrement } from '../store/slices/counterSlice';
import Svg, { Circle } from 'react-native-svg';

export default function HomeScreen({ navigation }: any) {
  const count = useSelector((s: RootState) => s.counter.value);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.counter}>Counter: {count}</Text>
      <View style={styles.row}>
        <Button title="+" onPress={() => dispatch(increment())} />
        <View style={{ width: 8 }} />
        <Button title="-" onPress={() => dispatch(decrement())} />
      </View>
      <View style={{ height: 8 }} />
      <Button title="Go to Discover" onPress={() => navigation.navigate('Discover')} />
      <View style={styles.svgWrap}>
        <Svg width={100} height={100} viewBox="0 0 120 120">
          <Circle cx={60} cy={60} r={50} fill="#0ea5e9" />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, marginBottom: 8 },
  counter: { fontSize: 18, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  svgWrap: { marginTop: 16 },
});
