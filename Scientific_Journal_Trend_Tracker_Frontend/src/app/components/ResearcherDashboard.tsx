import { useState, useEffect } from "react";
import { Box, Grid, Typography, Paper, Chip, IconButton } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import PaperDetail, { type Paper as PaperType } from "./PaperDetail";
import apiClient from "../../api/apiClient";

interface ResearcherDashboardProps {
  onNavigate?: (section: string) => void;
}

export default function ResearcherDashboard({
  onNavigate,
}: ResearcherDashboardProps) {
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(null);
  const [recentPubs, setRecentPubs] = useState<PaperType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/papers/search?keyword=machine learning&limit=5');
        if (res.data.success) {
          setRecentPubs(res.data.papers || []);
        }
      } catch (err) {
        console.error("Failed to fetch recent publications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
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
          Welcome back, Dr. User
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
              23
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.8, mt: 0.5 }}>
              +2 this month
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
              1,847
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.8, mt: 0.5 }}>
              h-index: 12
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
              Active Projects
            </Typography>
            <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, mt: 0.5 }}>
              5
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.8, mt: 0.5 }}>
              2 under review
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
              Collaborators
            </Typography>
            <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, mt: 0.5 }}>
              28
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", opacity: 0.8, mt: 0.5 }}>
              Across 12 institutions
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
              {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><Typography>Loading...</Typography></Box> : 
              recentPubs.map((pub, idx) => (
                <Paper key={idx} onClick={() => setSelectedPaper(pub)} sx={{ p: 2, mb: 1.5, background: "rgba(102,126,234,0.05)", borderLeft: "4px solid #667eea", borderRadius: 1, cursor: "pointer", transition: "all 0.2s ease", "&:hover": { boxShadow: "0 4px 12px rgba(102,126,234,0.15)", transform: "translateX(4px)" } }}> <Typography sx={{ fontWeight: 600, mb: 0.5, color: "#4f46e5", "&:hover": { textDecoration: "underline" } }}>{pub.title}</Typography> <Box sx={{ display: "flex", gap: 2, fontSize: "0.85rem", color: "#64748b" }}> <span>{pub.journal}</span> <span>•</span> <span>{pub.year}</span> <span>•</span> <span>{pub.citations} citations</span>
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
              {[
                {
                  event: "ICML 2025 Submission",
                  daysLeft: 12,
                  type: "Conference",
                },
                {
                  event: "Journal Review Due",
                  daysLeft: 5,
                  type: "Review",
                },
                {
                  event: "Grant Proposal Deadline",
                  daysLeft: 21,
                  type: "Grant",
                },
              ].map((item, idx) => (
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
              ))}
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
              {[
                {
                  name: "Prof. Jane Smith",
                  affiliation: "MIT",
                  status: "In progress",
                },
                {
                  name: "Dr. John Lee",
                  affiliation: "Stanford",
                  status: "Planning",
                },
              ].map((collab, idx) => (
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
              {[
                "Machine Learning",
                "NLP",
                "Computer Vision",
                "Federated Learning",
                "AI Safety",
                "Explainability",
              ].map((area, idx) => (
                <Chip
                  key={idx}
                  label={area}
                  sx={{
                    bgcolor: "rgba(102,126,234,0.1)",
                    color: "#4f46e5",
                    fontWeight: 500,
                    borderRadius: 2,
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <PaperDetail
        open={Boolean(selectedPaper)}
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
      />
    </Box>
  );
}


