import { Box, Typography, Grid, Paper, Avatar, Chip, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function AuthorProfile() {
  const authorQuery = "Alice Chen";
  const [authorInfo, setAuthorInfo] = useState<any>(null);
  const [papers, setPapers] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [sort, setSort] = useState('newest');
  const [yearFilter, setYearFilter] = useState('all');

  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        const [authorRes, papersRes] = await Promise.all([
          apiClient.get(`/sources/author?query=${encodeURIComponent(authorQuery)}`),
          apiClient.get(`/sources/search?keyword=${encodeURIComponent(authorQuery)}&limit=10`)
        ]);
        
        if (authorRes.data.success && authorRes.data.authors?.length > 0) {
          setAuthorInfo(authorRes.data.authors[0]);
        }
        
        if (papersRes.data.success) {
          setPapers(papersRes.data.papers || []);
          
          // Generate a simple timeline from papers
          const yearCounts: Record<string, number> = {};
          (papersRes.data.papers || []).forEach((p: any) => {
            if (p.publicationYear) {
              yearCounts[p.publicationYear] = (yearCounts[p.publicationYear] || 0) + 1;
            }
          });
          const timelineData = Object.entries(yearCounts).map(([year, count]) => ({ year, papers: count })).sort((a: any, b: any) => a.year - b.year);
          setTimeline(timelineData);
        }
      } catch (err) {
        console.error("Failed to fetch author data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorData();
  }, []);

  const filtered = useMemo(() => {
    let list = papers.filter((p) => yearFilter === 'all' || String(p.publicationYear) === yearFilter);
    if (sort === 'newest') list = [...list].sort((a, b) => b.publicationYear - a.publicationYear);
    if (sort === 'cited') list = [...list].sort((a, b) => b.citationCount - a.citationCount);
    return list;
  }, [sort, yearFilter]);

  return (
    <Box>
      {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box> : (
      <>
      <Paper sx={{ p: 2.5, borderRadius: 3, mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar sx={{ width: 72, height: 72 }}>{authorInfo?.name?.charAt(0) || 'A'}</Avatar>
          <Box>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 800 }}>{authorInfo?.name || authorQuery}</Typography>
            <Typography sx={{ color: '#64748b' }}>{authorInfo?.orcid ? `ORCID: ${authorInfo.orcid}` : 'Researcher'}</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label={`Papers: ${authorInfo?.paperCount || papers.length || 0}`} />
              <Chip label={`Citations: ${authorInfo?.citationCount || 0}`} />
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
            {filtered.map((p) => <Paper key={p.id} variant="outlined" sx={{ p: 1.5, mb: 1 }}><Typography sx={{ fontWeight: 700 }}>{p.title}</Typography><Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>{p.journalName || 'Unknown Journal'} • {p.publicationYear} • {p.citationCount} citations</Typography></Paper>)}
          </Paper>
        </Grid>
      </Grid>
      </>
      )}
    </Box>
  );
}
