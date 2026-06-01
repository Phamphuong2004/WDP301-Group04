import { Box } from "@mui/material";
import ResearcherDashboard from "./ResearcherDashboard";
import AdminDashboard from "./AdminDashboard";

interface DashboardProps {
  role: string;
  onSectionChange?: (section: string) => void;
  onNavigate?: (page: string) => void;
}

export default function Dashboard({ role, onSectionChange, onNavigate }: DashboardProps) {
  if (role === "admin") {
    return <AdminDashboard onNavigate={onNavigate} />;
  }

  if (role === "researcher") {
    return <ResearcherDashboard onNavigate={onNavigate} />;
  }

  if (role === "user") {
    return <ResearcherDashboard onNavigate={onNavigate} />;
  }

  return <Box>Dashboard not available</Box>;
}
