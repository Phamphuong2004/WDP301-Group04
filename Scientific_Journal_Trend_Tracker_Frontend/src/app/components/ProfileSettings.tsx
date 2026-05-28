import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  MenuItem,
} from "@mui/material";
import { getCurrentUser } from "../../services/api";

export default function ProfileSettings() {
  const [interests, setInterests] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    frequency: "daily",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        setCurrentUser(user);
        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          institution: user.institution || "",
        });
        setInterests(user.interests || []);
      } catch (err: any) {
        setError(err.message || "Failed to load user settings");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const addInterest = () => {
    if (!input.trim()) return;
    if (interests.includes(input.trim())) return;
    setInterests((prev) => [...prev, input.trim()]);
    setInput("");
  };

  const normalizeRole = (role: string): string => {
    const r = role.toLowerCase();
    if (r === "admin") return "System Administrator";
    if (r === "researcher") return "Researcher";
    if (r === "user") return "Lecturer/Student";
    if (r === "system administrator") return "System Administrator";
    if (r === "lecturer/student") return "Lecturer/Student";
    return role;
  };

  const handleSave = async () => {
    setIsEditMode(false);
    // TODO: Call API to update user
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormData({
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      institution: currentUser?.institution || "",
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Header Card */}
      <Card
        sx={{
          mb: 4,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
        }}
      >
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              mx: "auto",
              bgcolor: "rgba(255,255,255,0.3)",
              fontSize: "3rem",
              fontWeight: "bold",
              border: "4px solid white",
            }}
          >
            {(currentUser?.fullName || "Dr. User").charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {currentUser?.fullName || "User"}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
            {normalizeRole(currentUser?.role)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {currentUser?.email}
          </Typography>
          {!isEditMode && (
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "white",
                color: "#667eea",
                fontWeight: 600,
                "&:hover": { bgcolor: "#f0f0f0" },
              }}
              onClick={() => setIsEditMode(true)}
            >
              ✏️ Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Personal Info Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              👤 Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TextField
              label="Full Name"
              fullWidth
              value={
                isEditMode ? formData.fullName : currentUser?.fullName || ""
              }
              onChange={(e) =>
                isEditMode &&
                setFormData({ ...formData, fullName: e.target.value })
              }
              sx={{ mb: 2 }}
              InputProps={{ readOnly: !isEditMode }}
              variant={isEditMode ? "outlined" : "filled"}
            />
            <TextField
              label="Email"
              fullWidth
              value={isEditMode ? formData.email : currentUser?.email || ""}
              onChange={(e) =>
                isEditMode &&
                setFormData({ ...formData, email: e.target.value })
              }
              sx={{ mb: 2 }}
              InputProps={{ readOnly: true }}
              variant="filled"
            />
            <TextField
              label="Affiliation"
              fullWidth
              value={
                isEditMode
                  ? formData.institution
                  : currentUser?.institution || "University Lab"
              }
              onChange={(e) =>
                isEditMode &&
                setFormData({ ...formData, institution: e.target.value })
              }
              sx={{ mb: 2 }}
              InputProps={{ readOnly: !isEditMode }}
              variant={isEditMode ? "outlined" : "filled"}
            />
            <TextField
              label="Role"
              fullWidth
              value={currentUser?.role ? normalizeRole(currentUser.role) : ""}
              InputProps={{ readOnly: true }}
              variant="filled"
            />
          </Paper>
        </Grid>

        {/* Security Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              🔐 Security
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Enter current password"
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Enter new password"
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              placeholder="Confirm new password"
            />
            <Button
              variant="contained"
              sx={{ mt: 2, textTransform: "none", fontWeight: 600 }}
            >
              Update Password
            </Button>
          </Paper>

          {/* Notification Preferences */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              🔔 Notification Preferences
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationPrefs.emailNotifications}
                  onChange={(e) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      emailNotifications: e.target.checked,
                    })
                  }
                />
              }
              label="Email Notifications"
              sx={{ display: "block", mb: 1.5 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationPrefs.inAppNotifications}
                  onChange={(e) =>
                    setNotificationPrefs({
                      ...notificationPrefs,
                      inAppNotifications: e.target.checked,
                    })
                  }
                />
              }
              label="In-App Notifications"
              sx={{ display: "block", mb: 2 }}
            />
            <TextField
              select
              label="Frequency"
              fullWidth
              value={notificationPrefs.frequency}
              onChange={(e) =>
                setNotificationPrefs({
                  ...notificationPrefs,
                  frequency: e.target.value,
                })
              }
              size="small"
            >
              <MenuItem value="instant">Instant</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </TextField>
          </Paper>
        </Grid>

        {/* Research Interests Section */}
        <Grid size={{ xs: 12 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              🎯 Research Interests
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
              {interests.map((i) => (
                <Chip
                  key={i}
                  label={i}
                  onDelete={() =>
                    setInterests(interests.filter((x) => x !== i))
                  }
                  sx={{
                    bgcolor: "#667eea",
                    color: "white",
                    fontWeight: 500,
                    "& .MuiChip-deleteIcon": {
                      color: "rgba(255,255,255,0.7)",
                      "&:hover": { color: "white" },
                    },
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <TextField
                label="Add keyword"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addInterest()}
                size="small"
                variant="outlined"
                placeholder="e.g., Machine Learning"
              />
              <Button
                onClick={addInterest}
                variant="contained"
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Add
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Action Buttons */}
        {isEditMode && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                ❌ Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                💾 Save Changes
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
