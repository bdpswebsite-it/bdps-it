'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Search, MapPin, Building2, Calendar, 
  ExternalLink, Sparkles, Filter, IndianRupee, Layers, GraduationCap, ShieldCheck, CheckCircle2, Share2, Check, X
} from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';
import InternshipModal from '@/components/forms/InternshipModal';
import JobLeadModal from '@/components/forms/JobLeadModal';
import { fetchCached } from '@/lib/api-cache';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [internshipModalOpen, setInternshipModalOpen] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 6;

  useEffect(() => {
    fetchCached('/api/site-settings')
      .then(data => {
        if (data && data.success && data.settings) {
          setSiteSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const fetchJobs = async (overrideSearch) => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const queryParams = new URLSearchParams();
      const q = overrideSearch !== undefined ? overrideSearch : searchQuery;
      if (q) queryParams.append('search', q);
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (selectedLocation !== 'All') queryParams.append('location', selectedLocation);

      const res = await fetch(`/api/jobs?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchJobs('');
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'As per Industry Standards';
    const formatNum = (num) => (num >= 100000 ? `₹${(num / 100000).toFixed(1)} LPA` : `₹${num.toLocaleString('en-IN')}`);
    if (min && max) return `${formatNum(min)} - ${formatNum(max)}`;
    if (min) return `From ${formatNum(min)}`;
    return `Up to ${formatNum(max)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Pagination calculations
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = Math.min(startIndex + JOBS_PER_PAGE, jobs.length);
  const paginatedJobs = jobs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const handleShareJob = async (e, job) => {
    e.preventDefault();
    e.stopPropagation();
    const id = job._id || job.adzunaId || job.id;
    const jobUrl = `/jobs/${id}`;
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${jobUrl}` : jobUrl;
    const shareData = {
      title: `${job.title} at ${job.company || 'BDPS Partner'}`,
      text: `Explore this job vacancy for ${job.title} at ${job.company || 'BDPS Computer Education'}!`,
      url: fullUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard if cancelled
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
      } catch (err) {
        console.error('Failed to copy job URL:', err);
      }
    }
  };

  const syncAppliedJobsFromStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem('bdps_applied_job_ids') || '[]');
        setAppliedJobIds(saved);
      } catch (e) {}
    }
  };

  useEffect(() => {
    syncAppliedJobsFromStorage();
  }, []);

  const hasRedirectUrl = (job) => Boolean(
    job?.redirectUrl &&
    typeof job.redirectUrl === 'string' &&
    job.redirectUrl.trim() !== '' &&
    job.redirectUrl !== 'null' &&
    job.redirectUrl !== 'undefined'
  );

  const isApplied = (job) => {
    const jobId = job?._id || job?.adzunaId;
    return Boolean(jobId && appliedJobIds.includes(jobId));
  };

  const handleApplyClick = (job) => {
    if (typeof window !== 'undefined') {
      const jobHasLink = hasRedirectUrl(job);
      const alreadyApplied = isApplied(job);

      if (jobHasLink && alreadyApplied) {
        // Direct seamless redirect for jobs with links that were already applied
        window.open(job.redirectUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Open lead modal for first-time application or custom jobs
        setSelectedJobForModal(job);
        setJobModalOpen(true);
      }
    }
  };

  const categories = ['All', 'IT Jobs', 'Accounting', 'Engineering', 'Customer Service'];
  const locations = ['All', ...(siteSettings?.jobCities && Array.isArray(siteSettings.jobCities) && siteSettings.jobCities.length > 0
    ? siteSettings.jobCities 
    : ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Kakinada', 'Bengaluru', 'Chennai', 'Mumbai', 'Pune', 'Delhi NCR'])];

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Hero Header Banner */}
      <section className="courses-banner-header">
        <div className="courses-banner-container">
          <div className="support-tag">
            <Sparkles size={14} /> Verified BDPS Career & Job Opportunities
          </div>
          <h1 className="courses-banner-title">
            Explore Latest Indian Vacancies & Campus Hiring
          </h1>
          <p className="courses-banner-desc">
            Discover verified job openings in Software Engineering, Java, Full Stack, Tally Accounting, and Computer Operations with placement assistance.
          </p>

          {/* Integrated Search Box & City Input */}
          <form onSubmit={handleSearchSubmit} className="courses-hero-search-box" style={{ gap: '10px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
              <Search size={18} className="search-box-icon" />
              <input
                type="text"
                placeholder="Search job title, skill, or company (e.g. Java, Developer, Tally)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hero-search-input-field"
                style={{ paddingRight: searchQuery ? '42px' : '16px' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search text"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-clear-search" 
              style={{ 
                position: 'static',
                backgroundColor: '#FF7518', 
                color: '#fff', 
                whiteSpace: 'nowrap',
                padding: '12px 22px',
                borderRadius: '30px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Search size={16} />
              <span>Search Jobs</span>
            </button>
          </form>

          {/* Internship Callout Banner */}
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Looking for Internship Opportunities?</span>
            <button
              type="button"
              onClick={() => setInternshipModalOpen(true)}
              className={`btn-stipend ${siteSettings?.internshipActive === false ? 'btn-stipend-disabled' : ''}`}
              style={{
                backgroundColor: siteSettings?.internshipActive === false ? '#1e293b' : '#FF7518',
                color: '#ffffff',
                borderColor: siteSettings?.internshipActive === false ? '#334155' : '#FF7518',
                fontWeight: '600',
                padding: '8px 18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <GraduationCap size={16} /> Apply for BDPS Internship
              {siteSettings?.internshipActive === false && (
                <span className="btn-stipend-tag tag-closed" style={{ marginLeft: '4px' }}>CLOSED</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="catalog-container">
        {/* Status Bar & Side-by-Side Select Controls */}
        <div className="job-controls-bar" style={{ marginBottom: '24px', padding: '20px 24px', backgroundColor: '#ffffff', borderRadius: '14px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
          <div className="job-filters-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%', alignItems: 'center' }}>
            
            {/* Category Searchable Dropdown */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} color="#FF7518" /> Search / Select Category:
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  list="categories-datalist"
                  placeholder="Type or select category (e.g. IT Jobs, Accounting)..."
                  value={selectedCategory === 'All' ? '' : selectedCategory}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedCategory(val.trim() === '' ? 'All' : val);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 38px 12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0F172A',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    outline: 'none'
                  }}
                />
                <datalist id="categories-datalist">
                  {categories.filter(c => c !== 'All').map((cat, idx) => (
                    <option key={idx} value={cat} />
                  ))}
                </datalist>
                <Filter size={15} style={{ position: 'absolute', right: '14px', pointerEvents: 'none', color: '#64748B' }} />
              </div>
            </div>

            {/* City / Location Searchable Dropdown */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '800', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#FF7518" /> Search / Select Location:
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  list="locations-datalist"
                  placeholder="Type or select city (e.g. Hyderabad, Visakhapatnam)..."
                  value={selectedLocation === 'All' ? '' : selectedLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedLocation(val.trim() === '' ? 'All' : val);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 38px 12px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#0F172A',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    outline: 'none'
                  }}
                />
                <datalist id="locations-datalist">
                  {locations.filter(l => l !== 'All').map((loc, idx) => (
                    <option key={idx} value={loc} />
                  ))}
                </datalist>
                <MapPin size={15} style={{ position: 'absolute', right: '14px', pointerEvents: 'none', color: '#64748B' }} />
              </div>
            </div>

          </div>
        </div>

        {/* Results Header */}
        <div className="catalog-count-row">
          <div className="catalog-count-text">
            {jobs.length > 0 ? (
              <>Showing <strong>{startIndex + 1} - {endIndex}</strong> of <strong>{jobs.length}</strong> active job listings in India (Page {currentPage} of {totalPages})</>
            ) : (
              <>Showing <strong>0</strong> job listings</>
            )}
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="section-header-center" style={{ padding: '60px 0' }}>
            <div className="logo-badge">Loading Verified Jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="catalog-empty-card">
            <Briefcase size={48} className="icon-orange" />
            <h3 className="bento-card-title">No matching jobs found</h3>
            <p className="about-paragraph">Try searching with a different keyword or click "Reset Filters".</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedLocation('All'); fetchJobs(); }}
              className="btn-explore"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="jobs-cards-grid">
              {paginatedJobs.map((job) => (
                <div key={job._id || job.adzunaId} className="job-card-item">
                  <div className="job-card-header">
                    <div className="job-badge-category">
                      {job.category || 'IT Jobs'}
                    </div>
                    <span className="job-posted-date">
                      <Calendar size={13} /> {formatDate(job.postedAt)}
                    </span>
                  </div>

                  <h3 className="job-title-text">
                    <Link href={`/jobs/${job._id || job.adzunaId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {job.title}
                    </Link>
                  </h3>

                  <div className="job-company-row">
                    <Building2 size={15} className="icon-orange" />
                    <span className="job-company-name">{job.company || 'Direct Employer'}</span>
                  </div>

                  <div className="job-meta-row">
                    <div className="job-meta-tag">
                      <MapPin size={14} className="icon-orange" />
                      <span>{job.location || 'India'}</span>
                    </div>
                    <div className="job-meta-tag salary-tag">
                      <IndianRupee size={14} />
                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    </div>
                  </div>

                  <p className="job-description-snippet">
                    {job.description ? `${job.description.slice(0, 160)}...` : 'Comprehensive role details available on application portal.'}
                  </p>

                  <div className="job-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="job-posted-by-badge">
                      <ShieldCheck size={13} className="posted-badge-icon" />
                      <span>{job.isCustom ? 'BDPS Custom Job' : 'Posted by BDPS'}</span>
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={(e) => handleShareJob(e, job)}
                        className={`btn-share-job ${copiedId === (job._id || job.adzunaId) ? 'copied' : ''}`}
                        title={copiedId === (job._id || job.adzunaId) ? 'Link Copied!' : 'Share Job Opening'}
                        aria-label={`Share ${job.title} job posting`}
                      >
                        {copiedId === (job._id || job.adzunaId) ? <Check size={15} /> : <Share2 size={15} />}
                        {copiedId === (job._id || job.adzunaId) && <span className="share-toast-pop">Copied!</span>}
                      </button>

                      {isApplied(job) && !hasRedirectUrl(job) ? (
                        <button
                          type="button"
                          className="btn-apply-job btn-job-applied"
                          disabled
                          style={{ opacity: 0.7, cursor: 'not-allowed' }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={15} /> Applied
                          </span>
                        </button>
                      ) : (
                        <Link
                          href={`/jobs/${job._id || job.adzunaId}`}
                          className="btn-apply-job"
                          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <span>View Details & Apply</span>
                          <ExternalLink size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="jobs-pagination-bar">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn nav-btn"
                >
                  ← Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`pagination-btn num-btn ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn nav-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <VisitorFooter />

      <InternshipModal
        isOpen={internshipModalOpen}
        onClose={() => setInternshipModalOpen(false)}
        siteSettings={siteSettings}
      />

      <JobLeadModal
        job={selectedJobForModal}
        isOpen={jobModalOpen}
        onClose={() => {
          setJobModalOpen(false);
          syncAppliedJobsFromStorage();
        }}
        onSuccess={(redirectUrl) => {
          setJobModalOpen(false);
          syncAppliedJobsFromStorage();
          if (typeof window !== 'undefined' && redirectUrl) {
            window.open(redirectUrl, '_blank', 'noopener,noreferrer');
          }
        }}
      />
    </div>
  );
}
