'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Star, Clock, User, Share2, ArrowRight, CheckCircle2, 
  Award, ShieldCheck, ChevronLeft, ChevronRight,
  TrendingUp, Code, Cloud, Database, ShieldAlert, Cpu, X, Bot, Sparkles, Briefcase, FileText, Target, Compass, HeartHandshake, Layers, GraduationCap, Users, Trophy
} from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';
import BlogCarousel from '@/components/BlogCarousel';
import RatingStars from '@/components/RatingStars';
import BDPSLoadingScreen from '@/components/BDPSLoadingScreen';
import CourseCard from '@/components/CourseCard';
import DynamicIcon from '@/components/DynamicIcon';
import { DEFAULT_HOME_PAGE } from '@/app/api/home-page/route';
import { DEFAULT_TESTIMONIALS } from '@/app/api/testimonials/route';
import { fetchCached } from '@/lib/api-cache';
import { urlFor } from '@/lib/sanity.client';

const renderHeroTitle = (title, highlightWord) => {
  if (!title) return null;
  if (highlightWord && title.includes(highlightWord)) {
    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="hero-title-red-highlight">{highlightWord}</span>
        {parts[1]}
      </>
    );
  }
  const words = title.split(' ');
  if (words.length > 2) {
    const mainPart = words.slice(0, words.length - 2).join(' ');
    const redPart = words.slice(words.length - 2).join(' ');
    return (
      <>
        {mainPart} <span className="hero-title-red-highlight">{redPart}</span>
      </>
    );
  }
  return title;
};

const DEFAULT_HERO_SLIDES = [
  {
    subtitle: 'SINCE 2006',
    title: 'BUILD YOUR FUTURE WITH THE RIGHT DIGITAL SKILLS',
    highlightWord: 'DIGITAL SKILLS',
    desc: 'Industry-focused computer education, practical training and career-oriented programs designed for the next generation of IT professionals.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Explore Courses',
    buttonLink: '/courses',
    secondaryButtonText: 'Enquire Now',
    secondaryButtonLink: '/contact',
  },
  {
    subtitle: 'CAREER READY PROGRAMS',
    title: 'MASTER CORE JAVA & FULL STACK DEVELOPMENT',
    highlightWord: 'DEVELOPMENT',
    desc: 'Gain practical software engineering skills, hands-on coding experience, and expert mentorship for top IT careers.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Explore Courses',
    buttonLink: '/courses',
    secondaryButtonText: 'Enquire Now',
    secondaryButtonLink: '/contact',
  },
  {
    subtitle: 'COMMERCIAL ACCOUNTING',
    title: 'TALLY PRIME WITH GST & FINANCIAL ACCOUNTING',
    highlightWord: 'FINANCIAL ACCOUNTING',
    desc: 'Master commercial bookkeeping, GST taxation, payroll management, and computerized accounting standards.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Explore Courses',
    buttonLink: '/courses',
    secondaryButtonText: 'Enquire Now',
    secondaryButtonLink: '/contact',
  }
];

