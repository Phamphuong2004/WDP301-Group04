import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import apiClient from "../../api/apiClient";

const keywordBookmarks: any[] = [];

export default function Bookmarks() {
  const [tab, setTab] = useState(0);
  const [sort, setSort] = useState("recent");
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/papers/bookmarks");
        if (res.data.success) {
          setData(res.data.papers || []);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const filtered = useMemo(() => {
    let list = data.filter((p) => {
      const tags = p.topics ? p.topics.map((t: any) => t.name || t) : p.tags || [];
      return tags.join(",").toLowerCase().includes(keyword.toLowerCase()) || 
             (p.title && p.title.toLowerCase().includes(keyword.toLowerCase()));
    });
    if (sort === "recent")
      list = [...list].sort((a, b) => b.savedDate.localeCompare(a.savedDate));
    if (sort === "cited")
      list = [...list].sort((a, b) => b.citations - a.citations);
    if (sort === "year") list = [...list].sort((a, b) => b.year - a.year);
    return list;
  }, [sort, keyword]);

  const paperColors = [
    "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))",
    "linear-gradient(135deg, rgba(245,87,108,0.08), rgba(240,147,251,0.08))",
    "linear-gradient(135deg, rgba(79,184,254,0.08), rgba(0,242,254,0.08))",
  ];

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} textColor="primary" indicatorColor="primary">
          <Tab label="Saved Papers" />
          <Tab label="Saved Keywords" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <>
          {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>}
          {!loading && (
            <>
            <Paper
            sx={{
              p: 2.5,
              mb: 2.5,
              borderRadius: 3,
              display: "flex",
              gap: 1.5,
              alignItems: "center",
              background:
                "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(79,184,254,0.08))",
              border: "1px solid rgba(102,126,234,0.2)",
            }}
          >
        <FormControl size="small">
          <InputLabel>Sort</InputLabel>
          <Select
            value={sort}
            label="Sort"
            onChange={(e) => setSort(e.target.value)}
          >
            <MenuItem value="recent">Recently Saved</MenuItem>
            <MenuItem value="cited">Most Cited</MenuItem>
            <MenuItem value="year">By Year</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="Filter by keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button
          sx={{
            ml: "auto",
            bgcolor: "#4f46e5",
            color: "#fff",
            textTransform: "none",
            "&:hover": { bgcolor: "#4338ca" },
          }}
          variant="contained"
        >
          📥 Export BibTeX
        </Button>
      </Paper>
      <Grid container spacing={2.5}>
        {filtered.map((paper, idx) => (
          <Grid key={paper.id} size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 3,
                background: paperColors[idx % 3],
                border: "1.5px solid rgba(102,126,234,0.2)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 32px rgba(102,126,234,0.15)",
                },
              }}
            >
              <CardContent>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: "#0f172a",
                    mb: 0.8,
                  }}
                >
                  {paper.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    color: "#64748b",
                    fontSize: "0.85rem",
                    mb: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(102,126,234,0.1)",
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                    }}
                  >
                    {paper.journal}
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "rgba(79,184,254,0.1)",
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                    }}
                  >
                    {paper.year}
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "rgba(67,233,123,0.1)",
                      px: 1,
                      py: 0.3,
                      borderRadius: 1,
                    }}
                  >
                    {paper.citations} 📊
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.7,
                    flexWrap: "wrap",
                  }}
                >
                  {paper.tags && paper.tags.map((t: string) => (
                    <Chip
                      key={t}
                      size="small"
                      label={t}
                      sx={{
                        bgcolor: "#4f46e5",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
            </>
      )}
      </>
      )}

      {tab === 1 && (
        <Grid container spacing={2.5}>
          {keywordBookmarks.map((kw, idx) => (
            <Grid key={kw.id} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: paperColors[idx % 3],
                  border: "1.5px solid rgba(102,126,234,0.2)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 32px rgba(102,126,234,0.15)",
                  },
                }}
              >
                <CardContent>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#0f172a", mb: 1 }}>
                    #{kw.keyword}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.85rem" }}>
                    <Typography variant="body2">{kw.papersCount} papers</Typography>
                    <Typography variant="body2">Saved: {kw.addedDate}</Typography>
                  </Box>
                  <Button size="small" variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>
                    View Trends
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
