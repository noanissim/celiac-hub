import { useState } from "react";
import { FileText, ExternalLink, Calendar, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticles, type Article } from "@/hooks/useArticles";

function isNew(createdAt: string | null) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < 24 * 60 * 60 * 1000;
}

const categoryStyle: Record<string, string> = {
  research: "bg-blue-500/15 text-blue-700 border-blue-200",
  news: "bg-amber-500/15 text-amber-700 border-amber-200",
};

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group rounded-xl border bg-card p-6 transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <div className="flex items-start gap-4">
        {/* Left accent line */}
        <div className="hidden sm:block w-1 self-stretch rounded-full bg-primary/20 group-hover:bg-primary/50 transition-colors" />

        <div className="flex-1 min-w-0 space-y-3">
          {/* Header row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider ${categoryStyle[article.category] ?? ""}`}>
              {article.category}
            </Badge>
            {isNew(article.createdAt) && (
              <Badge className="bg-green-500/90 text-white text-[10px] px-1.5 py-0 leading-5 hover:bg-green-500">
                NEW
              </Badge>
            )}
          </div>

          {/* Title */}
          <h2 className="font-display text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
            {article.title}
          </h2>

          {/* Date */}
          {article.publishedDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(article.publishedDate).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <p className="text-sm text-foreground/75 leading-relaxed max-w-prose">
              {article.summary}
            </p>
          )}

          {/* CTA */}
          {article.sourceUrl && (
            <Button variant="ghost" size="sm" asChild className="h-8 px-0 text-primary hover:text-primary/80 hover:bg-transparent">
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="gap-1.5">
                Read Full Article <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ArticlesPage() {
  const [tab, setTab] = useState<"all" | "research" | "news">("all");
  const category = tab === "all" ? undefined : tab;
  const { data: articles = [], isLoading } = useArticles(category);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <FileText className="mx-auto mb-3 h-10 w-10 text-primary" />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Celiac Research & Updates
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Stay informed with the latest celiac disease research, medical breakthroughs, and gluten-free living news.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Articles list */}
      {!isLoading && (
        <div className="space-y-5">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && articles.length === 0 && (
        <div className="py-16 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">No articles yet</p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Research articles and news will appear here once added.
          </p>
        </div>
      )}
    </div>
  );
}
