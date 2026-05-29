import {
  Dialog, DialogTitle, DialogContent, Box, Typography, Chip, Button, Divider,
} from "@mui/material";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { ExternalLink } from "lucide-react";

export interface Paper {
  id: number;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  citations: number;
  doi: string;
  keywords: string[];
}

interface PaperDetailProps {
  open: boolean;
  paper: Paper | null;
  onClose: () => void;
}

const keywordTrend: any[] = [];

export default function PaperDetail({ open, paper, onClose }: PaperDetailProps) {
  if (!paper) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, fontSize: "1.15rem", pb: 1 }}>
        {paper.title}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <Chip label={paper.journal} size="small" sx={{ bgcolor: "#4f46e5", color: "#fff", fontWeight: 600 }} />
          <Chip label={String(paper.year)} size="small" />
          <Chip label={`${paper.citations} citations`} size="small" />
          {paper.keywords.map((kw) => (
            <Chip key={kw} label={kw} size="small" variant="outlined" />
          ))}
        </Box>

        <Typography sx={{ fontSize: "0.9rem", color: "#64748b", mb: 1 }}>
          {paper.authors.join(", ")}
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Abstract</Typography>
        <Typography sx={{ fontSize: "0.92rem", color: "#475569", mb: 2 }}>
          {paper.abstract}
        </Typography>

        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Citation Trend</Typography>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={keywordTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line dataKey="count" stroke="#4f46e5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<ExternalLink size={14} />}
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noreferrer"
            sx={{ bgcolor: "#4f46e5", "&:hover": { bgcolor: "#4338ca" }, textTransform: "none" }}
          >
            View on DOI
          </Button>
          <Button onClick={onClose} sx={{ textTransform: "none" }}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
