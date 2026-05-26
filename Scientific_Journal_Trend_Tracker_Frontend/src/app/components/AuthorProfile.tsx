import { Box, Typography, Grid, Paper, Avatar, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const timeline = [{ year: 2019, papers: 8 }, { year: 2020, papers: 11 }, { year: 2021, papers: 15 }, { year: 2022, papers: 18 }, { year: 2023, papers: 22 }, { year: 2024, papers: 20 }, { year: 2025, papers: 24 }];
const papers = [
  { id: 1, title: 'Efficient Transformer Compression', year: 2024, citations: 122, journal: 'NeurIPS' },
  { id: 2, title: 'Instruction Tuning at Scale', year: 2025, citations: 86, journal: 'ICLR' },
  { id: 3, title: 'Robust Multimodal Alignment', year: 2023, citations: 142, journal: 'Nature MI' },
];

export default function AuthorProfile() {
  const [sort, setSort] = useState('newest');
  const [yearFilter, setYearFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = papers.filter((p) => yearFilter === 'all' || String(p.year) === yearFilter);
    if (sort === 'newest') list = [...list].sort((a, b) => b.year - a.year);
    if (sort === 'cited') list = [...list].sort((a, b) => b.citations - a.citations);
    return list;
  }, [sort, yearFilter]);

  return (
    <Box>
      <Paper sx={{ p: 2.5, borderRadius: 3, mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar sx={{ width: 72, height: 72 }}>AC</Avatar>
          <Box>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 800 }}>Dr. Alice Chen</Typography>
            <Typography sx={{ color: '#64748b' }}>MIT CSAIL</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label="h-index: 49" /><Chip label="Papers: 118" /><Chip label="Citations: 12,304" />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Publication Timeline</Typography><ResponsiveContainer width="100%" height={260}><LineChart data={timeline}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Line dataKey="papers" stroke="#4f46e5" strokeWidth={2} /></LineChart></ResponsiveContainer></Paper></Grid>
        <Grid size={{ xs: 12, lg: 5 }}><Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>Popular Topics</Typography><Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}><Chip label="LLM" /><Chip label="Alignment" /><Chip label="Efficient AI" /><Chip label="Multimodal" /></Box></Paper></Grid>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
              <FormControl size="small"><InputLabel>Sort</InputLabel><Select label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}><MenuItem value="newest">Newest</MenuItem><MenuItem value="cited">Most Cited</MenuItem></Select></FormControl>
              <FormControl size="small"><InputLabel>Year</InputLabel><Select label="Year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}><MenuItem value="all">All</MenuItem><MenuItem value="2025">2025</MenuItem><MenuItem value="2024">2024</MenuItem><MenuItem value="2023">2023</MenuItem></Select></FormControl>
            </Box>
            {filtered.map((p) => <Paper key={p.id} variant="outlined" sx={{ p: 1.5, mb: 1 }}><Typography sx={{ fontWeight: 700 }}>{p.title}</Typography><Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>{p.journal} • {p.year} • {p.citations} citations</Typography></Paper>)}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
