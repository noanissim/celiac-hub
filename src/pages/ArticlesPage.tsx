import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useArticles, type Article } from "@/hooks/useArticles";

function isNew(createdAt: string | null) {
  if (!createdAt) return false;
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 24 * 60 * 60 * 1000;
}

function ArticleCard({ article }: { article: Article & { createdAt?: string } }) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-foreground">{article.title}</h3>
              {isNew(article.createdAt ?? null) && (
                <Badge className="bg-green-500/90 text-white text-[10px] px-1.5 py-0 leading-5 hover:bg-green-500">
                  NEW
                </Badge>
              )}
            </div>
            {article.publishedDate && (
              <p className="text-xs text-muted-foreground">
                {new Date(article.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {article.summary && <p className="text-sm text-foreground/80">{article.summary}</p>}
        {article.sourceUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" /> Read Source
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function ArticlesPage() {
  const [tab, setTab] = useState<"all" | "research" | "news">("all");
  const category = tab === "all" ? undefined : tab;
  const { data: articles = [], isLoading } = useArticles(category);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <FileText className="mx-auto mb-2 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Research & News</h1>
        <p className="mt-2 text-muted-foreground">Latest celiac disease research and gluten-free news</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-4">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {!isLoading && articles.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">No articles yet. They'll appear here once added via the data pipeline.</p>
        </div>
      )}
    </div>
  );
}
