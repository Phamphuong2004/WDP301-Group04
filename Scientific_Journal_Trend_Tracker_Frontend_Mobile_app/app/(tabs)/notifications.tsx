import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { notificationsApi } from '@/services/api';

type Notification = {
  _id: string; title: string; message: string;
  createdAt: string; read: boolean; type?: string;
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      // Swagger: GET /api/notifications?page=&limit=
      const res = await notificationsApi.list();
      // Response: { data: [{ _id, title, message, createdAt, read }], pagination }
      setNotifications(res?.data || res?.notifications || (Array.isArray(res) ? res : []));
    } catch (e) {
      console.log('Notifications fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    try {
      // Swagger: PUT /api/notifications/all/read
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) { }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeEmoji: Record<string, string> = {
    new_paper: '📄', trending: '📈', system: '⚙️', follow: '👥', default: '🔔',
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ color: Colors.textSecondary, marginTop: 10 }}>Đang tải thông báo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🔔 Thông báo</Text>
          {unreadCount > 0 && <Text style={styles.unreadBadge}>{unreadCount} chưa đọc</Text>}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
            <Text style={styles.markAllText}>Đọc tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyEmoji}>🔕</Text>
          <Text style={styles.emptyTitle}>Không có thông báo mới</Text>
          <Text style={styles.emptySubtext}>Bạn sẽ nhận thông báo khi có bài báo mới phù hợp với bạn</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchNotifications(); }} tintColor={Colors.primary} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.card, !item.read && styles.cardUnread]} activeOpacity={0.75}>
              <View style={styles.iconWrapper}>
                <Text style={styles.typeEmoji}>{typeEmoji[item.type || 'default'] || '🔔'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.notifMessage} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.notifTime}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  unreadBadge: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  markAllBtn: {
    backgroundColor: Colors.primary + '12', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  markAllText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  emptySubtext: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  list: { padding: 16 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  cardUnread: { borderLeftWidth: 4, borderLeftColor: Colors.primary },
  iconWrapper: {
    width: 42, height: 42, borderRadius: 12, backgroundColor: Colors.bg,
    justifyContent: 'center', alignItems: 'center',
  },
  typeEmoji: { fontSize: 20 },
  notifTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  notifTitleUnread: { color: Colors.textPrimary, fontWeight: '800' },
  notifMessage: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, marginTop: 3 },
  notifTime: { fontSize: 11, color: Colors.textSecondary, marginTop: 6 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 6 },
});
