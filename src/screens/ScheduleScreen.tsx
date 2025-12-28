import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import DaySection from './Schedule/DaySection';
import AppText from '../components/AppText';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function ScheduleScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://api.jikan.moe/v4/schedules');
        const json = await res.json();
        if (mounted) setData(json.data || []);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load schedules');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSchedules();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <AppText>{error}</AppText>
      </View>
    );
  }

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const extractDay = (item: any) => {
    const candidates = [
      item.broadcast?.string,
      item.aired?.string,
      item.broadcast,
      item.aired,
    ];
    for (const v of candidates) {
      if (!v) continue;
      const s = String(v);
      for (const d of days) {
        const re = new RegExp(d, 'i');
        if (re.test(s)) return d;
      }
      // also accept plural like 'Mondays'
      for (const d of days) {
        const re = new RegExp(d + 's', 'i');
        if (re.test(s)) return d;
      }
    }
    return 'Other';
  };

  const sections = days
    .concat(['Other'])
    .map(day => ({ title: day, data: data.filter(i => extractDay(i) === day) }))
    .filter(s => s.data.length > 0);
  console.log('details===', JSON.stringify(sections[0]));

  return (
    <SafeAreaWrapper style={styles.container} backgroundColor="#000">
      <ScrollView showsVerticalScrollIndicator={false}>
        {sections.map(s => (
          <DaySection key={s.title} day={s.title} items={s.data} />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 12, backgroundColor: '#000' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  sectionHeader: { paddingVertical: 8 },
  card: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  poster: { width: 80, height: 110, borderRadius: 6, backgroundColor: '#111' },
  info: { marginLeft: 12, flex: 1 },
  meta: { color: '#aaa', marginTop: 6 },
});
