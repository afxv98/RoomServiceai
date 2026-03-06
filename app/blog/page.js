'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import { Clock, User, ArrowRight } from 'lucide-react';

function toDirectImageUrl(url) {
  if (!url) return url;
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (driveMatch) return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  return url;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    fetch('/api/blogs?published=true')
      .then((r) => r.json())
      .then((data) => setBlogPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const categories = ['All', 'Technology', 'Best Practices', 'Business', 'Industry Trends', 'Implementation', 'Case Studies'];

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-gradient-to-br from-charcoal via-charcoal to-copper/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-cormorant">
            RoomService AI Blog
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Insights, updates, and best practices for hotel automation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 bg-offwhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border-2 border-charcoal text-charcoal hover:bg-charcoal-darker hover:text-white transition-colors font-medium"
              >
                {category}
              </button>
            ))}
          </div>

          {blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No blog posts available yet.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              <div className="mb-16">
                <div className="bg-offwhite rounded-lg shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="grid md:grid-cols-2">
                    {blogPosts[0].image ? (
                      <img
                        src={toDirectImageUrl(blogPosts[0].image)}
                        alt={blogPosts[0].title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-copper to-copper-hover h-64 md:h-auto flex items-center justify-center">
                        <div className="text-white text-center p-8">
                          <div className="text-6xl mb-4">📰</div>
                          <p className="text-lg font-medium">Featured Article</p>
                        </div>
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-copper text-white text-xs font-bold rounded-full uppercase">
                          {blogPosts[0].category}
                        </span>
                        <span className="text-sm text-gray-500">{new Date(blogPosts[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h2 className="text-3xl font-bold mb-4 font-cormorant text-charcoal">
                        {blogPosts[0].title}
                      </h2>
                      <p className="text-charcoal/70 mb-6">
                        {blogPosts[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{blogPosts[0].author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{blogPosts[0].readTime}</span>
                          </div>
                        </div>
                        <Link
                          href={`/blog/${blogPosts[0].slug}`}
                          className="flex items-center gap-2 text-copper hover:text-copper-hover font-bold transition-colors"
                        >
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Grid */}
              {blogPosts.length > 1 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogPosts.slice(1).map((post) => (
                    <div
                      key={post.id}
                      className="bg-offwhite rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {post.image ? (
                        <img
                          src={toDirectImageUrl(post.image)}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                          <div className="text-gray-400 text-5xl">📝</div>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-2 py-1 bg-gray-100 text-charcoal/80 text-xs font-bold rounded uppercase">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-charcoal font-cormorant line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-charcoal/70 mb-4 line-clamp-3 text-sm">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-copper hover:text-copper-hover font-bold text-sm transition-colors"
                          >
                            Read →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Newsletter Section */}
          <div className="mt-20 bg-gradient-to-br from-charcoal to-copper p-12 rounded-lg shadow-xl">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-white mb-4 font-cormorant">
                Stay Updated
              </h3>
              <p className="text-gray-200 mb-8">
                Subscribe to our newsletter for the latest insights on hotel automation and AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-8 py-4 bg-offwhite text-charcoal rounded-lg font-bold uppercase tracking-wide hover:bg-gray-100 transition-colors shadow-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
