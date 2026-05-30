import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { keywordsApi } from '@/services/api';

type Keyword = { name: string; count: number; growth?: number };

export default function TrendingScreen() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const FILTERS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'week', label: 'Tuần này' },
    { key: 'month', label: 'Tháng này' },
    { key: 'year', label: 'Năm nay' },
  ];

  const fetchData = async () => {
    try {
      // Swagger: GET /api/keywords/trends/trending?limit=
      // Response: [{ _id, name, trendScore, paperCount, growthRate }]
      const res = await keywordsApi.trending(20);
      const list = Array.isArray(res) ? res : res?.data || [];
      // Map to { name, count } for display
      setKeywords(list.map((k: any) => ({ name: k.name, count: k.paperCount || k.workCount || 0 })));
    } catch (e) {
      console.log('Trending fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const maxCount = keywords.length > 0 ? Math.max(...keywords.map(k => k.count)) : 1;

  const trendColors = [Colors.primary, Colors.secondary, Colors.success, Colors.warning, Colors.error];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📈 Xu hướng nghiên cứu</Text>
          <Text style={styles.headerSubtitle}>Các chủ đề nghiên cứu đang được quan tâm nhất</Text>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterBtn, activeFilter === f.key && styles.filterBtnActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.stateText}>Đang tải xu hướng...</Text>
          </View>
        ) : keywords.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.stateText}>Chưa có dữ liệu xu hướng</Text>
          </View>
        ) : (
          <>
            {/* Top 3 Podium */}
            <View style={styles.podiumSection}>
              <Text style={styles.sectionTitle}>🏆 Top 3 từ khóa nổi bật</Text>
              {keywords.slice(0, 3).map((kw, i) => (
                <View key={kw.name} style={styles.podiumCard}>
                  <View style={[styles.podiumRank, { backgroundColor: trendColors[i] + '20' }]}>
                    <Text style={[styles.podiumRankText, { color: trendColors[i] }]}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.podiumKeyword}>{kw.name}</Text>
                    <View style={styles.progressBarWrapper}>
                      <View style={[styles.progressBar, {
                        width: `${(kw.count / maxCount) * 100}%`,
                        backgroundColor: trendColors[i],
                      }]} />
                    </View>
                  </View>
                  <View style={[styles.countBadge, { backgroundColor: trendColors[i] }]}>
                    <Text style={styles.countText}>{kw.count}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* All Keywords */}
            <View style={styles.allKeywordsSection}>
              <Text style={styles.sectionTitle}>📋 Tất cả từ khóa</Text>
              <View style={styles.keywordsGrid}>
                {keywords.map((kw, i) => (
                  <TouchableOpacity
                    key={kw.name}
                    style={[styles.keywordCard, { borderLeftColor: trendColors[i % trendColors.length] }]}
                    activeOpacity={0.75}
                  >
                    <View style={styles.keywordCardRow}>
                      <Text style={styles.keywordName} numberOfLines={1}>{kw.name}</Text>
                      <View style={[styles.keywordCountBadge, { backgroundColor: trendColors[i % trendColors.length] + '15' }]}>
                        <Text style={[styles.keywordCountText, { color: trendColors[i % trendColors.length] }]}>{kw.count}</Text>
                      </View>
                    </View>
                    <View style={styles.keywordProgressOuter}>
                      <View style={[styles.keywordProgressFill, {
                        width: `${(kw.count / maxCount) * 100}%`,
                        backgroundColor: trendColors[i % trendColors.length],
                      }]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { padding: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerSubtitle: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  filtersRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: '#fff' },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  stateText: { fontSize: 16, color: Colors.textSecondary, fontWeight: '600', marginTop: 8 },
  podiumSection: { backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  podiumCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  podiumRank: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  podiumRankText: { fontSize: 22 },
  podiumKeyword: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  progressBarWrapper: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 3 },
  countBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  countText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  allKeywordsSection: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 20, padding: 16 },
  keywordsGrid: { gap: 8 },
  keywordCard: {
    backgroundColor: '#f8fafc', borderRadius: 12, padding: 14,
    borderLeftWidth: 4,
  },
  keywordCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  keywordName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  keywordCountBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  keywordCountText: { fontSize: 12, fontWeight: '800' },
  keywordProgressOuter: { height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' },
  keywordProgressFill: { height: '100%', borderRadius: 2 },
});
