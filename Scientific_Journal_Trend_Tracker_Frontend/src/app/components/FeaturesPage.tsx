import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import {
  TrendingUp,
  Sparkles,
  BookOpen,
  Users,
  Globe,
  FlaskConical,
  GraduationCap,
  UserCog,
  CheckCircle,
  BarChart2,
  Database,
  Search,
  ArrowRight,
  Shield,
  Zap,
  Info,
  X,
} from "lucide-react";
import PublicHeader from "./PublicHeader";

interface FeaturesPageProps {
  onNavigate: (page: "home" | "login" | "register" | "dashboard" | "features" | "how-it-works" | "reviews") => void;
  isLoggedIn?: boolean;
  currentRole?: string;
  onLogout?: () => void;
}

const FEATURE_CATEGORIES = [
  {
    id: "researcher",
    label: "Nhà nghiên cứu",
    icon: FlaskConical,
    color: "#4f46e5",
    features: [
      {
        icon: TrendingUp,
        title: "Theo dõi xu hướng tương tác",
        desc: "Phân tích và dự báo các chủ đề nghiên cứu hot trong 3-5 năm tới bằng thuật toán AI.",
        details: ["Biểu đồ đường thời gian tương tác", "Phân tích từ khóa đột phá", "Dự báo tăng trưởng nghiên cứu"],
      },
      {
        icon: BarChart2,
        title: "Phân tích trích dẫn thông minh",
        desc: "Vẽ bản đồ mạng lưới trích dẫn giữa các tác giả và bài báo để phát hiện công trình nền tảng.",
        details: ["Bản đồ trích dẫn dạng đồ thị", "Tính toán tầm ảnh hưởng (Impact Factor)", "Danh sách đồng tác giả"],
      },
      {
        icon: Zap,
        title: "Cảnh báo từ khóa thời gian thực",
        desc: "Nhận thông báo ngay khi có công bố mới liên quan đến các từ khóa bạn đang theo dõi.",
        details: ["Thông báo qua Email & Telegram", "Tần suất cảnh báo tùy chỉnh", "Tóm tắt bài báo bằng AI"],
      },
    ],
  },
  {
    id: "academic",
    label: "Giảng viên & Sinh viên",
    icon: GraduationCap,
    color: "#06b6d4",
    features: [
      {
        icon: BookOpen,
        title: "Tìm kiếm học thuật nâng cao",
        desc: "Bộ lọc thông minh theo chỉ mục Scopus, ISI, năm xuất bản, tác giả và cơ sở đào tạo.",
        details: ["Lọc chỉ mục uy tín Scopus/ISI", "Tìm kiếm toàn văn hoặc tóm tắt", "Gợi ý từ khóa liên quan"],
      },
      {
        icon: Database,
        title: "Danh sách đọc & Quản lý thư viện",
        desc: "Tổ chức tài liệu nghiên cứu theo thư mục, gắn tag phân loại và ghi chú trực tiếp.",
        details: ["Bookmarks không giới hạn", "Tạo thư mục con thông minh", "Đồng bộ hóa đám mây"],
      },
      {
        icon: Globe,
        title: "Xuất trích dẫn đa định dạng",
        desc: "Tự động tạo trích dẫn chuẩn APA, MLA, Harvard, BibTeX chỉ bằng một cú nhấp chuột.",
        details: ["Hỗ trợ APA, MLA, Harvard", "Xuất file .bib cho LaTeX", "Tích hợp Zotero/Mendeley"],
      },
    ],
  },
  {
    id: "admin",
    label: "Quản trị viên",
    icon: UserCog,
    color: "#10b981",
    features: [
      {
        icon: Shield,
        title: "Phân quyền người dùng chi tiết",
        desc: "Hệ thống phân quyền đa cấp, quản lý tài khoản theo tổ chức hoặc cá nhân.",
        details: ["Phân quyền Researcher/Lecturer/Student", "Quản lý theo tên miền email tổ chức", "Khóa/mở khóa tài khoản hàng loạt"],
      },
      {
        icon: Users,
        title: "Giám sát hệ thống & API",
        desc: "Báo cáo hiệu năng hệ thống, số lượng request API và tài nguyên sử dụng.",
        details: ["Bảng điều khiển giám sát API", "Nhật ký hoạt động của người dùng (Audit Log)", "Cảnh báo quá tải hệ thống"],
      },
      {
        icon: Info,
        title: "Tổng hợp dữ liệu & Báo cáo",
        desc: "Xuất báo cáo thống kê xu hướng xuất bản khoa học của toàn đơn vị/viện nghiên cứu.",
        details: ["Xuất file PDF/Excel tùy chỉnh", "Thống kê số lượng trích dẫn toàn viện", "Biểu đồ so sánh giữa các khoa"],
      },
    ],
  },
];

