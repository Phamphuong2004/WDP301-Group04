import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  getFollows,
  removeFollow,
  addFollow,
  getKeywords,
  type Follow,
  type Keyword,
} from "../../services/api";

export default function Following() {
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const [following, setFollowing] = useState<Follow[]>([]);
  const [discover, setDiscover] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [followsData, keywordsData] = await Promise.all([
          getFollows(),
          getKeywords(1, 20),
        ]);
        setFollowing(followsData);
        setDiscover(keywordsData.keywords);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUnfollow = async (targetId: string) => {
    try {
      await removeFollow(targetId);
      setFollowing((prev) => prev.filter((f) => f._id !== targetId));
    } catch {
      // silently ignore
    }
  };

  const handleFollow = async (keyword: Keyword) => {
    try {
      const result = await addFollow("Keyword", keyword._id);
      setFollowing((prev) => [...prev, result]);
    } catch {
      // silently ignore
    }
  };

  const discoverFiltered = useMemo(
    () => discover.filter((d) => d.name.toLowerCase().includes(q.toLowerCase())),
    [discover, q],
  );

  // Kiểm tra xem keyword đã được follow chưa
  const isFollowing = (keywordId: string) =>
    following.some((f) => f.targetType === "Keyword" && f.targetId === keywordId);

  const typeColorMap = {
    Keyword: {
      bg: "linear-gradient(135deg, rgba(245,87,108,0.08), rgba(240,147,251,0.08))",
      text: "#f5576c",
      icon: "🏷️",
    },
    Journal: {
      bg: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))",
      text: "#667eea",
      icon: "📚",
    },
  };

  return (
    <Box>
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(79,184,254,0.08))",
          border: "1px solid rgba(102,126,234,0.2)",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
            "& .Mui-selected": { color: "#4f46e5 !important" },
          }}
        >
          <Tab label="📌 Following" />
          <Tab label="✨ Discover" />
        </Tabs>

        <Box sx={{ p: 2.5 }}>
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
                <Grid container spacing={2.5}>
                  {following.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ textAlign: "center", py: 4, color: "#94a3b8" }}>
                        <Typography>Chưa theo dõi journal hoặc keyword nào</Typography>
                      </Box>
                    </Grid>
                  ) : (
                    following.map((f) => {
                      const colors = typeColorMap[f.targetType] ?? typeColorMap.Keyword;
                      const target = f.target as any;
                      const displayName = target?.name ?? f.targetId;
                      return (
                        <Grid key={f._id} size={{ xs: 12, md: 6 }}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              background: colors.bg,
                              border: `1.5px solid ${colors.text}33`,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-6px)",
                                boxShadow: `0 12px 32px ${colors.text}20`,
                              },
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: "flex", gap: 1, alignItems: "start", mb: 1 }}>
                                <Typography sx={{ fontSize: "1.3rem" }}>
                                  {colors.icon}
                                </Typography>
                                <Box sx={{ flex: 1 }}>
                                  <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
                                    {displayName}
                                  </Typography>
                                  {target?.trendScore != null && (
                                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem", mt: 0.3 }}>
                                      Trend score: {target.trendScore}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                <Chip
                                  size="small"
                                  label={f.targetType}
                                  sx={{ bgcolor: colors.text, color: "#fff", fontWeight: 600 }}
                                />
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  sx={{ ml: "auto", borderRadius: 2, textTransform: "none" }}
                                  onClick={() => handleUnfollow(f._id)}
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

              {tab === 1 && (
                <>
                  <TextField
                    placeholder="Search keywords..."
                    size="small"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    sx={{ mb: 2.5 }}
                    fullWidth
                  />
                  <Grid container spacing={2.5}>
                    {discoverFiltered.map((d) => {
                      const colors = typeColorMap.Keyword;
                      const alreadyFollowing = isFollowing(d._id);
                      return (
                        <Grid key={d._id} size={{ xs: 12, md: 6 }}>
                          <Card
                            sx={{
                              borderRadius: 3,
                              background: colors.bg,
                              border: `1.5px solid ${colors.text}33`,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "translateY(-6px)",
                                boxShadow: `0 12px 32px ${colors.text}20`,
                              },
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: "flex", gap: 1, alignItems: "start", mb: 1 }}>
                                <Typography sx={{ fontSize: "1.3rem" }}>🏷️</Typography>
                                <Box sx={{ flex: 1 }}>
                                  <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
                                    {d.name}
                                  </Typography>
                                  {d.trendScore != null && (
                                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem", mt: 0.3 }}>
                                      Trend score: {d.trendScore}
                                    </Typography>
                                  )}
                                  {d.paperCount != null && (
                                    <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
                                      {d.paperCount} papers
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                              <Button
                                sx={{
                                  bgcolor: alreadyFollowing ? "#94a3b8" : colors.text,
                                  color: "#fff",
                                  textTransform: "none",
                                  fontWeight: 600,
                                  "&:hover": { opacity: 0.9 },
                                }}
                                variant="contained"
                                size="small"
                                disabled={alreadyFollowing}
                                onClick={() => handleFollow(d)}
                              >
                                {alreadyFollowing ? "Following ✓" : "Follow"}
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </>
              )}
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
