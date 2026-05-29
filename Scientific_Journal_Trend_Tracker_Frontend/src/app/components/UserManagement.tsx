import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { UserPlus, Edit3, ArrowLeft } from "lucide-react";
import { getUsers, type User } from "../../services/api";

interface UserManagementProps {
  currentRole?: string;
  onNavigate?: (
    target: "home" | "login" | "register" | "dashboard" | string,
  ) => void;
}

export default function UserManagement(props: UserManagementProps) {
  const { currentRole = "Admin", onNavigate } = props;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getUsers(1, 100);
        setUsers(res.users);
      } catch (err: any) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (roleFilter === "all" || u.role === roleFilter) &&
          `${u.fullName} ${u.email}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [users, roleFilter, q],
  );
  const pageSize = 10;
  const shown = filtered.slice((page - 1) * pageSize, page * pageSize);

  const statColors = [
    { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", icon: "👥" },
    { bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", icon: "🎓" },
    { bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", icon: "👨" },
    { bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", icon: "⚙️" },
  ];

  const stats = [
    { label: "Total Users", value: users.length },
    {
      label: "Researchers",
      value: users.filter((u) => u.role === "researcher").length,
    },
    {
      label: "Lecturers/Students",
      value: users.filter((u) => u.role === "user").length,
    },
    { label: "System Administrators", value: users.filter((u) => u.role === "admin").length },
  ];

  // ── Different screens based on role ──
  if (currentRole === "Researcher" || currentRole === "Lecturer/Student") {
    return (
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => onNavigate?.("home")}
            sx={{
              textTransform: "none",
              color: "#4f46e5",
              "&:hover": { bgcolor: "rgba(79,70,229,0.1)" },
            }}
          >
            Back to Home
          </Button>
        </Box>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(79,184,254,0.08))",
            border: "1px solid rgba(102,126,234,0.2)",
          }}
        >
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, mb: 1 }}>
            User Management
          </Typography>
          <Typography sx={{ color: "#64748b" }}>
            This feature is only available for administrators. You are logged in
            as a {currentRole}.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // ── Admin view ──
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => onNavigate?.("home")}
          sx={{
            textTransform: "none",
            color: "#4f46e5",
            "&:hover": { bgcolor: "rgba(79,70,229,0.1)" },
          }}
        >
          Back to Home
        </Button>
      </Box>
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {stats.map((s, idx) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                background: statColors[idx].bg,
                color: "#fff",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography sx={{ fontSize: "1.2rem" }}>
                {statColors[idx].icon}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", opacity: 0.9 }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontSize: "1.4rem", fontWeight: 800 }}>
                {s.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 3,
          display: "flex",
          gap: 1.5,
          background:
            "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(79,184,254,0.08))",
          border: "1px solid rgba(102,126,234,0.2)",
        }}
      >
        <TextField
          size="small"
          placeholder="Search name/email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <FormControl size="small">
          <InputLabel>Role</InputLabel>
          <Select
            value={roleFilter}
            label="Role"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="researcher">Researcher</MenuItem>
            <MenuItem value="user">Lecturer/Student</MenuItem>
            <MenuItem value="admin">System Administrator</MenuItem>
          </Select>
        </FormControl>
        <Button
          sx={{
            ml: "auto",
            bgcolor: "#4f46e5",
            color: "#fff",
            textTransform: "none",
            "&:hover": { bgcolor: "#4338ca" },
          }}
          startIcon={<UserPlus size={15} />}
          variant="contained"
          onClick={() => setInviteOpen(true)}
        >
          Invite User
        </Button>
      </Paper>
      <Paper
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(102,126,234,0.15)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead
              sx={{
                background:
                  "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(79,184,254,0.08))",
                borderBottom: "2px solid rgba(102,126,234,0.2)",
              }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shown.map((u) => (
                <TableRow
                  key={u._id}
                  sx={{
                    "&:hover": { bgcolor: "rgba(102,126,234,0.05)" },
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Avatar sx={{ bgcolor: "#4f46e5" }}>
                        {(u.fullName ?? u.email).charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          {u.fullName}
                        </Typography>
                        <Typography
                          sx={{ color: "#94a3b8", fontSize: "0.78rem" }}
                        >
                          {u.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.status}
                      sx={{
                        bgcolor:
                          u.status === "Active"
                            ? "rgba(16,185,129,0.2)"
                            : "rgba(245,87,108,0.2)",
                        color: u.status === "Active" ? "#10b981" : "#f5576c",
                        fontWeight: 600,
                      }}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => setEditUser(u)}
                      sx={{
                        color: "#4f46e5",
                        "&:hover": { bgcolor: "rgba(79,70,229,0.1)" },
                      }}
                    >
                      <Edit3 size={14} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.max(1, Math.ceil(filtered.length / pageSize))}
          page={page}
          onChange={(_, p) => setPage(p)}
        />
      </Box>

      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor:
              "linear-gradient(135deg, rgba(102,126,234,0.1), rgba(79,184,254,0.1))",
            fontWeight: 700,
          }}
        >
          Invite New User
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField fullWidth label="Email" sx={{ mb: 1.5 }} />
          <TextField
            fullWidth
            select
            label="Role"
            defaultValue="Researcher"
            sx={{ mb: 1.5 }}
          >
            <MenuItem value="Researcher">Researcher</MenuItem>
            <MenuItem value="Lecturer/Student">Lecturer/Student</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#4f46e5",
              "&:hover": { bgcolor: "#4338ca" },
              textTransform: "none",
              width: "100%",
            }}
          >
            Send Invite
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            bgcolor:
              "linear-gradient(135deg, rgba(245,87,108,0.1), rgba(240,147,251,0.1))",
            fontWeight: 700,
          }}
        >
          Edit User
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            defaultValue={editUser?.name}
            sx={{ mb: 1.5 }}
          />
          <TextField
            fullWidth
            select
            label="Role"
            defaultValue={editUser?.role || "Researcher"}
            sx={{ mb: 1.5 }}
          >
            <MenuItem value="Researcher">Researcher</MenuItem>
            <MenuItem value="Lecturer/Student">Lecturer/Student</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          <TextField
            fullWidth
            select
            label="Status"
            defaultValue={editUser?.status || "Active"}
            sx={{ mb: 1.5 }}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
          </TextField>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#4f46e5",
              "&:hover": { bgcolor: "#4338ca" },
              textTransform: "none",
              width: "100%",
            }}
          >
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
  // ── End of Admin view ──
}
