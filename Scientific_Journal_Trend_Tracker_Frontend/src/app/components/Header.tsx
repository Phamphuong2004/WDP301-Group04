import { useState, useEffect } from 'react';
import {
  Box, Typography, InputBase, IconButton, Avatar, Badge,
  Menu, MenuItem, Divider, ListItemIcon, Chip, Tooltip,
} from '@mui/material';
import {
  Search, Notifications, Logout, Person, Bookmark,
  Settings, KeyboardArrowDown,
} from '@mui/icons-material';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../App';
import { getCurrentUser } from '../../services/api';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Research Hub', subtitle: 'Global research monitoring & trends' },
  search: { title: 'Discovery Engine', subtitle: 'Search millions of scientific papers' },
  trending: { title: 'Market Trends', subtitle: 'High-momentum research topics' },
  bookmarks: { title: 'Knowledge Base', subtitle: 'Your personal library & assets' },
  following: { title: 'Network', subtitle: 'Following journals and researchers' },
  notifications: { title: 'Activity Center', subtitle: 'Recent updates and system alerts' },
  users: { title: 'User Management', subtitle: 'System administration & permissions' },
  settings: { title: 'System Configuration', subtitle: 'Database & API integrations' },
  reports: { title: 'Analytics Reports', subtitle: 'Publication trends & field insights' },
  'paper-detail': { title: 'Paper Detail', subtitle: 'Abstract, citation, and related publications' },
  profile: { title: 'My Profile', subtitle: 'Account settings & preferences' },
  author: { title: 'Author Profile', subtitle: 'Researcher publications & impact' },
  journal: { title: 'Journal Details', subtitle: 'Journal metrics & publications' },
};

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onNavigate: (target: string) => void;
  currentRole: string;
  unreadCount: number;
}

export default function Header({ activeSection, onSectionChange, onNavigate, currentRole, unreadCount }: HeaderProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch((err) => console.log("Header current user fetch error", err));
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const page = pageTitles[activeSection] || pageTitles.dashboard;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Researcher': return '#4f46e5';
      case 'Lecturer/Student': return '#10b981';
      case 'Admin': return '#f59e0b';
      default: return '#4f46e5';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: SIDEBAR_WIDTH,
        right: 0,
        height: HEADER_HEIGHT,
        bgcolor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        px: 4,
        gap: 2,
        zIndex: 1100,
      }}
    >
      {/* Page Title */}
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.02em' }}
        >
          {page.title}
        </Typography>
        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
          {page.subtitle}
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#f1f5f9',
          borderRadius: 3,
          px: 2,
          py: 0.75,
          gap: 1.5,
          width: 380,
          border: '1.5px solid transparent',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus-within': {
            bgcolor: '#fff',
            borderColor: '#4f46e5',
            boxShadow: '0 4px 12px rgba(79,70,229,0.12)',
            width: 420,
          },
        }}
      >
        <Search sx={{ color: '#94a3b8', fontSize: 18 }} />
        <InputBase
          placeholder="Search papers, authors, journals..."
          sx={{ fontSize: '0.85rem', color: '#0f172a', flex: 1, fontWeight: 500, '& input::placeholder': { color: '#94a3b8', opacity: 1 } }}
        />
        <Box sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 700, border: '1px solid #e2e8f0', px: 0.5, borderRadius: 0.5, bgcolor: '#fff' }}>/</Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Notifications">
          <IconButton
            onClick={() => onSectionChange('notifications')}
            sx={{
              width: 40,
              height: 40,
              bgcolor: activeSection === 'notifications' ? 'rgba(79,70,229,0.08)' : 'transparent',
              color: activeSection === 'notifications' ? '#4f46e5' : '#64748b',
              border: '1px solid',
              borderColor: activeSection === 'notifications' ? 'rgba(79,70,229,0.2)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(79,70,229,0.05)', color: '#4f46e5' },
            }}
          >
            <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16, fontWeight: 700, border: '2px solid #fff' } }}>
              <Notifications sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />

        {/* User Profile */}
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            pl: 1,
            pr: 1.5,
            py: 0.5,
            borderRadius: 10,
            border: '1.5px solid transparent',
            bgcolor: 'transparent',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#e2e8f0' },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: `linear-gradient(135deg, ${getRoleColor(currentUser?.role || currentRole)}, #312e81)`,
              fontSize: '0.85rem',
              fontWeight: 800,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {(currentUser?.fullName || "Dr. User").charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
              {currentUser?.fullName || "Dr. User"}
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
              {normalizeRole(currentUser?.role || currentRole)}
            </Typography>
          </Box>
          <KeyboardArrowDown sx={{ fontSize: 16, color: '#94a3b8' }} />
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { mt: 1.5, minWidth: 240, borderRadius: 3, boxShadow: '0 12px 32px rgba(0,0,0,0.15)', border: '1px solid #f1f5f9', p: 0.5 },
        }}
      >
        <Box sx={{ px: 2, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
             <Avatar sx={{ width: 44, height: 44, bgcolor: getRoleColor(currentUser?.role || currentRole) }}>{(currentUser?.fullName || "Dr. User").charAt(0).toUpperCase()}</Avatar>
             <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>{currentUser?.fullName || "Dr. User"}</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>{currentUser?.email || "user@university.edu"}</Typography>
             </Box>
          </Box>
          <Chip
            label={normalizeRole(currentUser?.role || currentRole)}
            size="small"
            sx={{
              bgcolor: `${getRoleColor(currentUser?.role || currentRole)}15`,
              color: getRoleColor(currentUser?.role || currentRole),
              height: 22,
              fontSize: '0.65rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          />
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { onSectionChange('profile'); setAnchorEl(null); }} sx={{ borderRadius: 1.5, gap: 1.5, fontSize: '0.85rem', py: 1.25 }}>
          <ListItemIcon><Person fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon> Account Settings
        </MenuItem>
        <MenuItem onClick={() => { onSectionChange('bookmarks'); setAnchorEl(null); }} sx={{ borderRadius: 1.5, gap: 1.5, fontSize: '0.85rem', py: 1.25 }}>
          <ListItemIcon><Bookmark fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon> Saved Collections
        </MenuItem>
        <MenuItem onClick={() => { onSectionChange('settings'); setAnchorEl(null); }} sx={{ borderRadius: 1.5, gap: 1.5, fontSize: '0.85rem', py: 1.25 }}>
          <ListItemIcon><Settings fontSize="small" sx={{ color: '#64748b' }} /></ListItemIcon> System Preferences
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => { setAnchorEl(null); onNavigate('login'); }}
          sx={{ borderRadius: 1.5, gap: 1.5, fontSize: '0.85rem', py: 1.25, color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
        >
          <ListItemIcon><Logout fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon> Sign Out
        </MenuItem>
      </Menu>
    </Box>
  );
}
