import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/blogs/[id] - full update
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, excerpt, content, author, category, readTime, slug, image, published } = body;

    const resolvedSlug = slug?.trim() || title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title:     title?.trim(),
        excerpt:   excerpt?.trim(),
        content:   content?.trim() ?? '',
        author:    author?.trim(),
        category:  category,
        readTime:  readTime,
        slug:      resolvedSlug,
        image:     image ?? '',
        published: published ?? false,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    console.error('PUT /api/blogs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// PATCH /api/blogs/[id] - toggle published
export async function PATCH(request, { params }) {
  try {
    const id = parseInt(params.id);
    const { published } = await request.json();

    const post = await prisma.blogPost.update({
      where: { id },
      data: { published },
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    console.error('PATCH /api/blogs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE /api/blogs/[id]
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    console.error('DELETE /api/blogs/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
