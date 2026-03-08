import { useState } from "react";
import { FileText, ExternalLink, Calendar, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticles, type Article } from "@/hooks/useArticles";

function isNew(createdAt: string | null) {
  if (!createdAt) return false;
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 24 * 60 * 60 * 1000;
}

function ArticleCard({ article }: { article: Article }) {
  const isResearch = article.category === "research";

  return (
    <article className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex items-start gap-4">
        {/* Category indicator */}
        <div
          className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            isResearch ? "bg-primary/10 text-primary" : "bg-accent/30 text-accent-foreground"
          }`}
        >
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                {isNew(article.createdAt) && (
                  <Badge className="bg-green-500/90 text-white text-[10px] px-1.5 py-0 leading-5 hover:bg-green-500">
                    NEW
                  </Badge>
                )}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {article.publishedDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(article.publishedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {isResearch ? "Research" : "News"}
                </span>
              </div>
            </div>
          </div>

          {/* Summary */}
          {article.summary && (
            <p className="text-sm leading-relaxed text-foreground/75">{article.summary}</p>
          )}

          {/* CTA */}
          {article.sourceUrl && (
            <Button variant="outline" size="sm" asChild className="mt-1">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Read Full Article
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
      <div className="mb-8 text-center">
        <FileText className="mx-auto mb-2 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          Celiac Research & Updates
        </h1>
        <p className="mt-2 max-w-xl mx-auto text-muted-foreground leading-relaxed">
          Stay informed with the latest celiac disease research, gluten-free news, and medical updates — curated for the community.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-6">
        <TabsList className="mx-auto grid w-full max-w-sm grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
      </Tabs>

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

      {/* Articles list */}
      {!isLoading && articles.length > 0 && (
        <div className="space-y-4">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && articles.length === 0 && (
        <div className="py-16 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">
            No articles yet. They'll appear here once added via the data pipeline.
          </p>
        </div>
      )}
    </div>
  );
}
