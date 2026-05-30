import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { authApi } from '@/services/api';

const ROLES = [
  { value: 'researcher', label: 'Nhà nghiên cứu', icon: '🔬', color: Colors.primary, desc: 'Theo dõi xu hướng & phân tích trích dẫn' },
  { value: 'student', label: 'Giảng viên / Sinh viên', icon: '🎓', color: Colors.secondary, desc: 'Tìm tài liệu & quản lý danh sách đọc' },
  { value: 'admin', label: 'Quản trị viên', icon: '⚙️', color: Colors.success, desc: 'Quản lý hệ thống & phân quyền' },
];

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('researcher');
  const [loading, setLoading] = useState(false);

  const passwordChecks = [
    { label: 'Ít nhất 8 ký tự', ok: password.length >= 8 },
    { label: 'Chữ hoa & thường', ok: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'Chứa số', ok: /\d/.test(password) },
    { label: 'Ký tự đặc biệt', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const passwordScore = passwordChecks.filter(c => c.ok).length;
  const strengthColors = ['#ef4444', '#f59e0b', '#10b981', '#10b981'];
  const strengthLabels = ['Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    setLoading(true);
    try {
      await authApi.register({ fullName, email, password, institution });
      Alert.alert('Thành công!', 'Tài khoản đã được tạo. Vui lòng đăng nhập.', [
        { text: 'Đăng nhập ngay', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err: any) {
      Alert.alert('Đăng ký thất bại', err.message || 'Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find(r => r.value === role)!;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <LinearGradient colors={['#0f172a', '#1e1b4b', '#0c4a6e']} style={styles.header}>
          <View style={styles.logoRow}>
            <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.logoBox}>
              <Text style={styles.logoIcon}>📈</Text>
            </LinearGradient>
            <Text style={styles.logoText}>SciTrend</Text>
          </View>
          <Text style={styles.headerBadge}>✅  Miễn phí · Không cần thẻ tín dụng</Text>
          <Text style={styles.headerTitle}>Tham gia cộng đồng{'\n'}<Text style={styles.headerHighlight}>nghiên cứu</Text> hôm nay</Text>
          <View style={styles.benefitsRow}>
            {['📚 52,000+ bài báo', '📊 20+ bộ lọc', '🔔 Thông báo realtime', '🌐 Kết nối toàn cầu'].map(b => (
              <Text key={b} style={styles.benefit}>{b}</Text>
            ))}
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Tạo tài khoản mới</Text>
          <Text style={styles.subtitle}>Miễn phí · Cài đặt trong 2 phút</Text>

          {/* Role selector */}
          <Text style={styles.label}>Bạn là ai? <Text style={{ color: Colors.error }}>*</Text></Text>
          {ROLES.map(r => (
            <TouchableOpacity
              key={r.value}
              style={[styles.roleCard, role === r.value && { borderColor: r.color, backgroundColor: r.color + '10' }]}
              onPress={() => setRole(r.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.roleIcon}>{r.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.roleLabel, role === r.value && { color: r.color }]}>{r.label}</Text>
                <Text style={styles.roleDesc}>{r.desc}</Text>
              </View>
              {role === r.value && <Text style={{ color: r.color, fontSize: 18 }}>✓</Text>}
            </TouchableOpacity>
          ))}

          {/* Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên <Text style={{ color: Colors.error }}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput style={styles.input} placeholder="Nguyễn Văn A" placeholderTextColor={Colors.textSecondary} value={fullName} onChangeText={setFullName} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email <Text style={{ color: Colors.error }}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput style={styles.input} placeholder="ten@example.com" placeholderTextColor={Colors.textSecondary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trường / Tổ chức <Text style={{ color: Colors.textSecondary, fontWeight: '400', fontSize: 12 }}>(tùy chọn)</Text></Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🏛️</Text>
              <TextInput style={styles.input} placeholder="Đại học Bách Khoa Hà Nội" placeholderTextColor={Colors.textSecondary} value={institution} onChangeText={setInstitution} />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu <Text style={{ color: Colors.error }}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="••••••••" placeholderTextColor={Colors.textSecondary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            {/* Password strength */}
            {password.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <View style={styles.strengthBar}>
                  <View style={[styles.strengthFill, { width: `${(passwordScore / 4) * 100}%`, backgroundColor: strengthColors[passwordScore - 1] || '#e2e8f0' }]} />
                </View>
                <Text style={{ color: strengthColors[passwordScore - 1] || Colors.textSecondary, fontSize: 12, fontWeight: '700', marginTop: 4 }}>
                  {strengthLabels[passwordScore - 1] || ''}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                  {passwordChecks.map(c => (
                    <Text key={c.label} style={{ fontSize: 11, color: c.ok ? Colors.success : Colors.textSecondary }}>
                      {c.ok ? '✅' : '⭕'} {c.label}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu <Text style={{ color: Colors.error }}>*</Text></Text>
            <View style={[styles.inputWrapper, confirmPassword && confirmPassword !== password ? { borderColor: Colors.error } : {}]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="••••••••" placeholderTextColor={Colors.textSecondary} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            </View>
            {confirmPassword && confirmPassword !== password && (
              <Text style={{ color: Colors.error, fontSize: 12, marginTop: 4 }}>Mật khẩu không khớp</Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity onPress={handleRegister} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={[selectedRole.color, selectedRole.color + 'CC']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.registerBtn}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Tạo tài khoản — {selectedRole.label} →</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.terms}>Bằng cách đăng ký, bạn đồng ý với <Text style={{ color: Colors.primary }}>Điều khoản sử dụng</Text> và <Text style={{ color: Colors.primary }}>Chính sách bảo mật</Text>.</Text>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>

          {/* Trust badges */}
          <View style={styles.trustRow}>
            {['🔒 Bảo mật SSL', '✅ Xác minh email', '⭐ Miễn phí mãi mãi'].map(b => (
              <Text key={b} style={styles.trustBadge}>{b}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1 },
  header: { padding: 28, paddingTop: 60, paddingBottom: 32 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 10 },
  logoBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logoIcon: { fontSize: 18 },
  logoText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  headerBadge: { color: '#6ee7b7', fontSize: 13, fontWeight: '600', marginBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: '#fff', lineHeight: 34, marginBottom: 16 },
  headerHighlight: { color: '#818cf8' },
  benefitsRow: { gap: 8 },
  benefit: { color: 'rgba(255,255,255,0.65)', fontSize: 13 },
  form: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, marginBottom: 6 },
  subtitle: { color: Colors.textSecondary, fontSize: 14, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 8 },
  roleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 14, borderWidth: 2, borderColor: Colors.border,
    backgroundColor: '#f8fafc', marginBottom: 10,
  },
  roleIcon: { fontSize: 24 },
  roleLabel: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  roleDesc: { fontSize: 12, color: Colors.textSecondary },
  inputGroup: { marginBottom: 16 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 4,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary, paddingVertical: 12 },
  strengthBar: { height: 5, backgroundColor: '#f1f5f9', borderRadius: 5, overflow: 'hidden' },
  strengthFill: { height: '100%', borderRadius: 5 },
  registerBtn: {
    borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  registerBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  terms: { color: Colors.textSecondary, fontSize: 12, textAlign: 'center', lineHeight: 18, marginTop: 14, marginBottom: 20 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  loginText: { color: Colors.textSecondary, fontSize: 14 },
  loginLink: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
  trustRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9', marginBottom: 20 },
  trustBadge: { color: Colors.textSecondary, fontSize: 12 },
});
