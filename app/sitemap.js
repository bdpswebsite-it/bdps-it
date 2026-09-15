import { getSanityCourses, getSanityBlogPosts } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // revalidate every 1 hour

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bdpsit.com';
  const currentDate = new Date().toISOString();

  // Static core routes
  const staticRoutes = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/jobs`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/verify-certificate`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic course routes from Sanity CMS
  let courseRoutes = [];
  try {
    const courses = await getSanityCourses();
    if (Array.isArray(courses) && courses.length > 0) {
      courseRoutes = courses.map((course) => ({
        url: `${siteUrl}/courses/${course.id || course._id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.85,
      }));
    }
  } catch (err) {
    console.error('Error generating dynamic course sitemap:', err);
  }

  // Dynamic blog routes from Sanity CMS
  let blogRoutes = [];
  try {
    const posts = await getSanityBlogPosts();
    if (Array.isArray(posts) && posts.length > 0) {
      blogRoutes = posts.map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.error('Error generating dynamic blog sitemap:', err);
  }

  return [...staticRoutes, ...courseRoutes, ...blogRoutes];
}
