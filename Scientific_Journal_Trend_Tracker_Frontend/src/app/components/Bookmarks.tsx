import { useEffect, useMemo, useState } from "react";
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
  Alert,
} from "@mui/material";
import { getBookmarks, removeBookmark, getFollows, removeFollow, type Bookmark, type Follow } from "../../services/api";

export default function Bookmarks() {
  const [tab, setTab] = useState(0);
  const [sort, setSort] = useState("recent");
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState<Bookmark[]>([]);
  const [keywordFollows, setKeywordFollows] = useState<Follow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [bookmarksRes, followsRes] = await Promise.all([
          getBookmarks(1, 50),
          getFollows(),
        ]);
        setData(bookmarksRes.bookmarks);
        // Chỉ lấy follows loại Keyword
        setKeywordFollows(followsRes.filter((f) => f.targetType === "Keyword"));
      } catch (err: any) {
        setError(err.message || "Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemoveBookmark = async (paperId: string) => {
    try {
      await removeBookmark(paperId);
      setData((prev) => prev.filter((b) => b.paper._id !== paperId));
    } catch {
      // silently ignore
    }
  };

  const handleUnfollowKeyword = async (followId: string) => {
    try {
      await removeFollow(followId);
      setKeywordFollows((prev) => prev.filter((f) => f._id !== followId));
    } catch {
      // silently ignore
    }
  };

  const filtered = useMemo(() => {
    let list = data.filter((b) => {
      const kws = (b.paper.keywords ?? []).map((k: any) => k.name ?? k).join(",");
      return kws.toLowerCase().includes(keyword.toLowerCase()) ||
        b.paper.title.toLowerCase().includes(keyword.toLowerCase());
    });
    if (sort === "recent") list = [...list].reverse(); // API trả về theo thứ tự mới nhất
    if (sort === "cited") list = [...list].sort((a, b) => (b.paper.citations ?? 0) - (a.paper.citations ?? 0));
    if (sort === "year") list = [...list].sort((a, b) => (b.paper.publicationYear ?? 0) - (a.paper.publicationYear ?? 0));
    return list;
  }, [data, sort, keyword]);

  const paperColors = [
    "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))",
    "linear-gradient(135deg, rgba(245,87,108,0.08), rgba(240,147,251,0.08))",
    "linear-gradient(135deg, rgba(79,184,254,0.08), rgba(0,242,254,0.08))",
  ];

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} textColor="primary" indicatorColor="primary">
          <Tab label="Saved Papers" />
          <Tab label="Saved Keywords" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#4f46e5" }} />
        </Box>
      ) : (
        <>
          {tab === 0 && (
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
              {filtered.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6, color: "#94a3b8" }}>
                  <Typography>Chưa có bài báo nào được bookmark</Typography>
                </Box>
              ) : (
                <Grid container spacing={2.5}>
                  {filtered.map((b, idx) => (
                    <Grid key={b.paper._id} size={{ xs: 12, md: 6 }}>
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
                            {b.paper.title}
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
                            {b.paper.journal && (
                              <Box sx={{ bgcolor: "rgba(102,126,234,0.1)", px: 1, py: 0.3, borderRadius: 1 }}>
                                {typeof b.paper.journal === "object" ? (b.paper.journal as any).name : b.paper.journal}
                              </Box>
                            )}
                            {b.paper.publicationYear && (
                              <Box sx={{ bgcolor: "rgba(79,184,254,0.1)", px: 1, py: 0.3, borderRadius: 1 }}>
                                {b.paper.publicationYear}
                              </Box>
                            )}
                            {b.paper.citations != null && (
                              <Box sx={{ bgcolor: "rgba(67,233,123,0.1)", px: 1, py: 0.3, borderRadius: 1 }}>
                                {b.paper.citations} 📊
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap" }}>
                            {(b.paper.keywords ?? []).map((k: any) => {
                              const label = typeof k === "object" ? k.name : k;
                              return (
                                <Chip
                                  key={label}
                                  size="small"
                                  label={label}
                                  sx={{ bgcolor: "#4f46e5", color: "#fff", fontWeight: 600 }}
                                />
                              );
                            })}
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            sx={{ mt: 2, borderRadius: 2 }}
                            onClick={() => handleRemoveBookmark(b.paper._id)}
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {tab === 1 && (
            <Grid container spacing={2.5}>
              {keywordFollows.length === 0 ? (
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ textAlign: "center", py: 6, color: "#94a3b8" }}>
                    <Typography>Chưa theo dõi keyword nào</Typography>
                  </Box>
                </Grid>
              ) : (
                keywordFollows.map((f, idx) => {
                  const kw = f.target as any;
                  return (
                    <Grid key={f._id} size={{ xs: 12, md: 4 }}>
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
                            #{kw?.name ?? f.targetId}
                          </Typography>
                          <Box sx={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.85rem" }}>
                            <Typography variant="body2">{kw?.paperCount ?? 0} papers</Typography>
                            <Typography variant="body2">Trend score: {kw?.trendScore ?? "—"}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                            <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>
                              View Trends
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              sx={{ borderRadius: 2 }}
                              onClick={() => handleUnfollowKeyword(f._id)}
                            >
                              Unfollow
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })
              )}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
