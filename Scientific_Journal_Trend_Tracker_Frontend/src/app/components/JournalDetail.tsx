import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, Chip, CircularProgress } from '@mui/material';
import apiClient from '../../api/apiClient';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function JournalDetail() {
  const journalName = "Nature Machine Intelligence";
  const [journalData, setJournalData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJournal = async () => {
      setLoading(true);
      try {
        const [journalRes, trendRes] = await Promise.all([
          apiClient.get(`/sources/journal?query=${encodeURIComponent(journalName)}`),
          apiClient.get(`/sources/trend?source=openalex&keyword=${encodeURIComponent(journalName)}`)
        ]);
        if (journalRes.data.success) setJournalData(journalRes.data.data);
        if (trendRes.data.success) {
          const formattedTrends = trendRes.data.trends.map((t: any) => ({
            year: t.year,
            count: t.publicationCount
          }));
          setTrendData(formattedTrends);
        }
      } catch (error) {
        console.error("Failed to fetch journal data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  return (
    <Box>
      <Paper sx={{ p: 2.5, borderRadius: 3, mb: 2.5 }}>
        <Typography sx={{ fontSize: '1.3rem', fontWeight: 800 }}>{journalData?.displayName || journalName}</Typography>
        <Typography sx={{ color: '#64748b', mb: 1 }}>{journalData?.publisher || 'Springer Nature'}</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={`ISSN: ${journalData?.issn || '2522-5839'}`} />
          <Chip label={`Impact Factor: ${journalData?.impactFactor || 'N/A'}`} />
          <Chip label="Field: AI" />
        </Box>
      </Paper>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Publication Trend by Year</Typography><ResponsiveContainer width="100%" height={260}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Line dataKey="count" stroke="#4f46e5" strokeWidth={2} /></LineChart></ResponsiveContainer></Paper></Grid>
        <Grid size={{ xs: 12, lg: 4 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Actions</Typography><Button variant="contained" fullWidth>Follow Journal</Button></Paper></Grid>
        <Grid size={{ xs: 12 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Latest Papers</Typography>{[]}</Paper></Grid>
      </Grid>
    </Box>
  );
}
