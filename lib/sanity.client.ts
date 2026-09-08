import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder_project_id';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use Sanity CDN edge caching for ultra-fast response
});

const builder = imageUrlBuilder(sanityClient);

/**
 * Optimizes any Sanity CDN image URL to modern WebP/AVIF format with width and quality constraints
 */
export function optimizeSanityImageUrl(url: string | undefined | null, width = 800, quality = 75): string {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    if (url.includes('auto=format')) return url;
    return `${url}&auto=format&fit=crop&w=${width}&q=${quality}&fm=webp`;
  }
  if (!url.includes('cdn.sanity.io')) return url;
  const separator = url.includes('?') ? '&' : '?';
  if (url.includes('auto=format')) return url;
  return `${url}${separator}auto=format&fit=max&w=${width}&q=${quality}`;
}

export function urlFor(source: any, width = 800, quality = 80) {
  if (!source) return '';
  if (typeof source === 'string') {
    return optimizeSanityImageUrl(source, width, quality);
  }
  return builder.image(source).auto('format').fit('max').width(width).quality(quality).url();
}

export async function getSanityCourses() {
  try {
    const query = `*[_type == "course" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      "_id": _id,
      "id": _id,
      title,
      "slug": slug.current,
      "category": coalesce(categoryRef->title, category, "General"),
      subtitle,
      "tagline": subtitle,
      duration,
      fee,
      instructor,
      rating,
      reviewsCount,
      "image": thumbnail.asset->url,
      description,
      isFeatured
    }`;
    const courses = await sanityClient.fetch(query, {}, { cache: 'no-store' });
    if (!Array.isArray(courses)) return [];
    return courses.map((course: any) => ({
      ...course,
      image: optimizeSanityImageUrl(course.image, 600, 75),
    }));
  } catch (error) {
    console.error('Error fetching courses from Sanity:', error);
    return [];
  }
}

export async function getSanityCourseCategories() {
  try {
    const query = `*[_type == "courseCategory" && !(_id in path("drafts.**"))] | order(order asc, title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      icon
    }`;
    const categories = await sanityClient.fetch(query, {}, { cache: 'no-store' });
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error('Error fetching course categories from Sanity:', error);
    return [];
  }
}

export async function getSanityCourseById(id: string) {
  try {
    const query = `*[_type == "course" && !(_id in path("drafts.**")) && (_id == $id || slug.current == $id)][0] {
      "_id": _id,
      "id": _id,
      title,
      "slug": slug.current,
      category,
      subtitle,
      "tagline": subtitle,
      duration,
      fee,
      instructor,
      rating,
      reviewsCount,
      "image": thumbnail.asset->url,
      syllabus,
      description,
      isFeatured
    }`;
    const course = await sanityClient.fetch(query, { id }, { cache: 'no-store' });
    if (!course) return null;
    return {
      ...course,
      image: optimizeSanityImageUrl(course.image, 1000, 80),
    };
  } catch (error) {
    console.error('Error fetching course by ID from Sanity:', error);
    return null;
  }
}

export async function getSanityPopupAd() {
  try {
    const query = `*[_type == "popupAd" && isActive == true && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0] {
      title,
      "image": bannerImage.asset->url,
      targetUrl,
      buttonText
    }`;
    const ad = await sanityClient.fetch(query, {}, { cache: 'no-store' });
    if (!ad) return null;
    return {
      ...ad,
      image: optimizeSanityImageUrl(ad.image, 600, 75),
    };
  } catch (error) {
    console.error('Error fetching popup ad from Sanity:', error);
    return null;
  }
}

export async function getSanitySiteSettings() {
  try {
    const query = `*[_type == "siteSettings" && !(_id in path("drafts.**"))] | order((_id == "siteSettings") desc, _updatedAt desc)[0] {
      announcementBanner,
      "headerLogo": headerLogo.asset->url,
      headerBrandTitle,
      headerBrandSubtitle,
      headerLogoBadge,
      headerTopBarLegacyText,
      headerTopBarAlliancesText,
      stipendRegistrationActive,
      stipendNoticeText,
      internshipActive,
      internshipNoticeText,
      internshipCourses,
      jobCities,
      contactEmail,
      contactPhone,
      whatsappNumber,
      address,
      facebook,
      instagram,
      linkedin,
      youtube,
      twitter,
      footerTagline,
      footerShowCsr,
      footerCsrText,
      footerPopularCourses,
      footerQuickLinks,
      footerAccreditationText,
      footerCopyrightText
    }`;
    const settings = await sanityClient.fetch(query, {}, { cache: 'no-store' });
    if (!settings) return null;
    return {
      ...settings,
      headerLogo: optimizeSanityImageUrl(settings.headerLogo, 300, 85),
    };
  } catch (error) {
    console.error('Error fetching site settings from Sanity:', error);
    return null;
  }
}

