'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Printer, 
  Share2, 
  Check, 
  Lock, 
  Users, 
  ShieldAlert, 
  Globe, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  HelpCircle,
  GraduationCap,
  CreditCard,
  Laptop,
  Award,
  Cpu,
  Briefcase,
  AlertTriangle,
  Ban,
  Scale,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';

const TERMS_SECTIONS = [
  {
    id: 'section-1',
    num: '01',
    title: 'Our Educational & Tech Services',
    icon: GraduationCap,
    content: 'BDPS IT provides educational, technology, and career-oriented programs, including selected initiatives in collaboration with Embracing Humanity Foundation (EHF).',
    services: [
      '💻 Computer & IT Software Training',
      '🎓 Skill Development Programs',
      '🤖 AI-Enabled Learning Assistance',
      '🧑‍💻 Internship & Real Project Opportunities',
      '📜 Certification-Related Services',
      '💼 Career & Placement Support',
      '🚀 IT Projects & Technology Services',
      '🤝 Education & Skill-Development Initiatives in Collaboration with EHF'
    ]
  },
  {
    id: 'section-2',
    num: '02',
    title: 'BDPS IT & EHF Collaboration',
    icon: Building2,
    content: 'BDPS IT and Embracing Humanity Foundation (EHF) may collaborate on educational, skill-development, employability, internship, technology, community-development, and other mutually agreed programs. Specific programs may have their own eligibility requirements, registration procedures, schedules, fees, benefits, and participation conditions. Participation in a particular program does not automatically create an employment, partnership, agency, or other legal relationship beyond the specific program or written arrangement applicable to that activity.'
  },
  {
    id: 'section-3',
    num: '03',
    title: 'Course Registration & Student Accuracy',
    icon: FileText,
    content: 'Students and participants must provide accurate, current, and complete information during registration. BDPS IT reserves the right to reject or cancel registration where information provided is found to be false, misleading, or fraudulent.'
  },
  {
    id: 'section-4',
    num: '04',
    title: 'Course Fees & Payment Terms',
    icon: CreditCard,
    content: 'Course fees and applicable charges will be clearly communicated or displayed prior to registration. Fee refunds, cancellations, and course transfers are governed strictly by the applicable Refund & Cancellation Policy or program-specific terms.'
  },
  {
    id: 'section-5',
    num: '05',
    title: 'Online Learning & Platform Access',
    icon: Laptop,
    content: 'Depending on the enrolled program, participants may receive access to learning materials, online classes, practical lab training, projects, AI-based academic assistance, certification, and career guidance. Course login credentials are personal to the student and MUST NOT be shared with others.'
  },
  {
    id: 'section-6',
    num: '06',
    title: 'Intellectual Property Rights',
    icon: Award,
    content: 'All BDPS IT website content, course syllabus, video lectures, notes, graphics, software source code, branding, logos, and educational materials are protected under applicable Indian intellectual property laws. Users may not copy, reproduce, resell, distribute, or commercially exploit such materials without prior explicit written permission from BDPS IT.'
  },
  {
    id: 'section-7',
    num: '07',
    title: 'AI Tutor & Learning Assistance',
    icon: Cpu,
    content: 'BDPS IT may provide AI-based academic assistance and technology-enabled learning tools. AI-generated information is provided primarily for educational support and may occasionally contain inaccuracies. Students should independently verify important professional, legal, financial, or technical information.'
  },
  {
    id: 'section-8',
    num: '08',
    title: 'Internship & Practical Projects',
    icon: Briefcase,
    content: 'Internship and project opportunities are offered subject to student eligibility, academic performance, batch availability, registration, and program-specific conditions. Participation in an internship or academic project does not automatically guarantee employment.'
  },
  {
    id: 'section-9',
    num: '09',
    title: 'Placement Assistance Policy',
    icon: Users,
    content: 'BDPS IT provides career support services including resume guidance, interview preparation, career counseling, job referrals, and placement drives.',
    alertWarning: '⚠️ Important Disclaimer: Placement assistance does not guarantee employment, a specific salary, a job offer, or selection by any specific company. Final hiring decisions are strictly made by respective employers based on candidate performance.'
  },
  {
    id: 'section-10',
    num: '10',
    title: 'Career Opportunities & Future IT Projects',
    icon: RocketIcon,
    content: 'BDPS IT plans to expand its IT projects, technology services, and industry-oriented initiatives in the future. As our IT projects and business operations grow, eligible and suitable students who successfully complete relevant courses at BDPS IT may be considered for employment opportunities within BDPS IT or its associated IT projects, subject to their skills, performance, project requirements, available positions, and applicable selection procedures. Our objective is not only to provide quality training, but also to create practical career pathways and employment opportunities for skilled students through our future IT projects and initiatives. BDPS IT may also collaborate with EHF and other organisations for education, skill development, employability, technology, and community-oriented initiatives. Course completion does not automatically guarantee employment.'
  },
  {
    id: 'section-11',
    num: '11',
    title: 'User Responsibilities',
    icon: ShieldCheck,
    content: 'All users and students accessing the site agree to uphold the following standards:',
    responsibilities: [
      'Provide true, accurate, and current information at all times',
      'Use the website and learning portal lawfully and respectfully',
      'Safeguard and protect personal account login credentials',
      'Respect copyright and intellectual property rights',
      'Avoid unauthorized system access or server probing',
      'Refrain from fraudulent, malicious, or deceptive activities',
      'Follow all program rules, lab guidelines, and code of conduct'
    ]
  },
  {
    id: 'section-12',
    num: '12',
    title: 'Prohibited Activities',
    icon: Ban,
    content: 'Users are explicitly prohibited from engaging in any of the following activities on our platforms:',
    prohibitedItems: [
      'Attempting unauthorized access to website servers, databases, or user accounts',
      'Introducing malware, viruses, worms, or harmful computational code',
      'Sharing, renting, or reselling paid course credentials to third parties',
      'Copying, scraping, recording, or redistributing course materials or videos',
      'Conducting fraudulent financial transactions or unauthorized registration',
      'Misusing BDPS IT or Embracing Humanity Foundation (EHF) brand names',
      'Interfering with website performance, network infrastructure, or availability'
    ]
  },
  {
    id: 'section-13',
    num: '13',
    title: 'Website Availability & Maintenance',
    icon: Globe,
    content: 'We strive to maintain high availability for our website and online portals. However, we cannot guarantee uninterrupted or error-free access due to scheduled maintenance, technical upgrades, internet network failures, or circumstances beyond our reasonable control.'
  },
  {
    id: 'section-14',
    num: '14',
    title: 'Third-Party Services & Integrations',
    icon: Share2,
    content: 'Our website may utilize trusted third-party technology providers, such as payment gateways, video hosting services, messaging platforms, and server infrastructures. Use of such services is subject to their respective terms and privacy policies.'
  },
  {
    id: 'section-15',
    num: '15',
    title: 'General Disclaimer',
    icon: AlertTriangle,
    content: 'BDPS IT and EHF provide educational, training, skill-development, and career-support services on a reasonable-efforts basis. We do not guarantee specific examination results, specific salary figures, guaranteed employment, guaranteed placement with a particular company, or specific business outcomes.'
  },
  {
    id: 'section-16',
    num: '16',
    title: 'Limitation of Liability',
    icon: ShieldAlert,
    content: 'To the maximum extent permitted under applicable law, BDPS IT and EHF shall not be liable for any indirect, incidental, consequential, special, or unforeseeable losses arising from the use of or inability to use our website or services. Nothing in these Terms excludes liability that cannot legally be excluded under Indian law.'
  },
  {
    id: 'section-17',
    num: '17',
    title: 'Changes to Services & Terms',
    icon: RefreshCw,
    content: 'BDPS IT and/or EHF reserve the right to modify, update, suspend, or discontinue any course, program, schedule, fee structure, or service feature when reasonably required. Updated terms will be published on the website.'
  },
  {
    id: 'section-18',
    num: '18',
    title: 'Privacy Compliance',
    icon: Lock,
    content: 'Your use of our website and services is also governed by our comprehensive Privacy Policy, which explains how personal information is collected, stored, and protected.'
  },
  {
    id: 'section-19',
    num: '19',
    title: 'Governing Law & Legal Jurisdiction',
    icon: Scale,
    content: 'These Terms of Service shall be governed by and construed in accordance with the laws of India. Subject to applicable law, any legal disputes arising out of these Terms shall be subject to the exclusive jurisdiction of the competent courts in Kakinada, Andhra Pradesh, India.'
  },
  {
    id: 'section-20',
    num: '20',
    title: 'Contact Information',
    icon: HelpCircle,
    content: 'If you have any questions or clarifications regarding these Terms of Service, please contact BDPS IT headquarters:'
  }
];

function RocketIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.79-1.81z" />
      <path d="M12 15l-3-3 8.5-8.5a2.12 2.12 0 0 1 3 3L12 15z" />
      <path d="M9 18l3 3" />
    </svg>
  );
}

export default function TermsOfServiceClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('section-1');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const section of TERMS_SECTIONS) {
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

  const filteredSections = TERMS_SECTIONS.filter((sec) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      sec.title.toLowerCase().includes(term) ||
      sec.content.toLowerCase().includes(term) ||
      sec.services?.some((s) => s.toLowerCase().includes(term)) ||
      sec.responsibilities?.some((r) => r.toLowerCase().includes(term)) ||
      sec.prohibitedItems?.some((p) => p.toLowerCase().includes(term))
    );
  });

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Hero Header */}
      <section className="legal-page-header">
        <div className="page-banner-container">
          <div className="legal-hero-badge">
            <FileText size={14} /> Official Terms of Service • Effective Sept 13, 2026
          </div>
          <h1 className="legal-hero-title">Terms of Service</h1>
          <p className="legal-hero-desc">
            Welcome to BDPS Computer Education & IT Solutions. Please review the official terms governing your use of our courses, training portals, and EHF collaborative initiatives.
          </p>

          <div className="legal-hero-controls">
            <div className="legal-search-box-container">
              <div className="legal-search-box">
                <input
                  type="text"
                  placeholder="Search terms (e.g., fees, placement, EHF, prohibited)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="legal-search-input"
                />
                <Search size={18} className="legal-search-icon" />
              </div>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="site-search-clear-btn"
                >
                  Clear
                </button>
              )}
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
              <span className="legal-toc-num">{TERMS_SECTIONS.length}</span>
            </div>
            <ul className="legal-toc-list">
              {TERMS_SECTIONS.map((sec) => (
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
                <Scale size={14} className="icon-orange" />
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
                <p style={{ color: '#64748B' }}>Try searching with different terms like "fees", "refund", or "placement".</p>
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

                      {/* Section 1 services list */}
                      {sec.services && (
                        <div className="legal-grid-list">
                          {sec.services.map((srv, idx) => (
                            <div key={idx} className="legal-list-item-card">
                              <span style={{ fontSize: '15px' }}>{srv}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Section 9 placement warning */}
                      {sec.alertWarning && (
                        <div className="legal-alert-box">
                          <AlertTriangle size={20} className="legal-alert-icon" />
                          <div>{sec.alertWarning}</div>
                        </div>
                      )}

                      {/* Section 11 responsibilities */}
                      {sec.responsibilities && (
                        <div className="legal-grid-list">
                          {sec.responsibilities.map((resp, idx) => (
                            <div key={idx} className="legal-list-item-card">
                              <Check className="legal-list-bullet-icon" size={16} />
                              <span>{resp}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Section 12 prohibited */}
                      {sec.prohibitedItems && (
                        <div className="legal-grid-list">
                          {sec.prohibitedItems.map((pro, idx) => (
                            <div key={idx} className="legal-list-item-card prohibited">
                              <Ban className="legal-list-bullet-icon" size={16} />
                              <span>{pro}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            )}

            {/* Contact HQ Card */}
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
