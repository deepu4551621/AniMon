import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AppText from '../../components/AppText';

type Props = {
  visible: boolean;
  onClose: () => void;
  genresMeta: any[];
  genreType: 'genres' | 'explicit_genres' | 'themes' | 'demographics';
  selectedGenres: string[];
  onToggleGenre: (id: number | string) => void;

  onApply: () => void;
  onReset: () => void;
};

export default function FilterModal({
  visible,
  onClose,
  genresMeta = [],
  genreType,
  selectedGenres = [],
  onToggleGenre,
  onApply,
  onReset,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <AppText style={styles.modalTitle}>Filters & Genres</AppText>
            <TouchableOpacity onPress={onClose}>
              <AppText style={styles.closeText}>Close</AppText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.genreList}>
            {(genresMeta || [])
              .filter((g: any) => !g.type || g.type === genreType)
              .map((g: any) => {
                const id = String(g.mal_id ?? g.id);
                const selected = selectedGenres.includes(id);
                return (
                  <TouchableOpacity
                    key={id}
                    onPress={() => onToggleGenre(g.mal_id ?? g.id)}
                    style={[
                      styles.genreRow,
                      selected && styles.genreRowSelected,
                    ]}
                  >
                    <AppText
                      style={
                        selected ? styles.genreTextSelected : styles.genreText
                      }
                    >
                      {g.name}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onReset} style={styles.actionBtn}>
              <AppText style={styles.resetText}>Reset</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApply}
              style={[styles.actionBtn, styles.applyBtn]}
            >
              <AppText style={styles.applyText}>Apply</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '70%',
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: { color: '#fff', fontSize: 16 },
  closeText: { color: '#1e90ff' },
  typeRow: {
    flexDirection: 'row',
    marginVertical: 8,
    justifyContent: 'space-between',
  },
  typeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#222',
    marginHorizontal: 4,
  },
  typeBtnActive: { backgroundColor: '#1e90ff' },
  typeText: { color: '#ddd' },
  typeTextActive: { color: '#fff' },
  genreList: { flex: 1, marginTop: 8 },
  genreRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  genreRowSelected: { backgroundColor: '#1e90ff' },
  genreText: { color: '#ddd' },
  genreTextSelected: { color: '#fff' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionBtn: { padding: 8, marginLeft: 8 },
  resetText: { color: '#1e90ff' },
  applyBtn: {
    backgroundColor: '#1e90ff',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  applyText: { color: '#fff' },
});
