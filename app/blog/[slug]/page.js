'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Clock, User, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

// Convert Google Drive share URLs to direct-embed URLs
function toDirectImageUrl(url) {
  if (!url) return url;
  // https://drive.google.com/file/d/FILE_ID/view?...
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  return url;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodedSlug = decodeURIComponent(params.slug);
    fetch(`/api/blogs?slug=${encodeURIComponent(decodedSlug)}`)
      .then((r) => r.json())
      .then((data) => setPost(data ?? null))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-24 bg-offwhite flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper mx-auto mb-4"></div>
            <p className="text-charcoal/60">Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-24 bg-offwhite">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-charcoal mb-6 font-cormorant">
              Blog Post Not Found
            </h1>
            <p className="text-charcoal/70 mb-2">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <p className="text-sm text-charcoal/40 mb-8 font-mono">slug: "{decodeURIComponent(params.slug)}"</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-copper text-white rounded-lg font-semibold hover:bg-copper-hover transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Article Header */}
      <div className="pt-32 pb-12 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <span className="inline-block px-3 py-1 bg-copper text-white text-xs font-bold rounded-full uppercase mb-4">
            {post.category}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-cormorant">
            {post.title}
          </h1>

          <p className="text-xl text-white/90 mb-8">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="py-12 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Article Image */}
              {post.image && (
                <div className="mb-8 -mx-8 md:-mx-12 -mt-8 md:-mt-12">
                  <img
                    src={toDirectImageUrl(post.image)}
                    alt={post.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="text-charcoal/80 leading-relaxed">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-charcoal mb-4">Share this article</h3>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Twitter
                </button>
                <button className="px-4 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  LinkedIn
                </button>
                <button className="px-4 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Facebook
                </button>
              </div>
            </div>
          </article>

          {/* Back to Blog CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-lg font-semibold hover:bg-charcoal-darker transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Read More Articles
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
