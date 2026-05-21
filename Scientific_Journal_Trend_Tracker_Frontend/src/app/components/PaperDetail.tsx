import { useMemo, useState } from 'react';
import {
  Box, Typography, Dialog, DialogContent, IconButton, Chip, Button, Grid, Paper, List, ListItem, ListItemText,
} from '@mui/material';
import { Bookmark, UserPlus, Copy, X } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export interface Paper {
  id: number;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  keywords: string[];
  citations: number;
}

interface PaperDetailProps {
  open: boolean;
  paper: Paper | null;
  onClose: () => void;
}

const relatedPapers: Paper[] = [
  {
    id: 101,
    title: 'Scaling Laws for Neural Language Models',
    abstract: 'Empirical scaling behaviors across model, data, and compute.',
    authors: ['Jared Kaplan', 'Sam McCandlish'],
    journal: 'arXiv',
    year: 2020,
    doi: '10.48550/arXiv.2001.08361',
    keywords: ['LLM', 'Scaling Laws'],
    citations: 8450,
  },
  {
    id: 102,
    title: 'InstructGPT: Training Language Models to Follow Instructions',
    abstract: 'Alignment via human feedback for instruction-following models.',
    authors: ['Long Ouyang', 'Jeff Wu'],
    journal: 'NeurIPS',
    year: 2022,
    doi: '10.48550/arXiv.2203.02155',
    keywords: ['Alignment', 'RLHF'],
    citations: 10050,
  },
];

const keywordTrend = [
  { year: 2019, count: 120 },
  { year: 2020, count: 190 },
  { year: 2021, count: 280 },
  { year: 2022, count: 410 },
  { year: 2023, count: 560 },
  { year: 2024, count: 720 },
  { year: 2025, count: 880 },
];

const buildCitation = (paper: Paper, format: 'APA' | 'MLA' | 'BibTeX') => {
  const authorText = paper.authors.join(', ');
  if (format === 'APA') return `${authorText} (${paper.year}). ${paper.title}. ${paper.journal}. https://doi.org/${paper.doi}`;
  if (format === 'MLA') return `${authorText}. "${paper.title}." ${paper.journal}, ${paper.year}, doi:${paper.doi}.`;
  return `@article{paper_${paper.id},\n  title={${paper.title}},\n  author={${authorText}},\n  journal={${paper.journal}},\n  year={${paper.year}},\n  doi={${paper.doi}}\n}`;
};

export default function PaperDetail({ open, paper, onClose }: PaperDetailProps) {
  const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'BibTeX'>('APA');

  const citationText = useMemo(() => (paper ? buildCitation(paper, citationFormat) : ''), [paper, citationFormat]);

  const copyCitation = async () => {
    if (!citationText) return;
    await navigator.clipboard.writeText(citationText);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, pr: 2 }}>{paper?.title}</Typography>
          <IconButton onClick={onClose}><X size={18} /></IconButton>
        </Box>

        {paper && (
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 2.5, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Abstract</Typography>
                <Typography sx={{ color: '#475569' }}>{paper.abstract}</Typography>
              </Paper>

              <Paper sx={{ p: 2.5, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Publication Info</Typography>
                <Typography><strong>Authors:</strong> {paper.authors.join(', ')}</Typography>
                <Typography><strong>Journal:</strong> {paper.journal}</Typography>
                <Typography><strong>Year:</strong> {paper.year}</Typography>
                <Typography><strong>DOI:</strong> {paper.doi}</Typography>
                <Typography><strong>Citations:</strong> {paper.citations}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {paper.keywords.map((kw) => <Chip key={kw} label={kw} size="small" />)}
                </Box>
              </Paper>

              <Paper sx={{ p: 2.5, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Publication Trend</Typography>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={keywordTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 2.5, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  <Button startIcon={<Bookmark size={16} />} variant="contained">Bookmark</Button>
                  <Button startIcon={<UserPlus size={16} />} variant="outlined">Follow Author</Button>
                </Box>
              </Paper>

              <Paper sx={{ p: 2.5, mb: 2 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Copy Citation</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1.2 }}>
                  {(['APA', 'MLA', 'BibTeX'] as const).map((f) => (
                    <Chip key={f} label={f} clickable color={citationFormat === f ? 'primary' : 'default'} onClick={() => setCitationFormat(f)} />
                  ))}
                </Box>
                <Paper variant="outlined" sx={{ p: 1.5, mb: 1.2, bgcolor: '#f8fafc' }}>
                  <Typography sx={{ fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>{citationText}</Typography>
                </Paper>
                <Button startIcon={<Copy size={16} />} onClick={copyCitation} fullWidth>Copy</Button>
              </Paper>

              <Paper sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Related Papers</Typography>
                <List dense>
                  {relatedPapers.map((rp) => (
                    <ListItem key={rp.id} disablePadding>
                      <ListItemText primary={rp.title} secondary={`${rp.journal} • ${rp.year}`} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
}