export async function getSanityHeroSlides() {
  try {
    const query = `*[_type == "heroSlide" && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc) {
      "_id": _id,
      title,
      subtitle,
      "desc": description,
      "image": slideImage.asset->url,
      backgroundPreset,
      customBackground,
      "bgImage": backgroundImage.asset->url,
      buttonText,
      buttonLink,
      secondaryButtonText,
      secondaryButtonLink
    }`;
    const slides = await sanityClient.fetch(query, {}, { cache: 'no-store' });
    if (!Array.isArray(slides)) return [];
    return slides.map((slide: any) => ({
      ...slide,
      image: optimizeSanityImageUrl(slide.image, 800, 80),
      bgImage: optimizeSanityImageUrl(slide.bgImage, 1600, 75),
    }));
  } catch (error) {
    console.error('Error fetching hero slides from Sanity:', error);
    return [];
  }
}

export async function getSanityHomePage() {
  try {
    const query = `*[_type == "homePage" && !(_id in path("drafts.**"))] | order((_id == "homePage") desc, _updatedAt desc)[0] {
      featuredCoursesTitle,
      featuredCoursesSubtitle,
      supportPillarsTitle,
      supportPillarsSubtitle,
      testimonialsTitle,
      testimonialsSubtitle,
      whyBdpsBadge,
      whyBdpsTitle,
      whyBdpsDescription,
      whyBdpsHighlights,
      csrActive,
      csrTitle,
      csrDescription,
      supportPillars,
      jobsMarqueeTitle,
      customJobMarqueeItems,
      hiringPartnersTitle,
      hiringPartnersSubtitle,
      "hiringPartners": hiringPartners[] {
        _type == "companyPartner" => {
          name,
          "logo": logo.asset->url,
          website
        },
        _type != "companyPartner" => @
      }
    }`;
    const homeData = await sanityClient.fetch(query, {}, { cache: 'no-store' });
    return homeData || null;
  } catch (error) {
    console.error('Error fetching home page data from Sanity:', error);
    return null;
  }
}

export async function getSanityAboutPage() {
  try {
    const query = `*[_type == "aboutPage" && !(_id in path("drafts.**"))] | order((_id == "aboutPage") desc, _updatedAt desc)[0] {
      bannerBadge,
      bannerTitle,
      bannerDesc,
      legacyBadge,
      legacyHeading,
      storyParagraphs,
      highlightsList,
      spotlightBadge,
      spotlightTitle,
      spotlightDesc,
      spotlightPillars,
      stats,
      beliefsSubtitle,
      beliefsTitle,
      beliefs
    }`;
    const aboutData = await sanityClient.fetch(query, {}, { cache: 'no-store' });
    return aboutData || null;
  } catch (error) {
    console.error('Error fetching about page data from Sanity:', error);
    return null;
  }
}

export async function getSanityContactPage() {
  try {
    const query = `*[_type == "contactPage" && !(_id in path("drafts.**"))] | order((_id == "contactPage") desc, _updatedAt desc)[0] {
      studentBannerTitle,
      studentBannerDesc,
      collabBannerTitle,
      collabBannerDesc,
      branches,
      studentCourses,
      collabTypes,
      upcomingITProjects
    }`;
    const contactData = await sanityClient.fetch(query, {}, { cache: 'no-store' });
    return contactData || null;
  } catch (error) {
    console.error('Error fetching contact page data from Sanity:', error);
    return null;
  }
}

export async function getSanityTestimonials() {
  try {
    const query = `*[_type == "testimonial" && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc) {
      "_id": _id,
      name,
      role,
      company,
      courseName,
      quote,
      rating,
      "avatar": avatar.asset->url
    }`;
    const testimonials = await sanityClient.fetch(query, {}, { cache: 'no-store' });
    if (!Array.isArray(testimonials)) return [];
    return testimonials.map((t: any) => ({
      ...t,
      avatar: optimizeSanityImageUrl(t.avatar, 160, 80),
    }));
  } catch (error) {
    console.error('Error fetching testimonials from Sanity:', error);
    return [];
  }
}

export async function getSanityBlogPosts() {
  try {
    const query = `*[_type == "blog" && !(_id in path("drafts.**"))] | order(publishedAt desc, _createdAt desc) {
      "_id": _id,
      title,
      "slug": slug.current,
      publishedAt,
      category,
      author,
      readTime,
      excerpt,
      content,
      isFeatured,
      "coverImage": coverImage.asset->url,
      seoTitle,
      seoDescription
    }`;
    const posts = await sanityClient.fetch(query, {}, { next: { revalidate: 60 } });
    if (!Array.isArray(posts)) return [];
    return posts.map((post: any) => ({
      ...post,
      coverImage: optimizeSanityImageUrl(post.coverImage, 600, 75),
    }));
  } catch (error) {
    console.error('Error fetching blog posts from Sanity:', error);
    return [];
  }
}

export async function getSanityBlogPostBySlug(slug: string) {
  try {
    const query = `*[_type == "blog" && !(_id in path("drafts.**")) && slug.current == $slug][0] {
      "_id": _id,
      title,
      "slug": slug.current,
      publishedAt,
      category,
      author,
      readTime,
      excerpt,
      content,
      isFeatured,
      "coverImage": coverImage.asset->url,
      seoTitle,
      seoDescription
    }`;
    const post = await sanityClient.fetch(query, { slug }, { next: { revalidate: 60 } });
    if (!post) return null;
    return {
      ...post,
      coverImage: optimizeSanityImageUrl(post.coverImage, 900, 80),
    };
  } catch (error) {
    console.error(`Error fetching blog post "${slug}" from Sanity:`, error);
    return null;
  }
}

