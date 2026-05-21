import { useState } from "react";
import { motion, Variants } from "motion/react";
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  TrendingUp,
  ArrowLeft,
  BookOpen,
  Users,
  BarChart2,
  ChevronRight,
  Shield,
  Sparkles,
  Search,
  Bell,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

interface LoginPageProps {
  onNavigate: (page: "home" | "register" | "dashboard", role?: string) => void;
}

const TEST_CREDENTIALS = [
  {
    role: "Researcher",
    color: "#4f46e5",
    email: "researcher@scitrend.com",
    password: "Password123",
  },
  {
    role: "Lecturer/Student",
    color: "#06b6d4",
    email: "student@scitrend.com",
    password: "Password123",
  },
  {
    role: "Admin",
    color: "#10b981",
    email: "admin@scitrend.com",
    password: "Password123",
  },
];

const ACTIVITY_FEED = [
  {
    user: "Nguyễn M.T",
    action: "vừa bookmark",
    paper: "Attention Is All You Need",
    time: "2 phút trước",
    color: "#4f46e5",
  },
  {
    user: "Lê T.H",
    action: "đang theo dõi chủ đề",
    paper: "Deep Learning",
    time: "5 phút trước",
    color: "#06b6d4",
  },
  {
    user: "Trần Q.B",
    action: "tìm kiếm",
    paper: "NLP Vietnamese",
    time: "8 phút trước",
    color: "#10b981",
  },
  {
    user: "Phạm A.D",
    action: "đánh dấu nổi bật",
    paper: "GPT-4 Technical Report",
    time: "12 phút trước",
    color: "#f59e0b",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

function FloatingOrb({
  size,
  color,
  x,
  y,
  delay,
}: {
  size: number;
  color: string;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        left: x,
        top: y,
        filter: "blur(72px)",
        opacity: 0.2,
        pointerEvents: "none",
      }}
      animate={{ y: [0, -20, 0], scale: [1, 1.06, 1] }}
      transition={{
        duration: 7 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    
    const matchedDemo = TEST_CREDENTIALS.find(demo => demo.email.toLowerCase() === email.toLowerCase());
    const role = matchedDemo ? matchedDemo.role : "Researcher";
    onNavigate("dashboard", role);
  };

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  const autoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
    setTimeout(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const matchedDemo = TEST_CREDENTIALS.find(demo => demo.email.toLowerCase() === demoEmail.toLowerCase());
        const role = matchedDemo ? matchedDemo.role : "Researcher";
        onNavigate("dashboard", role);
      }, 1200);
    }, 100);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      bgcolor: "#f8fafc",
      transition: "all 0.2s",
      "& fieldset": { borderColor: "#e2e8f0", borderWidth: 1.5 },
      "&:hover fieldset": { borderColor: "#c7d2fe" },
      "&.Mui-focused fieldset": { borderColor: "#4f46e5", borderWidth: 2 },
      "&.Mui-focused": {
        bgcolor: "#fff",
        boxShadow: "0 0 0 4px rgba(79,70,229,0.06)",
      },
    },
    "& input": { py: 1.625, fontSize: "0.95rem" },
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fff" }}>
      {/* ─── LEFT PANEL ─── */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flex: "0 0 50%",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(145deg, #0f172a 0%, #1e1b4b 55%, #0c4a6e 100%)",
        }}
      >
        <FloatingOrb size={600} color="#4f46e5" x="-15%" y="-10%" delay={0} />
        <FloatingOrb size={400} color="#06b6d4" x="50%" y="55%" delay={2} />
        <FloatingOrb size={280} color="#7c3aed" x="65%" y="-10%" delay={1} />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            p: 6,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "13px",
                background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(79,70,229,0.45)",
              }}
            >
              <TrendingUp size={22} color="#fff" />
            </Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "1.5rem",
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              SciTrend
            </Typography>
          </Stack>

          {/* Main content */}
          <Box sx={{ my: "auto", pt: 4 }}>
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                    px: 1.75,
                    py: 0.625,
                    borderRadius: 5,
                    bgcolor: "rgba(79,70,229,0.2)",
                    border: "1px solid rgba(165,180,252,0.25)",
                  }}
                >
                  <Sparkles size={13} color="#a5b4fc" />
                  <Typography
                    sx={{
                      color: "#a5b4fc",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                    }}
                  >
                    Chào mừng trở lại
                  </Typography>
                </Box>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Typography
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1.1,
                    mb: 2,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Nơi hội tụ{" "}
                  <Box
                    component="span"
                    sx={{
                      background: "linear-gradient(135deg, #818cf8, #67e8f9)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    tri thức
                  </Box>{" "}
                  khoa học
                </Typography>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.58)",
                    lineHeight: 1.85,
                    mb: 6,
                    maxWidth: 380,
                    fontSize: "0.975rem",
                  }}
                >
                  Đăng nhập để tiếp tục khám phá hàng chục nghìn bài báo khoa
                  học và kết nối với cộng đồng nghiên cứu toàn cầu.
                </Typography>
              </motion.div>

              {/* Stats mini */}
              <motion.div variants={fadeUp}>
                <Grid3 />
              </motion.div>
            </motion.div>

            {/* Live activity feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Box sx={{ mt: 5 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2.5}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#10b981",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Hoạt động trực tiếp
                  </Typography>
                </Stack>
                <Stack spacing={1.5}>
                  {ACTIVITY_FEED.map(
                    ({ user, action, paper, time, color }, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                            p: 1.75,
                            bgcolor: "rgba(255,255,255,0.04)",
                            borderRadius: "12px",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: color,
                              width: 28,
                              height: 28,
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {user[0]}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                color: "rgba(255,255,255,0.75)",
                                fontSize: "0.78rem",
                                lineHeight: 1.4,
                              }}
                            >
                              <Box component="span" sx={{ fontWeight: 700 }}>
                                {user}
                              </Box>{" "}
                              {action}{" "}
                              <Box
                                component="span"
                                sx={{ color, fontWeight: 600 }}
                              >
                                "{paper}"
                              </Box>
                            </Typography>
                            <Typography
                              sx={{
                                color: "rgba(255,255,255,0.3)",
                                fontSize: "0.7rem",
                                mt: 0.25,
                              }}
                            >
                              {time}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div>
                    ),
                  )}
                </Stack>
              </Box>
            </motion.div>
          </Box>

          {/* Bottom testimonial */}
          <Box
            sx={{
              p: 3,
              bgcolor: "rgba(255,255,255,0.04)",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Stack direction="row" spacing={0.5} mb={1.5}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
              ))}
            </Stack>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.78)",
                fontSize: "0.875rem",
                fontStyle: "italic",
                lineHeight: 1.75,
                mb: 1.75,
              }}
            >
              "SciTrend đã thay đổi hoàn toàn cách tôi tiếp cận nghiên cứu. Giao
              diện đẹp, tính năng phân tích rất ấn tượng."
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Avatar
                sx={{
                  bgcolor: "#4f46e5",
                  width: 32,
                  height: 32,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
              >
                N
              </Avatar>
              <Box>
                <Typography
                  sx={{ color: "#fff", fontSize: "0.8rem", fontWeight: 700 }}
                >
                  PGS.TS Nguyễn Minh Tuấn
                </Typography>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem" }}
                >
                  ĐH Bách Khoa Hà Nội
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* ─── RIGHT PANEL (form) ─── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 5 },
          position: "relative",
          bgcolor: "#fff",
          minHeight: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Back button */}
        <Box sx={{ position: "absolute", top: 24, left: 24 }}>
          <Button
            startIcon={<ArrowLeft size={16} />}
            onClick={() => onNavigate("home")}
            sx={{
              color: "#64748b",
              fontWeight: 500,
              borderRadius: 2.5,
              "&:hover": { bgcolor: "#f8fafc", color: "#0f172a" },
            }}
          >
            Trang chủ
          </Button>
        </Box>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ width: "100%", maxWidth: 420 }}
        >
          {/* Mobile logo */}
          <motion.div variants={fadeUp}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.25}
              sx={{ display: { xs: "flex", lg: "none" }, mb: 5 }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "11px",
                  background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={20} color="#fff" />
              </Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SciTrend
              </Typography>
            </Stack>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Typography
              sx={{
                fontSize: "1.875rem",
                fontWeight: 900,
                color: "#0f172a",
                mb: 0.5,
                letterSpacing: "-0.02em",
              }}
            >
              Đăng nhập
            </Typography>
            <Typography sx={{ color: "#64748b", mb: 4, fontSize: "0.95rem" }}>
              Chào mừng trở lại! Nhập thông tin để tiếp tục.
            </Typography>
          </motion.div>

          {/* Test Credentials */}
          <motion.div variants={fadeUp}>
            <Box
              sx={{
                mb: 3.5,
                p: 2.5,
                bgcolor: "#f0f9ff",
                borderRadius: 3,
                border: "1.5px solid #bae6fd",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Sparkles size={15} color="#0891b2" />
                <Typography
                  sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#0369a1" }}
                >
                  📋 Test Credentials
                </Typography>
              </Stack>
              <Stack spacing={1.5}>
                {TEST_CREDENTIALS.map(({ role, color, email, password }) => (
                  <Box
                    key={role}
                    onClick={() => fillDemo(email, password)}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: `1.5px solid ${color}30`,
                      bgcolor: `${color}08`,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: `${color}15`,
                        borderColor: `${color}50`,
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 0.75 }}
                    >
                      <Typography
                        sx={{ fontSize: "0.8rem", fontWeight: 700, color }}
                      >
                        {role}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          autoLogin(email, password);
                        }}
                        sx={{
                          py: 0.25,
                          px: 1,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          borderColor: color,
                          color,
                          "&:hover": { bgcolor: `${color}10` },
                        }}
                      >
                        Auto-login
                      </Button>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        fontFamily: "monospace",
                        mb: 0.5,
                      }}
                    >
                      📧 {email}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        fontFamily: "monospace",
                      }}
                    >
                      🔑 {password}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </motion.div>

          {error && (
            <motion.div variants={fadeUp}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>
                {error}
              </Alert>
            </motion.div>
          )}

          <motion.div variants={fadeUp}>
            <Stack spacing={2.5}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#374151",
                    mb: 0.875,
                  }}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  placeholder="ten@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color="#9ca3af" />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              <Box>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 0.875 }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "#374151",
                    }}
                  >
                    Mật khẩu
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      color: "#4f46e5",
                      cursor: "pointer",
                      fontWeight: 600,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Quên mật khẩu?
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#9ca3af" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{
                            color: "#9ca3af",
                            "&:hover": { color: "#4f46e5" },
                          }}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={loading}
                endIcon={!loading && <ArrowRight size={18} />}
                sx={{
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  borderRadius: 3,
                  py: 1.625,
                  fontWeight: 800,
                  fontSize: "1rem",
                  boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
                  "&:hover": {
                    boxShadow: "0 8px 28px rgba(79,70,229,0.5)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": { transform: "translateY(0)" },
                  transition: "all 0.2s ease",
                  mt: 0.5,
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </Stack>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Box
              sx={{ my: 3.5, display: "flex", alignItems: "center", gap: 2 }}
            >
              <Divider sx={{ flex: 1 }} />
              <Typography
                sx={{
                  color: "#9ca3af",
                  fontSize: "0.78rem",
                  whiteSpace: "nowrap",
                }}
              >
                hoặc tiếp tục với
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Stack spacing={1.5}>
              {[
                {
                  label: "Tiếp tục với Google",
                  bg: "#fff",
                  border: "#e2e8f0",
                  color: "#374151",
                  icon: "🔍",
                },
                {
                  label: "Tiếp tục với ORCID",
                  bg: "#a6ce39",
                  border: "#a6ce39",
                  color: "#fff",
                  icon: "🔬",
                },
              ].map(({ label, bg, border, color, icon }) => (
                <Button
                  key={label}
                  fullWidth
                  sx={{
                    py: 1.375,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    bgcolor: bg,
                    border: `1.5px solid ${border}`,
                    color,
                    "&:hover": {
                      bgcolor: bg === "#fff" ? "#f8fafc" : "#95bc30",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s",
                    boxShadow:
                      bg === "#fff" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <span style={{ fontSize: "1rem" }}>{icon}</span>
                    <span>{label}</span>
                  </Stack>
                </Button>
              ))}
            </Stack>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                Chưa có tài khoản?{" "}
                <Box
                  component="span"
                  onClick={() => onNavigate("register")}
                  sx={{
                    color: "#4f46e5",
                    fontWeight: 700,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Đăng ký miễn phí
                </Box>
              </Typography>
            </Box>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeUp}>
            <Stack
              direction="row"
              justifyContent="center"
              spacing={3}
              sx={{ mt: 4, pt: 4, borderTop: "1px solid #f1f5f9" }}
            >
              {[
                { icon: Shield, text: "Bảo mật SSL" },
                { icon: Lock, text: "Mã hóa E2E" },
                { icon: CheckCircle, text: "GDPR tuân thủ" },
              ].map(({ icon: Icon, text }) => (
                <Stack key={text} alignItems="center" spacing={0.5}>
                  <Icon size={16} color="#94a3b8" />
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      fontSize: "0.72rem",
                      fontWeight: 500,
                    }}
                  >
                    {text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
}

// Mini stats grid for the left panel
function Grid3() {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5 }}>
      {[
        { value: "52K+", label: "Bài báo", color: "#818cf8" },
        { value: "12K+", label: "Thành viên", color: "#67e8f9" },
        { value: "98%", label: "Hài lòng", color: "#6ee7b7" },
      ].map(({ value, label, color }) => (
        <Box
          key={label}
          sx={{
            p: 2,
            bgcolor: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.07)",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{ color, fontWeight: 900, fontSize: "1.3rem", lineHeight: 1 }}
          >
            {value}
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.72rem",
              mt: 0.5,
            }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
