'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Printer, 
  Share2, 
  Check, 
  Clock, 
  Lock, 
  FileText, 
  Users, 
  Cookie, 
  ShieldAlert, 
  Globe, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Building2, 
  HelpCircle,
  Database,
  UserCheck
} from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';

const PRIVACY_SECTIONS = [
  {
    id: 'section-1',
    num: '01',
    title: 'Information We Collect',
    icon: Database,
    content: 'At BDPS IT (in collaboration with EHF), we collect personal information necessary to deliver educational courses, internships, certifications, and career placement support services.',
    items: [
      'Full Name & Identity Details',
      'Mobile / WhatsApp Number',
      'Email Address',
      'Educational Qualification & Background',
      'Course & Training Program Enrolment Info',
      'Registration & Student Enquiry Details',
      'Payment & Transaction Records',
      'Internship, Project & Placement Profile',
      'Device, Browser & Technical Access Data',
      'Communication records via Phone, Email or Forms'
    ]
  },
  {
    id: 'section-2',
    num: '02',
    title: 'How We Use Your Information',
    icon: UserCheck,
    content: 'We use the collected information exclusively to fulfill educational services, manage student certifications, and facilitate career development opportunities.',
    items: [
      'Course registration, student portal access & administration',
      'Delivering practical online and offline classroom training',
      'AI-based academic assistance & learning tools',
      'Conducting assessments and issuing verified course certificates',
      'Facilitating internship and project opportunities',
      'Career guidance, resume support and placement referrals',
      'Conducting skill-development initiatives with EHF',
      'Sending important batch schedules, updates and notices',
      'Improving course curriculum, platform security and user experience',
      'Promptly responding to student inquiries and support requests'
    ]
  },
  {
    id: 'section-3',
    num: '03',
    title: 'BDPS IT & EHF Collaboration',
    icon: Building2,
    content: 'Where a training, education, skill-development, internship, social-impact or career-related program is jointly organised or supported by BDPS IT and Embracing Humanity Foundation (EHF), relevant participant information may be shared between the collaborating organisations to the extent reasonably necessary for registration, program administration, communication, certification, reporting, monitoring and delivery of the respective program. Such information will be handled strictly in accordance with applicable privacy and data-protection laws.'
  },
  {
    id: 'section-4',
    num: '04',
    title: 'Information Sharing Policy',
    icon: Users,
    content: 'We strictly maintain data privacy. We NEVER sell or rent personal information to third parties.',
    sharingPurposes: [
      'Secure payment processing gateways',
      'Online learning platforms and technical servers',
      'Website infrastructure and cloud hosting support',
      'Student communication services (SMS, WhatsApp, Email)',
      'Internship, practical project & industry collaborator activities',
      'Placement & recruitment employer referrals',
      'EHF-supported or jointly conducted community programs',
      'Legal, compliance or regulatory requirements when compelled by law'
    ]
  },
  {
    id: 'section-5',
    num: '05',
    title: 'Cookies & Analytics',
    icon: Cookie,
    content: 'Our website may use essential cookies, browser local storage, and anonymous performance metrics to enhance site performance, remember user preferences, maintain session state, and deliver a smooth navigation experience.'
  },
  {
    id: 'section-6',
    num: '06',
    title: 'Data Security Measures',
    icon: Lock,
    content: 'We implement robust technical and organizational security measures to protect personal information against unauthorized access, alteration, disclosure, misuse, or destruction. Access to student data is restricted strictly to authorized staff on a need-to-know basis.'
  },
  {
    id: 'section-7',
    num: '07',
    title: 'Data Retention',
    icon: Clock,
    content: 'We retain personal information only for as long as reasonably necessary to fulfill educational, certification verification, financial record-keeping, program administration, legal compliance, and legitimate operational purposes.'
  },
  {
    id: 'section-8',
    num: '08',
    title: 'Your Privacy Rights',
    icon: ShieldCheck,
    content: 'Subject to applicable Indian data privacy laws, students and visitors have rights regarding their personal information:',
    rights: [
      'Access & Review: Request details of personal information held by BDPS IT.',
      'Correction: Request update or correction of inaccurate or incomplete records.',
      'Deletion: Request erasure of personal data where legally permissible.',
      'Consent Withdrawal: Withdraw consent for optional marketing communications.',
      'Grievance Redressal: Raise privacy concerns directly with our compliance officer.'
    ]
  },
  {
    id: 'section-9',
    num: '09',
    title: 'Children & Minors Privacy',
    icon: ShieldAlert,
    content: 'Where our educational programs or workshops involve students under 18 years of age, personal information is collected and processed with appropriate parental/guardian consent and in compliance with legal child protection standards.'
  },
  {
    id: 'section-10',
    num: '10',
    title: 'Third-Party Websites',
    icon: Globe,
    content: 'Our website may contain links to external third-party tools, payment partners, or informational resources. BDPS IT and EHF are not responsible for the privacy practices, content, or security policies of external websites.'
  },
  {
    id: 'section-11',
    num: '11',
    title: 'Policy Updates',
    icon: FileText,
    content: 'We periodically review and update this Privacy Policy to reflect technological improvements, operational changes, or legal updates. The latest version will always be published on this page with an updated effective date.'
  },
  {
    id: 'section-12',
    num: '12',
    title: 'Contact Us',
    icon: HelpCircle,
    content: 'For any privacy inquiries, data access requests, or policy questions, please reach out to our administration team:'
  }
];

