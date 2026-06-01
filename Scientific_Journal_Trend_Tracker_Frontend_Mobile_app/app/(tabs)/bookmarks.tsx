import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { bookmarksApi } from '@/services/api';

type Bookmark = {
  _id: string; paper: {
    _id: string; title: string;
    journal?: { name: string }; publicationYear: number; citations?: number;
  };
};

export default function BookmarksScreen() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookmarks = async () => {
    try {
      // Swagger: GET /api/bookmarks?page=&limit=
      const res = await bookmarksApi.list();
      // Response: { data: [{_id, paper: {...}}], pagination }
      setBookmarks(res?.data || res?.bookmarks || (Array.isArray(res) ? res : []));
    } catch (e) {
      console.log('Bookmarks fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const handleRemove = (id: string) => {
    Alert.alert('Xóa bookmark', 'Bạn có chắc muốn xóa bài báo này khỏi danh sách đã lưu?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive',
        onPress: async () => {
          try {
            // Swagger: DELETE /api/bookmarks/:paperId  (paperId, không phải bookmark _id)
            const bookmark = bookmarks.find(b => b._id === id);
            const paperId = bookmark?.paper?._id || id;
            await bookmarksApi.remove(paperId);
            setBookmarks(prev => prev.filter(b => b._id !== id));
          } catch (e) {
            Alert.alert('Lỗi', 'Không thể xóa bookmark. Vui lòng thử lại.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.stateText}>Đang tải bookmark...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔖 Bài báo đã lưu</Text>
        <Text style={styles.headerSubtitle}>{bookmarks.length} bài báo trong thư viện của bạn</Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.emptyTitle}>Chưa có bài báo nào được lưu</Text>
          <Text style={styles.emptySubtext}>Tìm kiếm bài báo và bấm lưu để thêm vào đây</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchBookmarks(); }} tintColor={Colors.primary} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.paperTitle} numberOfLines={2}>{item.paper.title}</Text>
                  <Text style={styles.paperMeta}>
                    📰 {item.paper.journal?.name || 'N/A'} · 📅 {item.paper.publicationYear} · 📊 {item.paper.citations || 0} citations
                  </Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.openBtn} onPress={() => router.push(`/paper/${item.paper._id}` as any)}>
                  <Text style={styles.openBtnText}>Xem chi tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item._id)}>
                  <Text style={styles.removeBtnText}>🗑️ Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerSubtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  stateText: { color: Colors.textSecondary, fontSize: 14, marginTop: 10 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
    padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardContent: { flexDirection: 'row', marginBottom: 12 },
  accent: { width: 4, backgroundColor: Colors.primary, borderRadius: 2, marginRight: 12 },
  paperTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, lineHeight: 20, marginBottom: 6 },
  paperMeta: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  cardActions: { flexDirection: 'row', gap: 10 },
  openBtn: {
    flex: 1, backgroundColor: Colors.primary + '12', borderRadius: 10,
    paddingVertical: 8, alignItems: 'center',
  },
  openBtnText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  removeBtn: {
    backgroundColor: Colors.error + '12', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center',
  },
  removeBtnText: { color: Colors.error, fontSize: 13, fontWeight: '600' },
});
