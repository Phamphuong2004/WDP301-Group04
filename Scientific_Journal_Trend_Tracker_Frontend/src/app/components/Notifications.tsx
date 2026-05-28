import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Check, Trash2 } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification as deleteNotifAPI,
  type Notification,
} from "../../services/api";

interface NotificationsProps {
  onMarkAllRead?: () => void;
}

export default function Notifications({ onMarkAllRead }: NotificationsProps) {
  const [tab, setTab] = useState("all");
  const [items, setItems] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getNotifications(1, 50);
        setItems(res.notifications);
      } catch (err: any) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(
    () => items.filter((n) => tab === "all" || n.type === tab),
    [items, tab]
  );
  const shown = filtered.slice(0, visible);

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      onMarkAllRead?.();
    } catch {
      // silently ignore
    }
  };

  const markOne = async (id: string) => {
    try {
      await markNotificationRead(id);
      setItems((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silently ignore
    }
  };

  const removeOne = async (id: string) => {
    try {
      await deleteNotifAPI(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch {
      // silently ignore
    }
  };

  const getTypeColor = (type: string) => {
    if (type === "papers")
      return {
        bg: "rgba(102,126,234,0.08)",
        border: "rgba(102,126,234,0.3)",
        text: "#667eea",
        icon: "📄",
      };
    if (type === "trends")
      return {
        bg: "rgba(245,87,108,0.08)",
        border: "rgba(245,87,108,0.3)",
        text: "#f5576c",
        icon: "📈",
      };
    return {
      bg: "rgba(79,184,254,0.08)",
      border: "rgba(79,184,254,0.3)",
      text: "#4facfe",
      icon: "⚙️",
    };
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background:
            "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(79,184,254,0.08))",
          border: "1px solid rgba(102,126,234,0.2)",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setVisible(4);
          }}
          sx={{
            "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
            "& .Mui-selected": { color: "#4f46e5 !important" },
          }}
        >
          <Tab value="all" label="All" />
          <Tab value="papers" label="Papers" />
          <Tab value="trends" label="Trends" />
          <Tab value="system" label="System" />
        </Tabs>
        <Button
          onClick={markAll}
          sx={{
            bgcolor: "#4f46e5",
            color: "#fff",
            textTransform: "none",
            "&:hover": { bgcolor: "#4338ca" },
          }}
        >
          Mark all as read
        </Button>
      </Paper>

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
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {shown.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center", color: "#94a3b8" }}>
              <Typography>Không có thông báo nào</Typography>
            </Box>
          ) : (
            shown.map((n, idx) => {
              const typeColor = getTypeColor(n.type);
              return (
                <Box
                  key={n._id}
                  sx={{
                    p: 2.5,
                    background: n.read
                      ? "transparent"
                      : `linear-gradient(135deg, ${typeColor.bg}, rgba(255,255,255,0.5))`,
                    border: n.read
                      ? "1px solid rgba(0,0,0,0.06)"
                      : `1px solid ${typeColor.border}`,
                    borderBottom:
                      idx < shown.length - 1
                        ? "1px solid rgba(0,0,0,0.08)"
                        : "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: !n.read ? typeColor.bg : "rgba(0,0,0,0.02)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, alignItems: "start" }}>
                    <Typography sx={{ fontSize: "1.2rem" }}>
                      {typeColor.icon}
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: n.read ? 500 : 700,
                          color: typeColor.text,
                          fontSize: "0.95rem",
                        }}
                      >
                        {n.title}
                      </Typography>
                      <Typography
                        sx={{ color: "#64748b", fontSize: "0.85rem", mt: 0.3 }}
                      >
                        {n.message}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          {new Date(n.createdAt).toLocaleString("vi-VN")}
                        </Typography>
                        <Box>
                          {!n.read && (
                            <IconButton
                              size="small"
                              onClick={() => markOne(n._id)}
                              sx={{
                                color: typeColor.text,
                                "&:hover": { bgcolor: typeColor.bg },
                              }}
                            >
                              <Check size={14} />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => removeOne(n._id)}
                            sx={{
                              color: "#ef4444",
                              "&:hover": { bgcolor: "rgba(239,68,68,0.1)" },
                            }}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Paper>
      )}

      {visible < filtered.length && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            onClick={() => setVisible((v) => v + 4)}
            sx={{
              textTransform: "none",
              color: "#4f46e5",
              "&:hover": { bgcolor: "rgba(79,70,229,0.08)" },
            }}
          >
            Load more
          </Button>
        </Box>
      )}
    </Box>
  );
}
