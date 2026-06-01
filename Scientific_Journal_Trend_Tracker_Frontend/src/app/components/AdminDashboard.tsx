import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import {
  Users,
  ArrowLeft,
  BookOpen,
  FileText,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  getAdminStats,
  getUsers,
  getTrendingKeywords,
  type AdminStats,
  type User,
  type Keyword,
} from "../../services/api";

interface AdminDashboardProps {
  onNavigate?: (section: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, usersData, keywordsData] = await Promise.all([
        getAdminStats(),
        getUsers(1, 5),
        getTrendingKeywords(5),
      ]);
      setStats(statsData);
      setRecentUsers(usersData.users);
      setTrendingKeywords(keywordsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      {/* Top Action Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <IconButton
          onClick={() => onNavigate?.("home")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#f59e0b",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.9rem",
            p: "8px 12px",
            borderRadius: 2,
            bgcolor: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            "&:hover": {
              bgcolor: "rgba(245, 158, 11, 0.15)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </IconButton>

        <Button
          onClick={fetchData}
          disabled={loading}
          startIcon={<RefreshCw size={16} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            color: "#4f46e5",
            bgcolor: "rgba(79, 70, 229, 0.08)",
            border: "1px solid rgba(79, 70, 229, 0.2)",
            "&:hover": {
              bgcolor: "rgba(79, 70, 229, 0.15)",
            },
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Welcome Section */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
          color: "#fff",
        }}
      >
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Admin Control Center
        </Typography>
        <Typography sx={{ opacity: 0.9, mt: 0.5 }}>
          System overview and real-time management metrics
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          {/* Key Admin Metrics */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Total Users Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 10px 20px rgba(118, 75, 162, 0.2)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", opacity: 0.9, fontWeight: 500 }}>
                      Total Registered Users
                    </Typography>
                    <Typography sx={{ fontSize: "2.3rem", fontWeight: 800, mt: 0.5 }}>
                      {stats?.users.total.toLocaleString() ?? 0}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 44, height: 44 }}>
                    <Users size={22} />
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2, pt: 1, borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                  <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    Researchers: <strong>{stats?.users.researchers ?? 0}</strong>
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    Lecturers/Students: <strong>{stats?.users.lecturersStudents ?? 0}</strong>
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    Admins: <strong>{stats?.users.admins ?? 0}</strong>
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Scientific Papers Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 10px 20px rgba(0, 242, 254, 0.15)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", opacity: 0.9, fontWeight: 500 }}>
                      Scientific Papers
                    </Typography>
                    <Typography sx={{ fontSize: "2.3rem", fontWeight: 800, mt: 0.5 }}>
                      {stats?.papers.toLocaleString() ?? 0}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 44, height: 44 }}>
                    <FileText size={22} />
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2, pt: 1, borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                  <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    Total indexed publications in database
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Journals & Trends Card */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                  color: "#fff",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 10px 20px rgba(56, 249, 215, 0.15)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography sx={{ fontSize: "0.85rem", opacity: 0.9, fontWeight: 500 }}>
                      Journals & Sources
                    </Typography>
                    <Typography sx={{ fontSize: "2.3rem", fontWeight: 800, mt: 0.5 }}>
                      {stats?.journals.toLocaleString() ?? 0}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 44, height: 44 }}>
                    <BookOpen size={22} />
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2, pt: 1, borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", gap: 2 }}>
                  <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    Keywords: <strong>{stats?.keywords ?? 0}</strong>
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    Topics: <strong>{stats?.topics ?? 0}</strong>
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", opacity: 0.9 }}>
                    Sync Runs: <strong>{stats?.analysisRuns ?? 0}</strong>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Main Content */}
          <Grid container spacing={2.5}>
            {/* Recent Users List */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)", minHeight: 400 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Users size={20} style={{ color: "#667eea" }} />
                  <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    Recent User Signups
                  </Typography>
                  <Button
                    onClick={() => onNavigate?.("users")}
                    sx={{
                      ml: "auto",
                      textTransform: "none",
                      fontWeight: 600,
                      color: "#4f46e5",
                      fontSize: "0.85rem",
                    }}
                  >
                    Manage All
                  </Button>
                </Box>
                <Box sx={{ p: 1.5 }}>
                  {recentUsers.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: "center", color: "#64748b" }}>
                      No recent users found.
                    </Box>
                  ) : (
                    <List disablePadding>
                      {recentUsers.map((user, idx) => (
                        <Box key={user._id}>
                          <ListItem sx={{ py: 1.5 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: "#667eea" }}>
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "?"}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                                    {user.fullName}
                                  </Typography>
                                  <Chip
                                    label={user.role}
                                    size="small"
                                    sx={{
                                      fontSize: "0.7rem",
                                      height: 18,
                                      fontWeight: 600,
                                      bgcolor:
                                        user.role === "admin"
                                          ? "rgba(245, 158, 11, 0.15)"
                                          : user.role === "researcher"
                                            ? "rgba(79, 70, 229, 0.1)"
                                            : "rgba(100, 116, 139, 0.1)",
                                      color:
                                        user.role === "admin"
                                          ? "#d97706"
                                          : user.role === "researcher"
                                            ? "#4f46e5"
                                            : "#475569",
                                    }}
                                  />
                                </Box>
                              }
                              secondary={
                                <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
                                  {user.email}
                                </Typography>
                              }
                            />
                            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                            </Typography>
                          </ListItem>
                          {idx < recentUsers.length - 1 && <Divider variant="inset" component="li" />}
                        </Box>
                      ))}
                    </List>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Trending Keywords List */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)", minHeight: 400 }}>
                <Box
                  sx={{
                    p: 2.5,
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <TrendingUp size={20} style={{ color: "#f59e0b" }} />
                  <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    Top Trending Keywords
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {trendingKeywords.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: "center", color: "#64748b" }}>
                      No keywords monitored.
                    </Box>
                  ) : (
                    <Grid container spacing={1.5}>
                      {trendingKeywords.map((keyword, idx) => (
                        <Grid size={{ xs: 12 }} key={keyword._id}>
                          <Paper
                            sx={{
                              p: 2,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              bgcolor: "rgba(0,0,0,0.02)",
                              border: "1px solid rgba(0,0,0,0.04)",
                              borderRadius: 2,
                              transition: "transform 0.2s ease",
                              "&:hover": {
                                transform: "translateX(4px)",
                                bgcolor: "rgba(79, 70, 229, 0.02)",
                              },
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Typography sx={{ fontWeight: 700, color: "#4f46e5", minWidth: 24 }}>
                                #{idx + 1}
                              </Typography>
                              <Typography sx={{ fontWeight: 600 }}>
                                {keyword.name}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              {keyword.trendScore !== undefined && (
                                <Chip
                                  label={`Score: ${keyword.trendScore}`}
                                  size="small"
                                  color="warning"
                                  sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                                />
                              )}
                              {keyword.paperCount !== undefined && (
                                <Chip
                                  label={`${keyword.paperCount} Papers`}
                                  size="small"
                                  color="primary"
                                  sx={{ fontWeight: 600, fontSize: "0.75rem", bgcolor: "#4f46e5" }}
                                />
                              )}
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

