import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { BlogCard } from "@/components/pages/BlogCard";
import { blogPosts } from "@/content/blog";

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Everyday Digital Solutions Blog",
  "url": "https://everydaydigitalsolutions.com/blog",
  "description": "Insights on custom app development, AI voice agents, and business automation for service businesses in India and Punjab.",
  "author": {
    "@type": "Person",
    "name": "Shushant Bangar"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Everyday Digital Solutions",
    "logo": {
      "@type": "ImageObject",
      "url": "https://everydaydigitalsolutions.com/logo.png"
    }
  }
};

const sorted = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function BlogIndex() {
  return (
    <>
      <SEO
        title="Blog — App Development, AI & Automation Insights for Indian Businesses"
        description="Practical articles on custom mobile app development, AI voice agents, business automation, and the tools that help service businesses in India and Punjab compete and grow."
        canonical="/blog"
        jsonLd={blogSchema}
      />
      <Navbar />
      <main className="bg-background min-h-[100dvh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 lg:pt-28">
          <span className="inline-block bg-[var(--accent-soft)] text-primary px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-6">
            Blog
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 leading-tight">
            Insights on apps, AI, and automation for Indian businesses.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Practical articles from the EDS team — no fluff, no agency-speak. Just honest perspectives on what works for service businesses in India.
          </p>
        </div>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sorted.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center">
          <div className="bg-card border border-border/40 p-8 sm:p-12 rounded-xl">
            <h2 className="text-2xl font-serif mb-4">Ready to build something?</h2>
            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
              We work with service businesses across Punjab and India. Tell us what you are building and we will get back to you within one business day.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-black px-8 py-4 rounded-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Start a Project
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