export default function PrivacyPolicyClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('section-1');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const section of PRIVACY_SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const filteredSections = PRIVACY_SECTIONS.filter((sec) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      sec.title.toLowerCase().includes(term) ||
      sec.content.toLowerCase().includes(term) ||
      sec.items?.some((i) => i.toLowerCase().includes(term)) ||
      sec.sharingPurposes?.some((i) => i.toLowerCase().includes(term))
    );
  });

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Hero Header */}
      <section className="legal-page-header">
        <div className="page-banner-container">
          <div className="legal-hero-badge">
            <Lock size={14} /> Official Legal Document • Updated Sept 13, 2026
          </div>
          <h1 className="legal-hero-title">Privacy Policy</h1>
          <p className="legal-hero-desc">
            Learn how BDPS Computer Education & IT Solutions (in collaboration with Embracing Humanity Foundation) collects, protects, and handles your personal data.
          </p>

          <div className="legal-hero-controls">
            <div className="legal-search-box">
              <Search size={18} className="legal-search-icon" />
              <input
                type="text"
                placeholder="Search policy terms (e.g., cookies, security, EHF)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="legal-search-input"
              />
            </div>
            <button onClick={handlePrint} className="legal-action-btn" title="Print document">
              <Printer size={16} /> Print Document
            </button>
            <button onClick={handleCopyLink} className="legal-action-btn" title="Copy URL">
              {copied ? <Check size={16} /> : <Share2 size={16} />}
              {copied ? 'Link Copied!' : 'Share Page'}
            </button>
          </div>
        </div>
      </section>

      {/* Layout Grid */}
      <div className="legal-layout-container">
        <div className="legal-grid">
          {/* Sidebar Table of Contents */}
          <aside className="legal-sidebar">
            <div className="legal-toc-title">
              <span>Table of Contents</span>
              <span className="legal-toc-num">{PRIVACY_SECTIONS.length}</span>
            </div>
            <ul className="legal-toc-list">
              {PRIVACY_SECTIONS.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className={`legal-toc-link ${activeSection === sec.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span className="legal-toc-num">{sec.num}</span>
                    <span>{sec.title}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="legal-meta-card">
              <div className="legal-meta-row">
                <Calendar size={14} className="icon-orange" />
                <span>Effective: Sept 13, 2026</span>
              </div>
              <div className="legal-meta-row">
                <Globe size={14} className="icon-orange" />
                <span>Jurisdiction: Kakinada, AP, India</span>
              </div>
              <div className="legal-meta-row">
                <Building2 size={14} className="icon-orange" />
                <span>BDPS IT & EHF Collaboration</span>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="legal-content-main">
            {filteredSections.length === 0 ? (
              <div className="legal-section-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <Search size={40} style={{ color: '#94A3B8', marginBottom: '16px' }} />
                <h3>No matching sections found</h3>
                <p style={{ color: '#64748B' }}>Try searching with different keywords like "data", "cookies", or "rights".</p>
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="legal-action-btn"
                  style={{ background: '#FF7518', marginTop: '16px', border: 'none' }}
                >
                  Clear Search Filter
                </button>
              </div>
            ) : (
              filteredSections.map((sec) => {
                const IconComponent = sec.icon || FileText;
                return (
                  <article key={sec.id} id={sec.id} className="legal-section-card">
                    <header className="legal-section-header">
                      <div className="legal-section-icon-badge">
                        <IconComponent size={22} />
                      </div>
                      <div className="legal-section-title-wrap">
                        <div className="legal-section-num-tag">Section {sec.num}</div>
                        <h2 className="legal-section-title">{sec.title}</h2>
                      </div>
                    </header>

                    <div className="legal-section-body">
                      <p>{sec.content}</p>

                      {/* Section 1 items */}
                      {sec.items && (
                        <div className="legal-grid-list">
                          {sec.items.map((item, idx) => (
                            <div key={idx} className="legal-list-item-card">
                              <CheckCircle2 size={16} className="legal-list-bullet-icon" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Section 4 sharing list */}
                      {sec.sharingPurposes && (
                        <div className="legal-grid-list">
                          {sec.sharingPurposes.map((purpose, idx) => (
                            <div key={idx} className="legal-list-item-card">
                              <CheckCircle2 size={16} className="legal-list-bullet-icon" />
                              <span>{purpose}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Section 8 rights */}
                      {sec.rights && (
                        <div className="legal-alert-box info">
                          <div>
                            <strong style={{ display: 'block', marginBottom: '6px' }}>Your Data Protection Rights:</strong>
                            <ul style={{ paddingLeft: '18px', margin: 0 }}>
                              {sec.rights.map((right, idx) => (
                                <li key={idx} style={{ marginBottom: '4px' }}>{right}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            )}

            {/* Contact HQ Box */}
            <div className="legal-contact-footer-card">
              <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0' }}>
                BDPS Computer Education & IT Solutions
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '14.5px', margin: 0 }}>
                In Collaboration with Embracing Humanity Foundation (EHF)
              </p>

              <div className="legal-contact-grid">
                <div className="legal-contact-info-item">
                  <MapPin size={20} className="legal-contact-icon" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#CBD5E1' }}>Headquarters Address</strong>
                    <span style={{ fontSize: '13.5px', lineHeight: 1.4 }}>
                      Nagamalli Thota Junction, Vision Emergency Hospital Back Side, Kakinada, Andhra Pradesh, India.
                    </span>
                  </div>
                </div>

                <div className="legal-contact-info-item">
                  <Phone size={20} className="legal-contact-icon" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#CBD5E1' }}>Phone & WhatsApp</strong>
                    <a href="tel:8142668889" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>
                      +91 81426 68889
                    </a>
                  </div>
                </div>

                <div className="legal-contact-info-item">
                  <Mail size={20} className="legal-contact-icon" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#CBD5E1' }}>Official Email</strong>
                    <a href="mailto:info@bdpsit.com" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>
                      info@bdpsit.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <VisitorFooter />
    </div>
  );
}
