'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Calendar, User, Clock, ArrowRight, BookOpen, Tag, Sparkles } from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';

const stripMarkdown = (str) => {
  if (!str) return '';
  return str.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#+\s+/g, '');
};

export default function BlogCatalogClient({ initialPosts = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(initialPosts.map((p) => p.category).filter(Boolean)))];

  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = initialPosts.find((p) => p.isFeatured) || initialPosts[0];

  return (
    <div className="visitor-landing-page">
      <VisitorHeader />

      {/* Hero Banner */}
      <section className="courses-hero-banner" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '60px 20px', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 16px', borderRadius: '30px', color: '#ef4444', fontSize: '0.875rem', fontWeight: '600', marginBottom: '16px' }}>
            <Sparkles size={16} /> BDPS Knowledge Hub
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px' }}>
            Career Insights & Tech Tutorials
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 32px' }}>
            Explore practical IT career guides, software engineering tips, PGDCA syllabus breakdowns, and commercial accounting advice.
          </p>

          {/* Search Bar */}
          <div className="site-search-wrapper search-centered">
            <div className="site-search-input-box">
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="site-search-input-field"
              />
              <Search size={18} className="site-search-icon-inside" />
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="site-search-clear-btn"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '36px', borderBottom: '1px solid #e2e8f0' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                background: selectedCategory === cat ? '#dc2626' : '#f1f5f9',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post Highlight (Only if showing all and no search query) */}
        {!searchQuery && selectedCategory === 'All' && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '30px',
              background: '#ffffff',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              marginBottom: '50px',
            }}
          >
            <div style={{ position: 'relative', minHeight: '280px' }}>
              <img
                src={featuredPost.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'}
                alt={featuredPost.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '16px', left: '16px', background: '#dc2626', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                Featured Story
              </span>
            </div>
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '0.85rem', marginBottom: '12px' }}>
                <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 10px', borderRadius: '6px', fontWeight: '600' }}>
                  {featuredPost.category}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {featuredPost.readTime || '5 min read'}</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.3', marginBottom: '14px' }}>
                <Link href={`/blog/${featuredPost.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {stripMarkdown(featuredPost.title)}
                </Link>
              </h2>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
                {stripMarkdown(featuredPost.excerpt)}
              </p>
              <Link
                href={`/blog/${featuredPost.slug}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: '700', textDecoration: 'none', width: 'fit-content' }}
              >
                Read Full Article <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Article Grid */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '24px' }}>
          {selectedCategory === 'All' ? 'Recent Publications' : `${selectedCategory} Articles`} ({filteredPosts.length})
        </h3>

        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', color: '#64748b' }}>
            <BookOpen size={48} style={{ color: '#94a3b8', marginBottom: '12px' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>No Articles Found</h4>
            <p>Try searching for another keyword or clearing your category filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
            {filteredPosts.map((post) => (
              <motion.article
                key={post._id || post.slug}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ position: 'relative', height: '200px', width: '100%', background: '#e2e8f0' }}>
                  <img
                    src={post.coverImage || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'}
                    alt={stripMarkdown(post.title)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600' }}>
                    {post.category || 'Article'}
                  </span>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={13} /> {post.author || 'BDPS Desk'}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> {post.readTime || '5 min'}</span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.4', marginBottom: '10px' }}>
                    <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {stripMarkdown(post.title)}
                    </Link>
                  </h4>

                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {stripMarkdown(post.excerpt)}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{ color: '#dc2626', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Read Post <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <VisitorFooter />
    </div>
  );
}
