import { useState } from "react";
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

const data = [
  { topic: "LLM", value: 1543 },
  { topic: "GenAI", value: 1287 },
  { topic: "Quantum", value: 842 },
  { topic: "EdgeAI", value: 723 },
];

export default function TrendingTopics() {
  const [field, setField] = useState("all");
  const [timeRange, setTimeRange] = useState("6m");

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
                    bgcolor: "#fff",
                    border: "1px solid #4facfe",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" fill="#4facfe" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {[
                "Tool-Augmented Reasoning",
                "World Models",
                "Agentic Workflow",
                "Long Context",
              ].map((kw) => (
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
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
