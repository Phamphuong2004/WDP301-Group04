import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  TrendingUp,
  Sparkles,
  Search,
  Users,
  BarChart2,
  Database,
  ArrowRight,
  ChevronDown,
  Lock,
  Bookmark,
  Share2,
} from "lucide-react";
import PublicHeader from "./PublicHeader";

interface HowItWorksPageProps {
  onNavigate: (page: "home" | "login" | "register" | "dashboard" | "features" | "how-it-works" | "reviews") => void;
  isLoggedIn?: boolean;
  currentRole?: string;
  onLogout?: () => void;
}

const STEPS = [
  {
    num: "01",
    title: "Đăng ký tài khoản",
    desc: "Tạo tài khoản miễn phí và thiết lập vai trò phù hợp: Nhà nghiên cứu, Giảng viên hoặc Sinh viên để tối ưu hóa bảng điều khiển.",
    icon: Users,
    color: "#4f46e5",
    highlight: "Tùy biến dashboard",
    mockScreen: {
      title: "Hồ Sơ Nghiên Cứu Cá Nhân",
      content: (
        <Stack spacing={2} sx={{ p: 1 }}>
          <Box sx={{ border: "1px dashed #c7d2fe", p: 2, borderRadius: 2, bgcolor: "#f8fafc" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#4f46e5", mb: 0.5 }}>✓ Vai trò: Nhà nghiên cứu (Researcher)</Typography>
            <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>Đại học Bách Khoa Hà Nội</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip size="small" label="Trí tuệ nhân tạo" color="primary" variant="outlined" />
            <Chip size="small" label="Khoa học dữ liệu" color="primary" variant="outlined" />
          </Box>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>Hệ thống tự động đồng bộ hóa nguồn cấp dữ liệu dựa trên lĩnh vực bạn chọn.</Typography>
        </Stack>
      ),
    },
  },
  {
    num: "02",
    title: "Khám phá & Tìm kiếm",
    desc: "Sử dụng công cụ Discovery để lọc hàng chục ngàn bài báo từ các cơ sở dữ liệu lớn ISI/Scopus theo năm, ngành học hoặc từ khóa.",
    icon: Search,
    color: "#06b6d4",
    highlight: "Bộ lọc chuyên sâu ISI/Scopus",
    mockScreen: {
      title: "Discovery Engine",
      content: (
        <Stack spacing={1.5} sx={{ p: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", p: 1, borderRadius: 2, gap: 1 }}>
            <Search size={14} color="#94a3b8" />
            <Typography variant="body2" sx={{ color: "#0f172a", flex: 1 }}>Attention Is All You Need</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Box sx={{ border: "1.5px solid #4f46e5", bgcolor: "#eef2ff", px: 1, py: 0.25, borderRadius: 1 }}>
              <Typography sx={{ fontSize: "0.65rem", color: "#4f46e5", fontWeight: 700 }}>Scopus Q1</Typography>
            </Box>
            <Box sx={{ border: "1.5px solid #06b6d4", bgcolor: "#ecfeff", px: 1, py: 0.25, borderRadius: 1 }}>
              <Typography sx={{ fontSize: "0.65rem", color: "#0891b2", fontWeight: 700 }}>Năm: 2017</Typography>
            </Box>
          </Stack>
          <Box sx={{ bgcolor: "#f8fafc", p: 1, borderRadius: 1.5, borderLeft: "3px solid #06b6d4" }}>
            <Typography sx={{ fontSize: "0.7rem", color: "#475569", fontStyle: "italic" }}>
              "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms..."
            </Typography>
          </Box>
        </Stack>
      ),
    },
  },
  {
    num: "03",
    title: "Phân tích xu hướng",
    desc: "Theo dõi biểu đồ momentum và dự báo từ khóa tương tác. Khám phá những chủ đề nghiên cứu tiềm năng trong tương lai gần.",
    icon: BarChart2,
    color: "#a78bfa",
    highlight: "Thuật toán dự báo momentum",
    mockScreen: {
      title: "Momentum Tracker (Xu hướng)",
      content: (
        <Stack spacing={1.5} sx={{ p: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Chủ đề: Đại mô hình ngôn ngữ (LLM)</Typography>
          {/* Mock chart representation */}
          <Box sx={{ display: "flex", alignItems: "flex-end", height: 70, gap: 1.5, px: 2, pt: 1, borderBottom: "1px solid #e2e8f0" }}>
            <Box sx={{ width: 24, height: 18, bgcolor: "#e2e8f0", borderRadius: "3px 3px 0 0" }} />
            <Box sx={{ width: 24, height: 32, bgcolor: "#cbd5e1", borderRadius: "3px 3px 0 0" }} />
            <Box sx={{ width: 24, height: 50, bgcolor: "#a78bfa", borderRadius: "3px 3px 0 0" }} />
            <Box sx={{ width: 24, height: 68, bgcolor: "#4f46e5", borderRadius: "3px 3px 0 0", display: "flex", justifyContent: "center" }}>
              <Typography sx={{ fontSize: "0.5rem", color: "#fff", mt: -1.7, fontWeight: 800 }}>+94%</Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: "0.68rem", color: "#64748b", textAlign: "center" }}>Tăng trưởng trích dẫn cao đột biến trong quý này</Typography>
        </Stack>
      ),
    },
  },
  {
    num: "04",
    title: "Quản lý & Chia sẻ",
    desc: "Lưu trữ bài viết vào các bộ sưu tập riêng, xuất trích dẫn dạng BibTeX, APA và chia sẻ dự án nghiên cứu với đồng nghiệp.",
    icon: Database,
    color: "#10b981",
    highlight: "Xuất trích dẫn thông minh",
    mockScreen: {
      title: "Saved Collections",
      content: (
        <Stack spacing={1.5} sx={{ p: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#f0fdf4", p: 1, borderRadius: 2, border: "1px solid #bbf7d0" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Bookmark size={14} color="#10b981" />
              <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#166534" }}>Thư viện AI</Typography>
            </Stack>
            <Typography sx={{ fontSize: "0.68rem", color: "#15803d" }}>(12 bài báo)</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" startIcon={<Share2 size={12} />} sx={{ fontSize: "0.65rem", py: 0.5, textTransform: "none", color: "#374151", borderColor: "#cbd5e1" }}>Chia sẻ</Button>
            <Button size="small" variant="contained" color="success" sx={{ fontSize: "0.65rem", py: 0.5, textTransform: "none", boxShadow: "none" }}>Xuất BibTeX</Button>
          </Stack>
        </Stack>
      ),
    },
  },
];

const FAQS = [
  {
    q: "SciTrend lấy nguồn dữ liệu bài báo từ đâu?",
    a: "Chúng tôi liên kết và liên tục cập nhật dữ liệu từ các cơ sở dữ liệu học thuật uy tín hàng đầu toàn cầu như Scopus, ISI/Web of Science, CrossRef, PubMed và arXiv nhằm đảm bảo tính chính xác và kịp thời cho nghiên cứu của bạn.",
  },
  {
    q: "Tài khoản Sinh viên và Giảng viên khác biệt như thế nào?",
    a: "Tài khoản sinh viên được trang bị các tính năng lưu trữ cá nhân, gợi ý tài liệu học tập và xuất trích dẫn cơ bản. Giảng viên và nhà nghiên cứu sẽ được mở khóa thêm các công cụ vẽ biểu đồ trích dẫn dạng đồ thị, phân tích xu hướng chi tiết và xuất báo cáo thống kê nghiên cứu nâng cao phục vụ cho việc giảng dạy và công bố quốc tế.",
  },
  {
    q: "Tôi có thể xuất danh mục tài liệu tham khảo cho LaTeX được không?",
    a: "Có, hệ thống hỗ trợ xuất hàng loạt trích dẫn sang nhiều định dạng phổ biến bao gồm BibTeX (.bib) cho LaTeX, EndNote, Mendeley và định dạng văn bản chuẩn APA 7th, MLA, Harvard.",
  },
  {
    q: "Hệ thống phân tích xu hướng hoạt động như thế nào?",
    a: "SciTrend sử dụng thuật toán phân tích mạng lưới trích dẫn kết hợp với mô hình Machine Learning xử lý ngôn ngữ tự nhiên (NLP) để quét tần suất xuất hiện và gia tăng trích dẫn của các từ khóa. Từ đó phát hiện các từ khóa có tốc độ tăng trưởng vượt bậc (momentum) và dự báo xu hướng tương lai.",
  },
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

export default function HowItWorksPage({
  onNavigate,
  isLoggedIn = false,
  currentRole = "Researcher",
  onLogout,
}: HowItWorksPageProps) {
  const [activeStep, setActiveStep] = useState(0);

  const selectedStep = STEPS[activeStep];

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Shared Navbar */}
      <PublicHeader
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        currentRole={currentRole}
        onLogout={onLogout}
        activePage="how-it-works"
      />

      {/* ─── HERO SECTION ─── */}
      <Box
        sx={{
          minHeight: "45vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #059669 100%)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 12,
          pb: 6,
        }}
      >
        <FloatingOrb size={450} color="#4f46e5" x="-10%" y="10%" delay={0} />
        <FloatingOrb size={350} color="#10b981" x="70%" y="30%" delay={2} />

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
            icon={<Sparkles size={14} color="#a7f3d0" />}
            label="Hướng Dẫn Chi Tiết"
            sx={{
              bgcolor: "rgba(16,185,129,0.2)",
              color: "#a7f3d0",
              fontWeight: 600,
              mb: 2.5,
              border: "1px solid rgba(167,243,208,0.3)",
              "& .MuiChip-icon": { color: "#a7f3d0" },
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
            Cách Hoạt Động Của{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #818cf8 0%, #a7f3d0 100%)",
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
            Quy trình làm việc 4 bước đơn giản từ việc tìm kiếm, phân tích cho đến xuất báo cáo, giúp tăng hiệu suất nghiên cứu khoa học của bạn gấp nhiều lần.
          </Typography>
        </Container>
      </Box>

      {/* ─── INTERACTIVE TIMELINE / WORKFLOW ─── */}
      <Box sx={{ py: 12, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
              gap: 6,
              alignItems: "center",
            }}
          >
            {/* Step Selection Timeline (Left side) */}
            <Stack spacing={3.5}>
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                const StepIcon = step.icon;
                return (
                  <Box
                    component="div"
                    key={step.num}
                    onClick={() => setActiveStep(idx)}
                    sx={{
                      display: "flex",
                      gap: 3,
                      p: 3,
                      borderRadius: 4,
                      bgcolor: isActive ? "#fff" : "transparent",
                      border: "1.5px solid",
                      borderColor: isActive ? step.color : "transparent",
                      boxShadow: isActive ? "0 10px 30px rgba(0,0,0,0.04)" : "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      position: "relative",
                      "&:hover": {
                        bgcolor: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {/* Line connector between steps */}
                    {idx < STEPS.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 45,
                          top: 76,
                          bottom: -28,
                          width: 2.5,
                          bgcolor: "#e2e8f0",
                          zIndex: 0,
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "50%",
                        background: isActive ? step.color : "#cbd5e1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        boxShadow: isActive ? `0 6px 16px ${step.color}35` : "none",
                        zIndex: 1,
                        transition: "all 0.3s",
                      }}
                    >
                      <StepIcon size={22} />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                        <Typography sx={{ fontWeight: 800, color: isActive ? "#0f172a" : "#64748b", fontSize: "1.1rem" }}>
                          {step.title}
                        </Typography>
                        <Chip
                          label={step.highlight}
                          size="small"
                          sx={{
                            height: 20,
                            bgcolor: isActive ? `${step.color}12` : "#f1f5f9",
                            color: isActive ? step.color : "#64748b",
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            border: isActive ? `1px solid ${step.color}22` : "1px solid transparent",
                          }}
                        />
                      </Stack>
                      <Typography sx={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7 }}>
                        {step.desc}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>

            {/* Live Mock Screen preview (Right side) */}
            <Box component="div">
              <Box
                component={motion.div}
                key={activeStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 6,
                  boxShadow: "0 25px 60px rgba(0,0,0,0.06), 0 5px 15px rgba(0,0,0,0.02)",
                  border: "1.5px solid #f1f5f9",
                  overflow: "hidden",
                  width: "100%",
                  maxWidth: 440,
                  mx: "auto",
                }}
              >
                {/* Browser bar top mock */}
                <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 1.75, display: "flex", gap: 1, alignItems: "center", borderBottom: "1.5px solid #f1f5f9" }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444" }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#f59e0b" }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#10b981" }} />
                  <Box sx={{ bgcolor: "#e2e8f0", height: 18, borderRadius: 1, flex: 1, ml: 2, display: "flex", alignItems: "center", px: 1 }}>
                    <Typography sx={{ fontSize: "0.58rem", color: "#94a3b8", fontWeight: 500 }}>scitrend.com/dashboard/workflow</Typography>
                  </Box>
                </Box>

                {/* Dashboard Screen */}
                <Box sx={{ p: 4, minHeight: 280 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: "1rem", color: "#0f172a" }}>
                      {selectedStep.mockScreen.title}
                    </Typography>
                    <Chip
                      label={selectedStep.num}
                      size="small"
                      sx={{
                        bgcolor: `${selectedStep.color}15`,
                        color: selectedStep.color,
                        fontWeight: 900,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Stack>

                  {selectedStep.mockScreen.content}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── FAQ ACCORDIONS ─── */}
      <Box sx={{ py: 12, bgcolor: "#ffffff" }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Chip
              label="Giải đáp thắc mắc"
              sx={{
                mb: 2,
                bgcolor: "#eef2ff",
                color: "#4f46e5",
                fontWeight: 600,
                borderRadius: 5,
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a", mb: 2, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
              Câu Hỏi Thường Gặp (FAQs)
            </Typography>
            <Typography sx={{ color: "#64748b", maxWidth: 500, mx: "auto", fontSize: "0.98rem" }}>
              Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến nhất về cách thiết lập và sử dụng SciTrend.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {FAQS.map((faq, idx) => (
              <Accordion
                key={idx}
                sx={{
                  borderRadius: "16px !important",
                  boxShadow: "none",
                  border: "1.5px solid #f1f5f9",
                  "&::before": { display: "none" },
                  "&.Mui-expanded": {
                    borderColor: "#4f46e5",
                    boxShadow: "0 8px 30px rgba(79,70,229,0.04)",
                  },
                  transition: "all 0.25s",
                }}
              >
                <AccordionSummary
                  expandIcon={<ChevronDown size={18} color="#4f46e5" />}
                  sx={{ px: 3, py: 1.5 }}
                >
                  <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "0.98rem" }}>{faq.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0, borderTop: "1px dashed #f1f5f9" }}>
                  <Typography sx={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.8, mt: 2 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
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
        <FloatingOrb size={300} color="#059669" x="-10%" y="40%" delay={3} />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, letterSpacing: "-0.02em" }}>
            Bắt Đầu Nghiên Cứu Ngay Hôm Nay
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 5, maxWidth: 520, mx: "auto", fontSize: "1.05rem", lineHeight: 1.75 }}>
            Chỉ mất chưa đầy 1 phút để tạo tài khoản và tự do khai thác hệ thống dữ liệu khoa học thông minh của SciTrend.
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
              Đăng ký tài khoản
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
              Đăng nhập hệ thống
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
