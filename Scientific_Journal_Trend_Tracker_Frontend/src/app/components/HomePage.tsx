import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "motion/react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Search,
  TrendingUp,
  BookOpen,
  Users,
  Shield,
  BarChart2,
  ArrowRight,
  Star,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  Zap,
  Globe,
  Award,
  Database,
  FlaskConical,
  GraduationCap,
  UserCog,
  Quote,
  Mail,
  ArrowUpRight,
  Github,
  Twitter,
  Linkedin,
  Sparkles,
  FileText,
  Bell,
  Lock,
} from "lucide-react";
import PublicHeader from "./PublicHeader";

interface HomePageProps {
  onNavigate: (page: "home" | "login" | "register" | "dashboard" | "features" | "how-it-works" | "reviews") => void;
  isLoggedIn?: boolean;
  currentRole?: string;
  onLogout?: () => void;
}

// ── Animated counter hook ──────────────────────────────────────────────────
function useCountUp(target: number, duration = 2200, trigger = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let frame: number;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [trigger, target, duration]);
  return count;
}

function AnimatedStat({
  value,
  suffix,
  label,
  icon: Icon,
  color,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: any;
  color: string;
}) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, 2000, started);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ textAlign: "center", p: 3 }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${color}22, ${color}11)`,
            border: `1px solid ${color}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <Icon size={28} color={color} />
        </Box>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: "2.25rem",
            color: "#0f172a",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {count.toLocaleString()}
          {suffix}
        </Typography>
        <Typography
          sx={{
            color: "#64748b",
            mt: 0.75,
            fontWeight: 500,
            fontSize: "0.95rem",
          }}
        >
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

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
        opacity: 0.25,
        pointerEvents: "none",
      }}
      animate={{ y: [0, -28, 0], scale: [1, 1.07, 1] }}
      transition={{
        duration: 7 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

const STATS = [
  {
    value: 52000,
    suffix: "+",
    label: "Bài báo khoa học",
    icon: BookOpen,
    color: "#4f46e5",
  },
  {
    value: 12400,
    suffix: "+",
    label: "Nhà nghiên cứu",
    icon: Users,
    color: "#06b6d4",
  },
  {
    value: 680,
    suffix: "+",
    label: "Tổ chức học thuật",
    icon: Globe,
    color: "#10b981",
  },
  {
    value: 98,
    suffix: "%",
    label: "Độ hài lòng",
    icon: Star,
    color: "#f59e0b",
  },
];

const FEATURES = [
  {
    icon: FlaskConical,
    role: "Nhà nghiên cứu",
    color: "#4f46e5",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    title: "Theo dõi xu hướng nghiên cứu",
    description:
      "Khám phá các chủ đề nóng, phân tích trích dẫn và kết nối với cộng đồng nghiên cứu toàn cầu theo thời gian thực.",
    items: [
      "Biểu đồ xu hướng tương tác",
      "Phân tích mạng lưới trích dẫn",
      "Cảnh báo từ khóa thông minh",
      "Kết nối tác giả & đồng nghiệp",
    ],
  },
  {
    icon: GraduationCap,
    role: "Giảng viên & Sinh viên",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    title: "Hỗ trợ học tập & giảng dạy",
    description:
      "Tìm kiếm tài liệu học thuật chất lượng cao, tổ chức danh sách đọc và chia sẻ tài nguyên với học viên dễ dàng.",
    items: [
      "Bộ lọc tìm kiếm nâng cao",
      "Danh sách đọc & bookmarks",
      "Xuất tài liệu tham khảo",
      "Chia sẻ bộ sưu tập",
    ],
  },
  {
    icon: UserCog,
    role: "Quản trị viên",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    title: "Quản lý hệ thống toàn diện",
    description:
      "Phân quyền người dùng chi tiết, giám sát hoạt động hệ thống và tổng hợp báo cáo thống kê trực quan.",
    items: [
      "Phân quyền đa cấp",
      "Báo cáo & thống kê",
      "Kiểm soát truy cập",
      "Giám sát API & hệ thống",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "PGS.TS Nguyễn Minh Tuấn",
    role: "Trưởng khoa CNTT, ĐH Bách Khoa HN",
    avatar: "N",
    color: "#4f46e5",
    text: "SciTrend đã thay đổi hoàn toàn cách tôi theo dõi các công bố mới. Tính năng phân tích xu hướng cực kỳ hữu ích cho nghiên cứu của tôi.",
    rating: 5,
  },
  {
    name: "ThS. Lê Thu Hà",
    role: "Giảng viên, ĐH Kinh tế Quốc dân",
    avatar: "L",
    color: "#06b6d4",
    text: "Bộ lọc tìm kiếm nâng cao giúp tôi tìm được tài liệu phù hợp cho từng môn học trong vài giây. Giao diện đẹp và dễ dùng.",
    rating: 5,
  },
  {
    name: "Trần Quốc Bảo",
    role: "NCS Tiến sĩ, ĐH Quốc gia TP.HCM",
    avatar: "T",
    color: "#10b981",
    text: "Là sinh viên nghiên cứu sinh, SciTrend là công cụ không thể thiếu. Tính năng bookmarks và following giúp tôi luôn cập nhật lĩnh vực của mình.",
    rating: 5,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Đăng ký tài khoản",
    desc: "Tạo tài khoản miễn phí và chọn vai trò phù hợp với bạn — nhà nghiên cứu, giảng viên, hay sinh viên.",
    icon: Users,
  },
  {
    step: "02",
    title: "Khám phá & Tìm kiếm",
    desc: "Sử dụng bộ lọc thông minh để tìm kiếm hàng chục nghìn bài báo khoa học từ các nguồn uy tín.",
    icon: Search,
  },
  {
    step: "03",
    title: "Phân tích & Theo dõi",
    desc: "Xem biểu đồ xu hướng, theo dõi tác giả và chủ đề yêu thích với cập nhật theo thời gian thực.",
    icon: BarChart2,
  },
  {
    step: "04",
    title: "Quản lý & Chia sẻ",
    desc: "Tổ chức thư viện cá nhân, xuất danh sách tài liệu và chia sẻ với cộng đồng học thuật.",
    icon: Database,
  },
];

const UNIVERSITIES = [
  "ĐH Bách Khoa Hà Nội",
  "ĐH Quốc gia TP.HCM",
  "ĐH Kinh tế Quốc dân",
  "ĐH Khoa học Tự nhiên",
  "ĐH Y Hà Nội",
  "ĐH Đà Nẵng",
  "ĐH Cần Thơ",
  "Viện CNTT - VAST",
  "ĐH FPT",
];

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HomePage({
  onNavigate,
  isLoggedIn = false,
  currentRole = "Researcher",
  onLogout,
}: HomePageProps) {
  const [email, setEmail] = useState("");

  return (
    <Box sx={{ bgcolor: "#ffffff", overflowX: "hidden" }}>
      {/* Shared Navbar */}
      <PublicHeader
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        currentRole={currentRole}
        onLogout={onLogout}
        activePage="home"
      />

      {/* ─── HERO ─── */}
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0c4a6e 100%)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          pt: 9,
        }}
      >
        <FloatingOrb size={700} color="#4f46e5" x="-15%" y="5%" delay={0} />
        <FloatingOrb size={500} color="#06b6d4" x="55%" y="45%" delay={2} />
        <FloatingOrb size={350} color="#7c3aed" x="75%" y="-15%" delay={1} />
        <FloatingOrb size={300} color="#0891b2" x="20%" y="70%" delay={3} />

        {/* Grid pattern */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Vignette */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 6, alignItems: "center" }}>
            <Box>
              <motion.div variants={stagger} initial="hidden" animate="visible">
                <motion.div variants={fadeUp}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                      px: 2,
                      py: 0.75,
                      borderRadius: 6,
                      bgcolor: "rgba(79,70,229,0.2)",
                      border: "1px solid rgba(165,180,252,0.3)",
                    }}
                  >
                    <Sparkles size={14} color="#a5b4fc" />
                    <Typography
                      sx={{
                        color: "#a5b4fc",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      Nền tảng nghiên cứu thế hệ mới
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Typography
                    variant="h1"
                    sx={{
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: { xs: "2.75rem", md: "4rem" },
                      lineHeight: 1.08,
                      mb: 3,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Khám phá tri thức{" "}
                    <Box
                      component="span"
                      sx={{
                        background:
                          "linear-gradient(135deg, #818cf8 0%, #67e8f9 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        display: "block",
                      }}
                    >
                      khoa học không giới hạn
                    </Box>
                  </Typography>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "1.1rem",
                      lineHeight: 1.85,
                      mb: 5,
                      maxWidth: 480,
                    }}
                  >
                    Nền tảng quản lý bài báo khoa học thông minh dành cho nhà
                    nghiên cứu, giảng viên và sinh viên — tìm kiếm, phân tích và
                    theo dõi xu hướng hiệu quả hơn bao giờ hết.
                  </Typography>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ mb: 5 }}
                  >
                    {!isLoggedIn ? (
                      <Button
                        onClick={() => onNavigate("register")}
                        variant="contained"
                        size="large"
                        endIcon={<ArrowRight size={18} />}
                        sx={{
                          background:
                            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                          px: 4,
                          py: 1.875,
                          borderRadius: 3,
                          fontWeight: 700,
                          fontSize: "1rem",
                          boxShadow: "0 8px 32px rgba(79,70,229,0.5)",
                          "&:hover": {
                            boxShadow: "0 12px 40px rgba(79,70,229,0.65)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.25s ease",
                        }}
                      >
                        Đăng ký ngay
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onNavigate("dashboard")}
                        variant="contained"
                        size="large"
                        endIcon={<ArrowRight size={18} />}
                        sx={{
                          background:
                            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                          px: 4,
                          py: 1.875,
                          borderRadius: 3,
                          fontWeight: 700,
                          fontSize: "1rem",
                          boxShadow: "0 8px 32px rgba(79,70,229,0.5)",
                          "&:hover": {
                            boxShadow: "0 12px 40px rgba(79,70,229,0.65)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.25s ease",
                        }}
                      >
                        Đi đến Dashboard
                      </Button>
                    )}
                  </Stack>
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Stack direction="row" flexWrap="wrap" gap={2.5}>
                    {[
                      { icon: CheckCircle, text: "Miễn phí hoàn toàn" },
                      { icon: CheckCircle, text: "Không cần thẻ tín dụng" },
                      { icon: CheckCircle, text: "Cài đặt trong 2 phút" },
                    ].map(({ icon: Icon, text }) => (
                      <Stack
                        key={text}
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                      >
                        <Icon size={15} color="#10b981" />
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "0.85rem",
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

            {/* Hero Card */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  duration: 0.9,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.07)",
                      backdropFilter: "blur(24px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "20px",
                      p: 3,
                      boxShadow:
                        "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Window chrome */}
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={3}
                    >
                      {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
                        <Box
                          key={c}
                          sx={{
                            width: 11,
                            height: 11,
                            borderRadius: "50%",
                            bgcolor: c,
                          }}
                        />
                      ))}
                      <Box
                        sx={{
                          flex: 1,
                          height: 26,
                          bgcolor: "rgba(255,255,255,0.07)",
                          borderRadius: 2,
                          ml: 1,
                          display: "flex",
                          alignItems: "center",
                          px: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: "0.7rem",
                          }}
                        >
                          dashboard.scitrend.vn
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Stats row */}
                    <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
                      {[
                        {
                          label: "Bài báo mới hôm nay",
                          value: "2,847",
                          color: "#818cf8",
                          trend: "+12%",
                        },
                        {
                          label: "Đang theo dõi",
                          value: "142",
                          color: "#67e8f9",
                          trend: "+5%",
                        },
                        {
                          label: "Trích dẫn tháng này",
                          value: "18.3K",
                          color: "#6ee7b7",
                          trend: "+8%",
                        },
                      ].map(({ label, value, color, trend }) => (
                        <Box
                          key={label}
                          sx={{
                            bgcolor: "rgba(255,255,255,0.05)",
                            borderRadius: "10px",
                            p: 1.5,
                            textAlign: "center",
                            border: "1px solid rgba(255,255,255,0.06)",
                            flex: 1,
                          }}
                        >
                            <Typography
                              sx={{
                                color,
                                fontWeight: 800,
                                fontSize: "1.15rem",
                                lineHeight: 1,
                              }}
                            >
                              {value}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#10b981",
                                fontSize: "0.65rem",
                                fontWeight: 600,
                                mb: 0.25,
                              }}
                            >
                              {trend}
                            </Typography>
                            <Typography
                              sx={{
                                color: "rgba(255,255,255,0.4)",
                                fontSize: "0.68rem",
                                lineHeight: 1.3,
                              }}
                            >
                              {label}
                            </Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Chart */}
                    <Box sx={{ mb: 2.5 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: "0.75rem",
                            fontWeight: 500,
                          }}
                        >
                          Xu hướng bài báo theo tháng
                        </Typography>
                        <Chip
                          label="2026"
                          size="small"
                          sx={{
                            bgcolor: "rgba(79,70,229,0.3)",
                            color: "#a5b4fc",
                            fontSize: "0.65rem",
                            height: 18,
                            borderRadius: 1,
                          }}
                        />
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="flex-end"
                        spacing={0.5}
                        sx={{ height: 72 }}
                      >
                        {[38, 62, 48, 75, 68, 88, 72, 92, 82, 97, 86, 100].map(
                          (h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{
                                duration: 0.7,
                                delay: 0.6 + i * 0.05,
                                ease: "easeOut",
                              }}
                              style={{
                                flex: 1,
                                background:
                                  i === 11
                                    ? "linear-gradient(180deg, #818cf8, #4f46e5)"
                                    : i >= 9
                                      ? "rgba(129,140,248,0.35)"
                                      : "rgba(255,255,255,0.1)",
                                borderRadius: "4px 4px 0 0",
                              }}
                            />
                          ),
                        )}
                      </Stack>
                    </Box>

                    {/* Recent papers */}
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        mb: 1.5,
                      }}
                    >
                      Bài báo gần đây
                    </Typography>
                    {[
                      {
                        title: "Large Language Models in Medical Research",
                        tag: "AI/ML",
                        color: "#818cf8",
                      },
                      {
                        title: "Quantum Computing Applications in Optimization",
                        tag: "Quantum",
                        color: "#67e8f9",
                      },
                      {
                        title: "Deep Learning for Vietnamese NLP Tasks",
                        tag: "NLP",
                        color: "#6ee7b7",
                      },
                    ].map(({ title, tag, color }, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          py: 1,
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            bgcolor: color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          sx={{
                            color: "rgba(255,255,255,0.75)",
                            fontSize: "0.76rem",
                            flex: 1,
                          }}
                          noWrap
                        >
                          {title}
                        </Typography>
                        <Chip
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: `${color}22`,
                            color,
                            fontSize: "0.62rem",
                            height: 18,
                            borderRadius: 1,
                            flexShrink: 0,
                          }}
                        />
                      </Box>
                    ))}
                  </Box>

                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ position: "absolute", top: -24, right: -16 }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#10b981",
                        color: "#fff",
                        borderRadius: "12px",
                        px: 2,
                        py: 1,
                        boxShadow: "0 8px 24px rgba(16,185,129,0.5)",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Zap size={14} />
                        <Typography
                          sx={{ fontSize: "0.8rem", fontWeight: 700 }}
                        >
                          +1,200 papers/ngày
                        </Typography>
                      </Stack>
                    </Box>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    }}
                    style={{ position: "absolute", bottom: -20, left: -28 }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#fff",
                        borderRadius: "12px",
                        px: 2,
                        py: 1,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Database size={14} color="#4f46e5" />
                        <Typography
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: "#0f172a",
                          }}
                        >
                          52K+ bài báo
                        </Typography>
                      </Stack>
                    </Box>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                    style={{ position: "absolute", top: "40%", right: -32 }}
                  >
                    <Box
                      sx={{
                        bgcolor: "rgba(79,70,229,0.95)",
                        borderRadius: "12px",
                        px: 1.75,
                        py: 1,
                        boxShadow: "0 8px 24px rgba(79,70,229,0.4)",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        <Bell size={12} color="#fff" />
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          Thông báo mới
                        </Typography>
                      </Stack>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown size={28} color="rgba(255,255,255,0.35)" />
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* ─── STATS (animated) ─── */}
      <Box
        sx={{
          py: 10,
          bgcolor: "#f8fafc",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(#e0e7ff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="Con số ấn tượng"
                sx={{
                  mb: 2,
                  bgcolor: "#eef2ff",
                  color: "#4f46e5",
                  fontWeight: 600,
                  borderRadius: 6,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Được tin dùng bởi cộng đồng học thuật
              </Typography>
            </Box>
          </motion.div>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 3 }}>
            {STATS.map((stat) => (
              <Box component="div" key={stat.label}>
                <AnimatedStat {...stat} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ─── TRUSTED BY ─── */}
      <Box
        sx={{
          py: 7,
          bgcolor: "#fff",
          borderTop: "1px solid #f1f5f9",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              mb: 4,
            }}
          >
            Tin dùng bởi các trường đại học & viện nghiên cứu
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {UNIVERSITIES.map((uni, i) => (
              <motion.div
                key={uni}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    borderRadius: "10px",
                    border: "1.5px solid #e2e8f0",
                    bgcolor: "#f8fafc",
                    cursor: "default",
                    "&:hover": { borderColor: "#c7d2fe", bgcolor: "#eef2ff" },
                    transition: "all 0.2s",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#475569",
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {uni}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ─── FEATURES ─── */}
      <Box sx={{ py: 12, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="Tính năng nổi bật"
                sx={{
                  mb: 2,
                  bgcolor: "#eef2ff",
                  color: "#4f46e5",
                  fontWeight: 600,
                  borderRadius: 6,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  mb: 2,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Được thiết kế cho từng đối tượng
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  maxWidth: 540,
                  mx: "auto",
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                }}
              >
                Mỗi nhóm người dùng đều có bộ công cụ riêng biệt, tối ưu hóa cho
                nhu cầu và quy trình làm việc của họ.
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
            {FEATURES.map(
              (
                {
                  icon: Icon,
                  role,
                  color,
                  gradient,
                  title,
                  description,
                  items,
                },
                idx,
              ) => (
                <Box component="div" key={role}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: idx * 0.12,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        borderRadius: "20px",
                        border: "1.5px solid #f1f5f9",
                        bgcolor: "#fff",
                        p: 4,
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: color,
                          boxShadow: `0 20px 60px ${color}20`,
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      {/* Gradient top bar */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          background: gradient,
                        }}
                      />

                      {/* Background glow */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: -60,
                          right: -60,
                          width: 200,
                          height: 200,
                          borderRadius: "50%",
                          background: gradient,
                          opacity: 0.06,
                          filter: "blur(40px)",
                          pointerEvents: "none",
                        }}
                      />

                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "16px",
                          background: gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                          boxShadow: `0 8px 28px ${color}45`,
                        }}
                      >
                        <Icon size={28} color="#fff" />
                      </Box>

                      <Chip
                        label={role}
                        size="small"
                        sx={{
                          mb: 2,
                          bgcolor: `${color}12`,
                          color,
                          fontWeight: 600,
                          borderRadius: 5,
                          border: `1px solid ${color}22`,
                        }}
                      />

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#0f172a",
                          mb: 1.5,
                          lineHeight: 1.3,
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#64748b",
                          lineHeight: 1.85,
                          mb: 3,
                          fontSize: "0.9rem",
                        }}
                      >
                        {description}
                      </Typography>

                      <Stack spacing={1.25}>
                        {items.map((item) => (
                          <Stack
                            key={item}
                            direction="row"
                            alignItems="center"
                            spacing={1.25}
                          >
                            <Box
                              sx={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                bgcolor: `${color}15`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <CheckCircle size={13} color={color} />
                            </Box>
                            <Typography
                              sx={{
                                fontSize: "0.875rem",
                                color: "#374151",
                                fontWeight: 500,
                              }}
                            >
                              {item}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </motion.div>
                </Box>
              ),
            )}
          </Box>
        </Container>
      </Box>

      {/* ─── HOW IT WORKS ─── */}
      <Box
        sx={{
          py: 12,
          background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="Cách hoạt động"
                sx={{
                  mb: 2,
                  bgcolor: "#ecfdf5",
                  color: "#10b981",
                  fontWeight: 600,
                  borderRadius: 6,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Bắt đầu chỉ trong 4 bước
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 4 }}>
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, idx) => (
              <Box component="div" key={step}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.5 }}
                >
                  <Box sx={{ textAlign: "center", position: "relative" }}>
                    {idx < HOW_IT_WORKS.length - 1 && (
                      <Box
                        sx={{
                          display: { xs: "none", md: "block" },
                          position: "absolute",
                          top: 30,
                          left: "62%",
                          right: "-18%",
                          height: 2,
                          background:
                            "linear-gradient(90deg, #4f46e5, rgba(79,70,229,0.08))",
                          zIndex: 0,
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            right: -8,
                            top: -5,
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "rgba(79,70,229,0.2)",
                          }}
                        />
                      </Box>
                    )}
                    <Box
                      sx={{
                        width: 62,
                        height: 62,
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2.5,
                        position: "relative",
                        zIndex: 1,
                        boxShadow: "0 8px 24px rgba(79,70,229,0.35)",
                      }}
                    >
                      <Icon size={26} color="#fff" />
                    </Box>
                    <Chip
                      label={step}
                      size="small"
                      sx={{
                        mb: 1.5,
                        bgcolor: "#eef2ff",
                        color: "#4f46e5",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        borderRadius: 4,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#0f172a",
                        mb: 1,
                        fontSize: "1rem",
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#64748b",
                        fontSize: "0.875rem",
                        lineHeight: 1.75,
                        px: 1,
                      }}
                    >
                      {desc}
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ─── TESTIMONIALS ─── */}
      <Box
        sx={{
          py: 12,
          bgcolor: "#0f172a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(79,70,229,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />
        <FloatingOrb size={500} color="#4f46e5" x="-10%" y="20%" delay={0} />
        <FloatingOrb size={400} color="#06b6d4" x="70%" y="50%" delay={2} />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Chip
                label="Đánh giá người dùng"
                sx={{
                  mb: 2,
                  bgcolor: "rgba(79,70,229,0.2)",
                  color: "#a5b4fc",
                  fontWeight: 600,
                  borderRadius: 6,
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: "#fff",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Được tin dùng bởi hàng nghìn nhà nghiên cứu
              </Typography>
            </Box>
          </motion.div>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
            {TESTIMONIALS.map(
              ({ name, role, avatar, color, text, rating }, idx) => (
                <Box component="div" key={name}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.12, duration: 0.6 }}
                  >
                    <Box
                      sx={{
                        bgcolor: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "20px",
                        p: 4,
                        height: "100%",
                        backdropFilter: "blur(12px)",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.07)",
                          borderColor: `${color}40`,
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: `linear-gradient(90deg, ${color}, transparent)`,
                        }}
                      />
                      <Quote
                        size={32}
                        color={color}
                        style={{ opacity: 0.4, marginBottom: 16 }}
                      />
                      <Stack direction="row" spacing={0.5} mb={2.5}>
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill="#f59e0b"
                            color="#f59e0b"
                          />
                        ))}
                      </Stack>
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.85)",
                          lineHeight: 1.85,
                          mb: 3.5,
                          fontSize: "0.95rem",
                          fontStyle: "italic",
                        }}
                      >
                        "{text}"
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            bgcolor: color,
                            width: 44,
                            height: 44,
                            fontWeight: 700,
                            fontSize: "1rem",
                          }}
                        >
                          {avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: "0.9rem",
                            }}
                          >
                            {name}
                          </Typography>
                          <Typography
                            sx={{
                              color: "rgba(255,255,255,0.45)",
                              fontSize: "0.78rem",
                              mt: 0.25,
                            }}
                          >
                            {role}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </motion.div>
                </Box>
              ),
            )}
          </Box>
        </Container>
      </Box>

      {/* ─── CTA ─── */}
      <Box
        sx={{
          py: 14,
          background:
            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />
        <FloatingOrb size={500} color="#fff" x="60%" y="-20%" delay={0} />
        <FloatingOrb size={400} color="#fff" x="-10%" y="60%" delay={1} />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Chip
                label="Miễn phí · Không cần thẻ tín dụng"
                sx={{
                  mb: 3,
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: 6,
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  color: "#fff",
                  fontWeight: 900,
                  mb: 2,
                  fontSize: { xs: "2rem", md: "2.875rem" },
                  letterSpacing: "-0.02em",
                }}
              >
                Sẵn sàng bắt đầu hành trình nghiên cứu?
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "1.1rem",
                  mb: 6,
                  lineHeight: 1.8,
                  maxWidth: 540,
                  mx: "auto",
                }}
              >
                Tham gia cùng hơn 12,400 nhà nghiên cứu đang sử dụng SciTrend để
                nâng cao hiệu quả nghiên cứu mỗi ngày.
              </Typography>

              {/* Email signup */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  maxWidth: 480,
                  mx: "auto",
                  mb: 4,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color="#9ca3af" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    flex: 1,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fff",
                      borderRadius: 3,
                      height: 52,
                      "& fieldset": { border: "none" },
                    },
                  }}
                />
                <Button
                  onClick={() => onNavigate("register")}
                  variant="contained"
                  sx={{
                    bgcolor: "#0f172a",
                    color: "#fff",
                    fontWeight: 700,
                    px: 3,
                    borderRadius: 3,
                    height: 52,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    "&:hover": { bgcolor: "#1e293b" },
                  }}
                >
                  Đăng ký ngay
                </Button>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
              >
                {["Miễn phí hoàn toàn", "Không spam", "Hủy bất kỳ lúc nào"].map(
                  (t) => (
                    <Stack
                      key={t}
                      direction="row"
                      alignItems="center"
                      spacing={0.75}
                    >
                      <CheckCircle size={14} color="rgba(255,255,255,0.8)" />
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.8)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {t}
                      </Typography>
                    </Stack>
                  ),
                )}
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ─── FOOTER ─── */}
      <Box
        sx={{
          bgcolor: "#0a0f1e",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Container maxWidth="lg">
          {/* Top footer */}
          <Box sx={{ py: 8 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 6 }}>
              <Box component="div">
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #4f46e5, #06b6d4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TrendingUp size={18} color="#fff" />
                  </Box>
                  <Typography
                    sx={{ fontWeight: 800, color: "#fff", fontSize: "1.15rem" }}
                  >
                    SciTrend
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.875rem",
                    lineHeight: 1.8,
                    mb: 3,
                    maxWidth: 280,
                  }}
                >
                  Nền tảng quản lý bài báo khoa học thông minh cho cộng đồng học
                  thuật Việt Nam và quốc tế.
                </Typography>
                <Stack direction="row" spacing={1}>
                  {[Twitter, Github, Linkedin].map((Icon, i) => (
                    <IconButton
                      key={i}
                      size="small"
                      sx={{
                        color: "rgba(255,255,255,0.3)",
                        bgcolor: "rgba(255,255,255,0.05)",
                        borderRadius: 1.5,
                        "&:hover": {
                          color: "#fff",
                          bgcolor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      <Icon size={16} />
                    </IconButton>
                  ))}
                </Stack>
              </Box>

              {[
                {
                  title: "Sản phẩm",
                  links: ["Tính năng", "Cách hoạt động", "Giá cả", "Changelog"],
                },
                {
                  title: "Tài nguyên",
                  links: [
                    "Tài liệu API",
                    "Blog học thuật",
                    "Hướng dẫn sử dụng",
                    "Cộng đồng",
                  ],
                },
                {
                  title: "Công ty",
                  links: [
                    "Về chúng tôi",
                    "Liên hệ",
                    "Chính sách bảo mật",
                    "Điều khoản sử dụng",
                  ],
                },
              ].map(({ title, links }) => (
                <Box component="div" key={title}>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      mb: 2.5,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {title}
                  </Typography>
                  <Stack spacing={1.5}>
                    {links.map((link) => (
                      <Typography
                        key={link}
                        sx={{
                          color: "rgba(255,255,255,0.38)",
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          "&:hover": { color: "rgba(255,255,255,0.8)" },
                          transition: "color 0.2s",
                        }}
                      >
                        {link}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bottom footer */}
          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
          <Box
            sx={{
              py: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Typography
              sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem" }}
            >
              © 2026 SciTrend. Tất cả quyền được bảo lưu.
            </Typography>
            <Stack direction="row" spacing={3}>
              {["Bảo mật", "Điều khoản", "Cookie"].map((item) => (
                <Typography
                  key={item}
                  sx={{
                    color: "rgba(255,255,255,0.25)",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    "&:hover": { color: "rgba(255,255,255,0.6)" },
                    transition: "color 0.2s",
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

