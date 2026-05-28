import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Card,
  CardContent,
  Avatar,
  Rating,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
} from "@mui/material";
import {
  TrendingUp,
  Sparkles,
  Star,
  CheckCircle,
  ThumbsUp,
  Send,
  Plus,
  Calendar,
  X,
  MessageSquare,
} from "lucide-react";
import PublicHeader from "./PublicHeader";

interface ReviewsPageProps {
  onNavigate: (page: "home" | "login" | "register" | "dashboard" | "features" | "how-it-works" | "reviews") => void;
  isLoggedIn?: boolean;
  currentRole?: string;
  onLogout?: () => void;
}

interface ReviewItem {
  id: number;
  name: string;
  role: "Nhà nghiên cứu" | "Giảng viên & Sinh viên" | "Quản trị viên";
  uni: string;
  avatar: string;
  color: string;
  text: string;
  rating: number;
  date: string;
  likes: number;
  liked?: boolean;
}

const INITIAL_REVIEWS: ReviewItem[] = [];

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

export default function ReviewsPage({
  onNavigate,
  isLoggedIn = false,
  currentRole = "Researcher",
  onLogout,
}: ReviewsPageProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [activeFilter, setActiveFilter] = useState<string>("Tất cả");
  const [formOpen, setFormOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState<ReviewItem["role"]>("Nhà nghiên cứu");
  const [formUni, setFormUni] = useState("");
  const [formText, setFormText] = useState("");
  const [formRating, setFormRating] = useState<number | null>(5);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const handleLike = (id: number) => {
    setReviews(
      reviews.map((rev) => {
        if (rev.id === id) {
          return {
            ...rev,
            liked: !rev.liked,
            likes: rev.liked ? rev.likes - 1 : rev.likes + 1,
          };
        }
        return rev;
      })
    );
  };

  const handleFormSubmit = () => {
    if (!formName || !formUni || !formText) {
      setFormError("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    setFormError("");

    const newReview: ReviewItem = {
      id: Date.now(),
      name: formName,
      role: formRole,
      uni: formUni,
      avatar: formName.charAt(0).toUpperCase(),
      color: ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"][
        Math.floor(Math.random() * 6)
      ],
      text: formText,
      rating: formRating || 5,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    };

    setReviews([newReview, ...reviews]);
    setFormSuccess(true);
    setTimeout(() => {
      setFormOpen(false);
      setFormSuccess(false);
      // Reset form
      setFormName("");
      setFormUni("");
      setFormText("");
      setFormRating(5);
    }, 1500);
  };

  // Filter logic
  const filteredReviews = reviews.filter((rev) => {
    if (activeFilter === "Tất cả") return true;
    return rev.role === activeFilter;
  });

  // Calculate review stats
  const averageRating = (
    reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
  ).toFixed(1);

  const starPercentages = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((rev) => rev.rating === star).length;
    return {
      star,
      percentage: Math.round((count / reviews.length) * 100),
      count,
    };
  });

  const filterOptions = ["Tất cả", "Nhà nghiên cứu", "Giảng viên & Sinh viên", "Quản trị viên"];

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Shared Navbar */}
      <PublicHeader
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
        currentRole={currentRole}
        onLogout={onLogout}
        activePage="reviews"
      />

      {/* ─── HERO SECTION ─── */}
      <Box
        sx={{
          minHeight: "45vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4f46e5 100%)",
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
            icon={<Sparkles size={14} color="#c7d2fe" />}
            label="Đánh Giá & Nhận Xét"
            sx={{
              bgcolor: "rgba(79,70,229,0.25)",
              color: "#c7d2fe",
              fontWeight: 600,
              mb: 2.5,
              border: "1px solid rgba(165,180,252,0.35)",
              "& .MuiChip-icon": { color: "#c7d2fe" },
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
            Nhận Xét Từ{" "}
            <Box
              component="span"
              sx={{
                background: "linear-gradient(135deg, #818cf8 0%, #a5b4fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Cộng Đồng Khoa Học
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
            Được tin dùng bởi hàng nghìn giảng viên, sinh viên và nghiên cứu sinh khắp cả nước trong công tác công bố khoa học và tối ưu nghiên cứu.
          </Typography>
        </Container>
      </Box>

      {/* ─── RATING STATS & FILTER HEADER ─── */}
      <Box sx={{ py: 10, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1.5fr" },
              gap: 6,
              mb: 8,
              alignItems: "center",
              bgcolor: "#fff",
              p: { xs: 4, md: 5 },
              borderRadius: 5,
              boxShadow: "0 15px 40px rgba(0,0,0,0.02)",
              border: "1px solid #f1f5f9",
            }}
          >
            {/* Average Rating Big Block */}
            <Box sx={{ textAlign: "center", borderRight: { md: "1.5px solid #f1f5f9" }, pr: { md: 6 } }}>
              <Typography sx={{ fontSize: "5rem", fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
                {averageRating}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", my: 1.5 }}>
                <Rating value={parseFloat(averageRating)} precision={0.1} readOnly size="large" />
              </Box>
              <Typography sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.95rem" }}>
                Điểm đánh giá trung bình
              </Typography>
              <Typography sx={{ color: "#94a3b8", fontSize: "0.78rem", mt: 0.5 }}>
                Dựa trên {reviews.length} đánh giá thực tế từ hệ thống
              </Typography>

              <Button
                variant="contained"
                onClick={() => setFormOpen(true)}
                startIcon={<Plus size={16} />}
                sx={{
                  mt: 3.5,
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  borderRadius: 2.5,
                  fontWeight: 700,
                  px: 3,
                  py: 1.25,
                  boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(79,70,229,0.4)",
                  },
                }}
              >
                Viết đánh giá của bạn
              </Button>
            </Box>

            {/* Star progress breakdown */}
            <Stack spacing={2}>
              {starPercentages.map((item) => (
                <Box key={item.star} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151", minWidth: 42 }}>
                    {item.star} sao
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={item.percentage}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "#f1f5f9",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: item.star >= 4 ? "#f59e0b" : "#94a3b8",
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#64748b", minWidth: 32, textAlign: "right" }}>
                    {item.percentage}%
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Filter system */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5, flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {filterOptions.map((opt) => {
                const isActive = activeFilter === opt;
                return (
                  <Chip
                    key={opt}
                    label={opt}
                    onClick={() => setActiveFilter(opt)}
                    sx={{
                      py: 2,
                      px: 1,
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      bgcolor: isActive ? "#4f46e5" : "#fff",
                      color: isActive ? "#fff" : "#64748b",
                      border: "1.5px solid",
                      borderColor: isActive ? "#4f46e5" : "#e2e8f0",
                      "&:hover": {
                        bgcolor: isActive ? "#4f46e5" : "#f1f5f9",
                        borderColor: isActive ? "#4f46e5" : "#cbd5e1",
                      },
                      transition: "all 0.2s",
                    }}
                  />
                );
              })}
            </Box>
            <Typography sx={{ color: "#94a3b8", fontSize: "0.88rem", fontWeight: 500 }}>
              Hiển thị {filteredReviews.length} đánh giá
            </Typography>
          </Box>

          {/* Dynamic Review list */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((rev) => (
                <Box
                  component={motion.div}
                  key={rev.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                >
                  <Card
                    sx={{
                      borderRadius: 5,
                      border: "1.5px solid #f1f5f9",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }} sx={{ mb: 2.5 }}>
                        {/* Avatar */}
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: rev.color,
                            fontSize: "1.1rem",
                            fontWeight: 800,
                            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                          }}
                        >
                          {rev.avatar}
                        </Avatar>

                        {/* Author Info */}
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                              {rev.name}
                            </Typography>
                            <Chip
                              label="Đã xác thực"
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: "0.6rem",
                                fontWeight: 800,
                                bgcolor: "#f0f9ff",
                                color: "#0284c7",
                                border: "1px solid #bae6fd",
                              }}
                            />
                          </Stack>
                          <Typography sx={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 600 }}>
                            {rev.uni}
                          </Typography>
                        </Box>

                        {/* Rating stars & Date */}
                        <Box sx={{ textAlign: { sm: "right" } }}>
                          <Rating value={rev.rating} readOnly size="small" />
                          <Stack direction="row" spacing={0.75} alignItems="center" justifyContent={{ sm: "flex-end" }} sx={{ mt: 0.5 }}>
                            <Calendar size={13} color="#94a3b8" />
                            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>
                              {rev.date}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>

                      {/* Content */}
                      <Typography sx={{ color: "#374151", fontSize: "0.95rem", lineHeight: 1.8, mb: 3 }}>
                        "{rev.text}"
                      </Typography>

                      {/* Footer Actions */}
                      <Stack direction="row" spacing={3} sx={{ borderTop: "1px dashed #f1f5f9", pt: 2.5 }}>
                        <Button
                          size="small"
                          onClick={() => handleLike(rev.id)}
                          startIcon={<ThumbsUp size={14} fill={rev.liked ? "#4f46e5" : "none"} />}
                          sx={{
                            textTransform: "none",
                            color: rev.liked ? "#4f46e5" : "#64748b",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            "&:hover": { bgcolor: rev.liked ? "rgba(79,70,229,0.06)" : "#f1f5f9" },
                          }}
                        >
                          Hữu ích ({rev.likes})
                        </Button>
                        <Button
                          size="small"
                          startIcon={<MessageSquare size={14} />}
                          sx={{
                            textTransform: "none",
                            color: "#64748b",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            "&:hover": { bgcolor: "#f1f5f9" },
                          }}
                        >
                          Phản hồi
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </AnimatePresence>
          </Box>
        </Container>
      </Box>

      {/* ─── REVIEW CREATOR DIALOG (Interactive Modal) ─── */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        PaperProps={{
          sx: { borderRadius: 4, p: 1.5, width: "100%", maxWidth: 500 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pr: 5, fontSize: "1.2rem" }}>
          Đóng Góp Ý Kiến Của Bạn
          <IconButton
            onClick={() => setFormOpen(false)}
            sx={{ position: "absolute", right: 16, top: 16, color: "#94a3b8" }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 1 }}>
          {formSuccess ? (
            <Alert severity="success" sx={{ borderRadius: 3, my: 2 }}>
              Cảm ơn bạn! Đánh giá đã được đăng thành công và xuất hiện trực tiếp trong danh sách.
            </Alert>
          ) : (
            <Stack spacing={3} sx={{ mt: 1 }}>
              {formError && <Alert severity="error" sx={{ borderRadius: 3 }}>{formError}</Alert>}

              {/* Rating picker */}
              <Box>
                <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "#374151", mb: 1 }}>
                  Đánh giá số sao *
                </Typography>
                <Rating
                  value={formRating}
                  onChange={(_, val) => setFormRating(val)}
                  size="large"
                />
              </Box>

              {/* Name input */}
              <TextField
                label="Họ và tên *"
                fullWidth
                variant="outlined"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />

              {/* Role selector */}
              <TextField
                select
                label="Vai trò sử dụng *"
                fullWidth
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as ReviewItem["role"])}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              >
                <MenuItem value="Nhà nghiên cứu">Nhà nghiên cứu</MenuItem>
                <MenuItem value="Giảng viên & Sinh viên">Giảng viên & Sinh viên</MenuItem>
                <MenuItem value="Quản trị viên">Quản trị viên</MenuItem>
              </TextField>

              {/* University/Company input */}
              <TextField
                label="Chức danh / Cơ quan công tác (Ví dụ: Giảng viên, ĐH Bách Khoa) *"
                fullWidth
                variant="outlined"
                value={formUni}
                onChange={(e) => setFormUni(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />

              {/* Review content */}
              <TextField
                label="Nội dung nhận xét *"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          {!formSuccess && (
            <>
              <Button onClick={() => setFormOpen(false)} sx={{ color: "#64748b", fontWeight: 600 }}>
                Hủy bỏ
              </Button>
              <Button
                onClick={handleFormSubmit}
                variant="contained"
                endIcon={<Send size={15} />}
                sx={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  borderRadius: 2.5,
                  fontWeight: 700,
                  px: 3,
                }}
              >
                Gửi đánh giá
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
