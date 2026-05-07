import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/content/blog";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-card border border-border/40 p-6 sm:p-8 flex flex-col hover:border-primary transition-colors duration-300 group">
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs text-primary bg-[var(--accent-soft)] px-2 py-0.5 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      <h2 className="font-serif text-lg sm:text-xl mb-3 leading-snug flex-grow">
        {post.title}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs text-muted-foreground">
          {new Date(post.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {post.readTime}
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
        >
          Read <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
