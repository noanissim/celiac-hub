import { useState } from "react";
import { FileText, ExternalLink, Calendar, Tag, ArrowUpDown, Filter, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useArticles, useArticleSources, type Article, type SortField, type SortDir } from "@/hooks/useArticles";
import { FavoriteButton } from "@/components/FavoriteButton";

function isNew(createdAt: string | null) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

function ArticleCard({ article }: { article: Article }) {
  const isResearch = article.category === "research";
  return (
    <article className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex items-start gap-4">
        <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isResearch ? "bg-primary/10 text-primary" : "bg-accent/30 text-accent-foreground"}`}>
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              {isNew(article.createdAt) && (
                <Badge className="bg-green-500/90 text-white text-[10px] px-1.5 py-0 leading-5 hover:bg-green-500">NEW</Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              {article.publishedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(article.publishedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
              {article.sourceName && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {article.sourceName}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {isResearch ? "Research" : "News"}
              </span>
            </div>
          </div>
          {article.summary && (
            <p className="text-sm leading-relaxed text-foreground/75">{article.summary}</p>
          )}
          {article.sourceUrl && (
            <Button variant="outline" size="sm" asChild className="mt-1">
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> Read Full Article
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

const YEARS = [2026, 2025, 2024];

export default function ArticlesPage() {
  const [tab, setTab] = useState<"all" | "research" | "news">("all");
  const [source, setSource] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortField>("published_date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: sources = [] } = useArticleSources();
  const { data: articles = [], isLoading } = useArticles({
    category: tab === "all" ? undefined : tab,
    sourceName: source === "all" ? undefined : source,
    year: year === "all" ? undefined : Number(year),
    sortBy,
    sortDir,
  });

  const toggleSortDir = () => setSortDir((d) => (d === "desc" ? "asc" : "desc"));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <FileText className="mx-auto mb-2 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Celiac Research & Updates</h1>
        <p className="mt-2 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          Stay informed with the latest celiac disease research, gluten-free news, and medical updates.
        </p>
      </div>

      {/* Category tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-4">
        <TabsList className="mx-auto grid w-full max-w-sm grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters row */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" /> Filters:
        </div>

        {/* Year */}
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="h-8 w-[110px] text-xs">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source */}
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="h-8 w-[180px] text-xs">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortField)}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="published_date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="source_name">Source</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={toggleSortDir} className="h-8 px-2 text-xs gap-1">
          <ArrowUpDown className="h-3.5 w-3.5" />
          {sortDir === "desc" ? "Newest" : "Oldest"}
        </Button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-xl border bg-card p-6">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Articles */}
      {!isLoading && articles.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">{articles.length} article{articles.length !== 1 ? "s" : ""}</p>
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && articles.length === 0 && (
        <div className="py-16 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">No articles match your filters.</p>
        </div>
      )}
    </div>
  );
}
