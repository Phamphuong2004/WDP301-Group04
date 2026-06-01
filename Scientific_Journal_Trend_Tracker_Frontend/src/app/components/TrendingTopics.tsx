import { useEffect, useState } from "react";
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
  Alert,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  getTrendingKeywords,
  getTrendingPublications,
  type Keyword,
  type PublicationTrend,
} from "../../services/api";

export default function TrendingTopics() {
  const [field, setField] = useState("all");
  const [timeRange, setTimeRange] = useState("6m");

  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [trends, setTrends] = useState<PublicationTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [kws, pubs] = await Promise.all([
          getTrendingKeywords(20),
          getTrendingPublications(),
        ]);
        setKeywords(kws);
        setTrends(pubs);
      } catch (err: any) {
        setError(err.message || "Failed to load trending data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Biến trends thành dạng chart: { topic, value }
  const chartData = trends.map((t) => ({
    topic: t.keyword?.name ?? `${t.year}`,
    value: t.paperCount,
  }));

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

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#4facfe" }} />
        </Box>
      ) : (
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
              {chartData.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", textAlign: "center", py: 4 }}>
                  Chưa có dữ liệu xu hướng
                </Typography>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,0,0,0.08)"
                    />
                    <XAxis dataKey="topic" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
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
              {keywords.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem" }}>
                  Chưa có từ khóa nổi bật
                </Typography>
              ) : (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {keywords.map((kw) => (
                    <Chip
                      key={kw._id}
                      label={kw.name}
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
      )}
    </Box>
  );
}
