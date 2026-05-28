import { useMemo, useState } from 'react';
import {
  Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Button,
} from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';

const volumeData: any[] = [];
const topJournals: any[] = [];
const topAuthors: any[] = [];
const coOccur: any[] = [];

export default function AnalyticsReport() {
  const [field, setField] = useState('AI');
  const [yearRange, setYearRange] = useState('2020-2025');
  const [metric, setMetric] = useState('publications');

  const summary = useMemo(() => ({ totalPapers: 0, avgCitation: 0, topField: field }), [field]);

  return (
    <Box>
      <Paper sx={{ p: 2.5, mb: 2.5, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}><FormControl fullWidth><InputLabel>Field</InputLabel><Select label="Field" value={field} onChange={(e) => setField(e.target.value)}><MenuItem value="AI">AI</MenuItem><MenuItem value="Biology">Biology</MenuItem><MenuItem value="Physics">Physics</MenuItem></Select></FormControl></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormControl fullWidth><InputLabel>Year Range</InputLabel><Select label="Year Range" value={yearRange} onChange={(e) => setYearRange(e.target.value)}><MenuItem value="2019-2025">2019-2025</MenuItem><MenuItem value="2020-2025">2020-2025</MenuItem><MenuItem value="2023-2025">2023-2025</MenuItem></Select></FormControl></Grid>
          <Grid size={{ xs: 12, md: 3 }}><FormControl fullWidth><InputLabel>Metric</InputLabel><Select label="Metric" value={metric} onChange={(e) => setMetric(e.target.value)}><MenuItem value="publications">Publications</MenuItem><MenuItem value="citations">Citations</MenuItem><MenuItem value="impact">Impact Score</MenuItem></Select></FormControl></Grid>
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', gap: 1 }}><Button startIcon={<Download size={16} />} variant="outlined" fullWidth>Export PDF</Button><Button startIcon={<Download size={16} />} variant="contained" fullWidth>Export CSV</Button></Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, md: 4 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography>Total Papers</Typography><Typography sx={{ fontSize: '1.7rem', fontWeight: 800 }}>{summary.totalPapers}</Typography></Paper></Grid>
        <Grid size={{ xs: 12, md: 4 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography>Avg Citation</Typography><Typography sx={{ fontSize: '1.7rem', fontWeight: 800 }}>{summary.avgCitation}</Typography></Paper></Grid>
        <Grid size={{ xs: 12, md: 4 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography>Top Field</Typography><Typography sx={{ fontSize: '1.7rem', fontWeight: 800 }}>{summary.topField}</Typography></Paper></Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Publication Volume by Year</Typography><ResponsiveContainer width="100%" height={260}><LineChart data={volumeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Line dataKey="papers" stroke="#4f46e5" strokeWidth={2} /></LineChart></ResponsiveContainer></Paper></Grid>
        <Grid size={{ xs: 12, lg: 4 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Keyword Co-occurrence</Typography><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={coOccur} dataKey="value" nameKey="name">{coOccur.map((c) => <Cell key={c.name} fill={c.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Paper></Grid>
        <Grid size={{ xs: 12, md: 6 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Top Journals</Typography><ResponsiveContainer width="100%" height={240}><BarChart data={topJournals}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#10b981" /></BarChart></ResponsiveContainer></Paper></Grid>
        <Grid size={{ xs: 12, md: 6 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Top Authors</Typography><ResponsiveContainer width="100%" height={240}><BarChart data={topAuthors}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#7c3aed" /></BarChart></ResponsiveContainer></Paper></Grid>
      </Grid>
    </Box>
  );
}