const DEFAULT_HOMEPAGE_COURSES = [
  { id: '1', title: 'PGDCA - Post Graduate Diploma in Computer Applications', category: 'Full Stack', duration: '1 Year', instructor: 'Certified Coach', rating: 5.0, reviewsCount: '120+ reviews', fee: '15,000', subtitle: 'Comprehensive 1-year graduate diploma program covering office software & databases.', image: 'https://picsum.photos/seed/course-pgdca/800/600' },
  { id: '2', title: 'Core Java & Software Programming', category: 'Software Programming', duration: '3-4 Months', instructor: 'Senior Java Dev', rating: 5.0, reviewsCount: '150+ reviews', fee: '8,000', subtitle: 'Master object-oriented coding, collections, multi-threading, and JDBC.', image: 'https://picsum.photos/seed/course-java/800/600' },
  { id: '3', title: 'Tally Prime & Commercial Financial Accounting', category: 'Financial Accounting', duration: '3 Months', instructor: 'Chartered Accountant', rating: 5.0, reviewsCount: '90+ reviews', fee: '6,500', subtitle: 'Master commercial accounting, GST taxation, and balance sheet preparation.', image: 'https://picsum.photos/seed/course-tally/800/600' },
  { id: '4', title: 'Python Full Stack & AI Development', category: 'Software Programming', duration: '5 Months', instructor: 'AI Lead Coach', rating: 5.0, reviewsCount: '110+ reviews', fee: '12,000', subtitle: 'Build modern web apps with Django, React, and Python AI model integrations.', image: 'https://picsum.photos/seed/course-python/800/600' },
  { id: '5', title: 'MERN Stack Web Development', category: 'Full Stack', duration: '6 Months', instructor: 'Senior Fullstack Dev', rating: 5.0, reviewsCount: '200+ reviews', fee: '14,000', subtitle: 'Master MongoDB, Express.js, React.js, and Node.js with live real-time projects.', image: 'https://picsum.photos/seed/course-mern/800/600' },
  { id: '6', title: 'Cybersecurity & Ethical Hacking Essentials', category: 'Cybersecurity', duration: '4 Months', instructor: 'Security Analyst', rating: 5.0, reviewsCount: '80+ reviews', fee: '10,000', subtitle: 'Learn network security, vulnerability assessment, penetration testing & defense.', image: 'https://picsum.photos/seed/course-cyber/800/600' }
];

