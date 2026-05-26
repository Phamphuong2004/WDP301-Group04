import { useMemo, useState } from "react";
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
} from "@mui/material";

const following: any[] = [];
const discover: any[] = [];

export default function Following() {
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const discoverFiltered = useMemo(
    () =>
      discover.filter((d) => d.name.toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  const getTypeColor = (type: string) => {
    if (type === "journal")
      return {
        bg: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))",
        text: "#667eea",
        icon: "📚",
      };
    return {
      bg: "linear-gradient(135deg, rgba(245,87,108,0.08), rgba(240,147,251,0.08))",
      text: "#f5576c",
      icon: "🏷️",
    };
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
          {tab === 0 && (
            <Grid container spacing={2.5}>
              {following.map((f) => {
                const typeColor = getTypeColor(f.type);
                return (
                  <Grid key={f.id} size={{ xs: 12, md: 6 }}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        background: typeColor.bg,
                        border: `1.5px solid ${typeColor.text}33`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: `0 12px 32px ${typeColor.text}20`,
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "start",
                            mb: 1,
                          }}
                        >
                          <Typography sx={{ fontSize: "1.3rem" }}>
                            {typeColor.icon}
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: "0.95rem",
                                color: "#0f172a",
                              }}
                            >
                              {f.name}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#64748b",
                                fontSize: "0.85rem",
                                mt: 0.3,
                              }}
                            >
                              {f.stat}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          size="small"
                          label={f.type}
                          sx={{
                            bgcolor: typeColor.text,
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
          {tab === 1 && (
            <>
              <TextField
                placeholder="Search journals, topics..."
                size="small"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                sx={{ mb: 2.5 }}
              />
              <Grid container spacing={2.5}>
                {discoverFiltered.map((d) => {
                  const typeColor = getTypeColor(d.type);
                  return (
                    <Grid key={d.id} size={{ xs: 12, md: 6 }}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          background: typeColor.bg,
                          border: `1.5px solid ${typeColor.text}33`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-6px)",
                            boxShadow: `0 12px 32px ${typeColor.text}20`,
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "start",
                              mb: 1,
                            }}
                          >
                            <Typography sx={{ fontSize: "1.3rem" }}>
                              {typeColor.icon}
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  fontSize: "0.95rem",
                                  color: "#0f172a",
                                }}
                              >
                                {d.name}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#64748b",
                                  fontSize: "0.85rem",
                                  mt: 0.3,
                                }}
                              >
                                {d.stat}
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            sx={{
                              bgcolor: typeColor.text,
                              color: "#fff",
                              textTransform: "none",
                              fontWeight: 600,
                              "&:hover": {
                                bgcolor: typeColor.text,
                                opacity: 0.9,
                              },
                            }}
                            variant="contained"
                            size="small"
                          >
                            Follow
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
