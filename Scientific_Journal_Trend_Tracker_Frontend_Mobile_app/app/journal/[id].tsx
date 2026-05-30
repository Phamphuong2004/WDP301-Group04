import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { journalsApi, papersApi } from '@/services/api';

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [journal, setJournal] = useState<any>(null);
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        const [journalRes, papersRes] = await Promise.allSettled([
          journalsApi.getById(id!),
          papersApi.search('', undefined, id!),
        ]);

        if (journalRes.status === 'fulfilled') {
          setJournal(journalRes.value?.data || journalRes.value);
        }
        if (papersRes.status === 'fulfilled') {
          const p = papersRes.value;
          setPapers(p?.data || p?.papers || (Array.isArray(p) ? p : []));
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin tạp chí.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJournalData();
  }, [id]);

  if (loading || !journal) {
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết tạp chí</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header Info */}
        <View style={styles.section}>
          <View style={styles.journalIcon}>
            <Text style={{ fontSize: 32 }}>🏛️</Text>
          </View>
          <Text style={styles.title}>{journal.name}</Text>
          <Text style={styles.publisher}>{journal.publisher || 'Unknown Publisher'}</Text>
          
          <View style={styles.statsRow}>
            <StatBox label="Impact Factor" value={journal.impactFactor || 'N/A'} color="#818cf8" />
            <StatBox label="H-Index" value={journal.hIndex || 'N/A'} color="#67e8f9" />
            <StatBox label="Bài báo" value={journal.paperCount || 'N/A'} color="#6ee7b7" />
          </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chung</Text>
          <View style={styles.infoCard}>
            <InfoRow label="ISSN" value={journal.issn || 'N/A'} />
            <InfoRow label="Lĩnh vực" value={journal.fieldDomain || 'N/A'} />
            <InfoRow label="Trạng thái" value={journal.isTracked ? 'Đang theo dõi' : 'Không theo dõi'} hideBorder />
          </View>
        </View>

        {/* Recent Papers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bài báo thuộc tạp chí ({papers.length})</Text>
          {papers.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có bài báo nào được cập nhật.</Text>
          ) : (
            papers.map(paper => (
              <TouchableOpacity 
                key={paper._id} 
                style={styles.paperCard} 
                activeOpacity={0.75}
                onPress={() => router.push(`/paper/${paper._id}` as any)}
              >
                <View style={styles.paperAccent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.paperTitle} numberOfLines={2}>{paper.title}</Text>
                  <Text style={styles.paperMeta}>📅 {paper.publicationYear} · 📊 {paper.citationCount || paper.citations || 0} trích dẫn</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, color }: { label: string, value: string | number, color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ label, value, hideBorder }: { label: string, value: any, hideBorder?: boolean }) {
  return (
    <View style={[styles.infoRow, hideBorder && { borderBottomWidth: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flexGrow: 1, padding: 16 },
  section: { 
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  journalIcon: { width: 64, height: 64, borderRadius: 16, backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, lineHeight: 28 },
  publisher: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  infoCard: { backgroundColor: '#f8fafc', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: Colors.border },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  infoLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  infoValue: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600', flex: 1, textAlign: 'right', marginLeft: 16 },
  emptyText: { color: Colors.textSecondary, fontSize: 14, fontStyle: 'italic' },
  paperCard: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 8 },
  paperAccent: { width: 4, backgroundColor: Colors.primary, borderRadius: 2, marginRight: 12 },
  paperTitle: { fontSize: 14, fontWeight: '600', color: Colors.primary, lineHeight: 20, marginBottom: 4 },
  paperMeta: { fontSize: 12, color: Colors.textSecondary },
});
