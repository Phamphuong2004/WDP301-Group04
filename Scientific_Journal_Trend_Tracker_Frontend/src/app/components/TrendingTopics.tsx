import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from "@mui/material";
import apiClient from "../../api/apiClient";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function TrendingTopics() {
  const [field, setField] = useState("all");
  const [timeRange, setTimeRange] = useState("6m");
  const [data, setData] = useState<any[]>([]);
  const [emerging, setEmerging] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const [trendRes, emergingRes] = await Promise.all([
          apiClient.get("/trends/trending"),
          apiClient.get("/trends/emerging")
        ]);
        
        if (trendRes.data.success) {
          setData(
            trendRes.data.topics.map((t: any) => ({
              topic: t.name,
              value: t.growthRate || 0,
            }))
          );
        }
        if (emergingRes.data.success) {
          setEmerging(emergingRes.data.topics.map((t: any) => t.name));
        }
      } catch (err) {
        console.error("Failed to fetch trends", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <Box>
      <Paper
        sx={{
          p: 2.5,
          mb: 2.5,
          borderRadius: 3,
          display: "flex",
          gap: 1.5,
          background:
            "linear-gradient(135deg, rgba(245,87,108,0.08), rgba(240,147,251,0.08))",
          border: "1px solid rgba(245,87,108,0.2)",
        }}
      >
        <FormControl size="small">
          <InputLabel>Field</InputLabel>
          <Select
            value={field}
            label="Field"
            onChange={(e) => setField(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="ai">AI</MenuItem>
            <MenuItem value="bio">Biology</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="3m">3 Months</MenuItem>
            <MenuItem value="6m">6 Months</MenuItem>
            <MenuItem value="1y">1 Year</MenuItem>
          </Select>
        </FormControl>
      </Paper>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(79,184,254,0.08), rgba(0,242,254,0.08))",
              border: "1px solid rgba(79,184,254,0.2)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1.5,
                fontSize: "1rem",
                color: "#4facfe",
              }}
            >
              📊 Trending Topics
            </Typography>
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box> : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.08)"
                />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #4facfe",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" fill="#4facfe" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(67,233,123,0.08), rgba(56,249,215,0.08))",
              border: "1px solid rgba(67,233,123,0.2)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                mb: 1.5,
                fontSize: "1rem",
                color: "#43e97b",
              }}
            >
              ⚡ Emerging Keywords
            </Typography>
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={24} /></Box> : (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {emerging.map((kw) => (
                <Chip
                  key={kw}
                  label={kw}
                  sx={{
                    bgcolor: "#43e97b",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": { opacity: 0.9, transform: "scale(1.05)" },
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
