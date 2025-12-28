import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '../../../components/AppText';

type Props = { text?: string };

export default function Synopsis({ text }: Props) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  const preview = text.split('\n').slice(0, 3).join('\n');

  return (
    <View style={styles.container}>
      <AppText weight="semibold" size={16} style={styles.title}>Synopsis</AppText>
      <AppText size={14} style={styles.text}>{expanded ? text : preview}</AppText>
      {text.length > preview.length ? (
        <TouchableOpacity onPress={() => setExpanded((s) => !s)}>
          <AppText size={13} weight="medium" style={styles.toggle}>{expanded ? 'Show less' : 'Read more'}</AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 14 },
  title: { color: '#fff', marginBottom: 8 },
  text: { color: '#ddd', lineHeight: 20 },
  toggle: { color: '#9bdcff', marginTop: 8 },
});
