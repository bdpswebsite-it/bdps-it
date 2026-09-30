import { NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity.write';
import { DEFAULT_HOME_PAGE } from '@/app/api/home-page/route';
import { DEFAULT_ABOUT_PAGE } from '@/app/api/about-page/route';
import { DEFAULT_TESTIMONIALS } from '@/app/api/testimonials/route';

export const dynamic = 'force-dynamic';

async function performSeed() {
  const results: string[] = [];

  // Helper to safely delete any drafts or duplicates
  const cleanOldAndDrafts = async (id: string, typeName: string) => {
    try {
      await sanityWriteClient.delete(`drafts.${id}`);
    } catch (e) {}

    try {
      const oldDuplicates = await sanityWriteClient.fetch(
        `*[_type == $typeName && !(_id in [$id, "drafts." + $id])]._id`,
        { typeName, id }
      );
      if (Array.isArray(oldDuplicates) && oldDuplicates.length > 0) {
        for (const oldId of oldDuplicates) {
          try {
            await sanityWriteClient.delete(oldId);
          } catch (e) {}
        }
      }
    } catch (e) {}
  };

  // 1. Seed Site Settings (Singleton)
  await cleanOldAndDrafts('siteSettings', 'siteSettings');
  const siteSettingsDoc = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    announcementBanner: '🚀 New Batches Starting This Monday! Limited Seats in Full Stack & AI Tracks.',
    headerBrandTitle: 'BDPS Computer Education',
    headerBrandSubtitle: 'COMPUTER TRAINING INSTITUTE',
    headerLogoBadge: 'BDPS',
    headerTopBarLegacyText: 'Our Legacy (Since 2006)',
    headerTopBarAlliancesText: 'Placement Alliances',
    contactPhone: '+91 85001 08016',
    contactEmail: 'bdpskkd@gmail.com',
    whatsappNumber: '+91 85001 08016',
    address: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003',
    facebook: 'https://facebook.com/bdpscomputers',
    instagram: 'https://instagram.com/bdpscomputers',
    linkedin: 'https://linkedin.com/company/bdps',
    youtube: 'https://youtube.com/@bdpscomputers',
    twitter: 'https://twitter.com/bdpscomputers',
    footerTagline: 'Learn Today | 🚀 Lead Tomorrow | 🌍 Transform Tomorrow',
    footerShowCsr: true,
    footerCsrText: '🤝 CSR Initiatives in Collaboration with Embracing Humanity Foundation (EHF)',
    footerPopularCourses: [
      { _key: 'f_course_1', label: 'PGDCA Diploma', href: '/courses' },
      { _key: 'f_course_2', label: 'Core Java Certification', href: '/courses' },
      { _key: 'f_course_3', label: 'Tally Prime Accounting', href: '/courses' },
      { _key: 'f_course_4', label: 'C Language & Web Dev', href: '/courses' },
      { _key: 'f_course_5', label: 'Academic Projects Lab', href: '/courses' },
    ],
    footerQuickLinks: [
      { _key: 'f_link_1', label: 'Apply for Internship', href: '/courses', isModal: true },
      { _key: 'f_link_2', label: 'Certificate Verification', href: '/verify-certificate', isModal: false },
      { _key: 'f_link_3', label: 'Job Openings & Placements', href: '/jobs', isModal: false },
      { _key: 'f_link_4', label: 'Upcoming Batches', href: '/courses', isModal: false },
      { _key: 'f_link_5', label: 'About BDPS', href: '/about', isModal: false },
      { _key: 'f_link_6', label: 'Services Offered', href: '/courses', isModal: false },
      { _key: 'f_link_7', label: 'Student Reviews', href: '/', isModal: false },
      { _key: 'f_link_8', label: 'Contact Us', href: '/contact', isModal: false },
    ],
    footerAccreditationText: 'ISO 9001:2015 Accredited',
    footerCopyrightText: 'All Rights Reserved.',
    internshipActive: true,
    internshipNoticeText: 'Internship applications for the current batch are currently closed. Please check back for upcoming cohort announcements.',
    internshipCourses: [
      'Python Full Stack',
      'Core Java & Spring Boot',
      'Web Development (MERN)',
      'Tally Prime & GST Accounting'
    ],
    stipendRegistrationActive: true,
    stipendNoticeText: 'Stipend registrations for the current batch are now closed. Please check back for upcoming cohort announcements.'
  };

  // Create both published and draft to guarantee immediate Studio update
  await sanityWriteClient.createOrReplace(siteSettingsDoc);
  await sanityWriteClient.createOrReplace({ ...siteSettingsDoc, _id: 'drafts.siteSettings' });
  results.push('siteSettings');

  // 2. Seed Home Page (Singleton)
  await cleanOldAndDrafts('homePage', 'homePage');
  const homePageDoc = {
    _id: 'homePage',
    _type: 'homePage',
    ...DEFAULT_HOME_PAGE,
    supportPillars: DEFAULT_HOME_PAGE.supportPillars.map((p, idx) => ({
      _key: `pillar_${idx}`,
      ...p
    })),
    hiringPartners: DEFAULT_HOME_PAGE.hiringPartners.map((p, idx) => ({
      _key: `partner_${idx}`,
      _type: 'companyPartner',
      name: p.name,
      website: p.website
    }))
  };
  await sanityWriteClient.createOrReplace(homePageDoc);
  await sanityWriteClient.createOrReplace({ ...homePageDoc, _id: 'drafts.homePage' });
  results.push('homePage');

  // 3. Seed About Page (Singleton)
  await cleanOldAndDrafts('aboutPage', 'aboutPage');
  const aboutPageDoc = {
    _id: 'aboutPage',
    _type: 'aboutPage',
    ...DEFAULT_ABOUT_PAGE,
    spotlightPillars: DEFAULT_ABOUT_PAGE.spotlightPillars.map((p, idx) => ({
      _key: `spotlight_${idx}`,
      ...p
    })),
    stats: DEFAULT_ABOUT_PAGE.stats.map((s, idx) => ({
      _key: `stat_${idx}`,
      ...s
    })),
    beliefs: DEFAULT_ABOUT_PAGE.beliefs.map((b, idx) => ({
      _key: `belief_${idx}`,
      ...b
    }))
  };
  await sanityWriteClient.createOrReplace(aboutPageDoc);
  await sanityWriteClient.createOrReplace({ ...aboutPageDoc, _id: 'drafts.aboutPage' });
  results.push('aboutPage');

  // 4. Seed Contact Page (Singleton)
  await cleanOldAndDrafts('contactPage', 'contactPage');
  const contactPageDoc = {
    _id: 'contactPage',
    _type: 'contactPage',
    studentBannerTitle: 'Contact Our Advisors',
    studentBannerDesc: 'Get in touch to clear course doubts, check batch timings, or request custom syllabus modules.',
    collabBannerTitle: 'Corporate & Institutional Collaboration',
    collabBannerDesc: 'Partner with BDPS to recruit skilled software talent, execute corporate training bootcamps, or sponsor academic project labs.',
    branches: [
      {
        _key: 'branch_kakinada_hq',
        name: 'Kakinada Campus (Corporate HQ)',
        description: 'Visit our primary campus in Kakinada to review lab setups, interact with faculty mentors, or request course counseling.',
        address: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003',
        phone: '+91 85001 08016',
        email: 'bdpskkd@gmail.com',
        timings: 'Mon - Sat: 7:30 AM - 8:30 PM IST',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.7196022838426!2d82.25141071112674!3d16.988220084364417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3828414ca0cd97%3A0x88981e6992d9f2d1!2sNagamallithota%20Junction%2C%20Kakinada%2C%20Andhra%20Pradesh%20533003!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin'
      }
    ],
    studentCourses: [
      'General Counseling',
      'Software Development (Full Stack)',
      'Data Science & AI',
      'Tally Prime & GST',
      'PGDCA Diploma',
      'Core Java & Spring Boot',
      'Python & Django Development'
    ],
    collabTypes: [
      'Campus Placement / Talent Recruitment',
      'Corporate Employee Upskilling',
      'Lab & Capstone Project Sponsorship',
      'Guest Lecture & IEEE Workshops'
    ]
  };
  await sanityWriteClient.createOrReplace(contactPageDoc);
  await sanityWriteClient.createOrReplace({ ...contactPageDoc, _id: 'drafts.contactPage' });
  results.push('contactPage');

  // 5. Seed Testimonials (Collection)
  for (let i = 0; i < DEFAULT_TESTIMONIALS.length; i++) {
    const t = DEFAULT_TESTIMONIALS[i];
    const testimonialDoc = {
      _id: `testimonial-${i + 1}`,
      _type: 'testimonial',
      name: t.name,
      role: t.role,
      company: t.company,
      courseName: t.courseName,
      quote: t.quote,
      rating: t.rating || 5,
      order: i + 1
    };
    await sanityWriteClient.createOrReplace(testimonialDoc);
    results.push(`testimonial-${i + 1}`);
  }

  return results;
}

export async function POST() {
  try {
    const results = await performSeed();
    return NextResponse.json({
      success: true,
      message: 'Successfully populated Global Site Settings, Home, About, Contact, and Testimonials into Sanity CMS dataset!',
      seededDocuments: results
    });
  } catch (error: any) {
    console.error('Error seeding Sanity content:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to seed Sanity content'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const results = await performSeed();
    return NextResponse.json({
      success: true,
      message: 'Successfully populated Global Site Settings, Home, About, Contact, and Testimonials into Sanity CMS dataset!',
      seededDocuments: results
    });
  } catch (error: any) {
    console.error('Error seeding Sanity content:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to seed Sanity content'
    }, { status: 500 });
  }
}
