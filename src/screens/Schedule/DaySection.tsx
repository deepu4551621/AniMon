import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import AppText from '../../components/AppText';
import ScheduleItem from './ScheduleItem';

export default function DaySection({
  day,
  items,
}: {
  day: string;
  items: any[];
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText weight="semibold" color="#fff">
          {day.toUpperCase()}
        </AppText>
      </View>
      <FlatList
        data={items}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={(item: any, idx: number) =>
          `${item.mal_id ?? item.title}_${idx}`
        }
        renderItem={({ item }) => <ScheduleItem item={item} column />}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 18 },
  header: { paddingVertical: 6 },
});
