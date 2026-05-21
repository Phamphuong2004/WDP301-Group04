import { Box, Typography, Grid, Paper, Button, Chip } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const trend = [{ year: 2019, count: 90 }, { year: 2020, count: 120 }, { year: 2021, count: 148 }, { year: 2022, count: 180 }, { year: 2023, count: 210 }, { year: 2024, count: 254 }, { year: 2025, count: 289 }];
const latest = [
  { id: 1, title: 'Adaptive Retrieval for Scientific QA', year: 2025, citations: 54 },
  { id: 2, title: 'Benchmarking Multimodal Agents', year: 2025, citations: 38 },
  { id: 3, title: 'Reliable Evaluation for Long-Context LLMs', year: 2024, citations: 92 },
];

export default function JournalDetail() {
  return (
    <Box>
      <Paper sx={{ p: 2.5, borderRadius: 3, mb: 2.5 }}>
        <Typography sx={{ fontSize: '1.3rem', fontWeight: 800 }}>Nature Machine Intelligence</Typography>
        <Typography sx={{ color: '#64748b', mb: 1 }}>Springer Nature</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="ISSN: 2522-5839" /><Chip label="Impact Factor: 25.9" /><Chip label="Field: AI" />
        </Box>
      </Paper>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Publication Trend by Year</Typography><ResponsiveContainer width="100%" height={260}><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Line dataKey="count" stroke="#4f46e5" strokeWidth={2} /></LineChart></ResponsiveContainer></Paper></Grid>
        <Grid size={{ xs: 12, lg: 4 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Actions</Typography><Button variant="contained" fullWidth>Follow Journal</Button></Paper></Grid>
        <Grid size={{ xs: 12 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Latest Papers</Typography>{latest.map((p) => <Paper key={p.id} variant="outlined" sx={{ p: 1.5, mb: 1 }}><Typography sx={{ fontWeight: 700 }}>{p.title}</Typography><Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>{p.year} • {p.citations} citations</Typography></Paper>)}</Paper></Grid>
      </Grid>
    </Box>
  );
}
