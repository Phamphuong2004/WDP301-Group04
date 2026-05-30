import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { usersApi } from '@/services/api';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      return;
    }
    setLoading(true);
    try {
      // Swagger: PUT /api/users/:id → { fullName, institution, bio, interests }
      await usersApi.update(user.id, { fullName });
      Alert.alert('Thành công', 'Đã cập nhật thông tin hồ sơ!');
    } catch (e: any) {
      Alert.alert('Lỗi', e.message || 'Không thể cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất', style: 'destructive',
        onPress: async () => { await logout(); router.replace('/(auth)/login'); },
      },
    ]);
  };

  const roleInfo = {
    researcher: { label: 'Nhà nghiên cứu', emoji: '🔬', color: Colors.primary },
    student: { label: 'Giảng viên / Sinh viên', emoji: '🎓', color: Colors.secondary },
    admin: { label: 'Quản trị viên', emoji: '⚙️', color: Colors.success },
  }[user?.role?.toLowerCase() || 'researcher'] || { label: user?.role, emoji: '👤', color: Colors.primary };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar Banner */}
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.banner}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{(user?.name || 'U')[0].toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Người dùng'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{roleInfo.emoji} {roleInfo.label}</Text>
          </View>
        </LinearGradient>

        {/* Info & Following */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Thông tin & Hoạt động</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/following' as any)}>
            <View>
              <Text style={styles.settingLabel}>Đang theo dõi</Text>
              <Text style={styles.settingDesc}>Quản lý từ khóa và tạp chí đang theo dõi</Text>
            </View>
            <Text style={{ fontSize: 18, color: Colors.textSecondary }}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chỉnh sửa thông tin</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <TextInput
                style={[styles.input, { color: Colors.textSecondary }]}
                value={email}
                editable={false}
              />
              <Text style={styles.lockedIcon}>🔒</Text>
            </View>
            <Text style={styles.helperText}>Email không thể thay đổi</Text>
          </View>

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.saveBtnText}>💾 Lưu thay đổi</Text>
            }
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Cài đặt thông báo</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Thông báo Push</Text>
              <Text style={styles.settingDesc}>Nhận thông báo về bài báo mới</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
              thumbColor={notifications ? Colors.primary : '#f1f5f9'}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Thông báo Email</Text>
              <Text style={styles.settingDesc}>Nhận tóm tắt hàng tuần qua email</Text>
            </View>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
              thumbColor={emailAlerts ? Colors.primary : '#f1f5f9'}
            />
          </View>
        </View>

        {/* Danger zone */}
        <View style={[styles.section, styles.dangerSection]}>
          <Text style={styles.sectionTitle}>⚠️ Tài khoản</Text>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.logoutBtnText}>🚪 Đăng xuất</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.8}>
            <Text style={styles.deleteBtnText}>🗑️ Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>SciTrend Mobile</Text>
          <Text style={styles.appVersion}>Phiên bản 1.0.0</Text>
          <Text style={styles.appCopy}>© 2025 SciTrend. All rights reserved.</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  banner: { paddingTop: 40, paddingBottom: 32, alignItems: 'center' },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8 },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  roleBadgeText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  section: {
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12,
    borderRadius: 20, padding: 16,
  },
  dangerSection: { borderWidth: 1, borderColor: Colors.error + '30' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 14,
  },
  inputDisabled: { backgroundColor: '#f1f5f9' },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary, paddingVertical: 12 },
  lockedIcon: { fontSize: 14 },
  helperText: { fontSize: 11, color: Colors.textSecondary, marginTop: 4 },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginTop: 4,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  settingLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  settingDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  logoutBtn: {
    borderWidth: 1.5, borderColor: Colors.error + '50', borderRadius: 12,
    paddingVertical: 13, alignItems: 'center', marginBottom: 10,
    backgroundColor: Colors.error + '08',
  },
  logoutBtnText: { color: Colors.error, fontSize: 14, fontWeight: '700' },
  deleteBtn: {
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12,
    paddingVertical: 13, alignItems: 'center',
  },
  deleteBtnText: { color: Colors.textSecondary, fontSize: 14, fontWeight: '600' },
  appInfo: { alignItems: 'center', padding: 20, marginTop: 8 },
  appName: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  appVersion: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 },
  appCopy: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
});
