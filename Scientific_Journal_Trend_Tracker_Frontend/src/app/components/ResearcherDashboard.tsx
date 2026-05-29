import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import PaperDetail, { type Paper as PaperType } from "./PaperDetail";
import {
  getPapers,
  getTrendingKeywords,
  getCurrentUser,
  type Paper as ApiPaper,
  type Keyword,
  getDashboardStats,
  type DashboardStats
} from "../../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ResearcherDashboardProps {
  onNavigate?: (section: string) => void;
}

export const normalizeRole = (role: string): string => {
  const r = role.toLowerCase();
  if (r === "admin") return "System Administrator";
  if (r === "researcher") return "Researcher";
  if (r === "user") return "Lecturer/Student";
  if (r === "system administrator") return "System Administrator";
  if (r === "lecturer/student") return "Lecturer/Student";
  return role;
};

export default function ResearcherDashboard({
  onNavigate,
}: ResearcherDashboardProps) {
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(null);
  const [recentPubs, setRecentPubs] = useState<ApiPaper[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<Keyword[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch papers
        const papersData = await getPapers(1, 5);
        setRecentPubs(papersData.papers || []);

        // Fetch trending keywords
        const keywordsData = await getTrendingKeywords(10);
        setTrendingKeywords(keywordsData || []);

        // Fetch Dashboard stats
        try {
          const stats = await getDashboardStats();
          setDashboardStats(stats);
        } catch (e) {
          console.error("Could not load dashboard stats", e);
        }

        // Fetch current user
        try {
          const userData = await getCurrentUser();
          setCurrentUser(userData);
        } catch (err) {
          // User might not be authenticated, that's ok
          console.log("Not authenticated");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data",
        );
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Box>
      {/* Back to Home Button */}
      <Box sx={{ mb: 2 }}>
        <IconButton
          onClick={() => onNavigate?.("home")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#667eea",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.9rem",
            p: "8px 12px",
            borderRadius: 2,
            bgcolor: "rgba(102, 126, 234, 0.08)",
            border: "1px solid rgba(102, 126, 234, 0.2)",
            "&:hover": {
              bgcolor: "rgba(102, 126, 234, 0.15)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </IconButton>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}. Backend server might not be running. Start it with: <code>npm start</code> in the backend folder
        </Alert>
      )}

      {!loading && (
        <>
          {/* Welcome Section */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
            }}
          >
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Welcome back, {currentUser?.fullName || "Dr. User"}
            </Typography>
            <Typography sx={{ opacity: 0.9, mt: 0.5 }}>
              Here's your research dashboard overview
            </Typography>
          </Paper>

          {/* Key Metrics */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: "0.85rem", opacity: 0.9 }}>
                  Total Publications
                </Typography>
                <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, mt: 0.5 }}>
                  {recentPubs.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: "0.85rem", opacity: 0.9 }}>
                  Total Citations
                </Typography>
                <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, mt: 0.5 }}>
                  {recentPubs.reduce((sum, p) => sum + (p.citations || 0), 0)}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: "0.85rem", opacity: 0.9 }}>
                  Trending Keywords
                </Typography>
                <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, mt: 0.5 }}>
                  {trendingKeywords.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: "0.85rem", opacity: 0.9 }}>
                  User Role
                </Typography>
                <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, mt: 1.5 }}>
                  {currentUser?.role ? normalizeRole(currentUser.role) : "?"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

      {/* Main Content */}
      <Grid container spacing={2.5}>
        {/* Recent Publications */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                📄 Recent Publications
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {recentPubs.map((pub, idx) => (
                <Paper
                  key={idx}
                  onClick={() => setSelectedPaper({
                    id: pub._id as any,
                    title: pub.title,
                    authors: pub.authors.map(a => typeof a === 'string' ? a : (a.fullName || a.name || 'Unknown')),
                    journal: pub.journal?.name || "Unknown",
                    year: pub.publicationYear,
                    abstract: pub.abstract,
                    citations: pub.citations || 0,
                    doi: pub.doi,
                    keywords: pub.keywords?.map(k => typeof k === 'string' ? k : (k.name || 'Unknown')) || []
                  })}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    background: "rgba(102,126,234,0.05)",
                    borderLeft: "4px solid #667eea",
                    borderRadius: 1,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(102,126,234,0.15)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {" "}
                  <Typography
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      color: "#4f46e5",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {pub.title}
                  </Typography>{" "}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      fontSize: "0.85rem",
                      color: "#64748b",
                    }}
                  >
                    {" "}
                    <span>{pub.journal?.name || "Unknown Journal"}</span> <span>•</span>{" "}
                    <span>{pub.publicationYear}</span> <span>•</span>{" "}
                    <span>{pub.citations || 0} citations</span>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Deadlines & Events */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                📅 Upcoming Deadlines
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {([] as { event: string; daysLeft: number; type: string }[]).map(
                (item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      background:
                        item.daysLeft <= 5
                          ? "rgba(245,87,108,0.1)"
                          : "rgba(79,184,254,0.1)",
                      borderLeft: `4px solid ${
                        item.daysLeft <= 5 ? "#f5576c" : "#00f2fe"
                      }`,
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        {item.event}
                      </Typography>
                      <Chip
                        label={`${item.daysLeft}d left`}
                        size="small"
                        sx={{
                          bgcolor:
                            item.daysLeft <= 5
                              ? "rgba(245,87,108,0.2)"
                              : "rgba(79,184,254,0.2)",
                          color: item.daysLeft <= 5 ? "#f5576c" : "#00f2fe",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
                      {item.type}
                    </Typography>
                  </Box>
                ),
              )}
            </Box>
          </Paper>
          <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)", mt: 2 }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                📈 Publication Timeline
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, height: 300 }}>
              {dashboardStats?.timelineData && dashboardStats.timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardStats.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="paperCount" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="text.secondary">No timeline data available.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        {/* Active Collaborations */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                🤝 Active Collaborations
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {(
                [] as { name: string; affiliation: string; status: string }[]
              ).map((collab, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    background: "rgba(0,0,0,0.02)",
                    borderRadius: 1,
                    borderLeft: "3px solid #43e97b",
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    {collab.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {collab.affiliation}
                  </Typography>
                  <Chip
                    label={collab.status}
                    size="small"
                    sx={{
                      mt: 0.5,
                      bgcolor:
                        collab.status === "In progress"
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(79,184,254,0.2)",
                      color:
                        collab.status === "In progress" ? "#10b981" : "#00f2fe",
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Research Focus Areas */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                🎯 Research Focus Areas
              </Typography>
            </Box>
            <Box sx={{ p: 2.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {dashboardStats?.topKeywords ? (
                dashboardStats.topKeywords.map((kw, idx) => (
                  <Chip
                    key={idx}
                    label={`${kw.name} (${kw.count})`}
                    sx={{
                      bgcolor: "rgba(102,126,234,0.1)",
                      color: "#4f46e5",
                      fontWeight: 500,
                      borderRadius: 2,
                    }}
                  />
                ))
              ) : (
                <Typography color="text.secondary">No keyword data.</Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
        </>
      )}

      <PaperDetail
        open={Boolean(selectedPaper)}
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
      />
    </Box>
  );
}
