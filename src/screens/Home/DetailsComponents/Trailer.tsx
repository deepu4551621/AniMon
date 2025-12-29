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
import ShimmerCard from '../ShimmerCard';
import { SCREEN_WIDTH } from '../../../utils';

type TrailerProps = {
  trailer?: {
    youtube_id: any;
    embed_url?: string | null;
    url?: string | null;
    images?: any;
  } | null;
  height?: number;
};

export default function Trailer({ trailer, height = 180 }: TrailerProps) {
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

  if (youtubeId) {
    return (
      <View style={[styles.container, { marginVertical: 16 }]}>
        <AppText style={styles.title}>Trailer</AppText>
        <View
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: 4,
            elevation: 10,
          }}
        >
          <YoutubePlayer height={height} videoId={youtubeId} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { marginVertical: 12 }]}>
      <ShimmerCard cardWidth={SCREEN_WIDTH - 32} cardHeight={height} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 12,
  },
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
