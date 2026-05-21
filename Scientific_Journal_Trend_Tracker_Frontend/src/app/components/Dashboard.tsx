import { Box } from "@mui/material";
import ResearcherDashboard from "./ResearcherDashboard";
import AdminDashboard from "./AdminDashboard";

interface DashboardProps {
  role: string;
  onSectionChange?: (section: string) => void;
  onNavigate?: (page: string) => void;
}

export default function Dashboard({ role, onSectionChange, onNavigate }: DashboardProps) {
  if (role === "Admin") {
    return <AdminDashboard onNavigate={onNavigate} />;
  }

  if (role === "Researcher") {
    return <ResearcherDashboard onNavigate={onNavigate} />;
  }

  if (role === "Lecturer/Student") {
    return <ResearcherDashboard onNavigate={onNavigate} />;
  }

  return <Box>Dashboard not available</Box>;
}
