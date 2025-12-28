import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import AppText from '../../components/AppText';
import ScheduleDetailsModal from './ScheduleDetailsModal';

function formatRemaining(ms: number) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600)
    .toString()
    .padStart(2, '0');
  const m = Math.floor((totalSec % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = (totalSec % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function ScheduleItem({
  item,
  column = false,
}: {
  item: any;
  column?: boolean;
}) {
  const image = item.images?.jpg?.image_url || item.image_url || item.url;
  const timeText = item.broadcast?.string ?? item.aired?.string ?? '';

  const targetIso = item.aired?.from || null;
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    let timer: any = null;
    if (targetIso) {
      const update = () => {
        const now = Date.now();
        const t = Date.parse(targetIso);
        if (isNaN(t)) {
          setRemaining(null);
          return;
        }
        const diff = t - now;
        setRemaining(formatRemaining(diff));
      };
      update();
      timer = setInterval(update, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [targetIso]);

  let within24 = false;
  if (targetIso) {
    const t = Date.parse(targetIso);
    if (!isNaN(t))
      within24 = t - Date.now() <= 24 * 3600 * 1000 && t - Date.now() > 0;
  }

  const [open, setOpen] = useState(false);
  const openLink = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  if (column) {
    return (
      <>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setOpen(true)}
          style={styles.cardColumn}
        >
          <Image source={{ uri: image }} style={styles.posterColumn} />
          <View style={styles.infoColumn}>
            <AppText weight="semibold" size={13} numberOfLines={2}>
              {item.title}
            </AppText>
            {timeText ? (
              <AppText size={11} style={styles.meta}>
                {timeText}
              </AppText>
            ) : null}
            {within24 && remaining ? (
              <AppText size={11} style={styles.countdown}>
                Releases in {remaining}
              </AppText>
            ) : null}
          </View>
        </TouchableOpacity>

        <ScheduleDetailsModal
          visible={open}
          onClose={() => setOpen(false)}
          item={item}
        />
      </>
    );
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen(true)}
        style={styles.row}
      >
        <Image source={{ uri: image }} style={styles.poster} />
        <View style={styles.info}>
          <AppText weight="semibold" size={14} numberOfLines={2}>
            {item.title}
          </AppText>
          {timeText ? (
            <AppText size={12} style={styles.meta}>
              {timeText}
            </AppText>
          ) : null}
          {within24 && remaining ? (
            <AppText size={12} style={styles.countdown}>
              Releases in {remaining}
            </AppText>
          ) : null}
        </View>
      </TouchableOpacity>

      <ScheduleDetailsModal
        visible={open}
        onClose={() => setOpen(false)}
        item={item}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  poster: { width: 72, height: 100, borderRadius: 6, backgroundColor: '#111' },
  info: { marginLeft: 12, flex: 1 },
  meta: { color: '#aaa', marginTop: 6 },
  countdown: { color: '#ffd166', marginTop: 6 },
  cardColumn: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  posterColumn: {
    width: '100%',
    height: 140,
    borderRadius: 6,
    backgroundColor: '#111',
  },
  infoColumn: { marginTop: 8 },
  modal: { flex: 1, backgroundColor: '#000' },
  modalImage: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#000',
  },
});
