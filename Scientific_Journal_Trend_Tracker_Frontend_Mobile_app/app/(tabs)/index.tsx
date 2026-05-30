import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, FlatList, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { papersApi, keywordsApi } from '@/services/api';
import { router } from 'expo-router';

type Paper = {
  _id: string; title: string; journal?: { name: string };
  publicationYear: number; citations?: number;
  authors?: any[]; keywords?: any[];
};

type Keyword = { name: string; count: number };

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [papersRes, keywordsRes] = await Promise.allSettled([
        papersApi.list(1, 5),
        keywordsApi.trending(10),
      ]);

      if (papersRes.status === 'fulfilled') {
        // Response: { data: Paper[], pagination } → trường 'data' theo Swagger
        const papersData = papersRes.value;
        setPapers(papersData?.data || papersData?.papers || []);
      }
      if (keywordsRes.status === 'fulfilled') {
        // Response: [ { name, trendScore, paperCount } ]
        const kwData = keywordsRes.value;
        setKeywords(Array.isArray(kwData) ? kwData : kwData?.data || []);
      }
    } catch (e) {
      console.log('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalCitations = papers.reduce((sum, p) => sum + (p.citations || 0), 0);

  const statCards = [
    { label: 'Bài báo', value: papers.length.toString(), gradient: Colors.gradientPrimary, emoji: '📄' },
    { label: 'Trích dẫn', value: totalCitations.toString(), gradient: Colors.gradientPink, emoji: '📊' },
    { label: 'Xu hướng', value: keywords.length.toString(), gradient: Colors.gradientBlue, emoji: '🔥' },
    { label: 'Vai trò', value: user?.role || '?', gradient: Colors.gradientGreen, emoji: '🎓', small: true },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={Colors.primary} />}
      >
        {/* Welcome Banner */}
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.welcomeBanner}>
          <View style={styles.welcomeRow}>
            <View>
              <Text style={styles.welcomeGreeting}>Xin chào 👋</Text>
              <Text style={styles.welcomeName}>{user?.name || 'Nhà nghiên cứu'}</Text>
              <Text style={styles.welcomeSubtitle}>Đây là tổng quan nghiên cứu của bạn</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={async () => { await logout(); router.replace('/(auth)/login'); }}>
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stat Cards */}
        <View style={styles.statsGrid}>
          {statCards.map((card) => (
            <LinearGradient key={card.label} colors={[...card.gradient]} style={styles.statCard}>
              <Text style={styles.statEmoji}>{card.emoji}</Text>
              <Text style={[styles.statValue, card.small && { fontSize: 16, marginTop: 4 }]}>{card.value}</Text>
              <Text style={styles.statLabel}>{card.label}</Text>
            </LinearGradient>
          ))}
        </View>

        {/* Recent Publications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📄 Bài báo gần đây</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={styles.seeAll}>Xem tất cả →</Text>
            </TouchableOpacity>
          </View>
          {papers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>Chưa có bài báo nào</Text>
            </View>
          ) : (
            papers.map((paper) => (
              <TouchableOpacity key={paper._id} style={styles.paperCard} activeOpacity={0.75} onPress={() => router.push(`/paper/${paper._id}` as any)}>
                <View style={styles.paperAccent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.paperTitle} numberOfLines={2}>{paper.title}</Text>
                  <Text style={styles.paperMeta}>
                    {paper.journal?.name || 'Unknown Journal'} · {paper.publicationYear} · {paper.citations || 0} citations
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Trending Keywords */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Từ khóa xu hướng</Text>
          <View style={styles.keywordsWrap}>
            {keywords.map((kw) => (
              <TouchableOpacity key={kw.name} style={styles.keywordChip} activeOpacity={0.75}>
                <Text style={styles.keywordText}>{kw.name}</Text>
                <Text style={styles.keywordCount}>{kw.count}</Text>
              </TouchableOpacity>
            ))}
            {keywords.length === 0 && (
              <Text style={styles.emptyText}>Chưa có dữ liệu từ khóa</Text>
            )}
          </View>
        </View>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <View style={[styles.section, { borderColor: Colors.error, borderWidth: 1 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🛡️ Quản trị hệ thống</Text>
            </View>
            <TouchableOpacity 
              style={styles.adminActionCard} 
              activeOpacity={0.75}
              onPress={() => router.push('/admin/users' as any)}
            >
              <View style={styles.adminActionIcon}>
                <Text style={{ fontSize: 24 }}>👥</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.adminActionTitle}>Quản lý người dùng</Text>
                <Text style={styles.adminActionDesc}>Xem, thêm, phân quyền hoặc xóa tài khoản hệ thống</Text>
              </View>
              <Text style={{ color: Colors.textSecondary, fontSize: 18 }}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Thao tác nhanh</Text>
          <View style={styles.quickActionsRow}>
            {[
              { label: 'Tìm kiếm', emoji: '🔍', route: '/(tabs)/search' },
              { label: 'Xu hướng', emoji: '📈', route: '/(tabs)/trending' },
              { label: 'Đã lưu', emoji: '🔖', route: '/(tabs)/bookmarks' },
              { label: 'Hồ sơ', emoji: '👤', route: '/(tabs)/profile' },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickAction}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.75}
              >
                <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg },
  loadingText: { color: Colors.textSecondary, marginTop: 12, fontSize: 14 },
  welcomeBanner: { margin: 16, borderRadius: 20, padding: 20 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  welcomeGreeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  welcomeName: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  welcomeSubtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 13, marginTop: 4 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  logoutText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 4 },
  statCard: {
    flex: 1, minWidth: '45%', borderRadius: 16, padding: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4,
  },
  statEmoji: { fontSize: 24 },
  statValue: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 6 },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4, fontWeight: '600' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 20, padding: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  seeAll: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  paperCard: {
    flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 12,
    padding: 14, marginBottom: 8, overflow: 'hidden',
  },
  paperAccent: { width: 4, backgroundColor: Colors.primary, borderRadius: 2, marginRight: 12 },
  paperTitle: { fontSize: 14, fontWeight: '600', color: Colors.primary, lineHeight: 20 },
  paperMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  keywordsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  keywordChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary + '12', borderRadius: 20,
    paddingVertical: 6, paddingHorizontal: 12,
  },
  keywordText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  keywordCount: {
    backgroundColor: Colors.primary, color: '#fff', borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 1, fontSize: 10, fontWeight: '700',
  },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  quickAction: {
    flex: 1, backgroundColor: '#f8fafc', borderRadius: 14, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  quickActionEmoji: { fontSize: 24, marginBottom: 6 },
  quickActionLabel: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary },
  emptyState: { alignItems: 'center', paddingVertical: 24 },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },
  adminActionCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#f1f5f9',
  },
  adminActionIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.error + '15', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  adminActionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  adminActionDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});
