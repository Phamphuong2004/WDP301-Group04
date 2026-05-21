import { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import SearchPapers from "./components/SearchPapers";
import TrendingTopics from "./components/TrendingTopics";
import Bookmarks from "./components/Bookmarks";
import Following from "./components/Following";
import Notifications from "./components/Notifications";
import UserManagement from "./components/UserManagement";
import SystemSettings from "./components/SystemSettings";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import FeaturesPage from "./components/FeaturesPage";
import HowItWorksPage from "./components/HowItWorksPage";
import ReviewsPage from "./components/ReviewsPage";
import AnalyticsReport from "./components/AnalyticsReport";
import AuthorProfile from "./components/AuthorProfile";
import JournalDetail from "./components/JournalDetail";
import ProfileSettings from "./components/ProfileSettings";

export const SIDEBAR_WIDTH = 260;
export const HEADER_HEIGHT = 64;

type PageType =
  | "home"
  | "login"
  | "register"
  | "dashboard"
  | "features"
  | "how-it-works"
  | "reviews";

const theme = createTheme({
  palette: {
    primary: { main: "#4f46e5", light: "#818cf8", dark: "#3730a3" },
    secondary: { main: "#06b6d4", light: "#67e8f9", dark: "#0891b2" },
    success: { main: "#10b981", light: "#6ee7b7", dark: "#059669" },
    warning: { main: "#f59e0b", light: "#fcd34d", dark: "#d97706" },
    error: { main: "#ef4444", light: "#fca5a5", dark: "#dc2626" },
    background: { default: "#f1f5f9", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#64748b" },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.25s ease, transform 0.25s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500 },
        contained: {
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 12px rgba(79,70,229,0.3)" },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 500 } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
  },
});

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as any, // cubic-bezier for custom easing
    },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function App(props: any) {
  const filteredProps = Object.keys(props).reduce((acc: any, key) => {
    if (
      !key.startsWith("data-fg") &&
      key !== "text" &&
      key !== "figmaComponentId"
    ) {
      acc[key] = props[key];
    }
    return acc;
  }, {});

  const [page, setPage] = useState<PageType>("home");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [currentRole, setCurrentRole] = useState("Researcher");
  const [unreadCount, setUnreadCount] = useState(4);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigateTo = (target: PageType | string, role?: string): void => {
    if (role) {
      setCurrentRole(role);
    }
    if (target === "dashboard") {
      setPage("dashboard");
      setActiveSection("dashboard");
      setIsLoggedIn(true);
    } else if (
      target === "home" ||
      target === "login" ||
      target === "register" ||
      target === "features" ||
      target === "how-it-works" ||
      target === "reviews"
    ) {
      setPage(target as PageType);
      if (target === "login") {
        setIsLoggedIn(false);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage("home");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard role={currentRole} onSectionChange={setActiveSection} onNavigate={navigateTo} />
        );
      case "search":
        return <SearchPapers />;
      case "trending":
        return <TrendingTopics />;
      case "bookmarks":
        return <Bookmarks />;
      case "following":
        return <Following />;
      case "notifications":
        return <Notifications onMarkAllRead={() => setUnreadCount(0)} />;
      case "users":
        return (
          <UserManagement currentRole={currentRole} onNavigate={navigateTo} />
        );
      case "settings":
        return <SystemSettings />;
      case "reports":
        return <AnalyticsReport />;
      case "author":
        return <AuthorProfile />;
      case "journal":
        return <JournalDetail />;
      case "profile":
        return <ProfileSettings />;

      default:
        return (
          <Dashboard role={currentRole} onSectionChange={setActiveSection} onNavigate={navigateTo} />
        );
    }
  };

  // ── Public pages (home / login / register) ──
  if (page !== "dashboard") {
    return (
      <ThemeProvider theme={theme} {...filteredProps}>
        <CssBaseline />
        <AnimatePresence mode="wait">
          {page === "home" && (
            <motion.div
              key="home"
              {...pageVariants}
              style={{ minHeight: "100vh" }}
            >
              <HomePage
                onNavigate={navigateTo}
                isLoggedIn={isLoggedIn}
                currentRole={currentRole}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
          {page === "features" && (
            <motion.div
              key="features"
              {...pageVariants}
              style={{ minHeight: "100vh" }}
            >
              <FeaturesPage
                onNavigate={navigateTo}
                isLoggedIn={isLoggedIn}
                currentRole={currentRole}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
          {page === "how-it-works" && (
            <motion.div
              key="how-it-works"
              {...pageVariants}
              style={{ minHeight: "100vh" }}
            >
              <HowItWorksPage
                onNavigate={navigateTo}
                isLoggedIn={isLoggedIn}
                currentRole={currentRole}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
          {page === "reviews" && (
            <motion.div
              key="reviews"
              {...pageVariants}
              style={{ minHeight: "100vh" }}
            >
              <ReviewsPage
                onNavigate={navigateTo}
                isLoggedIn={isLoggedIn}
                currentRole={currentRole}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
          {page === "login" && (
            <motion.div
              key="login"
              {...pageVariants}
              style={{ minHeight: "100vh" }}
            >
              <LoginPage onNavigate={navigateTo} />
            </motion.div>
          )}
          {page === "register" && (
            <motion.div
              key="register"
              {...pageVariants}
              style={{ minHeight: "100vh" }}
            >
              <RegisterPage onNavigate={navigateTo} />
            </motion.div>
          )}
        </AnimatePresence>
      </ThemeProvider>
    );
  }

  // ── Dashboard (authenticated) ──
  return (
    <ThemeProvider theme={theme} {...filteredProps}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          currentRole={currentRole}
          unreadCount={unreadCount}
        />
        <Box
          sx={{
            marginLeft: `${SIDEBAR_WIDTH}px`,
            width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onNavigate={navigateTo}
            currentRole={currentRole}
            unreadCount={unreadCount}
          />
          <Box sx={{ flex: 1, p: 3, pt: `${HEADER_HEIGHT + 24}px` }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeSection} {...pageVariants}>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
