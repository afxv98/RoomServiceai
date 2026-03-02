import { mockBlogPosts } from './mockData';

const STORAGE_KEY = 'roomservice_blog_posts';

// Get blog posts from localStorage, or use mock data if not available
export const getBlogPosts = () => {
  if (typeof window === 'undefined') return mockBlogPosts;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock data if nothing stored
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBlogPosts));
    return mockBlogPosts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return mockBlogPosts;
  }
};

// Save blog posts to localStorage
export const saveBlogPosts = (posts) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving blog posts:', error);
  }
};

// Add a new blog post
export const addBlogPost = (post) => {
  const posts = getBlogPosts();
  const newPost = {
    ...post,
    id: Math.max(...posts.map(p => p.id), 0) + 1,
    date: post.date || new Date().toISOString().split('T')[0],
  };
  const updatedPosts = [newPost, ...posts];
  saveBlogPosts(updatedPosts);
  return newPost;
};

// Update an existing blog post
export const updateBlogPost = (updatedPost) => {
  const posts = getBlogPosts();
  const updatedPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
  saveBlogPosts(updatedPosts);
  return updatedPost;
};

// Delete a blog post
export const deleteBlogPost = (postId) => {
  const posts = getBlogPosts();
  const updatedPosts = posts.filter(p => p.id !== postId);
  saveBlogPosts(updatedPosts);
};

// Get published blog posts only
export const getPublishedBlogPosts = () => {
  return getBlogPosts().filter(post => post.published);
};

// Get a single blog post by slug
export const getBlogPostBySlug = (slug) => {
  const posts = getPublishedBlogPosts();
  return posts.find(post => post.slug === slug);
};
