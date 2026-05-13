import { useParams } from "wouter";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { BlogCard } from "@/components/pages/BlogCard";
import { LeadMagnet } from "@/components/LeadMagnet";
import { OptimizedImage } from "@/components/OptimizedImage";
import { blogPosts, getBlogPost } from "@/content/blog";

const BASE_URL = "https://everydaydigitalsolutions.com";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = getBlogPost(params.slug);

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="bg-background min-h-[100dvh] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl font-serif mb-4">Article not found</h1>
            <Link href="/blog" className="text-primary text-sm hover:text-primary/80 transition-colors">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Everyday Digital Solutions",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "image": `${BASE_URL}/opengraph.jpg`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`
    }
  };

  const related = blogPosts.filter((p) => post.relatedSlugs.includes(p.slug));

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        jsonLd={articleSchema}
      />
      <Navbar />
      <main className="bg-background min-h-[100dvh]">
        {/* Header */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-12 lg:pt-28">
          <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block">
            ← Back to Blog
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-primary bg-[var(--accent-soft)] px-2 py-0.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-muted-foreground border-b border-border/40 pb-6 mb-10">
            <span className="font-medium text-foreground">{post.author.name}</span>
            <span>·</span>
            <span>{post.author.role}</span>
            <span>·</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">{post.excerpt}</p>

          {post.sections.map((section, i) => (
            <section key={i} className="mb-10">
              <h2 className="text-xl sm:text-2xl font-serif mb-4 text-foreground">{section.heading}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.body}</p>
            </section>
          ))}

          <div className="mt-12 mb-4">
            <LeadMagnet variant="compact" source={`blog:${post.slug}`} />
          </div>
        </article>

        {/* Explore further — internal links to service/solution/location pages */}
        {post.relatedLinks.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="border border-border/40 bg-card p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Explore further</h2>
              <div className="flex flex-col gap-3">
                {post.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-start gap-3 hover:text-primary transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors block">{link.label}</span>
                      <span className="text-xs text-muted-foreground">{link.description}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Author bio */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="border-t border-border/40 pt-8 flex gap-4 items-start">
            <OptimizedImage
              src="/photos/founder.png"
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
            />
            <div>
              <p className="font-medium text-foreground text-sm">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.role}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Shushant has been building software products for service businesses in India since 2018. He leads every project at EDS personally.
              </p>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <h2 className="text-xl font-serif mb-6">Related articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <div className="bg-card border border-border/40 p-8 sm:p-12 rounded-xl">
            <h2 className="text-2xl font-serif mb-4">Ready to build something?</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              We work with service businesses across Punjab and India. Tell us what you are building and we will get back to you within one business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start a Project
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
