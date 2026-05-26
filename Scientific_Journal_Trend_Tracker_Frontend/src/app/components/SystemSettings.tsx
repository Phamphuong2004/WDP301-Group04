import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  Button,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
} from "@mui/material";
import { Database, Globe } from "lucide-react";

const apiSources = [
  { id: "ss", name: "Semantic Scholar", enabled: true },
  { id: "oa", name: "OpenAlex", enabled: true },
  { id: "cr", name: "Crossref", enabled: true },
];
const logs: any[] = [];

export default function SystemSettings() {
  const [sources, setSources] = useState(apiSources);
  const [schedule, setSchedule] = useState("daily");
  const [fieldRange, setFieldRange] = useState("AI");
  const [emailAlert, setEmailAlert] = useState(true);

  return (
    <Box>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            sx={{
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))",
              border: "1px solid rgba(102,126,234,0.2)",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(102,126,234,0.2)",
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <Globe size={20} style={{ color: "#667eea" }} />
              <Typography
                sx={{ fontWeight: 700, fontSize: "1rem", color: "#667eea" }}
              >
                API Sources
              </Typography>
            </Box>
            {sources.map((s, idx) => (
              <Box key={s.id}>
                <Box
                  sx={{
                    p: 2.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "&:hover": { bgcolor: "rgba(102,126,234,0.05)" },
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>{s.name}</Typography>
                  <Switch
                    checked={s.enabled}
                    onChange={() =>
                      setSources(
                        sources.map((x) =>
                          x.id === s.id ? { ...x, enabled: !x.enabled } : x,
                        ),
                      )
                    }
                  />
                </Box>
                {idx < sources.length - 1 && <Divider sx={{ opacity: 0.3 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(245,87,108,0.08), rgba(240,147,251,0.08))",
              border: "1px solid rgba(245,87,108,0.2)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: "1rem",
                display: "flex",
                gap: 1,
                alignItems: "center",
                color: "#f5576c",
              }}
            >
              <Database size={20} /> Sync Configuration
            </Typography>
            <FormControl fullWidth sx={{ mb: 1.5 }}>
              <InputLabel>Sync Schedule</InputLabel>
              <Select
                label="Sync Schedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              >
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 1.5 }}>
              <InputLabel>Data Range</InputLabel>
              <Select
                label="Data Range"
                value={fieldRange}
                onChange={(e) => setFieldRange(e.target.value)}
              >
                <MenuItem value="AI">AI</MenuItem>
                <MenuItem value="Biology">Biology</MenuItem>
                <MenuItem value="Physics">Physics</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={emailAlert}
                  onChange={() => setEmailAlert(!emailAlert)}
                />
              }
              label="Email alerts on sync"
              sx={{ color: "#64748b" }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12 }}>
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
                mb: 2,
                fontSize: "1rem",
                color: "#4facfe",
              }}
            >
              📊 Sync Logs
            </Typography>
            <Table>
              <TableHead
                sx={{
                  background: "rgba(79,184,254,0.1)",
                  borderBottom: "2px solid rgba(79,184,254,0.2)",
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Source</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Papers</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((l) => (
                  <TableRow
                    key={`${l.time}-${l.source}`}
                    sx={{
                      "&:hover": { bgcolor: "rgba(79,184,254,0.05)" },
                      borderBottom: "1px solid rgba(0,0,0,0.06)",
                    }}
                  >
                    <TableCell sx={{ fontSize: "0.9rem" }}>{l.time}</TableCell>
                    <TableCell sx={{ fontSize: "0.9rem" }}>
                      {l.source}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      {l.papers}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#10b981",
                          bgcolor: "rgba(16,185,129,0.1)",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          display: "inline-block",
                        }}
                      >
                        ✅ {l.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
