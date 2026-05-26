import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton
} from "@mui/material";
import { Play, RefreshCw, Eye, ArrowRight, Activity } from "lucide-react";
import apiClient from "../../api/apiClient";

interface Run {
  _id: string;
  keyword: string;
  status: string;
  progress: number;
  createdAt: string;
  resultsSummary?: {
    totalPapers: number;
    sourcesUsed: string[];
  };
}

export default function CorpusDashboard() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [runs, setRuns] = useState<Run[]>([]);
  const [error, setError] = useState("");

  const fetchRuns = async () => {
    try {
      const response = await apiClient.get('/corpus/runs');
      if (response.data.success) {
        setRuns(response.data.runs);
      }
    } catch (err) {
      console.error("Failed to fetch runs", err);
    }
  };

  useEffect(() => {
    fetchRuns();
    // Poll every 10 seconds if there are pending runs
    const interval = setInterval(() => {
      fetchRuns();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRun = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await apiClient.post('/corpus/runs', { keyword });
      if (response.data.success) {
        setKeyword("");
        fetchRuns();
      } else {
        setError(response.data.message || "Failed to start run");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      case 'pending': return 'warning';
      case 'processing': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
          background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.08))",
          border: "1px solid rgba(16,185,129,0.2)",
        }}
      >
        <Typography sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2, color: "#059669" }}>
          🚀 Create New Corpus Run
        </Typography>
        <Typography sx={{ color: "#475569", mb: 2 }}>
          Track emerging trends by creating a new data collection run for a specific keyword. The system will aggregate data from OpenAlex, Semantic Scholar, and Crossref.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Enter research topic or keyword (e.g., 'Agentic AI')"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={loading}
          />
          <Button
            variant="contained"
            disabled={!keyword.trim() || loading}
            onClick={handleCreateRun}
            sx={{
              bgcolor: "#059669",
              color: "#fff",
              minWidth: 140,
              "&:hover": { bgcolor: "#047857" },
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Play size={18} />}
          >
            Start Run
          </Button>
        </Box>
        {error && <Typography color="error" sx={{ mt: 1, fontSize: '0.85rem' }}>{error}</Typography>}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
          📋 Recent Runs
        </Typography>
        <IconButton onClick={fetchRuns} size="small" color="primary">
          <RefreshCw size={18} />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {runs.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ color: '#64748b', textAlign: 'center', py: 4 }}>
              No corpus runs found. Create your first run above!
            </Typography>
          </Grid>
        ) : (
          runs.map((run) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={run._id}>
              <Card sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)", height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                      {run.keyword}
                    </Typography>
                    <Chip 
                      label={run.status.toUpperCase()} 
                      size="small" 
                      color={getStatusColor(run.status) as any}
                      sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                    />
                  </Box>
                  
                  <Typography sx={{ fontSize: '0.85rem', color: '#64748b', mb: 2 }}>
                    Started: {new Date(run.createdAt).toLocaleString()}
                  </Typography>

                  {(run.status === 'pending' || run.status === 'processing') && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0284c7', mb: 2 }}>
                      <Activity size={16} />
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        Processing ({run.progress || 0}%)
                      </Typography>
                    </Box>
                  )}

                  {run.status === 'completed' && run.resultsSummary && (
                    <Box sx={{ bgcolor: 'rgba(16,185,129,0.05)', p: 1.5, borderRadius: 2, mb: 2 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#059669' }}>
                        Found {run.resultsSummary.totalPapers} papers
                      </Typography>
                    </Box>
                  )}

                  <Button 
                    fullWidth 
                    variant="outlined"
                    endIcon={<ArrowRight size={16} />}
                    sx={{ mt: 'auto', borderRadius: 2 }}
                    disabled={run.status !== 'completed'}
                  >
                    View Analysis
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}
