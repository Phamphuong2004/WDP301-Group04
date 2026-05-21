import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Pagination,
} from "@mui/material";
import { Search, User, Calendar, BookOpen, Quote } from "lucide-react";
import PaperDetail, { type Paper as PaperType } from "./PaperDetail";

const papers: PaperType[] = [
  {
    id: 1,
    title: "Constitutional AI: Harmlessness from AI Feedback",
    authors: ["Yuntao Bai", "Saurav Kadavath"],
    journal: "arXiv",
    year: 2022,
    abstract: "Training harmless assistants with AI feedback.",
    citations: 450,
    doi: "10.48550/arXiv.2212.08073",
    keywords: ["AI Safety", "LLM", "RLHF"],
  },
  {
    id: 2,
    title: "Attention Is All You Need",
    authors: ["Ashish Vaswani", "Noam Shazeer"],
    journal: "NeurIPS",
    year: 2017,
    abstract: "Transformer architecture for sequence modeling.",
    citations: 98500,
    doi: "10.48550/arXiv.1706.03762",
    keywords: ["Transformer", "NLP"],
  },
  {
    id: 3,
    title: "Language Models are Few-Shot Learners",
    authors: ["Tom Brown", "Benjamin Mann"],
    journal: "NeurIPS",
    year: 2020,
    abstract: "Large-scale language models and in-context learning.",
    citations: 24300,
    doi: "10.48550/arXiv.2005.14165",
    keywords: ["GPT-3", "LLM"],
  },
];

export default function SearchPapers() {
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("all");
  const [journal, setJournal] = useState("all");
  const [field, setField] = useState("all");
  const [yearRange, setYearRange] = useState("all");
  const [citationRange, setCitationRange] = useState("all");
  const [sort, setSort] = useState("relevant");
  const [page, setPage] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(null);

  const filtered = useMemo(() => {
    let list = papers.filter(
      (p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.authors.join(",").toLowerCase().includes(query.toLowerCase()),
    );
    if (author !== "all")
      list = list.filter((p) => p.authors.join(",").includes(author));
    if (journal !== "all") list = list.filter((p) => p.journal === journal);
    if (field !== "all")
      list = list.filter((p) =>
        p.keywords.join(",").toLowerCase().includes(field.toLowerCase()),
      );
    if (yearRange === "2020+") list = list.filter((p) => p.year >= 2020);
    if (yearRange === "2015-2019")
      list = list.filter((p) => p.year >= 2015 && p.year <= 2019);
    if (citationRange === "1000+")
      list = list.filter((p) => p.citations >= 1000);
    if (citationRange === "100-999")
      list = list.filter((p) => p.citations >= 100 && p.citations < 1000);

    if (sort === "newest") list = [...list].sort((a, b) => b.year - a.year);
    if (sort === "cited")
      list = [...list].sort((a, b) => b.citations - a.citations);
    return list;
  }, [query, author, journal, field, yearRange, citationRange, sort]);

  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
          background:
            "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.08))",
          border: "1px solid rgba(79,70,229,0.2)",
        }}
      >
        <Typography
          sx={{ fontSize: "1.35rem", fontWeight: 800, mb: 2, color: "#4f46e5" }}
        >
          🔎 Search Papers
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              placeholder="Search title / author"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} style={{ color: "#4f46e5" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Author</InputLabel>
              <Select
                label="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Ashish Vaswani,Noam Shazeer">
                  Vaswani et al.
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Journal</InputLabel>
              <Select
                label="Journal"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="NeurIPS">NeurIPS</MenuItem>
                <MenuItem value="arXiv">arXiv</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Field</InputLabel>
              <Select
                label="Field"
                value={field}
                onChange={(e) => setField(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="LLM">LLM</MenuItem>
                <MenuItem value="NLP">NLP</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                label="Year"
                value={yearRange}
                onChange={(e) => setYearRange(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="2020+">2020+</MenuItem>
                <MenuItem value="2015-2019">2015-2019</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Citation</InputLabel>
              <Select
                label="Citation"
                value={citationRange}
                onChange={(e) => setCitationRange(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="1000+">1000+</MenuItem>
                <MenuItem value="100-999">100-999</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Sort</InputLabel>
              <Select
                label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value="relevant">Most Relevant</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
                <MenuItem value="cited">Most Cited</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {paginated.map((paper) => (
        <Card
          key={paper.id}
          sx={{
            mb: 2,
            borderRadius: 3,
            border: "1px solid rgba(79,70,229,0.1)",
            transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            "&:hover": {
              boxShadow: "0 12px 32px rgba(79,70,229,0.15)",
              transform: "translateY(-4px)",
              borderColor: "rgba(79,70,229,0.3)",
            },
          }}
        >
          <CardContent>
            <Typography
              sx={{
                fontWeight: 800,
                cursor: "pointer",
                color: "#4f46e5",
                fontSize: "1.05rem",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => setSelectedPaper(paper)}
            >
              {paper.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                color: "#64748b",
                my: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                  bgcolor: "rgba(102,126,234,0.08)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <User size={14} style={{ color: "#667eea" }} />
                <Typography sx={{ fontSize: "0.85rem" }}>
                  {paper.authors.join(", ")}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                  bgcolor: "rgba(245,87,108,0.08)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <BookOpen size={14} style={{ color: "#f5576c" }} />
                <Typography sx={{ fontSize: "0.85rem" }}>
                  {paper.journal}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                  bgcolor: "rgba(79,184,254,0.08)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Calendar size={14} style={{ color: "#4facfe" }} />
                <Typography sx={{ fontSize: "0.85rem" }}>
                  {paper.year}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                  bgcolor: "rgba(67,233,123,0.08)",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Quote size={14} style={{ color: "#43e97b" }} />
                <Typography sx={{ fontSize: "0.85rem" }}>
                  {paper.citations}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ color: "#475569", fontSize: "0.9rem", my: 1 }}>
              {paper.abstract}
            </Typography>
            <Button
              sx={{
                mt: 1,
                bgcolor: "#4f46e5",
                color: "#fff",
                "&:hover": { bgcolor: "#4338ca" },
              }}
              onClick={() => setSelectedPaper(paper)}
            >
              View Detail
            </Button>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, p) => setPage(p)}
        />
      </Box>
      <PaperDetail
        open={Boolean(selectedPaper)}
        paper={selectedPaper}
        onClose={() => setSelectedPaper(null)}
      />
    </Box>
  );
}
