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
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (driveMatch) return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
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
              <div className="flex gap-3 flex-wrap">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://roomserviceai.com/blog/${decodeURIComponent(params.slug)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.257 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X (Twitter)
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://roomserviceai.com/blog/${decodeURIComponent(params.slug)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#005e8e] transition-colors font-medium text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://roomserviceai.com/blog/${decodeURIComponent(params.slug)}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1265d0] transition-colors font-medium text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
                <button
                  onClick={() => { navigator.clipboard.writeText(`https://roomserviceai.com/blog/${decodeURIComponent(params.slug)}`); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-charcoal rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  Copy Link
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
