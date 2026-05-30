import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Dimensions, ScrollView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

// Simple blurred orb component for background effect
function Orb({ color, size, top, left, delay }: { color: string, size: number, top: any, left: any, delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000 + delay,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 4000 + delay,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top, left,
        width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity: 0.15,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -20]
            })
          }
        ]
      }}
    />
  );
}

const STATS = [
  { value: '52K+', label: 'Bài báo', color: '#818cf8' },
  { value: '12K+', label: 'Tác giả', color: '#67e8f9' },
  { value: '98%', label: 'Hài lòng', color: '#6ee7b7' },
];

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background with Orbs */}
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#0c4a6e']} style={StyleSheet.absoluteFill}>
        <Orb color="#4f46e5" size={300} top="-10%" left="-20%" delay={0} />
        <Orb color="#06b6d4" size={250} top="40%" left="60%" delay={1000} />
        <Orb color="#7c3aed" size={200} top="70%" left="-10%" delay={500} />
      </LinearGradient>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Top Bar */}
          <View style={styles.topBar}>
            <LinearGradient colors={[Colors.primary, Colors.secondary]} style={styles.logoBox}>
              <Text style={styles.logoIcon}>📈</Text>
            </LinearGradient>
            <Text style={styles.logoText}>SciTrend</Text>
          </View>

          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1, justifyContent: 'center' }}>

            {/* Badge */}
            <View style={styles.badgeWrapper}>
              <View style={styles.badge}>
                <Text style={styles.badgeIcon}>✨</Text>
                <Text style={styles.badgeText}>Nền tảng nghiên cứu thế hệ mới</Text>
              </View>
            </View>

            {/* Hero Text */}
            <Text style={styles.heroTitle}>
              Khám phá tri thức{'\n'}
              <Text style={styles.heroHighlight}>khoa học không giới hạn</Text>
            </Text>

            <Text style={styles.heroSubtitle}>
              Nền tảng quản lý bài báo khoa học thông minh dành cho nhà nghiên cứu, giảng viên và sinh viên — tìm kiếm, phân tích và theo dõi xu hướng hiệu quả hơn bao giờ hết.
            </Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              {STATS.map((stat, i) => (
                <View key={i} style={styles.statCard}>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Mini Dashboard Preview */}
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                <View style={styles.dots}>
                  <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
                  <View style={[styles.dot, { backgroundColor: '#f59e0b' }]} />
                  <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
                </View>
                <View style={styles.urlBar}>
                  <Text style={styles.urlText}>dashboard.scitrend.vn</Text>
                </View>
              </View>
              <View style={styles.previewContent}>
                <Text style={styles.previewTitle}>Bài báo mới hôm nay</Text>
                <Text style={styles.previewValue}>2,847 <Text style={{ color: '#10b981', fontSize: 12 }}>+12%</Text></Text>
                <View style={styles.previewBars}>
                  {[40, 70, 50, 90, 60, 100].map((h, i) => (
                    <View key={i} style={[styles.bar, { height: `${h}%`, backgroundColor: i === 5 ? '#818cf8' : 'rgba(255,255,255,0.1)' }]} />
                  ))}
                </View>
              </View>
            </View>

          </Animated.View>

          {/* Bottom Actions */}
          <Animated.View style={[styles.actionsContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/(auth)/register')}
            >
              <LinearGradient
                colors={['#4f46e5', '#7c3aed']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.btnGradient}
              >
                <Text style={styles.primaryBtnText}>Đăng ký ngay →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.secondaryBtnText}>Tôi đã có tài khoản (Đăng nhập)</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollContent: { flexGrow: 1, padding: 24, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  logoBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logoIcon: { fontSize: 16 },
  logoText: { fontSize: 20, fontWeight: '900', color: '#fff' },
  badgeWrapper: { alignItems: 'flex-start', marginBottom: 24 },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(79,70,229,0.2)',
    borderWidth: 1, borderColor: 'rgba(165,180,252,0.3)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  badgeIcon: { fontSize: 12, marginRight: 6 },
  badgeText: { color: '#a5b4fc', fontSize: 12, fontWeight: '600' },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#fff', lineHeight: 44, marginBottom: 16, letterSpacing: -1 },
  heroHighlight: { color: '#67e8f9' },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 24, marginBottom: 32 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statCard: {
    flex: 1, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12, padding: 12, marginHorizontal: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: { fontSize: 22, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
  previewCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    padding: 20, marginBottom: 40,
  },
  previewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  urlBar: { flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 6, marginLeft: 12, paddingVertical: 4, alignItems: 'center' },
  urlText: { color: 'rgba(255,255,255,0.3)', fontSize: 10 },
  previewContent: { alignItems: 'center' },
  previewTitle: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4 },
  previewValue: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 16 },
  previewBars: { flexDirection: 'row', alignItems: 'flex-end', height: 60, gap: 8, width: '100%' },
  bar: { flex: 1, borderRadius: 4 },
  actionsContainer: { marginTop: 'auto' },
  primaryBtn: {
    borderRadius: 16,
    shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
    marginBottom: 16,
  },
  btnGradient: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  secondaryBtn: {
    paddingVertical: 16, alignItems: 'center', borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
