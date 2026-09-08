'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Phone, Mail, Send, CheckCircle2, Clock, Handshake, X, FileText } from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';
import { trackLeadEvent } from '@/lib/gtag';

const DEFAULT_BRANCH = {
  name: 'Kakinada Campus (Corporate HQ)',
  address: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003',
  phone: '+91 85001 08016',
  email: 'bdpskkd@gmail.com',
  timings: 'Mon - Sat: 7:30 AM - 8:30 PM IST',
  description: 'Visit our primary campus in Kakinada to review lab setups, interact with faculty mentors, or request course counseling.',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.7196022838426!2d82.25141071112674!3d16.988220084364417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3828414ca0cd97%3A0x88981e6992d9f2d1!2sNagamallithota%20Junction%2C%20Kakinada%2C%20Andhra%20Pradesh%20533003!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin'
};

const DEFAULT_COURSES = [
  'General Counseling',
  'Software Development (Full Stack)',
  'Data Science & AI',
  'Tally Prime & GST',
  'PGDCA Diploma'
];

const DEFAULT_COLLAB_TYPES = [
  'IT Solutions & Enterprise Software',
  'Campus Placement / Talent Recruitment',
  'Corporate Employee Upskilling',
  'Lab & Capstone Project Sponsorship',
  'Guest Lecture & IEEE Workshops'
];

