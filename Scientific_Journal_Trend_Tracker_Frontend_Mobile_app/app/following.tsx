import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { followsApi } from '@/services/api';

export default function FollowingScreen() {
  const [follows, setFollows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Keyword' | 'Journal'>('Keyword');

  const fetchFollows = async () => {
    try {
      const res = await followsApi.list();
      setFollows(res?.data || res || []);
    } catch (error) {
      console.log('Follows fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFollows();
  }, []);

  const handleUnfollow = (targetId: string) => {
    Alert.alert('Bỏ theo dõi', 'Bạn có chắc muốn bỏ theo dõi mục này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đồng ý', style: 'destructive',
        onPress: async () => {
          try {
            await followsApi.unfollow(targetId);
            setFollows(prev => prev.filter(f => f.targetId !== targetId && f.target?._id !== targetId));
          } catch (e) {
            Alert.alert('Lỗi', 'Không thể bỏ theo dõi.');
          }
        },
      },
    ]);
  };

  const filteredFollows = follows.filter(f => f.targetType === activeTab);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đang theo dõi</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'Keyword' && styles.tabBtnActive]}
          onPress={() => setActiveTab('Keyword')}
        >
          <Text style={[styles.tabText, activeTab === 'Keyword' && styles.tabTextActive]}>Từ khóa</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'Journal' && styles.tabBtnActive]}
          onPress={() => setActiveTab('Journal')}
        >
          <Text style={[styles.tabText, activeTab === 'Journal' && styles.tabTextActive]}>Tạp chí</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredFollows}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchFollows(); }} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{activeTab === 'Keyword' ? '🎯' : '🏛️'}</Text>
            <Text style={styles.emptyText}>Chưa theo dõi {activeTab === 'Keyword' ? 'từ khóa' : 'tạp chí'} nào.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.75}
            onPress={() => {
              if (activeTab === 'Journal' && item.targetId) {
                router.push(`/journal/${item.targetId}` as any);
              }
            }}
          >
            <View style={styles.cardIcon}>
              <Text style={{ fontSize: 24 }}>{activeTab === 'Keyword' ? '🎯' : '🏛️'}</Text>
            </View>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.target?.name || item.targetId}
              </Text>
              {activeTab === 'Journal' && item.target?.publisher && (
                <Text style={styles.cardSubtitle} numberOfLines={1}>{item.target.publisher}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.unfollowBtn} onPress={() => handleUnfollow(item.targetId || item.target?._id)}>
              <Text style={styles.unfollowBtnText}>Bỏ theo dõi</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { padding: 8, borderRadius: 8, backgroundColor: '#f1f5f9' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabsRow: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: Colors.primary + '15' },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary },
  list: { padding: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },
  card: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    borderRadius: 12, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardIcon: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  unfollowBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.error + '15', borderRadius: 8 },
  unfollowBtnText: { color: Colors.error, fontSize: 12, fontWeight: '700' },
});
