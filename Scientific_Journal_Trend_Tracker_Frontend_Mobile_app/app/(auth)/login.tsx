import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { authApi } from '@/services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.login({ email, password });
      // Backend trả về { token, user: { _id, fullName, email, role } }
      await login(result.token, {
        id: result.user._id,
        name: result.user.fullName,
        email: result.user.email,
        role: result.user.role,
      });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Đăng nhập thất bại', err.message || 'Kiểm tra lại email và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header Gradient */}
        <LinearGradient
          colors={['#0f172a', '#1e1b4b', '#0c4a6e']}
          style={styles.header}
        >
          {/* Logo */}
          <View style={styles.logoRow}>
            <LinearGradient
              colors={[Colors.primary, Colors.secondary]}
              style={styles.logoBox}
            >
              <Text style={styles.logoIcon}>📈</Text>
            </LinearGradient>
            <Text style={styles.logoText}>SciTrend</Text>
          </View>

          <Text style={styles.headerTitle}>
            Nơi hội tụ{'\n'}
            <Text style={styles.headerHighlight}>tri thức</Text> khoa học
          </Text>
          <Text style={styles.headerSubtitle}>
            Đăng nhập để khám phá hàng chục nghìn bài báo khoa học và kết nối với cộng đồng nghiên cứu toàn cầu.
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { value: '50K+', label: 'Bài báo' },
              { value: '10K+', label: 'Nhà KH' },
              { value: '500+', label: 'Tạp chí' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Đăng nhập</Text>
          <Text style={styles.formSubtitle}>Chào mừng trở lại! Nhập thông tin để tiếp tục.</Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="ten@example.com"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TouchableOpacity>
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Text>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            <LinearGradient
              colors={[Colors.primary, '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginBtn}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.loginBtnText}>Đăng nhập →</Text>
              }
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc tiếp tục với</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialBtnText}>🔍  Tiếp tục với Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, styles.socialBtnOrcid]}>
            <Text style={[styles.socialBtnText, { color: '#fff' }]}>🔬  Tiếp tục với ORCID</Text>
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

          {/* Testimonial */}
          <View style={styles.testimonial}>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.testimonialText}>
              "SciTrend đã thay đổi hoàn toàn cách tôi tiếp cận nghiên cứu. Giao diện đẹp, tính năng phân tích rất ấn tượng."
            </Text>
            <Text style={styles.testimonialAuthor}>— PGS.TS Nguyễn Minh Tuấn, ĐH Bách Khoa Hà Nội</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1 },
  header: {
    padding: 28,
    paddingTop: 60,
    paddingBottom: 36,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 10,
  },
  logoBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: { fontSize: 20 },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 38,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  headerHighlight: {
    color: '#818cf8',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 2,
  },
  form: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  formSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 28,
    lineHeight: 20,
  },
  inputGroup: { marginBottom: 18 },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  inputIcon: { fontSize: 16, marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 12,
  },
  eyeBtn: { padding: 4 },
  loginBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { color: '#9ca3af', fontSize: 13 },
  socialBtn: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  socialBtnOrcid: {
    backgroundColor: '#a6ce39',
    borderColor: '#a6ce39',
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  registerText: { color: Colors.textSecondary, fontSize: 14 },
  registerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  testimonial: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  stars: { fontSize: 14, marginBottom: 8 },
  testimonialText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 12,
  },
  testimonialAuthor: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
});