function ProjectDetailsModal({ project, onClose, onPartnerClick }) {
  if (!project) return null;

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div className="project-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="project-modal-header">
          <div>
            <div className="project-modal-badges">
              <span className="it-project-category-badge">{project.category || 'IT Solutions'}</span>
              <span className={`it-project-status-badge ${project.status?.toLowerCase().includes('open') ? 'status-open' : 'status-dev'}`}>
                {project.status || 'Open for Collaboration'}
              </span>
            </div>
            <h2 className="project-modal-title">{project.title}</h2>
          </div>
          <button type="button" className="project-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="project-modal-body">
          <h4 className="project-modal-subtitle">Project Overview & Full Scope</h4>
          <p className="project-modal-full-desc">{project.description}</p>

          {Array.isArray(project.techStack) && project.techStack.length > 0 && (
            <div style={{ marginTop: '22px' }}>
              <h4 className="project-modal-subtitle">Recommended Tech Stack</h4>
              <div className="it-project-tech-row">
                {project.techStack.map((tech, tIdx) => (
                  <span key={tIdx} className="it-project-tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="project-modal-footer">
          <button
            type="button"
            onClick={() => {
              onClose();
              onPartnerClick(project);
            }}
            className="btn-collab-project"
          >
            <Handshake size={16} /> Partner on this Project
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectCardItem({ project, onOpenModal, onPartnerClick }) {
  const description = project.description || '';
  const isLong = description.length > 180;
  const shortSnippet = isLong ? `${description.slice(0, 180)}...` : description;

  return (
    <div className="it-project-card">
      <div className="it-project-header">
        <span className="it-project-category-badge">{project.category || 'IT Solutions'}</span>
        <span className={`it-project-status-badge ${project.status?.toLowerCase().includes('open') ? 'status-open' : 'status-dev'}`}>
          {project.status || 'Open for Collaboration'}
        </span>
      </div>

      <h3 className="it-project-title">{project.title}</h3>

      <div className="it-project-desc-wrapper">
        <p className="it-project-desc it-project-desc-snippet">
          {shortSnippet}
        </p>
        <button
          type="button"
          onClick={() => onOpenModal(project)}
          className="btn-open-details-modal"
        >
          <FileText size={13} /> View Full Project Details ➔
        </button>
      </div>

      {Array.isArray(project.techStack) && project.techStack.length > 0 && (
        <div className="it-project-tech-row">
          {project.techStack.slice(0, 4).map((tech, tIdx) => (
            <span key={tIdx} className="it-project-tech-tag">{tech}</span>
          ))}
          {project.techStack.length > 4 && (
            <span className="it-project-tech-tag">+{project.techStack.length - 4} more</span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => onPartnerClick(project)}
        className="btn-collab-project"
      >
        <Handshake size={15} /> Partner on this Project
      </button>
    </div>
  );
}

function ContactFormContent() {
  const searchParams = useSearchParams();
  const formType = searchParams.get('type') || 'student';
  const isCollab = formType === 'collaboration' || formType === 'it-solutions';

  const [contactData, setContactData] = useState({
    studentBannerTitle: 'Contact Our Advisors',
    studentBannerDesc: 'Get in touch to clear course doubts, check batch timings, or request custom syllabus modules.',
    collabBannerTitle: formType === 'it-solutions' ? 'IT Solutions & Enterprise Services' : 'Corporate & Institutional Collaboration',
    collabBannerDesc: formType === 'it-solutions' ? 'Discover our upcoming customized software development, cloud infrastructure, and enterprise IT consulting services.' : 'Partner with BDPS to recruit skilled software talent, execute corporate training bootcamps, or sponsor academic project labs.',
    branches: [DEFAULT_BRANCH],
    studentCourses: DEFAULT_COURSES,
    collabTypes: DEFAULT_COLLAB_TYPES
  });

  useEffect(() => {
    fetch('/api/contact-page', { cache: 'no-store' })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setContactData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const branches = (contactData.branches && contactData.branches.length > 0) ? contactData.branches : [DEFAULT_BRANCH];
  const studentCourses = (contactData.studentCourses && contactData.studentCourses.length > 0) ? contactData.studentCourses : DEFAULT_COURSES;
  const collabTypes = (contactData.collabTypes && contactData.collabTypes.length > 0) ? contactData.collabTypes : DEFAULT_COLLAB_TYPES;

  // Forms states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: studentCourses[0] || 'General Counseling',
    message: ''
  });

  const [collabForm, setCollabForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    collabType: formType === 'it-solutions' ? 'IT Solutions & Enterprise Software' : (collabTypes[0] || 'Campus Placement / Talent Recruitment'),
    message: ''
  });

  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email || !studentForm.phone) {
      setStatus({ loading: false, success: false, error: 'Please enter your Name, Email, and Phone number.' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: studentForm.name,
          email: studentForm.email,
          phone: studentForm.phone,
          course: studentForm.course,
          message: studentForm.message
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ loading: false, success: true, error: null });
        trackLeadEvent('contact_form_student', { course: studentForm.course });
        setStudentForm({ name: '', email: '', phone: '', course: studentCourses[0] || 'General Counseling', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Submission failed.' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Connection error. Please try again.' });
    }
  };

  const handleCollabSubmit = async (e) => {
    e.preventDefault();
    if (!collabForm.companyName || !collabForm.contactName || !collabForm.email || !collabForm.phone) {
      setStatus({ loading: false, success: false, error: 'Please fill in Company, Contact Person, Email, and Phone.' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: collabForm.contactName,
          email: collabForm.email,
          phone: collabForm.phone,
          course: `Collaboration: ${collabForm.collabType}`,
          message: `Company/Org: ${collabForm.companyName} | Details: ${collabForm.message}`
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ loading: false, success: true, error: null });
        trackLeadEvent('contact_form_collaboration', { collabType: collabForm.collabType });
        setCollabForm({ companyName: '', contactName: '', email: '', phone: '', collabType: collabTypes[0] || 'Campus Placement / Talent Recruitment', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Submission failed.' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Connection error. Please try again.' });
    }
  };

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Header Banner */}
      <section className="page-banner-header">
        <div className="page-banner-container">
          <h1 className="page-banner-title">
            {isCollab ? (contactData.collabBannerTitle || 'Corporate & Institutional Collaboration') : (contactData.studentBannerTitle || 'Contact Our Advisors')}
          </h1>
          <p className="page-banner-desc">
            {isCollab
              ? (contactData.collabBannerDesc || 'Partner with BDPS to recruit skilled software talent, execute corporate training bootcamps, or sponsor academic project labs.')
              : (contactData.studentBannerDesc || 'Get in touch to clear course doubts, check batch timings, or request custom syllabus modules.')
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="contact-container">
        {/* Upcoming IT Projects Showcase Container for Collaboration (First in Collaboration Mode) */}
        {isCollab && (contactData.upcomingITProjects || []).length > 0 && (
          <section className="it-projects-section" style={{ marginBottom: '44px' }}>
            <div className="section-header-center" style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 className="section-title" style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A' }}>
                Upcoming IT Projects & <span className="section-title-accent" style={{ color: '#FF7518' }}>Collaboration Opportunities</span>
              </h2>
              <p className="about-paragraph" style={{ maxWidth: '760px', margin: '8px auto 0 auto', color: '#64748B', fontSize: '14.5px' }}>
                Explore active enterprise software, AI solutions, and capstone initiatives at BDPS. Corporate clients & institutions can collaborate on software development, talent sponsorship, or joint technical projects.
              </p>
            </div>

            <div className="it-projects-grid">
              {(contactData.upcomingITProjects || []).map((project, idx) => (
                <ProjectCardItem
                  key={idx}
                  project={project}
                  onOpenModal={(proj) => setActiveProjectModal(proj)}
                  onPartnerClick={(proj) => {
                    setCollabForm(prev => ({
                      ...prev,
                      collabType: 'IT Solutions & Enterprise Software',
                      message: `Inquiring regarding partnership for project: ${proj.title}`
                    }));
                    document.getElementById('contact-form-card')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </section>
        )}

        <div className="contact-grid">
          {/* Left: Contact Info & Corporate HQ Map Card */}
          <div className="contact-card">
            {branches.map((branch, idx) => (
              <div key={idx} className="contact-card-inner">
                <h3 className="contact-card-title">
                  {isCollab ? 'Corporate Alliances Desk' : (branch.name || 'Campus Location')}
                </h3>
                <p className="about-paragraph">
                  {isCollab
                    ? 'BDPS works closely with software enterprises, accounting firms, and technical colleges to bridge academic preparation and hiring needs.'
                    : (branch.description || 'Visit our primary campus in Kakinada to review lab setups, interact with faculty mentors, or request course counseling.')
                  }
                </p>

                <div className="contact-info-list">
                  {branch.address && (
                    <div className="contact-detail-row">
                      <MapPin size={18} className="contact-icon" />
                      <span>{branch.address}</span>
                    </div>
                  )}
                  {branch.phone && (
                    <div className="contact-detail-row">
                      <Phone size={18} className="contact-icon" />
                      <a href={`tel:${branch.phone}`} className="footer-contact-link">{branch.phone}</a>
                    </div>
                  )}
                  {branch.email && (
                    <div className="contact-detail-row">
                      <Mail size={18} className="contact-icon" />
                      <a href={`mailto:${branch.email}`} className="footer-contact-link">{branch.email}</a>
                    </div>
                  )}
                  <div className="contact-detail-row">
                    <Clock size={18} className="contact-icon" />
                    <span><strong>Office Timings:</strong> {branch.timings || 'Mon - Sat: 7:30 AM - 8:30 PM IST'}</span>
                  </div>
                </div>

                {/* Map Wrapper Expands to Fill Available Height */}
                {branch.mapEmbedUrl && (
                  <div className="contact-map-wrapper">
                    <iframe
                      src={branch.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      className="contact-map-frame"
                      allowFullScreen=""
                      loading="lazy"
                      title={`${branch.name || 'BDPS'} Location Map`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Form Card */}
          <div id="contact-form-card" className="contact-form-card">
            <h3 className="contact-card-title">
              {isCollab ? 'Submit Collaboration Proposal' : 'Leave a Message'}
            </h3>

            {status.success ? (
              <div className="form-success-banner">
                <CheckCircle2 size={42} className="success-icon" />
                <h4 className="success-title">
                  {isCollab ? 'Proposal Received!' : 'Message Submitted!'}
                </h4>
                <p className="success-desc">
                  {isCollab
                    ? 'Thank you for reaching out. Our Corporate Placement Desk will contact you within 24 hours.'
                    : 'Our academic counselor will reach out to you within 24 hours.'
                  }
                </p>
              </div>
            ) : isCollab ? (
              /* Collaboration Form */
              <form onSubmit={handleCollabSubmit} className="form-block-column">
                {status.error && (
                  <div className="form-error-alert">{status.error}</div>
                )}

                <div className="form-group-block">
                  <label className="form-label">COMPANY / INSTITUTION NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter company or college name"
                    value={collabForm.companyName}
                    onChange={(e) => setCollabForm({ ...collabForm, companyName: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">CONTACT PERSON NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name of representative"
                    value={collabForm.contactName}
                    onChange={(e) => setCollabForm({ ...collabForm, contactName: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">OFFICIAL EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="official@company.com"
                    value={collabForm.email}
                    onChange={(e) => setCollabForm({ ...collabForm, email: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9999999999"
                    value={collabForm.phone}
                    onChange={(e) => setCollabForm({ ...collabForm, phone: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">COLLABORATION TYPE</label>
                  <select
                    value={collabForm.collabType}
                    onChange={(e) => setCollabForm({ ...collabForm, collabType: e.target.value })}
                    className="form-select-plain"
                  >
                    {collabTypes.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-block">
                  <label className="form-label">PROPOSAL DETAILS / REQUIREMENTS</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your requirements or partnership scope..."
                    value={collabForm.message}
                    onChange={(e) => setCollabForm({ ...collabForm, message: e.target.value })}
                    className="form-textarea-plain"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="btn-submit-orange"
                >
                  <Handshake size={16} /> {status.loading ? 'Submitting...' : 'Submit Partnership Proposal'}
                </button>
              </form>
            ) : (
              /* Student Form */
              <form onSubmit={handleStudentSubmit} className="form-block-column">
                {status.error && (
                  <div className="form-error-alert">{status.error}</div>
                )}

                <div className="form-group-block">
                  <label className="form-label">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9999999999"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">INTERESTED PROGRAM</label>
                  <select
                    value={studentForm.course}
                    onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                    className="form-select-plain"
                  >
                    {studentCourses.map((crs, idx) => (
                      <option key={idx} value={crs}>{crs}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group-block">
                  <label className="form-label">MESSAGE</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you'd like to achieve..."
                    value={studentForm.message}
                    onChange={(e) => setStudentForm({ ...studentForm, message: e.target.value })}
                    className="form-textarea-plain"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="btn-submit-orange"
                >
                  <Send size={16} /> {status.loading ? 'Submitting...' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Project Details Popup Modal */}
        {activeProjectModal && (
          <ProjectDetailsModal
            project={activeProjectModal}
            onClose={() => setActiveProjectModal(null)}
            onPartnerClick={(proj) => {
              setCollabForm(prev => ({
                ...prev,
                collabType: 'IT Solutions & Enterprise Software',
                message: `Inquiring regarding partnership for project: ${proj.title}`
              }));
              document.getElementById('contact-form-card')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <VisitorFooter />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading contact page...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
