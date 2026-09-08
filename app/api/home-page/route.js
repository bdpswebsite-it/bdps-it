import { NextResponse } from 'next/server';
import { getSanityHomePage } from '@/lib/sanity.client';

export const revalidate = 60;

export const DEFAULT_HOME_PAGE = {
  featuredCoursesTitle: 'Featured Training Programs',
  featuredCoursesSubtitle: 'Explore our most popular industry-recognized diploma and certification courses in Kakinada.',
  supportPillarsTitle: 'End-to-End Career & Academic Ecosystem',
  supportPillarsSubtitle: 'Everything a student needs — from foundational computer literacy to corporate placements.',
  testimonialsTitle: 'What Our Students Say',
  testimonialsSubtitle: 'Real stories and career transformations from our alumni network.',
  whyBdpsBadge: 'WHY CHOOSE BDPS',
  whyBdpsTitle: 'Over 20 Years of Technical Training Trust in Kakinada',
  whyBdpsDescription: 'BDPS Computer Education is Kakinada’s trusted destination for career-driven software engineering, office applications, and accounting expertise.',
  whyBdpsHighlights: [
    '🚀 20+ Years Legacy of IT Excellence',
    '💻 100% Practical Computer Lab Practice',
    '🎓 IEEE Capstone Final Year Project Guidance',
    '💼 Direct Job Referrals to 800+ MNC Partners',
    '🤖 BDPS AI Tutor 24/7 Academic Support',
    '📜 Government Recognized ISO Certifications',
    '💰 Scholarship & Stipend Programs',
    '👨‍🏫 1-on-1 Certified Industry Mentors',
  ],
  csrActive: true,
  csrTitle: 'CSR Initiative Collaboration',
  csrDescription: 'BDPS proudly collaborates with Embracing Humanity Foundation (EHF) to implement CSR skill development, digital literacy, and youth employment training.',
  supportPillars: [
    { icon: 'Briefcase', title: 'Internship Programs', desc: 'Real-world workplace experience & stipend exposure.' },
    { icon: 'Code', title: 'Live Projects', desc: 'Hands-on software application development.' },
    { icon: 'FileText', title: 'Academic Project Reports', desc: 'Comprehensive review & documentation assistance.' },
    { icon: 'Cpu', title: 'Final Year Project Guidance', desc: 'IEEE capstone guidance for B.Tech/M.Tech reviews.' },
    { icon: 'FileText', title: 'Resume Building', desc: 'ATS-friendly professional resume crafting.' },
    { icon: 'Target', title: 'Interview Preparation', desc: 'Technical testing & mock interview sessions.' },
    { icon: 'Award', title: 'Placement Assistance', desc: 'Direct job referrals to AP & MNC employer partners.' },
    { icon: 'Compass', title: 'Career Counseling', desc: '1-on-1 personalized career roadmap guidance.' },
  ],
  jobsMarqueeTitle: '🔥 LATEST JOB OPENINGS',
  customJobMarqueeItems: [
    { company: 'TCS / INFOSYS', title: 'Special Off-Campus Drive for Trained Freshers', location: 'Hyderabad / Vizag', link: '/jobs' },
    { company: 'BDPS CAREER CELL', title: '100+ Active IT & Accounting Placements Open', location: 'Kakinada HQ', link: '/jobs' },
  ],
  hiringPartnersTitle: 'Our Alumni Work At Top IT & Enterprise Firms',
  hiringPartnersSubtitle: 'Direct placement referrals with 800+ recruiting enterprises and regional offices.',
  hiringPartners: [
    'TCS',
    'Infosys',
    'Wipro',
    'Cognizant',
    'Accenture',
    'Tech Mahindra',
    'HCL Tech',
    'Local IT Solutions',
    'Business Accounts Firms',
  ],
};

export async function GET() {
  try {
    const data = await getSanityHomePage();
    return NextResponse.json(
      {
        success: true,
        data: data || DEFAULT_HOME_PAGE,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: DEFAULT_HOME_PAGE,
      warning: 'Fallback used due to fetch error',
    });
  }
}
