import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import { TrendingUp, Menu, X } from "lucide-react";

interface PublicHeaderProps {
  onNavigate: (page: "home" | "login" | "register" | "dashboard" | "features" | "how-it-works" | "reviews") => void;
  isLoggedIn?: boolean;
  currentRole?: string;
  onLogout?: () => void;
  activePage: "home" | "features" | "how-it-works" | "reviews";
}

export default function PublicHeader({
  onNavigate,
  isLoggedIn = false,
  currentRole = "Researcher",
  onLogout,
  activePage,
}: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isNavbarScrolled = scrolled || activePage !== "home";

  const navItems = [
    { label: "Tính năng", value: "features" },
    { label: "Cách hoạt động", value: "how-it-works" },
    { label: "Đánh giá", value: "reviews" },
  ] as const;

  return (
    <Box
      component={motion.nav}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: isNavbarScrolled ? "blur(24px) saturate(180%)" : "none",
        bgcolor: isNavbarScrolled ? "rgba(255,255,255,0.9)" : "transparent",
        boxShadow: isNavbarScrolled
          ? "0 1px 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)"
          : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", height: 72, gap: 2 }}>
          {/* Logo */}
          <Box
            onClick={() => onNavigate("home")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "11px",
                background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(79,70,229,0.35)",
              }}
            >
              <TrendingUp size={20} color="#fff" />
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.3rem",
                background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SciTrend
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
              ml: 4,
              flex: 1,
            }}
          >
            {navItems.map((item) => {
              const isActive = activePage === item.value;
              return (
                <Button
                  key={item.value}
                  onClick={() => onNavigate(item.value)}
                  sx={{
                    color: isActive
                      ? "#4f46e5"
                      : isNavbarScrolled
                      ? "#374151"
                      : "rgba(255,255,255,0.85)",
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: 2,
                    fontSize: "0.9rem",
                    px: 2,
                    py: 1,
                    position: "relative",
                    "&::after": isActive ? {
                      content: '""',
                      position: "absolute",
                      bottom: 4,
                      left: 16,
                      right: 16,
                      height: 2,
                      bgcolor: "#4f46e5",
                      borderRadius: 1,
                    } : {},
                    "&:hover": {
                      bgcolor: isNavbarScrolled
                        ? "rgba(79,70,229,0.06)"
                        : "rgba(255,255,255,0.1)",
                      color: isActive ? "#4f46e5" : isNavbarScrolled ? "#4f46e5" : "#fff",
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              ml: "auto",
            }}
          >
            {!isLoggedIn ? (
              <>
                <Button
                  onClick={() => onNavigate("login")}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    color: isNavbarScrolled ? "#4f46e5" : "rgba(255,255,255,0.9)",
                    fontWeight: 600,
                    borderRadius: 2,
                    border: isNavbarScrolled
                      ? "1px solid #e0e7ff"
                      : "1px solid rgba(255,255,255,0.25)",
                    "&:hover": {
                      bgcolor: isNavbarScrolled ? "#eef2ff" : "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  onClick={() => onNavigate("register")}
                  variant="contained"
                  sx={{
                    display: { xs: "none", md: "flex" },
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    borderRadius: 2,
                    fontWeight: 700,
                    px: 2.5,
                    boxShadow: "0 4px 14px rgba(79,70,229,0.4)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(79,70,229,0.5)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  Đăng ký
                </Button>
              </>
            ) : (
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {currentRole ? currentRole.charAt(0) : "U"}
                  </Avatar>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: isNavbarScrolled ? "#0f172a" : "#fff",
                        lineHeight: 1.1,
                      }}
                    >
                      Dr. User
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: isNavbarScrolled ? "#64748b" : "rgba(255,255,255,0.6)",
                        fontWeight: 600,
                      }}
                    >
                      {currentRole}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  onClick={() => onNavigate("dashboard")}
                  variant="contained"
                  sx={{
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    borderRadius: 2,
                    fontWeight: 700,
                    px: 2,
                    fontSize: "0.85rem",
                    boxShadow: "0 4px 14px rgba(79,70,229,0.4)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(79,70,229,0.5)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={onLogout}
                  sx={{
                    color: isNavbarScrolled ? "#ef4444" : "rgba(239,68,68,0.9)",
                    fontWeight: 600,
                    borderRadius: 2,
                    fontSize: "0.85rem",
                    border: "1px solid transparent",
                    "&:hover": {
                      bgcolor: isNavbarScrolled
                        ? "rgba(239,68,68,0.06)"
                        : "rgba(255,255,255,0.1)",
                      borderColor: "rgba(239,68,68,0.2)",
                    },
                  }}
                >
                  Đăng xuất
                </Button>
              </Stack>
            )}
            <IconButton
              sx={{
                display: { xs: "flex", md: "none" },
                color: isNavbarScrolled ? "#374151" : "#fff",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </IconButton>
          </Box>
        </Box>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Box
              sx={{
                bgcolor: "#fff",
                borderTop: "1px solid #f1f5f9",
                p: 2,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              <Stack spacing={1}>
                {navItems.map((item) => (
                  <Button
                    key={item.value}
                    fullWidth
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate(item.value);
                    }}
                    sx={{
                      justifyContent: "flex-start",
                      color: activePage === item.value ? "#4f46e5" : "#374151",
                      fontWeight: activePage === item.value ? 700 : 500,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Divider />
                {!isLoggedIn ? (
                  <>
                    <Button
                      fullWidth
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("login");
                      }}
                      sx={{ color: "#4f46e5", fontWeight: 600 }}
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("register");
                      }}
                      sx={{
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      }}
                    >
                      Đăng ký
                    </Button>
                  </>
                ) : (
                  <>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      sx={{ p: 1 }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background:
                            "linear-gradient(135deg, #4f46e5, #06b6d4)",
                        }}
                      >
                        {currentRole ? currentRole.charAt(0) : "U"}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#0f172a",
                          }}
                        >
                          Dr. User
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.7rem", color: "#64748b" }}
                        >
                          {currentRole}
                        </Typography>
                      </Box>
                    </Stack>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigate("dashboard");
                      }}
                      sx={{
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        mb: 1,
                      }}
                    >
                      Đi đến Dashboard
                    </Button>
                    <Button
                      fullWidth
                      onClick={() => {
                        setMenuOpen(false);
                        if (onLogout) onLogout();
                      }}
                      sx={{ color: "#ef4444", fontWeight: 600 }}
                    >
                      Đăng xuất
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