export default function VisitorHomepage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [coursesLoaded, setCoursesLoaded] = useState(false);

  const [heroSlides, setHeroSlides] = useState([]);
  const [heroSlidesLoaded, setHeroSlidesLoaded] = useState(false);

  const [homeData, setHomeData] = useState(DEFAULT_HOME_PAGE);
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [latestJobs, setLatestJobs] = useState([]);

  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const [sanityCategories, setSanityCategories] = useState([]);

  // Fetch latest real jobs from Sanity CMS for home page marquee
  useEffect(() => {
    fetchCached('/api/jobs')
      .then(data => {
        if (data && data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setLatestJobs(data.jobs.slice(0, 15));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch live courses & categories from Sanity CMS — fall back to defaults only if Sanity returns nothing
  useEffect(() => {
    fetchCached('/api/courses')
      .then(data => {
        if (data && data.success) {
          if (data.courses && data.courses.length > 0) {
            setCourses(data.courses);
          } else {
            setCourses(DEFAULT_HOMEPAGE_COURSES);
          }
          if (data.categories && data.categories.length > 0) {
            setSanityCategories(data.categories.map(c => c.title).filter(Boolean));
          }
        } else {
          setCourses(DEFAULT_HOMEPAGE_COURSES);
        }
      })
      .catch(() => setCourses(DEFAULT_HOMEPAGE_COURSES))
      .finally(() => setCoursesLoaded(true));
  }, []);

  // Fetch live hero slides from Sanity CMS — fall back to defaults only if Sanity returns nothing
  useEffect(() => {
    fetchCached('/api/hero-slides')
      .then(data => {
        if (data && data.success && data.slides && data.slides.length > 0) {
          setHeroSlides(data.slides);
        } else {
          setHeroSlides(DEFAULT_HERO_SLIDES);
        }
      })
      .catch(() => setHeroSlides(DEFAULT_HERO_SLIDES))
      .finally(() => setHeroSlidesLoaded(true));
  }, []);

  // Fetch home page section settings
  useEffect(() => {
    fetchCached('/api/home-page')
      .then(res => {
        if (res && res.success && res.data) {
          setHomeData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch testimonials
  useEffect(() => {
    fetchCached('/api/testimonials')
      .then(res => {
        if (res && res.success && res.testimonials && res.testimonials.length > 0) {
          setTestimonials(res.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const categoriesList = ['All', ...new Set([
    ...sanityCategories,
    ...courses.map(c => c.category).filter(Boolean)
  ])];

  const filteredExploreCourses = (selectedCategoryTab === 'All'
    ? courses
    : courses.filter(c => c.category && c.category.toLowerCase().includes(selectedCategoryTab.toLowerCase()))
  ).slice(0, 6);

  const jobMarqueeItems = [
    ...(homeData.customJobMarqueeItems || []),
    ...latestJobs.filter(j => j.showInMarquee !== false)
  ];

  const rawPartners = Array.isArray(homeData?.hiringPartners) ? homeData.hiringPartners : [];
  const validPartners = rawPartners
    .map(p => {
      if (!p) return null;
      if (typeof p === 'string') return p.trim() || null;
      if (typeof p === 'object') {
        const name = p.name || p.company || p.title || p.label || p.text;
        if (typeof name === 'string' && name.trim()) {
          const logoUrl = p.logo?.asset?.url || (typeof p.logo === 'string' ? p.logo : null) || (p.logo ? urlFor(p.logo) : null);
          return {
            name: name.trim(),
            logo: logoUrl || null,
            website: p.website || null,
          };
        }
      }
      return null;
    })
    .filter(Boolean);

  const partners = validPartners.length > 0 ? validPartners : DEFAULT_HOME_PAGE.hiringPartners;

  const supportPillars = (homeData.supportPillars && homeData.supportPillars.length > 0)
    ? homeData.supportPillars
    : DEFAULT_HOME_PAGE.supportPillars;

  const whyHighlights = (homeData.whyBdpsHighlights && homeData.whyBdpsHighlights.length > 0)
    ? homeData.whyBdpsHighlights
    : DEFAULT_HOME_PAGE.whyBdpsHighlights;

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const getSlideBackground = (slide, idx) => {
    if (slide.bgImage) {
      return `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.55)), url('${slide.bgImage}') center/cover no-repeat`;
    }
    if (slide.backgroundPreset === 'custom' && slide.customBackground) {
      return slide.customBackground;
    }
    if (slide.backgroundPreset && slide.backgroundPreset !== 'custom') {
      return slide.backgroundPreset;
    }
    const defaultGradients = [
      'linear-gradient(135deg, #BD601C 0%, #7A3700 100%)',
      'linear-gradient(135deg, #B45309 0%, #92400E 100%)',
      'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)'
    ];
    return defaultGradients[idx % defaultGradients.length];
  };

  // Full Screen Loading Screen until Sanity CMS data resolves
  if (!coursesLoaded || !heroSlidesLoaded) {
    return <BDPSLoadingScreen />;
  }

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Section 1: Redesigned Hero Carousel Section with Faded Image Transition & 4-Stat Banner */}
      <section className="hero-section-wrapper">
        <div className="hero-carousel-container">
          <AnimatePresence mode="wait">
            {heroSlides.map((slide, idx) => idx === activeSlide && (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: "easeInOut" }}
                className="hero-faded-slide"
              >
                <div className="hero-slide-grid">
                  {/* Left Content Side */}
                  <div className="hero-text-side">
                    <motion.span
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="hero-tag-red"
                    >
                      {slide.subtitle || 'SINCE 2006'}
                    </motion.span>

                    <motion.h1
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="hero-main-title"
                    >
                      {renderHeroTitle(slide.title || 'BUILD YOUR FUTURE WITH THE RIGHT DIGITAL SKILLS', slide.highlightWord)}
                    </motion.h1>

                    <motion.p
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="hero-desc-text"
                    >
                      {slide.desc || 'Industry-focused computer education, practical training and career-oriented programs designed for the next generation of IT professionals.'}
                    </motion.p>

                    <motion.div
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="hero-buttons-row"
                    >
                      <Link href={slide.buttonLink || '/courses'} className="btn-hero-primary">
                        <span>{slide.buttonText || 'Explore Courses'}</span> <ArrowRight size={16} />
                      </Link>
                      <Link href={slide.secondaryButtonLink || '/contact'} className="btn-hero-danger">
                        <span>{slide.secondaryButtonText || 'Enquire Now'}</span> <ArrowRight size={16} />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Right Image Side with Left Soft Fade Overlay */}
                  <div className="hero-image-side">
                    <motion.div
                      initial={{ scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.55 }}
                      className="hero-faded-img-wrapper"
                    >
                      <img 
                        src={slide.image || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'} 
                        alt={slide.title} 
                        className="hero-faded-img" 
                        fetchPriority={idx === 0 ? "high" : "auto"}
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                      <div className="hero-left-fade-gradient" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Carousel Indicators & Controls */}
          {heroSlides.length > 1 && (
            <>
              <div className="hero-dots-row">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`hero-dot ${idx === activeSlide ? 'hero-dot-active' : ''}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="hero-arrow-btn hero-arrow-left"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setActiveSlide((prev) => (prev + 1) % heroSlides.length)}
                className="hero-arrow-btn hero-arrow-right"
                aria-label="Next Slide"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* 4 Boxes Stat Banner Anchor directly below Hero */}
        <div className="hero-stats-banner">
          <div className="hero-stats-container">
            <div className="hero-stat-card">
              <div className="hero-stat-icon-circle">
                <GraduationCap size={22} />
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-number">Since 2006</span>
                <span className="hero-stat-label">20+ Years Experience</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="hero-stat-icon-circle">
                <Users size={22} />
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-number">5000+</span>
                <span className="hero-stat-label">Students Trained</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="hero-stat-icon-circle">
                <BookOpen size={22} />
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-number">20+</span>
                <span className="hero-stat-label">Career-focused Courses</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="hero-stat-icon-circle">
                <Trophy size={22} />
              </div>
              <div className="hero-stat-info">
                <span className="hero-stat-number">100+</span>
                <span className="hero-stat-label">Training Initiatives</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Real & Custom Jobs Scrolling Marquee Banner (Identical to Alumni Marquee Structure) */}
      {jobMarqueeItems.length > 0 && (
        <>
          {/* Announcement Bar directly on top of Marquee */}
          <div className="visitor-announcement-bar visitor-announcement-bar-permanent">
            <span className="announcement-text">
              ⚡ Admissions Open for Upcoming Batches! Enroll Now for Industry-Oriented IT & Computer Software Training.
            </span>
          </div>

          <section className="marquee-section" style={{ background: 'linear-gradient(135deg, #BD601C 0%, #7A3700 100%)' }}>
            <div className="marquee-header">
              <span className="marquee-tag">
                {homeData.jobsMarqueeTitle || '🔥 LATEST JOB OPENINGS'}
              </span>
            </div>

            <div className="marquee-container">
              <div className="jobs-marquee-single-track">
                {jobMarqueeItems.map((job, idx) => {
                  const targetHref = job.link || (job._id || job.id ? `/jobs/${job._id || job.id || job.adzunaId}` : '/jobs');
                  return (
                    <Link 
                      key={idx} 
                      href={targetHref}
                      className="marquee-item"
                      style={{ color: '#ffffff', textDecoration: 'none' }}
                    >
                      <span style={{ fontWeight: '800', color: '#FFEAD5', textTransform: 'uppercase' }}>{job.company || 'BDPS Partner'}</span>
                      <span style={{ textTransform: 'uppercase' }}>{job.title}</span>
                      {job.location && (
                        <span style={{ color: '#FFD8B2', fontSize: '12px' }}>({job.location})</span>
                      )}
                      <span className="marquee-bullet">•</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Section 5: Explore Our Courses (Featured Training Programs) */}
      {courses.length > 0 && (
      <section id="courses-section" className="explore-courses-section">
        <div className="section-header-center">
          <h2 className="section-title">
            {homeData.featuredCoursesTitle ? (
              <span>{homeData.featuredCoursesTitle}</span>
            ) : (
              <>Featured Training <span className="section-title-accent">Programs</span></>
            )}
          </h2>
          <p className="about-paragraph">
            {homeData.featuredCoursesSubtitle || 'Choose from our job-oriented software, AI, accounting, and technical tracks.'}
          </p>
        </div>

        {/* Category Tabs Selector */}
        <div className="category-pills-row" style={{ marginBottom: '24px' }}>
          {categoriesList.map((cat, idx) => {
            const count = cat === 'All'
              ? courses.length
              : courses.filter(c => c.category && c.category.toLowerCase().includes(cat.toLowerCase())).length;

            return (
              <button
                key={idx}
                onClick={() => setSelectedCategoryTab(cat)}
                className={`category-pill-btn ${selectedCategoryTab === cat ? 'active' : ''}`}
              >
                <span>{cat}</span>
                <span className="pill-count-badge">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Courses Grid - Up to 6 Courses */}
        <div className="explore-courses-grid">
          {filteredExploreCourses.map((course) => (
            <CourseCard key={`tab-${course.id || course._id}`} course={course} showSubtitle={true} />
          ))}
        </div>

        {/* See More Courses Button */}
        <div className="explore-see-more-row">
          <Link href="/courses" className="btn-see-more-courses">
            See More Courses ({courses.length}+ Available) <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      )}

      {/* Permanent Announcement Bar on Top of 1st Marquee Bar */}
      <div className="visitor-announcement-bar visitor-announcement-bar-permanent">
        <span className="announcement-text">
          ⚡ Admissions Open for Upcoming Batches! Enroll Now for Industry-Oriented IT & Computer Software Training.
        </span>
      </div>

      {/* Section 3: Continuous Partner Marquee Slider (1st Marquee after Featured Training Programs) */}
      <section className="marquee-section">
        <div className="marquee-header">
          <span className="marquee-tag">
            🤝 {homeData.hiringPartnersTitle || 'Our Alumni Work At Top IT & Enterprise Firms'}
          </span>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => {
              const isObj = typeof partner === 'object' && partner !== null;
              const name = isObj ? (partner.name || partner.company || partner.title) : partner;
              const logo = isObj ? partner.logo : null;
              const website = isObj ? partner.website : null;

              const content = (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {logo && (
                    <img 
                      src={logo} 
                      alt={name} 
                      style={{ height: '26px', maxWidth: '100px', objectFit: 'contain', verticalAlign: 'middle' }} 
                    />
                  )}
                  <span>{name}</span>
                </span>
              );

              return (
                <div key={idx} className="marquee-item">
                  {website ? (
                    <a href={website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                      {content}
                    </a>
                  ) : content}
                  <span className="marquee-bullet">•</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: 20+ Years of Academic Excellence & BDPS AI Tutor (WHY CHOOSE BDPS) */}
      <section className="about-section">
        <div className="about-grid">
          <div>
            <div className="about-badge-header">
              <Award size={16} /> {homeData.whyBdpsBadge || '20+ Years of Academic Excellence'}
            </div>
            <h2 className="about-heading">
              {homeData.whyBdpsTitle || 'BDPS Computer Education 📍 Kakinada, AP'}
            </h2>
            <p className="about-paragraph">
              {homeData.whyBdpsDescription || "BDPS Computer Education is one of Andhra Pradesh's most trusted and experienced computer training institutes, with over 20 years of dedication to technical skill development and digital literacy."}
            </p>

            {homeData.csrActive !== false && (
              <div className="csr-badge">
                <HeartHandshake size={32} className="contact-icon" />
                <div>
                  <h3 className="csr-title">
                    {homeData.csrTitle || 'CSR Initiative Collaboration'}
                  </h3>
                  <p className="csr-desc">
                    {homeData.csrDescription || 'BDPS proudly collaborates with Embracing Humanity Foundation (EHF) to implement CSR skill development, digital literacy, and youth employment training.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="ai-tutor-card">
            <Bot size={180} className="ai-tutor-bg-icon" />

            <div className="ai-tutor-badge">
              <Sparkles size={14} /> Next-Gen AI Learning
            </div>

            <h3 className="ai-tutor-title">
              Meet BDPS AI Tutor 🤖
            </h3>
            <p className="ai-tutor-desc">
              As technology advances into the future, BDPS introduces <strong>BDPS AI Tutor</strong>—an intelligent AI learning assistant providing personalized learning, smart coding guidance, practice support, and 24/7 academic help.
            </p>

            <div className="ai-tutor-list">
              <div className="ai-tutor-item">
                <CheckCircle2 size={16} className="contact-icon" /> 24/7 Academic & Coding Assistance
              </div>
              <div className="ai-tutor-item">
                <CheckCircle2 size={16} className="contact-icon" /> Personalized Speed & Skill Guidance
              </div>
              <div className="ai-tutor-item">
                <CheckCircle2 size={16} className="contact-icon" /> Practice Problem Diagnostics
              </div>
            </div>

            <Link href="/contact?type=student" className="btn-ai-tutor">
              Try AI-Enabled Learning <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Student Support System 8 Pillars Banner */}
      <section className="support-section">
        <div className="support-banner-card">
          <Award size={260} className="support-watermark" />

          <div className="support-header-box">
            <div className="support-tag">
              <Sparkles size={14} /> 360° Career & Academic Assistance
            </div>

            <h2 className="support-heading">
              🎯 {homeData.supportPillarsTitle || 'Complete Student Support System'}
            </h2>
            <p className="support-desc">
              {homeData.supportPillarsSubtitle || 'From real-world workplace internships and IEEE capstone projects to ATS resume building and 1-on-1 career counseling, we empower every learner end-to-end.'}
            </p>
          </div>

          <div className="support-pillars-grid">
            {supportPillars.map((pillar, idx) => (
              <div key={idx} className="support-pillar-card">
                <div className="support-icon-box">
                  <DynamicIcon name={pillar.icon || 'Briefcase'} size={22} className="icon-white" />
                </div>
                <div>
                  <h3 className="support-pillar-title">
                    {pillar.title}
                  </h3>
                  <p className="support-pillar-desc">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="support-bottom-bar">
            <div className="support-bottom-text">
              <ShieldCheck size={18} className="icon-white" />
              <span>Ready to boost your computing & career skills?</span>
            </div>
            <Link href="/contact" className="btn-support-counseling">
              Request Free Career Counseling <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6.5: Why Choose BDPS Continuous Marquee Track */}
      <section className="marquee-section marquee-section-why">
        <div className="marquee-header">
          <span className="marquee-tag">
            🌟 {homeData.whyBdpsBadge || 'Why Choose BDPS Computer Education?'}
          </span>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {[...whyHighlights, ...whyHighlights, ...whyHighlights, ...whyHighlights].map((item, idx) => (
              <div key={idx} className="marquee-item">
                <span>{item}</span>
                <span className="marquee-bullet">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BlogCarousel />

      {/* Section 7: Student Testimonials (Manual Control Slider) */}
      {testimonials.length > 0 && (
      <section className="testimonials-section">
        <div className="section-header-center">
          <span className="section-subtitle-tag">STUDENT SUCCESS STORIES</span>
          <h2 className="section-title">
            {homeData.testimonialsTitle ? (
              <span>{homeData.testimonialsTitle}</span>
            ) : (
              <>What Our Students <span className="section-title-accent">Say</span></>
            )}
          </h2>
        </div>

        <div className="testimonials-card">
          <p className="testimonial-quote">
            "{testimonials[activeTestimonial % testimonials.length]?.quote || 'BDPS provides exceptional practical lab training.'}"
          </p>

          <div>
            <h3 className="testimonial-author">
              {testimonials[activeTestimonial % testimonials.length]?.name}
            </h3>
            <span className="testimonial-role">
              {testimonials[activeTestimonial % testimonials.length]?.role}
              {testimonials[activeTestimonial % testimonials.length]?.company ? ` at ${testimonials[activeTestimonial % testimonials.length].company}` : ''}
              {testimonials[activeTestimonial % testimonials.length]?.courseName ? ` (${testimonials[activeTestimonial % testimonials.length].courseName})` : ''}
            </span>
          </div>

          <div className="testimonial-nav-controls">
            <button onClick={handlePrevTestimonial} className="btn-testimonial-nav" aria-label="Previous Testimonial">
              <ChevronLeft size={20} />
            </button>

            <div className="testimonial-dots-row">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`testimonial-dot ${idx === (activeTestimonial % testimonials.length) ? 'testimonial-dot-active' : 'testimonial-dot-inactive'}`}
                />
              ))}
            </div>

            <button onClick={handleNextTestimonial} className="btn-testimonial-nav" aria-label="Next Testimonial">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>
      )}

      <VisitorFooter />
    </div>
  );
}
