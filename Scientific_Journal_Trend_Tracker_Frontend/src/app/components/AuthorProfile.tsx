import { Box, Typography, Grid, Paper, Chip } from "@mui/material";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const timeline: any[] = [];
const papers: any[] = [];

export default function AuthorProfile() {
  return (
    <Box>
      <Paper sx={{ p: 2.5, borderRadius: 3, mb: 2.5, display: "flex", gap: 2, alignItems: "center" }}>
        <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.8rem", fontWeight: 800 }}>
          A
        </Box>
        <Box>
          <Typography sx={{ fontSize: "1.3rem", fontWeight: 800 }}>Author Profile</Typography>
          <Typography sx={{ color: "#64748b" }}>University</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Chip label="h-index: 0" size="small" />
            <Chip label="Citations: 0" size="small" />
          </Box>
        </Box>
      </Paper>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Publication Timeline</Typography>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line dataKey="papers" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5" }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Research Areas</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {([] as string[]).map((area) => (
                <Chip key={area} label={area} sx={{ bgcolor: "#4f46e5", color: "#fff", fontWeight: 600 }} />
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>Selected Papers</Typography>
            {papers.map((p) => (
              <Paper key={p.id} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>{p.title}</Typography>
                <Typography sx={{ fontSize: "0.82rem", color: "#64748b" }}>
                  {p.journal} - {p.year} - {p.citations} citations
                </Typography>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
