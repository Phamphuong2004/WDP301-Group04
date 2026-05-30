import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { usersApi } from '@/services/api';

export default function UserManagementScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await usersApi.list();
      setUsers(res?.data || res || []);
    } catch (error) {
      console.log('Users fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Xóa người dùng', `Bạn có chắc muốn xóa người dùng "${name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive',
        onPress: async () => {
          try {
            await usersApi.remove(id);
            setUsers(prev => prev.filter(u => u._id !== id));
          } catch (e) {
            Alert.alert('Lỗi', 'Không thể xóa người dùng.');
          }
        },
      },
    ]);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'researcher': return '#3b82f6';
      case 'student': return '#10b981';
      default: return '#64748b';
    }
  };

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
        <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchUsers(); }} tintColor={Colors.primary} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.fullName ? item.fullName.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName} numberOfLines={1}>{item.fullName || 'Người dùng'}</Text>
                <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
              </View>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) + '20' }]}>
                <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
                  {item.role || 'user'}
                </Text>
              </View>
            </View>
            
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id, item.fullName)}>
                <Text style={styles.deleteBtnText}>Xóa tài khoản</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  list: { padding: 16 },
  card: { 
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardInfo: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  userName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  userEmail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
  roleText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end', padding: 8 },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: Colors.error + '10' },
  deleteBtnText: { color: Colors.error, fontSize: 13, fontWeight: '600' },
});
