import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  Box, Button, Typography, TextField, InputAdornment, IconButton,
  Stack, Chip, Alert, CircularProgress, LinearProgress, Divider, Avatar,
} from '@mui/material';
import {
  Mail, Lock, Eye, EyeOff, TrendingUp, ArrowLeft, User,
  Building2, FlaskConical, GraduationCap, UserCog, CheckCircle, XCircle,
  ChevronRight, Star, Sparkles, ArrowRight, Shield, BookOpen,
  BarChart2, Bell, Award, Globe,
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard') => void;
}

const ROLES = [
  {
    value: 'researcher',
    label: 'Nhà nghiên cứu',
    icon: FlaskConical,
    color: '#4f46e5',
    gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    desc: 'Theo dõi xu hướng & phân tích trích dẫn',
    features: ['Biểu đồ xu hướng', 'Phân tích trích dẫn', 'Kết nối tác giả'],
  },
  {
    value: 'student',
    label: 'Giảng viên / Sinh viên',
    icon: GraduationCap,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    desc: 'Tìm tài liệu & quản lý danh sách đọc',
    features: ['Bộ lọc nâng cao', 'Bookmarks', 'Xuất tài liệu'],
  },
  {
    value: 'admin',
    label: 'Quản trị viên',
    icon: UserCog,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    desc: 'Quản lý hệ thống & phân quyền người dùng',
    features: ['Phân quyền đa cấp', 'Báo cáo thống kê', 'Giám sát API'],
  },
];

