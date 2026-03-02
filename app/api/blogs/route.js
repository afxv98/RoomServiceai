import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blogs?published=true&slug=some-slug
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';
    const slug = searchParams.get('slug');

    const where = {};
    if (publishedOnly) where.published = true;
    if (slug) where.slug = slug;

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (slug) {
      return NextResponse.json(posts[0] ?? null);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('GET /api/blogs error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST /api/blogs
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, author, category, readTime, slug, image, published } = body;

    if (!title?.trim() || !excerpt?.trim() || !author?.trim()) {
      return NextResponse.json({ error: 'Title, excerpt, and author are required' }, { status: 400 });
    }

    const resolvedSlug = slug?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const post = await prisma.blogPost.create({
      data: {
        title:     title.trim(),
        excerpt:   excerpt.trim(),
        content:   content?.trim() ?? '',
        author:    author.trim(),
        category:  category ?? 'Technology',
        readTime:  readTime ?? '',
        slug:      resolvedSlug,
        image:     image ?? '',
        published: published ?? false,
        date:      new Date().toISOString().split('T')[0],
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    console.error('POST /api/blogs error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
