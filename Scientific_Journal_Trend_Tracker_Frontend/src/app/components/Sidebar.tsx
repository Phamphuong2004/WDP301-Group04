import {
  Box,
  Typography,
  Divider,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ButtonBase,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/api";
import {
  LayoutDashboard,
  Search,
  TrendingUp,
  Bookmark,
  Bell,
  Users,
  Settings,
  FlaskConical,
  Heart,
  UserCircle,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  User,
  FileSearch,
  Library,
  UserRound,
} from "lucide-react";
import { SIDEBAR_WIDTH } from "../App";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  currentRole: string;
  unreadCount: number;
}

const mainNav = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    value: "dashboard",
    roles: ["researcher", "user", "admin"],
  },
  {
    icon: Search,
    label: "Search Papers",
    value: "search",
    roles: ["researcher", "user"],
  },
  {
    icon: TrendingUp,
    label: "Trending Topics",
    value: "trending",
    roles: ["researcher"],
  },
  {
    icon: BarChart3,
    label: "Reports",
    value: "reports",
    roles: ["researcher"],
  },
  {
    icon: UserRound,
    label: "Author Profile",
    value: "author",
    roles: ["researcher", "user"],
  },
  {
    icon: Library,
    label: "Journal Detail",
    value: "journal",
    roles: ["researcher", "user"],
  },
  {
    icon: Bookmark,
    label: "My Bookmarks",
    value: "bookmarks",
    roles: ["researcher", "user"],
  },
  {
    icon: Heart,
    label: "Following",
    value: "following",
    roles: ["researcher", "user"],
  },
  {
    icon: Bell,
    label: "Notifications",
    value: "notifications",
    badge: 4,
    roles: ["researcher", "user", "admin"],
  },
];

const adminNav = [
  { icon: Users, label: "User Management", value: "users", roles: ["admin"] },
  {
    icon: Settings,
    label: "System Settings",
    value: "settings",
    roles: ["admin"],
  },
];

const accountNav = [
  {
    icon: User,
    label: "My Profile",
    value: "profile",
    roles: ["researcher", "user", "admin"],
  },
];

export default function Sidebar({
  activeSection,
  onSectionChange,
  currentRole,
  unreadCount,
}: SidebarProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch((err) => console.log("Sidebar current user fetch error", err));
  }, []);

  const normalizeRole = (role: string): string => {
    const r = role.toLowerCase();
    if (r === "admin") return "System Administrator";
    if (r === "researcher") return "Researcher";
    if (r === "user") return "Lecturer/Student";
    if (r === "system administrator") return "System Administrator";
    if (r === "lecturer/student") return "Lecturer/Student";
    return role;
  };
  const filteredMainNav = mainNav.filter((item) =>
    item.roles.includes(currentRole),
  );
  const filteredAdminNav = adminNav.filter((item) =>
    item.roles.includes(currentRole),
  );
  const filteredAccountNav = accountNav.filter((item) =>
    item.roles.includes(currentRole),
  );

  const roles = [
    { name: "Researcher", icon: UserCircle, color: "#4f46e5" },
    { name: "Lecturer/Student", icon: GraduationCap, color: "#10b981" },
    { name: "System Administrator", icon: ShieldCheck, color: "#f59e0b" },
  ];

  const renderNavItem = (item: any) => (
    <ListItem key={item.value} disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        selected={activeSection === item.value}
        onClick={() => onSectionChange(item.value)}
        sx={{
          borderRadius: 2,
          py: 1.25,
          color:
            activeSection === item.value ? "#fff" : "rgba(255,255,255,0.5)",
          bgcolor:
            activeSection === item.value
              ? "rgba(79,70,229,0.9) !important"
              : "transparent",
          "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
          <item.icon
            size={18}
            strokeWidth={activeSection === item.value ? 2.5 : 2}
          />
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontSize: "0.85rem",
            fontWeight: activeSection === item.value ? 600 : 500,
          }}
        />
        {item.badge !== undefined && (
          <Chip
            label={item.value === "notifications" ? unreadCount : item.badge}
            size="small"
            sx={{
              height: 18,
              fontSize: "0.6rem",
              fontWeight: 800,
              bgcolor:
                item.value === "notifications" && unreadCount === 0
                  ? "rgba(255,255,255,0.2)"
                  : "#ef4444",
              color: "#fff",
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        background: "linear-gradient(180deg, #0f172a 0%, #1a1040 100%)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
        boxShadow: "4px 0 24px rgba(0,0,0,0.2)",
      }}
    >
      {/* Brand Logo */}
      <Box
        sx={{ px: 2.5, py: 3, display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FlaskConical size={18} color="#fff" />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            SciTrend
          </Typography>
          <Typography
            sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}
          >
            Researcher Portal
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 2, mb: 2 }} />

      {/* Main Navigation List */}
      <List sx={{ px: 1.5, py: 0, flex: 1, overflowY: "auto" }}>
        <Typography
          sx={{
            px: 2,
            mb: 1,
            fontSize: "0.65rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Menu
        </Typography>
        {filteredMainNav.map(renderNavItem)}

        {filteredAdminNav.length > 0 && (
          <>
            <Typography
              sx={{
                px: 2,
                mt: 3,
                mb: 1,
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Admin
            </Typography>
            {filteredAdminNav.map(renderNavItem)}
          </>
        )}

        {filteredAccountNav.length > 0 && (
          <>
            <Typography
              sx={{
                px: 2,
                mt: 3,
                mb: 1,
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Account
            </Typography>
            {filteredAccountNav.map(renderNavItem)}
          </>
        )}
      </List>

      <Box sx={{ p: 2 }}>
        {/* User Profile Display (Read-Only) */}
        <Box
          sx={{
            width: "100%",
            p: 1.5,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: roles.find((r) => r.name === normalizeRole(currentUser?.role || currentRole))?.color || "#4f46e5",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            {(currentUser?.fullName || "Dr. User").charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {currentUser?.fullName || "Dr. User"}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.4)",
                mt: 0.5,
              }}
            >
              {normalizeRole(currentUser?.role || currentRole)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
