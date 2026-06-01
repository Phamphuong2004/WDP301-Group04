import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BookOpen, Calendar, Quote, Search, User, FilterX } from "lucide-react";
import PaperDetail from "./PaperDetail";
import {
  getPapers,
  searchPapers as searchPapersAPI,
  type Paper as ApiPaper,
} from "../../services/api";

type SearchPaperCard = {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  abstract: string;
  citations: number;
  doi: string;
  keywords: string[];
};

const PAGE_SIZE = 10;

const sortOptions = [
  { value: "-publicationYear", label: "Newest first" },
  { value: "publicationYear", label: "Oldest first" },
  { value: "-citationCount", label: "Most cited first" },
  { value: "citationCount", label: "Least cited first" },
];

const mapPaper = (paper: ApiPaper | any): SearchPaperCard => {
  const authors = Array.isArray(paper.authors)
    ? paper.authors.map((author: any) => {
        if (typeof author === "string") {
          return author;
        }
        return (
          author?.fullName ||
          author?.name ||
          author?.email ||
          author?._id ||
          "Unknown author"
        );
      })
    : [];

  const keywords = Array.isArray(paper.keywords)
    ? paper.keywords
        .map((keyword: any) => {
          if (typeof keyword === "string") {
            return keyword;
          }
          return keyword?.name || keyword?._id || "";
        })
        .filter(Boolean)
    : [];

  return {
    id: String(paper._id),
    title: paper.title ?? "Untitled paper",
    authors,
    journal:
      paper.journalId?.name ?? paper.journal?.name ?? paper.journal ?? "",
    year: paper.publicationYear ?? 0,
    abstract: paper.abstract ?? "",
    citations: paper.citationCount ?? paper.citations ?? 0,
    doi: paper.doi ?? "",
    keywords,
  };
};

export default function SearchPapers() {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("-publicationYear");
  const [page, setPage] = useState(1);
  const [selectedPaper, setSelectedPaper] = useState<SearchPaperCard | null>(
    null,
  );
  const [results, setResults] = useState<SearchPaperCard[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    pages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [query, year, sort]);

  useEffect(() => {
    let isActive = true;
    const trimmedQuery = query.trim();
    const yearValue = year.trim() ? Number(year) : undefined;
    const normalizedYear = Number.isFinite(yearValue as number)
      ? yearValue
      : undefined;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        if (trimmedQuery) {
          const response = await searchPapersAPI(trimmedQuery, {
            year: normalizedYear,
            page,
            limit: PAGE_SIZE,
            sort,
          });

          if (!isActive) return;
          setResults(response.papers.map(mapPaper));
          setPagination(response.pagination);
        } else {
          const response = await getPapers(page, PAGE_SIZE);

          if (!isActive) return;
          setResults((response.papers ?? []).map(mapPaper));
          setPagination(
            response.pagination ?? {
              page,
              limit: PAGE_SIZE,
              total: response.papers?.length ?? 0,
              pages: 1,
            },
          );
        }
      } catch (err: any) {
        if (!isActive) return;
        setError(err?.message || "Failed to load papers");
        setResults([]);
        setPagination({ page: 1, limit: PAGE_SIZE, total: 0, pages: 1 });
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [query, year, sort, page]);

  const handleReset = () => {
    setQuery("");
    setYear("");
    setSort("-publicationYear");
    setPage(1);
  };

  const currentModeLabel = query.trim()
    ? "Backend search: title, abstract, author, journal"
    : "Recent papers";

  return (
    <Box>
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          mb: 3,
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(79,70,229,0.92))",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(16,185,129,0.14), transparent 28%)",
            pointerEvents: "none",
          }}
        />
        <Stack spacing={1.5} sx={{ position: "relative", zIndex: 1 }}>
          <Box>
            <Typography
              sx={{
                fontSize: "1.45rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Discovery Engine
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", mt: 0.5 }}>
              Search scientific papers by title, abstract, author, or journal.
            </Typography>
          </Box>

          <Grid container spacing={1.5} alignItems="stretch">
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                placeholder="Search papers, authors, journals..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPage(1);
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={18} style={{ color: "#64748b" }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  borderRadius: 2,
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                inputProps={{ min: 1900, max: new Date().getFullYear() }}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.98)",
                  borderRadius: 2,
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Sort</InputLabel>
                <Select
                  label="Sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.98)",
                    borderRadius: 2,
                  }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Stack
                direction={{ xs: "row", md: "column" }}
                spacing={1}
                sx={{ height: "100%" }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setPage(1)}
                  sx={{
                    bgcolor: "#fff",
                    color: "#111827",
                    fontWeight: 700,
                    textTransform: "none",
                    minHeight: 56,
                    "&:hover": { bgcolor: "#f8fafc" },
                  }}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleReset}
                  startIcon={<FilterX size={16} />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.35)",
                    color: "#fff",
                    fontWeight: 700,
                    textTransform: "none",
                    minHeight: 56,
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Reset
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Chip
              icon={<BookOpen size={14} />}
              label={currentModeLabel}
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <Chip
              icon={<Calendar size={14} />}
              label={`Page ${pagination.page} of ${pagination.pages}`}
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <Chip
              icon={<Quote size={14} />}
              label={`${pagination.total} results`}
              sx={{
                bgcolor: "rgba(255,255,255,0.12)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && results.length === 0 && (
        <Paper
          sx={{ p: 3, borderRadius: 3, textAlign: "center", color: "#64748b" }}
        >
          No papers found. Try another keyword or clear the filters.
        </Paper>
      )}

      {!loading &&
        results.map((paper) => (
          <Card
            key={paper.id}
            sx={{
              mb: 2,
              borderRadius: 3,
              border: "1px solid rgba(79,70,229,0.1)",
              transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
              "&:hover": {
                boxShadow: "0 12px 32px rgba(79,70,229,0.15)",
                transform: "translateY(-3px)",
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
                  gap: 1.5,
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
                    {paper.authors.length > 0
                      ? paper.authors.join(", ")
                      : "Unknown author"}
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
                    {paper.journal || "Unknown journal"}
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
                    {paper.year || "N/A"}
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

              {paper.keywords.length > 0 && (
                <Box
                  sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}
                >
                  {paper.keywords.slice(0, 4).map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}

              <Typography
                sx={{
                  color: "#475569",
                  fontSize: "0.9rem",
                  my: 1,
                  lineHeight: 1.7,
                }}
              >
                {paper.abstract || "No abstract available."}
              </Typography>

              <Button
                sx={{
                  mt: 1,
                  bgcolor: "#4f46e5",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#4338ca" },
                }}
                onClick={() => setSelectedPaper(paper)}
              >
                View Detail
              </Button>
            </CardContent>
          </Card>
        ))}

      {pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(_, nextPage) => setPage(nextPage)}
            color="primary"
          />
        </Box>
      )}

      <PaperDetail
        open={Boolean(selectedPaper)}
        paper={selectedPaper as any}
        onClose={() => setSelectedPaper(null)}
      />
    </Box>
  );
}
