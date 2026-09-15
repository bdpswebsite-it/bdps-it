'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube, Instagram, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchCached } from '@/lib/api-cache';
import InternshipModal from './forms/InternshipModal';

const DEFAULT_COURSE_LINKS = [
  { label: 'PGDCA Diploma', href: '/courses' },
  { label: 'Core Java Certification', href: '/courses' },
  { label: 'Tally Prime Accounting', href: '/courses' },
  { label: 'C Language & Web Dev', href: '/courses' },
  { label: 'Academic Projects Lab', href: '/courses' }
];

const DEFAULT_QUICK_LINKS = [
  { label: 'Apply for Internship', href: '/courses', isModal: true },
  { label: 'Certificate Verification', href: '/verify-certificate', isModal: false },
  { label: 'Job Openings & Placements', href: '/jobs', isModal: false },
  { label: 'Upcoming Batches', href: '/courses', isModal: false },
  { label: 'About BDPS', href: '/about', isModal: false },
  { label: 'Services Offered', href: '/courses', isModal: false },
  { label: 'Student Reviews', href: '/', isModal: false },
  { label: 'Contact Us', href: '/contact', isModal: false }
];

export default function VisitorFooter() {
  const [internshipModalOpen, setInternshipModalOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchCached('/api/site-settings')
      .then(data => {
        if (data && data.success && data.settings) {
          setSiteSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const phone = siteSettings?.contactPhone || '+91 85001 08016';
  const email = siteSettings?.contactEmail || 'bdpskkd@gmail.com';
  const address = siteSettings?.address || 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003';
  const tagline = siteSettings?.footerTagline || 'Learn Today | 🚀 Lead Tomorrow | 🌍 Transform Tomorrow';
  const showCsr = siteSettings?.footerShowCsr !== false;
  const csrText = siteSettings?.footerCsrText || '🤝 CSR Initiatives in Collaboration with Embracing Humanity Foundation (EHF)';
  const accreditation = siteSettings?.footerAccreditationText || 'ISO 9001:2015 Accredited';
  const copyrightText = siteSettings?.footerCopyrightText || 'All Rights Reserved.';

  const branding = {
    title: 'BDPS Computer Education',
    shortName: 'BDPS',
    tagline,
    phone,
    email,
    logoText: 'BDPS'
  };

  const courseLinks = (siteSettings?.footerPopularCourses && siteSettings.footerPopularCourses.length > 0)
    ? siteSettings.footerPopularCourses
    : DEFAULT_COURSE_LINKS;

  const quickLinks = (siteSettings?.footerQuickLinks && siteSettings.footerQuickLinks.length > 0)
    ? siteSettings.footerQuickLinks
    : DEFAULT_QUICK_LINKS;

  const socialLinks = [
    { icon: <Facebook size={18} />, href: siteSettings?.facebook || 'https://facebook.com/bdpscomputers', label: 'Facebook' },
    { icon: <Twitter size={18} />, href: siteSettings?.twitter || 'https://twitter.com/bdpscomputers', label: 'Twitter' },
    { icon: <Linkedin size={18} />, href: siteSettings?.linkedin || 'https://linkedin.com/company/bdps', label: 'LinkedIn' },
    { icon: <Youtube size={18} />, href: siteSettings?.youtube || 'https://youtube.com/@bdpscomputers', label: 'YouTube' },
    { icon: <Instagram size={18} />, href: siteSettings?.instagram || 'https://instagram.com/bdpscomputers', label: 'Instagram' }
  ];

  return (
    <footer className="visitor-footer">
      <div className="footer-grid">
        {/* Column 1: Info & Brand */}
        <div className="footer-column">
          <div className="footer-brand-logo-row">
            {siteSettings?.headerLogo ? (
              <div className="footer-logo-card">
                <img 
                  src={siteSettings.headerLogo} 
                  alt={branding.title} 
                  className="footer-logo-img" 
                  width="160"
                  height="52"
                  loading="lazy"
                />
              </div>
            ) : (
              <>
                <div className="footer-logo-badge">
                  {branding.logoText.charAt(0)}<span className="about-heading-accent">{branding.logoText.slice(1)}</span>
                </div>
                <span className="footer-logo-title">{branding.title}</span>
              </>
            )}
          </div>
          <p className="footer-tagline">
            {branding.tagline}
          </p>
          {showCsr && (
            <p className="footer-csr-tag">
              {csrText}
            </p>
          )}
          <div className="footer-social-row">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Popular Courses */}
        <div className="footer-column">
          <h4 className="footer-column-title">
            Popular Programs
          </h4>
          <ul className="footer-links-list">
            {courseLinks.map((course, idx) => (
              <li key={idx}>
                <Link href={course.href || '/courses'} className="footer-link-item">
                  <ArrowRight size={12} className="contact-icon" /> {course.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div className="footer-column">
          <h4 className="footer-column-title">
            Quick Links
          </h4>
          <ul className="footer-links-list">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                {link.isModal ? (
                  <button 
                    onClick={() => setInternshipModalOpen(true)}
                    className="footer-link-item"
                    style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
                  >
                    <ArrowRight size={12} className="contact-icon" /> {link.label}
                  </button>
                ) : (
                  <Link href={link.href || '/'} className="footer-link-item">
                    <ArrowRight size={12} className="contact-icon" /> {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact HQ */}
        <div className="footer-column">
          <h4 className="footer-column-title">
            Contact HQ
          </h4>
          <div className="footer-contact-list">
            <div className="footer-contact-item">
              <MapPin size={18} className="footer-contact-icon" />
              <span>{address}</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={18} className="footer-contact-icon" />
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="footer-contact-link">{phone}</a>
            </div>
            <div className="footer-contact-item">
              <Mail size={18} className="footer-contact-icon" />
              <a href={`mailto:${email}`} className="footer-contact-link">{email}</a>
            </div>
            {accreditation && (
              <div className="footer-accreditation">
                <ShieldCheck size={16} /> {accreditation}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div>
          © {currentYear} {branding.title}. {copyrightText}
        </div>
        <div className="footer-bottom-links">
          <Link href="/privacy-policy" className="footer-bottom-link">Privacy Policy</Link>
          <Link href="/terms-of-service" className="footer-bottom-link">Terms of Service</Link>
        </div>
      </div>

      <InternshipModal
        isOpen={internshipModalOpen}
        onClose={() => setInternshipModalOpen(false)}
        siteSettings={siteSettings}
      />
    </footer>
  );
}
