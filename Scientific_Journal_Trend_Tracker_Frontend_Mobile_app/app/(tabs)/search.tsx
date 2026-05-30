import { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  FlatList, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { papersApi } from '@/services/api';

type Paper = {
  _id: string; title: string;
  journal?: { name: string }; publicationYear: number;
  citations?: number; abstract?: string;
  authors?: any[]; keywords?: any[];
};

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      // Swagger: GET /api/papers/search/query?q=&year=&journalId=
      const res = await papersApi.search(query);
      // Response có thể là { data: [] } hoặc trực tiếp []
      setResults(res?.data || res?.papers || (Array.isArray(res) ? res : []));
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 Tìm kiếm bài báo</Text>
        <Text style={styles.headerSubtitle}>Khám phá hàng chục nghìn bài báo khoa học</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tiêu đề, tác giả, từ khóa..."
            placeholderTextColor={Colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
              <Text style={{ color: Colors.textSecondary, fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch} activeOpacity={0.8}>
          <Text style={styles.searchBtnText}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {/* Quick filters */}
      <View style={styles.filtersRow}>
        {['AI / ML', 'Y học', 'Vật lý', 'Hóa học', 'Sinh học'].map(tag => (
          <TouchableOpacity
            key={tag}
            style={styles.filterChip}
            onPress={() => { setQuery(tag); }}
            activeOpacity={0.75}
          >
            <Text style={styles.filterChipText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.stateText}>Đang tìm kiếm...</Text>
        </View>
      ) : searched && results.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyEmoji}>🔎</Text>
          <Text style={styles.stateText}>Không tìm thấy kết quả cho "{query}"</Text>
          <Text style={styles.stateSubText}>Thử từ khóa khác hoặc kiểm tra chính tả</Text>
        </View>
      ) : !searched ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyEmoji}>📚</Text>
          <Text style={styles.stateText}>Nhập từ khóa để bắt đầu tìm kiếm</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.paperCard} activeOpacity={0.75} onPress={() => router.push(`/paper/${item._id}` as any)}>
              <View style={styles.paperHeader}>
                <View style={styles.paperAccent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.paperTitle} numberOfLines={2}>{item.title}</Text>
                </View>
              </View>
              <Text style={styles.paperMeta}>
                📰 {item.journal?.name || 'N/A'} · 📅 {item.publicationYear} · 📊 {item.citations || 0} citations
              </Text>
              {item.abstract && (
                <Text style={styles.paperAbstract} numberOfLines={2}>{item.abstract}</Text>
              )}
              <View style={styles.paperKeywords}>
                {(item.keywords || []).slice(0, 3).map((k: any) => (
                  <View key={typeof k === 'string' ? k : k.name} style={styles.keywordBadge}>
                    <Text style={styles.keywordText}>{typeof k === 'string' ? k : k.name}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          )}
          ListHeaderComponent={() => (
            <Text style={styles.resultsCount}>🔎 Tìm thấy {results.length} kết quả</Text>
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
  searchRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12 },
  searchInputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, paddingVertical: 12 },
  searchBtn: {
    backgroundColor: Colors.primary, borderRadius: 14, paddingHorizontal: 18,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  filtersRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  filterChip: {
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  filterChipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  stateText: { fontSize: 16, color: Colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  stateSubText: { fontSize: 13, color: Colors.textSecondary, marginTop: 6, textAlign: 'center' },
  resultsList: { padding: 16 },
  resultsCount: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', marginBottom: 12 },
  paperCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  paperHeader: { flexDirection: 'row', marginBottom: 8 },
  paperAccent: { width: 4, backgroundColor: Colors.primary, borderRadius: 2, marginRight: 10 },
  paperTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, lineHeight: 20 },
  paperMeta: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, lineHeight: 18 },
  paperAbstract: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  paperKeywords: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  keywordBadge: { backgroundColor: Colors.primary + '12', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 },
  keywordText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
});
