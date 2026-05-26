import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  Users,
  Activity,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

interface AdminDashboardProps {
  onNavigate?: (section: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
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
          System overview and management tools
        </Typography>
      </Paper>

      {/* Key Admin Metrics */}
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
              Total Users
            </Typography>
            <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, mt: 0.5 }}>
              1,247
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.8, mt: 0.5 }}>
              +45 this month
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
              Active Sessions
            </Typography>
            <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, mt: 0.5 }}>
              342
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.8, mt: 0.5 }}>
              Online now
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
              System Health
            </Typography>
            <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, mt: 0.5 }}>
              99.8%
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.8, mt: 0.5 }}>
              Uptime
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
              API Requests
            </Typography>
            <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, mt: 0.5 }}>
              2.4M
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.8, mt: 0.5 }}>
              Today
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={2.5}>
        {/* User Management */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Users size={20} style={{ color: "#667eea" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                User Management
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {[].map((item: any, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    background:
                      item.type === "pending"
                        ? "rgba(102,126,234,0.1)"
                        : item.type === "warning"
                          ? "rgba(245,87,108,0.1)"
                          : "rgba(79,184,254,0.1)",
                    borderLeft: `4px solid ${
                      item.type === "pending"
                        ? "#667eea"
                        : item.type === "warning"
                          ? "#f5576c"
                          : "#00f2fe"
                    }`,
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    {item.action}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      color:
                        item.type === "pending"
                          ? "#667eea"
                          : item.type === "warning"
                            ? "#f5576c"
                            : "#00f2fe",
                    }}
                  >
                    {item.count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* System Alerts */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AlertCircle size={20} style={{ color: "#f5576c" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                System Alerts
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {[].map((item: any, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    mb: 1.5,
                    background:
                      item.severity === "warning"
                        ? "rgba(245,87,108,0.1)"
                        : item.severity === "success"
                          ? "rgba(16,185,129,0.1)"
                          : "rgba(79,184,254,0.1)",
                    borderLeft: `4px solid ${
                      item.severity === "warning"
                        ? "#f5576c"
                        : item.severity === "success"
                          ? "#10b981"
                          : "#00f2fe"
                    }`,
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600, mb: 0.3 }}>
                        {item.alert}
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
                        {item.time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom Section */}
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        {/* Database Status */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Activity size={20} style={{ color: "#00f2fe" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                Database Status
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {[].map((item: any, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "rgba(0,0,0,0.02)",
                    borderRadius: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>
                    {item.metric}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: item.status === "good" ? "#10b981" : "#00f2fe",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Actions Log */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.1)" }}>
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TrendingUp size={20} style={{ color: "#43e97b" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                Recent Admin Actions
              </Typography>
            </Box>
            <Box sx={{ p: 2.5 }}>
              {[].map((item: any, idx) => (
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
                    {item.action}
                  </Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
                    {item.actor} • {item.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
