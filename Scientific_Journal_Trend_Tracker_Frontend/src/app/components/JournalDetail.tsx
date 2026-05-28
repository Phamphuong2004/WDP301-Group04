import { Box, Typography, Grid, Paper, Button, Chip } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

const trend: any[] = [];
const latest: any[] = [];

export default function JournalDetail() {
  return (
    <Box>
      <Paper sx={{ p: 2.5, borderRadius: 3, mb: 2.5 }}>
        <Typography sx={{ fontSize: '1.3rem', fontWeight: 800 }}>Journal Detail</Typography>
        <Typography sx={{ color: '#64748b', mb: 1 }}></Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="" />
        </Box>
      </Paper>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Publication Trend by Year</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line dataKey="count" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Actions</Typography>
            <Button variant="contained" fullWidth>Follow Journal</Button>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Latest Papers</Typography>
            {latest.map((p) => (
              <Paper key={p.id} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>{p.title}</Typography>
                <Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {p.year} - {p.citations} citations
                </Typography>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
