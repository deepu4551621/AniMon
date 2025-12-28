import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import AppText from '../../../components/AppText';

type TrailerProps = {
  trailer?: {
    youtube_id: any;
    embed_url?: string | null;
    url?: string | null;
    images?: any;
  } | null;
  height?: number;
};

export default function Trailer({ trailer, height = 220 }: TrailerProps) {
  if (!trailer) return null;
  const embed = trailer.embed_url ?? trailer?.embed_url ?? null;
  // try to extract a YouTube video id from embed_url or trailer data
  const extractYouTubeId = (src?: string | null) => {
    if (!src) return null;
    const m = src.match(/(?:embed\/|watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  };
  const youtubeId =
    trailer.youtube_id ?? trailer.youtube_id ?? extractYouTubeId(embed);
  const thumb = trailer.images?.jpg?.image_url || null;
  const openLink = async (url?: string | null) => {
    if (!url) return;
    try {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
    } catch {
      // ignore
    }
  };

  if (youtubeId) {
    return (
      <View style={[styles.container, { height }]}>
        <AppText weight="semibold" size={16} style={styles.title}>
          Trailer
        </AppText>
        <View
          style={{
            backgroundColor: '#000',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <YoutubePlayer height={height} videoId={youtubeId} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {thumb ? (
        <Image source={{ uri: thumb }} style={[styles.image, { height }]} />
      ) : (
        <View style={[styles.image, { height }]} />
      )}
      <TouchableOpacity
        style={styles.playOverlay}
        onPress={() => openLink(trailer.url ?? undefined)}
      >
        <AppText weight="semibold" color="#fff">
          Play Trailer
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', backgroundColor: '#000', marginBottom: 12 },
  image: { width: '100%', borderRadius: 8, backgroundColor: '#111' },
  playOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 8,
  },
  title: { padding: 8, color: '#fff' },
});