const COMPARISON_ROWS = [
  { feature: "Tìm kiếm bài báo cơ bản", free: true, pro: true, enterprise: true },
  { feature: "Phân tích biểu đồ xu hướng", free: "Cơ bản", pro: "Nâng cao", enterprise: "Không giới hạn" },
  { feature: "Số lượng Bookmarks/Thư viện", free: "Tối đa 100", pro: "Không giới hạn", enterprise: "Không giới hạn" },
  { feature: "Cảnh báo từ khóa AI", free: false, pro: "Tối đa 5", enterprise: "Không giới hạn" },
  { feature: "Xuất trích dẫn (APA, BibTeX...)", free: true, pro: true, enterprise: true },
  { feature: "Xuất báo cáo thống kê phân tích", free: false, pro: "Chỉ PDF", enterprise: "PDF, Excel, API" },
  { feature: "Tích hợp API hệ thống", free: false, pro: false, enterprise: true },
  { feature: "Hỗ trợ kỹ thuật 24/7", free: false, pro: "Email", enterprise: "Điện thoại & Email riêng" },
];

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
        opacity: 0.15,
        pointerEvents: "none",
      }}
      animate={{ y: [0, -25, 0], scale: [1, 1.05, 1] }}
      transition={{
        duration: 8 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

export default function FeaturesPage({
  onNavigate,
  isLoggedIn = false,
  currentRole = "Researcher",
  onLogout,
}: FeaturesPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (_: any, newValue: number) => {
    setActiveTab(newValue);
  };

  // Filter features based on search query
  const filteredCategories = FEATURE_CATEGORIES.map((cat) => {
    const matchedFeatures = cat.features.filter(
      (feat) =>
        feat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return { ...cat, features: matchedFeatures };
  }).filter((cat) => cat.features.length > 0);

  const selectedCategory = FEATURE_CATEGORIES[activeTab];

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Shared Navbar */}
      <PublicHeader
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        currentRole={currentRole}
        onLogout={onLogout}
        activePage="features"
      />

      {/* ─── HERO SECTION ─── */}
      <Box
        sx={{
          minHeight: "45vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0891b2 100%)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 12,
          pb: 6,
        }}
      >
        <FloatingOrb size={450} color="#4f46e5" x="-10%" y="10%" delay={0} />
        <FloatingOrb size={350} color="#06b6d4" x="70%" y="30%" delay={2} />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg" sx={{ zIndex: 2, textAlign: "center" }}>
          <Chip
            icon={<Sparkles size={14} color="#a5b4fc" />}
            label="Khám Phá Các Tính Năng"
            sx={{
              bgcolor: "rgba(79,70,229,0.2)",
              color: "#a5b4fc",
              fontWeight: 600,
              mb: 2.5,
              border: "1px solid rgba(165,180,252,0.3)",
              "& .MuiChip-icon": { color: "#a5b4fc" },
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "#fff",
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              mb: 3,
            }}
          >
            Tính Năng Vượt Trội Của{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #818cf8 0%, #67e8f9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SciTrend
            </Box>
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              maxWidth: 600,
              mx: "auto",
              mb: 4,
            }}
          >
            Đầy đủ công cụ giúp bạn tìm kiếm tài liệu học thuật, phân tích dữ liệu, vẽ biểu đồ xu hướng và quản lý thư viện khoa học trực quan.
          </Typography>

          {/* Search bar inside Hero */}
          <Box sx={{ maxWidth: 500, mx: "auto" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm tính năng nhanh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#94a3b8" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery("")}>
                      <X size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  transition: "all 0.25s",
                  "& fieldset": { border: "none" },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.25)",
                  },
                  "&.Mui-focused": {
                    bgcolor: "#fff",
                    color: "#0f172a",
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
                    "& .MuiSvgIcon-root": { color: "#4f46e5" },
                  },
                },
                "& input": { py: 1.75, px: 2, fontSize: "0.95rem" },
                "& input::placeholder": { color: "rgba(255,255,255,0.5)", opacity: 1 },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* ─── INTERACTIVE FEATURES DISPLAY ─── */}
      <Box sx={{ py: 10, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          {searchQuery ? (
            // Search Results Mode
            <Box>
              <Typography sx={{ mb: 4, fontWeight: 700, color: "#64748b" }}>
                Kết quả tìm kiếm cho: "{searchQuery}" ({filteredCategories.reduce((acc, c) => acc + c.features.length, 0)} kết quả)
              </Typography>
              {filteredCategories.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography sx={{ color: "#94a3b8", fontSize: "1.1rem" }}>
                    Không tìm thấy tính năng nào khớp với từ khóa tìm kiếm.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={6}>
                  {filteredCategories.map((cat) => (
                    <Box key={cat.id}>
                      <Chip
                        label={cat.label}
                        sx={{
                          mb: 3,
                          bgcolor: `${cat.color}15`,
                          color: cat.color,
                          fontWeight: 700,
                        }}
                      />
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
                        {cat.features.map((feat) => {
                          const Icon = feat.icon;
                          return (
                            <Card key={feat.title} sx={{ borderRadius: 4, height: "100%", display: "flex", flexDirection: "column" }}>
                              <CardContent sx={{ p: 4, flexGrow: 1 }}>
                                <Box
                                  sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: "14px",
                                    bgcolor: `${cat.color}12`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 2.5,
                                  }}
                                >
                                  <Icon size={24} color={cat.color} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.5, fontSize: "1.05rem" }}>
                                  {feat.title}
                                </Typography>
                                <Typography sx={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.7, mb: 3 }}>
                                  {feat.desc}
                                </Typography>
                                <Stack spacing={1}>
                                  {feat.details.map((detail) => (
                                    <Stack key={detail} direction="row" spacing={1} alignItems="center">
                                      <CheckCircle size={14} color={cat.color} />
                                      <Typography sx={{ fontSize: "0.8rem", color: "#374151", fontWeight: 500 }}>
                                        {detail}
                                      </Typography>
                                    </Stack>
                                  ))}
                                </Stack>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          ) : (
            // Tabs Mode (Standard)
            <Box>
              {/* Tab Selector */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 6 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  centered
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 4,
                    p: 0.75,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)",
                    "& .MuiTabs-indicator": {
                      height: "100%",
                      borderRadius: 3.5,
                      bgcolor: `${selectedCategory.color}12`,
                      border: `1.5px solid ${selectedCategory.color}35`,
                      zIndex: 1,
                    },
                  }}
                >
                  {FEATURE_CATEGORIES.map((cat, idx) => {
                    const CatIcon = cat.icon;
                    const isActive = activeTab === idx;
                    return (
                      <Tab
                        key={cat.id}
                        icon={<CatIcon size={18} />}
                        iconPosition="start"
                        label={cat.label}
                        sx={{
                          borderRadius: 3.5,
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          px: { xs: 2, sm: 4 },
                          py: 1.5,
                          color: isActive ? cat.color : "#64748b",
                          zIndex: 2,
                          textTransform: "none",
                          minHeight: 0,
                          transition: "color 0.25s",
                          "&.Mui-selected": {
                            color: cat.color,
                          },
                        }}
                      />
                    );
                  })}
                </Tabs>
              </Box>

              {/* Tab Panel Contents */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 4 }}>
                    {selectedCategory.features.map((feat, idx) => {
                      const Icon = feat.icon;
                      return (
                        <Box
                          component={motion.div}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.08, duration: 0.4 }}
                          key={feat.title}
                        >
                          <Card
                            sx={{
                              borderRadius: 5,
                              height: "100%",
                              bgcolor: "#fff",
                              border: "1.5px solid #f1f5f9",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                borderColor: selectedCategory.color,
                                boxShadow: `0 20px 48px ${selectedCategory.color}15`,
                                transform: "translateY(-4px)",
                              },
                            }}
                          >
                            <CardContent sx={{ p: 4 }}>
                              <Box
                                sx={{
                                  width: 54,
                                  height: 54,
                                  borderRadius: "16px",
                                  bgcolor: `${selectedCategory.color}12`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  mb: 3,
                                  boxShadow: `0 4px 14px ${selectedCategory.color}20`,
                                }}
                              >
                                <Icon size={24} color={selectedCategory.color} />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.75, fontSize: "1.05rem" }}>
                                {feat.title}
                              </Typography>
                              <Typography sx={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.8, mb: 3 }}>
                                {feat.desc}
                              </Typography>

                              <Stack spacing={1.5} sx={{ borderTop: "1px dashed #f1f5f9", pt: 2.5 }}>
                                {feat.details.map((detail) => (
                                  <Stack key={detail} direction="row" spacing={1.25} alignItems="center">
                                    <CheckCircle size={14} color={selectedCategory.color} />
                                    <Typography sx={{ fontSize: "0.82rem", color: "#374151", fontWeight: 500 }}>
                                      {detail}
                                    </Typography>
                                  </Stack>
                                ))}
                              </Stack>
                            </CardContent>
                          </Card>
                        </Box>
                      );
                    })}
                  </Box>
                </motion.div>
              </AnimatePresence>
            </Box>
          )}
        </Container>
      </Box>

      {/* ─── DETAILED TIER COMPARISON ─── */}
      <Box sx={{ py: 12, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              label="So sánh gói dịch vụ"
              sx={{
                mb: 2,
                bgcolor: "#ecfdf5",
                color: "#10b981",
                fontWeight: 600,
                borderRadius: 5,
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a", mb: 2, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
              Lựa Chọn Gói Phù Hợp
            </Typography>
            <Typography sx={{ color: "#64748b", maxWidth: 540, mx: "auto", fontSize: "1rem" }}>
              Từ người dùng cá nhân tìm kiếm tài liệu đến các tổ chức/viện nghiên cứu quy mô lớn cần khai thác chuyên sâu.
            </Typography>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 5,
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
              border: "1px solid #f1f5f9",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: "1rem", py: 3, pl: 4, width: "40%" }}>Tính năng</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "1rem", py: 3, color: "#64748b" }}>Cơ bản (Free)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "1rem", py: 3, color: "#4f46e5" }}>Chuyên nghiệp (Pro)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "1rem", py: 3, color: "#10b981" }}>Tổ chức (Enterprise)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {COMPARISON_ROWS.map((row) => (
                  <TableRow key={row.feature} sx={{ "&:hover": { bgcolor: "#f8fafc" }, transition: "background 0.2s" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#374151", py: 2.25, pl: 4 }}>{row.feature}</TableCell>
                    <TableCell align="center" sx={{ py: 2.25 }}>
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <CheckCircle size={18} color="#10b981" style={{ margin: "auto" }} />
                        ) : (
                          <Typography sx={{ color: "#cbd5e1", fontWeight: 700 }}>-</Typography>
                        )
                      ) : (
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b" }}>{row.free}</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2.25, bgcolor: "rgba(79,70,229,0.01)" }}>
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <CheckCircle size={18} color="#4f46e5" style={{ margin: "auto" }} />
                        ) : (
                          <Typography sx={{ color: "#cbd5e1", fontWeight: 700 }}>-</Typography>
                        )
                      ) : (
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#4f46e5" }}>{row.pro}</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2.25 }}>
                      {typeof row.enterprise === "boolean" ? (
                        row.enterprise ? (
                          <CheckCircle size={18} color="#10b981" style={{ margin: "auto" }} />
                        ) : (
                          <Typography sx={{ color: "#cbd5e1", fontWeight: 700 }}>-</Typography>
                        )
                      ) : (
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#10b981" }}>{row.enterprise}</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* ─── CALL TO ACTION ─── */}
      <Box
        sx={{
          py: 10,
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%)",
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <FloatingOrb size={350} color="#4f46e5" x="70%" y="-10%" delay={0} />
        <FloatingOrb size={300} color="#06b6d4" x="-10%" y="40%" delay={3} />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: "-0.02em" }}>
            Sẵn Sàng Nâng Tầm Nghiên Cứu?
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 5, maxWidth: 520, mx: "auto", fontSize: "1.05rem", lineHeight: 1.75 }}>
            Tạo tài khoản SciTrend ngay hôm nay để bắt đầu trải nghiệm toàn bộ tính năng và khám phá kho tàng tri thức không giới hạn.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} justifyContent="center">
            <Button
              onClick={() => onNavigate("register")}
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: 2.5,
                fontWeight: 700,
                px: 4,
                py: 1.75,
                fontSize: "0.95rem",
                boxShadow: "0 6px 20px rgba(79,70,229,0.35)",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(79,70,229,0.45)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Đăng ký miễn phí
            </Button>
            <Button
              onClick={() => onNavigate("login")}
              size="large"
              sx={{
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 2.5,
                fontWeight: 600,
                px: 4,
                py: 1.75,
                fontSize: "0.95rem",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.08)",
                  borderColor: "#fff",
                },
              }}
            >
              Đăng nhập
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