const BENEFITS = [
  { icon: BookOpen, text: 'Truy cập 52,000+ bài báo khoa học' },
  { icon: BarChart2, text: 'Công cụ tìm kiếm với 20+ bộ lọc nâng cao' },
  { icon: TrendingUp, text: 'Biểu đồ xu hướng nghiên cứu thời gian thực' },
  { icon: Bell, text: 'Thông báo bài báo mới theo chủ đề' },
  { icon: Award, text: 'Phân tích mạng lưới trích dẫn chuyên sâu' },
  { icon: Globe, text: 'Kết nối cộng đồng học thuật toàn cầu' },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

function FloatingOrb({ size, color, x, y, delay }: { size: number; color: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', background: color, left: x, top: y, filter: 'blur(72px)', opacity: 0.18, pointerEvents: 'none' }}
      animate={{ y: [0, -18, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Ít nhất 8 ký tự', ok: password.length >= 8 },
    { label: 'Chữ hoa & thường', ok: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'Chứa số', ok: /\d/.test(password) },
    { label: 'Ký tự đặc biệt', ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['#ef4444', '#f59e0b', '#10b981', '#10b981'];
  const labels = ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  if (!password) return null;
  return (
    <Box sx={{ mt: 1.25 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <LinearProgress variant="determinate" value={(score / 4) * 100} sx={{ flex: 1, height: 5, borderRadius: 5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: colors[score - 1] || '#e2e8f0', borderRadius: 5, transition: 'all 0.4s ease' } }} />
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: colors[score - 1] || '#9ca3af', minWidth: 64 }}>{labels[score]}</Typography>
      </Stack>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {checks.map(({ label, ok }) => (
          <Stack key={label} direction="row" alignItems="center" spacing={0.5}>
            {ok ? <CheckCircle size={11} color="#10b981" /> : <XCircle size={11} color="#d1d5db" />}
            <Typography sx={{ fontSize: '0.7rem', color: ok ? '#10b981' : '#9ca3af', fontWeight: ok ? 600 : 400 }}>{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [role, setRole] = useState('researcher');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [institution, setInstitution] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
      if (!fullName || !email || !password || !confirmPassword) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp.');
        return;
      }
      setError('');
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1400));
      setLoading(false);
      onNavigate('dashboard');
    };

    const selectedRole = ROLES.find((r) => r.value === role)!;

    const inputSx = {
      '& .MuiOutlinedInput-root': {
        borderRadius: 3,
        bgcolor: '#f8fafc',
        transition: 'all 0.2s',
        '& fieldset': { borderColor: '#e2e8f0', borderWidth: 1.5 },
        '&:hover fieldset': { borderColor: '#c7d2fe' },
        '&.Mui-focused fieldset': { borderColor: '#4f46e5', borderWidth: 2 },
        '&.Mui-focused': { bgcolor: '#fff', boxShadow: '0 0 0 4px rgba(79,70,229,0.06)' },
      },
      '& input': { py: 1.5, fontSize: '0.95rem' },
    };

    const fillProgress = [fullName, email, password, confirmPassword].filter(Boolean).length;
    const progressPct = (fillProgress / 4) * 100;

    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>

        {/* ─── LEFT PANEL ─── */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            flex: '0 0 44%',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 55%, #0c4a6e 100%)',
          }}
        >
          <FloatingOrb size={550} color="#4f46e5" x="-20%" y="-5%" delay={0} />
          <FloatingOrb size={400} color="#06b6d4" x="55%" y="60%" delay={2} />
          <FloatingOrb size={250} color="#7c3aed" x="60%" y="-15%" delay={1} />

          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none' }} />

          <Box sx={{ position: 'relative', zIndex: 1, p: 6, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={1.5} mb={6}>
              <Box sx={{ width: 42, height: 42, borderRadius: '13px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(79,70,229,0.45)' }}>
                <TrendingUp size={22} color="#fff" />
              </Box>
              <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.01em' }}>SciTrend</Typography>
            </Stack>

            <Box sx={{ my: 'auto' }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 3, px: 1.75, py: 0.625, borderRadius: 5, bgcolor: 'rgba(16,185,129,0.15)', border: '1px solid rgba(110,231,183,0.2)' }}>
                <CheckCircle size={13} color="#6ee7b7" />
                <Typography sx={{ color: '#6ee7b7', fontWeight: 600, fontSize: '0.8rem' }}>Miễn phí · Không cần thẻ tín dụng</Typography>
              </Box>

              <Typography sx={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', lineHeight: 1.12, mb: 2, letterSpacing: '-0.02em' }}>
                Tham gia cộng đồng{' '}
                <Box component="span" sx={{ background: 'linear-gradient(135deg, #818cf8, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  nghiên cứu
                </Box>{' '}
                hôm nay
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, mb: 5.5, maxWidth: 360, fontSize: '0.95rem' }}>
                Đăng ký để tiếp cận đầy đủ các tính năng của nền tảng quản lý bài báo khoa học thông minh nhất Việt Nam.
              </Typography>

              <Stack spacing={1.75}>
                {BENEFITS.map(({ icon: Icon, text }, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.45 }}>
                    <Stack direction="row" alignItems="center" spacing={1.75}>
                      <Box sx={{ width: 32, height: 32, borderRadius: '9px', bgcolor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color="rgba(255,255,255,0.6)" />
                      </Box>
                      <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.875rem' }}>{text}</Typography>
                    </Stack>
                  </motion.div>
                ))}
              </Stack>
            </Box>

            {/* Stats row */}
            <Box sx={{ display: 'flex', gap: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { value: '12K+', label: 'Thành viên' },
                { value: '52K+', label: 'Bài báo' },
                { value: '98%', label: 'Hài lòng' },
              ].map(({ value, label }) => (
                <Box key={label}>
                  <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.75rem', mt: 0.5 }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ─── RIGHT PANEL (form) ─── */}
        <Box sx={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'flex-start', overflowY: 'auto',
          p: { xs: 3, sm: 5 }, position: 'relative',
        }}>
          {/* Back button */}
          <Box sx={{ alignSelf: 'flex-start', mb: 3 }}>
            <Button
              startIcon={<ArrowLeft size={16} />}
              onClick={() => onNavigate('home')}
              sx={{ color: '#64748b', fontWeight: 500, borderRadius: 2.5, '&:hover': { bgcolor: '#f8fafc', color: '#0f172a' } }}
            >
              Trang chủ
            </Button>
          </Box>

          <motion.div variants={stagger} initial="hidden" animate="visible" style={{ width: '100%', maxWidth: 460 }}>

            {/* Mobile logo */}
            <motion.div variants={fadeUp}>
              <Stack direction="row" alignItems="center" spacing={1.25} sx={{ display: { xs: 'flex', lg: 'none' }, mb: 4 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} color="#fff" />
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: '1.25rem', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  SciTrend
                </Typography>
              </Stack>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Typography sx={{ fontSize: '1.875rem', fontWeight: 900, color: '#0f172a', mb: 0.5, letterSpacing: '-0.02em' }}>
                Tạo tài khoản mới
              </Typography>
              <Typography sx={{ color: '#64748b', mb: 3.5, fontSize: '0.95rem' }}>
                Miễn phí · Cài đặt trong 2 phút · Không cần thẻ tín dụng
              </Typography>
            </motion.div>

            {/* Progress bar */}
            {(fullName || email || password || confirmPassword) && (
              <motion.div variants={fadeUp}>
                <Box sx={{ mb: 3.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>Tiến độ hoàn thành</Typography>
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#4f46e5' }}>{Math.round(progressPct)}%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={progressPct} sx={{ height: 5, borderRadius: 5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', borderRadius: 5 } }} />
                </Box>
              </motion.div>
            )}

            {error && (
              <motion.div variants={fadeUp}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5 }}>{error}</Alert>
              </motion.div>
            )}

            {/* Role selector */}
            <motion.div variants={fadeUp}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', mb: 1.5 }}>
                Bạn là ai? <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
              </Typography>
              <Stack spacing={1.25} mb={3.5}>
                {ROLES.map(({ value, label, icon: Icon, color, gradient, desc, features }) => (
                  <Box
                    key={value}
                    onClick={() => setRole(value)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.75,
                      p: 2, borderRadius: '14px', cursor: 'pointer',
                      border: '2px solid',
                      borderColor: role === value ? color : '#e2e8f0',
                      bgcolor: role === value ? `${color}08` : '#f8fafc',
                      transition: 'all 0.25s ease',
                      '&:hover': { borderColor: color, bgcolor: `${color}05`, transform: 'translateX(2px)' },
                    }}
                  >
                    <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: role === value ? gradient : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.25s', boxShadow: role === value ? `0 4px 14px ${color}40` : 'none' }}>
                      <Icon size={22} color={role === value ? '#fff' : '#9ca3af'} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: role === value ? color : '#374151', mb: 0.25 }}>{label}</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', lineHeight: 1.3 }}>{desc}</Typography>
                      {role === value && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.2 }}>
                          <Stack direction="row" flexWrap="wrap" gap={0.75} mt={0.75}>
                            {features.map((f) => (
                              <Chip key={f} label={f} size="small" sx={{ bgcolor: `${color}12`, color, fontSize: '0.68rem', height: 18, fontWeight: 600, borderRadius: '4px' }} />
                            ))}
                          </Stack>
                        </motion.div>
                      )}
                    </Box>
                    <AnimatePresence>
                      {role === value && (
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                          <CheckCircle size={20} color={color} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                ))}
              </Stack>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Stack spacing={2.5}>
                {/* Full name */}
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', mb: 0.875 }}>
                    Họ và tên <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <TextField
                    fullWidth placeholder="Nguyễn Văn A"
                    value={fullName} onChange={(e) => setFullName(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} color="#9ca3af" /></InputAdornment> }}
                    sx={inputSx}
                  />
                </Box>

                {/* Email */}
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', mb: 0.875 }}>
                    Email <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <TextField
                    fullWidth placeholder="ten@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} color="#9ca3af" /></InputAdornment> }}
                    sx={inputSx}
                  />
                </Box>

                {/* Institution */}
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', mb: 0.875 }}>
                    Trường / Tổ chức <Box component="span" sx={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.8rem', ml: 0.75 }}>(tùy chọn)</Box>
                  </Typography>
                  <TextField
                    fullWidth placeholder="Đại học Bách Khoa Hà Nội"
                    value={institution} onChange={(e) => setInstitution(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Building2 size={18} color="#9ca3af" /></InputAdornment> }}
                    sx={inputSx}
                  />
                </Box>

                {/* Password */}
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', mb: 0.875 }}>
                    Mật khẩu <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <TextField
                    fullWidth type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock size={18} color="#9ca3af" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#4f46e5' } }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                  <PasswordStrength password={password} />
                </Box>

                {/* Confirm password */}
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', mb: 0.875 }}>
                    Xác nhận mật khẩu <Box component="span" sx={{ color: '#ef4444' }}>*</Box>
                  </Typography>
                  <TextField
                    fullWidth type={showConfirm ? 'text' : 'password'} placeholder="••••••••"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    error={!!confirmPassword && confirmPassword !== password}
                    helperText={confirmPassword && confirmPassword !== password ? 'Mật khẩu không khớp' : ''}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock size={18} color="#9ca3af" /></InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#4f46e5' } }}>
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={inputSx}
                  />
                </Box>

                <Button
                  fullWidth variant="contained" size="large"
                  onClick={handleRegister} disabled={loading}
                  endIcon={!loading && <ArrowRight size={18} />}
                  sx={{
                    background: `${selectedRole.gradient}`,
                    borderRadius: 3, py: 1.625, fontWeight: 800, fontSize: '1rem',
                    boxShadow: `0 4px 20px ${selectedRole.color}45`,
                    '&:hover': { boxShadow: `0 8px 28px ${selectedRole.color}55`, transform: 'translateY(-1px)' },
                    '&:active': { transform: 'translateY(0)' },
                    transition: 'all 0.2s ease', mt: 0.5,
                  }}
                >
                  {loading
                    ? <CircularProgress size={22} color="inherit" />
                    : `Tạo tài khoản — ${selectedRole.label}`
                  }
                </Button>

                <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', textAlign: 'center', lineHeight: 1.7 }}>
                  Bằng cách đăng ký, bạn đồng ý với{' '}
                  <Box component="span" sx={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Điều khoản sử dụng</Box>
                  {' '}và{' '}
                  <Box component="span" sx={{ color: '#4f46e5', cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>Chính sách bảo mật</Box>
                  {' '}của SciTrend.
                </Typography>
              </Stack>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Divider sx={{ my: 3.5 }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Đã có tài khoản?{' '}
                  <Box
                    component="span"
                    onClick={() => onNavigate('login')}
                    sx={{ color: '#4f46e5', fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Đăng nhập ngay
                  </Box>
                </Typography>
              </Box>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp}>
              <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 3.5, pt: 3.5, borderTop: '1px solid #f1f5f9' }}>
                {[
                  { icon: Shield, text: 'Bảo mật SSL' },
                  { icon: CheckCircle, text: 'Xác minh email' },
                  { icon: Star, text: 'Miễn phí mãi mãi' },
                ].map(({ icon: Icon, text }) => (
                  <Stack key={text} alignItems="center" spacing={0.5}>
                    <Icon size={16} color="#94a3b8" />
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 500 }}>{text}</Typography>
                  </Stack>
                ))}
              </Stack>
            </motion.div>
          </motion.div>
        </Box>
      </Box>
    );
  }
