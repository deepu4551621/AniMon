import React from 'react';
import {
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Linking,
  Alert,
} from 'react-native';
import AppText from '../../components/AppText';

type Props = {
  visible: boolean;
  onClose: () => void;
  item: any;
};

export default function ScheduleDetailsModal({
  visible,
  onClose,
  item,
}: Props) {
  if (!item) return null;

  const image = item.images?.jpg?.image_url || item.image_url || item.url;
  const timeText = item.broadcast?.string ?? item.aired?.string ?? '';

  const openLink = async (url?: string) => {
    if (!url) return;
    try {
      const can = await Linking.canOpenURL(url);
      if (can) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot open link', 'The link could not be opened.');
      }
    } catch (err) {
      Alert.alert(
        'Cannot open link',
        'An error occurred while trying to open the link.',
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <AppText weight="bold" color="#fff">
            ✕
          </AppText>
        </TouchableOpacity>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cover Image */}
          <Image source={{ uri: image }} style={styles.image} />

          {/* Titles */}
          <AppText weight="semibold" size={18} style={styles.title}>
            {item.title}
          </AppText>

          {item.title_english ? (
            <AppText size={13} style={styles.subTitle}>
              {item.title_english}
            </AppText>
          ) : null}

          {/* Info Section */}
          <View style={styles.infoSection}>
            {timeText && (
              <AppText size={13} color="#DDD">
                Broadcast: {timeText}
              </AppText>
            )}
            {item.type && (
              <AppText size={13} color="#DDD">
                Type: {item.type}
              </AppText>
            )}
            {item.episodes && (
              <AppText size={13} color="#DDD">
                Episodes: {item.episodes}
              </AppText>
            )}
            {item.status && (
              <AppText size={13} color="#DDD">
                Status: {item.status}
              </AppText>
            )}
            {item.duration && (
              <AppText size={13} color="#DDD">
                Duration: {item.duration}
              </AppText>
            )}
            {item.rating && (
              <AppText size={13} color="#DDD">
                Rating: {item.rating}
              </AppText>
            )}
            {item.score && (
              <AppText size={13} color="#DDD">
                Score: {item.score}
              </AppText>
            )}
            {typeof item.favorites === 'number' && (
              <AppText size={13} color="#DDD">
                Favorites: {item.favorites}
              </AppText>
            )}
          </View>

          {/* Studios & Genres */}
          {item.studios?.length ? (
            <AppText size={13} style={styles.inlineInfo}>
              Studios: {item.studios.map((s: any) => s.name).join(', ')}
            </AppText>
          ) : null}

          {item.genres?.length ? (
            <AppText size={13} style={styles.inlineInfo}>
              Genres: {item.genres.map((g: any) => g.name).join(', ')}
            </AppText>
          ) : null}

          {/* Synopsis */}
          {item.synopsis ? (
            <AppText size={13} style={styles.synopsis}>
              {item.synopsis}
            </AppText>
          ) : null}

          {/* Link Button */}
          {item.url ? (
            <TouchableOpacity
              onPress={() => openLink(item.url)}
              style={styles.primaryButton}
            >
              <AppText weight="semibold" color="#fff">
                Open on MyAnimeList
              </AppText>
            </TouchableOpacity>
          ) : null}

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

/* ---------- DARK THEME STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0E',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 56,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#1F1F1F',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
  },
  title: {
    marginTop: 12,
    color: '#FFFFFF',
  },
  subTitle: {
    marginTop: 4,
    color: '#A8A8A8',
  },
  infoSection: {
    marginTop: 10,
    gap: 2,
  },
  inlineInfo: {
    marginTop: 10,
    color: '#CCCCCC',
  },
  synopsis: {
    marginTop: 12,
    lineHeight: 18,
    color: '#E0E0E0',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
