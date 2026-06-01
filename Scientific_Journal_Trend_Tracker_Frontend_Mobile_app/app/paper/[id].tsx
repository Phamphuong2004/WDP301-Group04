import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { papersApi, bookmarksApi } from '@/services/api';

export default function PaperDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [paper, setPaper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const [paperRes, bookmarkRes] = await Promise.allSettled([
          papersApi.getById(id!),
          bookmarksApi.check(id!),
        ]);

        if (paperRes.status === 'fulfilled') {
          setPaper(paperRes.value?.data || paperRes.value);
        }
        if (bookmarkRes.status === 'fulfilled') {
          setIsBookmarked(bookmarkRes.value?.isBookmarked || bookmarkRes.value?.data?.isBookmarked || false);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin bài báo.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPaperDetails();
  }, [id]);

  const toggleBookmark = async () => {
    if (bookmarking) return;
    setBookmarking(true);
    try {
      if (isBookmarked) {
        await bookmarksApi.remove(id!);
        setIsBookmarked(false);
      } else {
        await bookmarksApi.add(id!);
        setIsBookmarked(true);
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể cập nhật bookmark.');
    } finally {
      setBookmarking(false);
    }
  };

  const openLink = (url: string) => {
    if (url) Linking.openURL(url);
  };

  if (loading || !paper) {
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
        <Text style={styles.headerTitle}>Chi tiết bài báo</Text>
        <TouchableOpacity onPress={toggleBookmark} disabled={bookmarking} style={styles.actionBtn}>
          <Text style={{ fontSize: 20 }}>{isBookmarked ? '🔖' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.title}>{paper.title}</Text>
          
          {/* Metadata */}
          <View style={styles.metaRow}>
            {paper.journal?.name && (
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>📰 {paper.journal.name}</Text>
              </View>
            )}
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>📅 {paper.publicationYear}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>📊 {paper.citationCount || paper.citations || 0} trích dẫn</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            {paper.url || paper.doi ? (
              <TouchableOpacity 
                style={styles.primaryBtn} 
                onPress={() => openLink(paper.url || `https://doi.org/${paper.doi}`)}
              >
                <Text style={styles.primaryBtnText}>🔗 Mở bài báo gốc</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Authors */}
        {paper.authors && paper.authors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tác giả</Text>
            <View style={styles.tagsRow}>
              {paper.authors.map((author: any, i: number) => (
                <View key={i} style={styles.authorBadge}>
                  <Text style={styles.authorBadgeText}>
                    {typeof author === 'string' ? author : author.name || 'Unknown'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Keywords */}
        {paper.keywords && paper.keywords.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Từ khóa</Text>
            <View style={styles.tagsRow}>
              {paper.keywords.map((kw: any, i: number) => (
                <View key={i} style={styles.keywordBadge}>
                  <Text style={styles.keywordText}>
                    {typeof kw === 'string' ? kw : kw.name || 'Unknown'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Abstract */}
        {paper.abstract && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tóm tắt (Abstract)</Text>
            <Text style={styles.abstractText}>{paper.abstract}</Text>
          </View>
        )}

        {/* Details List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin thêm</Text>
          <View style={styles.infoCard}>
            <InfoRow label="DOI" value={paper.doi || 'N/A'} />
            <InfoRow label="Năm xuất bản" value={paper.publicationYear} />
            <InfoRow label="Trích dẫn" value={paper.citationCount || paper.citations || 0} />
            {paper.journal?.name && (
              <InfoRow label="Tạp chí" value={paper.journal.name} hideBorder />
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value, hideBorder }: { label: string, value: any, hideBorder?: boolean }) {
  return (
    <View style={[styles.infoRow, hideBorder && { borderBottomWidth: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} selectable>{value}</Text>
    </View>
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
  actionBtn: { padding: 8, borderRadius: 8, backgroundColor: '#f1f5f9' },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flexGrow: 1, padding: 16 },
  section: { 
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, lineHeight: 28, marginBottom: 16 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  metaBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  metaBadgeText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  actionRow: { flexDirection: 'row', gap: 10 },
  primaryBtn: { 
    flex: 1, backgroundColor: Colors.primary, borderRadius: 10, 
    paddingVertical: 12, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  authorBadge: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  authorBadgeText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  keywordBadge: { backgroundColor: Colors.primary + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  keywordText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  abstractText: { fontSize: 14, color: '#475569', lineHeight: 24, textAlign: 'justify' },
  infoCard: { backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  infoLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  infoValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', flex: 1, textAlign: 'right', marginLeft: 16 },
});
