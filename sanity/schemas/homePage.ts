export const homePageSchema = {
  name: 'homePage',
  title: 'Home Page Content',
  type: 'document',
  fieldsets: [
    { name: 'sections', title: '🏷️ Section Headings & Subtitles', options: { collapsible: true, collapsed: false } },
    { name: 'whyBdps', title: '⭐ Why Choose BDPS Section', options: { collapsible: true, collapsed: false } },
    { name: 'csr', title: '🤝 CSR Initiative Collaboration', options: { collapsible: true, collapsed: false } },
    { name: 'pillars', title: '🎓 8 Student Support Pillars', options: { collapsible: true, collapsed: false } },
    { name: 'jobsMarquee', title: '🔥 Job Openings & Announcement Marquee', options: { collapsible: true, collapsed: false } },
    { name: 'partners', title: '🤝 Hiring Partners Section', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Jobs Marquee Settings
    {
      name: 'jobsMarqueeTitle',
      title: 'Job Marquee Badge Title',
      type: 'string',
      fieldset: 'jobsMarquee',
      initialValue: '🔥 LATEST JOB OPENINGS',
      description: 'Text shown on the tag/badge for the job scrolling ticker on the home page.',
    },
    {
      name: 'customJobMarqueeItems',
      title: 'Extra Job & Announcement Marquee Ticker Items',
      type: 'array',
      fieldset: 'jobsMarquee',
      description: 'Add extra custom job entries, urgent hiring alerts, or announcements to display in the homepage marquee slider.',
      initialValue: [
        { company: 'TCS / INFOSYS', title: 'Special Off-Campus Drive for Trained Freshers', location: 'Hyderabad / Vizag' },
        { company: 'BDPS CAREER CELL', title: '100+ Active IT & Accounting Placements Open', location: 'Kakinada HQ' },
      ],
      of: [
        {
          name: 'marqueeItem',
          type: 'object',
          title: 'Marquee Ticker Item',
          fields: [
            { name: 'company', title: 'Company / Badge Text', type: 'string', initialValue: 'BDPS PARTNER' },
            { name: 'title', title: 'Job / Announcement Title', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'location', title: 'Location / Subtitle (Optional)', type: 'string' },
            { name: 'link', title: 'Target Link URL (Optional)', type: 'string', description: 'Optional relative path like /jobs or external URL' },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'company',
            },
          },
        },
      ],
    },
    // Section Headings
    {
      name: 'featuredCoursesTitle',
      title: 'Featured Courses Section Heading',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'Featured Training Programs',
    },
    {
      name: 'featuredCoursesSubtitle',
      title: 'Featured Courses Subtitle',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'Explore our most popular industry-recognized diploma and certification courses in Kakinada.',
    },
    {
      name: 'supportPillarsTitle',
      title: 'Student Support Pillars Heading',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'End-to-End Career & Academic Ecosystem',
    },
    {
      name: 'supportPillarsSubtitle',
      title: 'Support Pillars Subtitle',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'Everything a student needs — from foundational computer literacy to corporate placements.',
    },
    {
      name: 'testimonialsTitle',
      title: 'Testimonials Heading',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'What Our Students Say',
    },
    {
      name: 'testimonialsSubtitle',
      title: 'Testimonials Subtitle',
      type: 'string',
      fieldset: 'sections',
      initialValue: 'Real stories and career transformations from our alumni network.',
    },

    // Why Choose BDPS
    {
      name: 'whyBdpsBadge',
      title: 'Why BDPS Top Badge Text',
      type: 'string',
      fieldset: 'whyBdps',
      initialValue: 'WHY CHOOSE BDPS',
    },
    {
      name: 'whyBdpsTitle',
      title: 'Why BDPS Main Heading',
      type: 'string',
      fieldset: 'whyBdps',
      initialValue: 'Over 20 Years of Technical Training Trust in Kakinada',
    },
    {
      name: 'whyBdpsDescription',
      title: 'Why BDPS Description Paragraph',
      type: 'text',
      rows: 3,
      fieldset: 'whyBdps',
      initialValue: 'BDPS Computer Education is Kakinada’s trusted destination for career-driven software engineering, office applications, and accounting expertise.',
    },
    {
      name: 'whyBdpsHighlights',
      title: 'Why BDPS Bullet Points / Highlights',
      type: 'array',
      fieldset: 'whyBdps',
      of: [{ type: 'string' }],
      initialValue: [
        '🚀 20+ Years Legacy of IT Excellence',
        '💻 100% Practical Computer Lab Practice',
        '🎓 IEEE Capstone Final Year Project Guidance',
        '💼 Direct Job Referrals to 800+ MNC Partners',
        '🤖 BDPS AI Tutor 24/7 Academic Support',
        '📜 Government Recognized ISO Certifications',
        '💰 Scholarship & Stipend Programs',
        '👨‍🏫 1-on-1 Certified Industry Mentors',
      ],
    },

    // CSR Initiative Collaboration
    {
      name: 'csrActive',
      title: 'Enable CSR Collaboration Box',
      type: 'boolean',
      fieldset: 'csr',
      initialValue: true,
      description: 'Toggle ON to display the CSR Foundation Collaboration badge on the Home Page. Toggle OFF to hide.',
    },
    {
      name: 'csrTitle',
      title: 'CSR Section Title',
      type: 'string',
      fieldset: 'csr',
      initialValue: 'CSR Initiative Collaboration',
    },
    {
      name: 'csrDescription',
      title: 'CSR Description Text',
      type: 'text',
      rows: 3,
      fieldset: 'csr',
      initialValue: 'BDPS proudly collaborates with Embracing Humanity Foundation (EHF) to implement CSR skill development, digital literacy, and youth employment training.',
    },

    // Support Pillars
    {
      name: 'supportPillars',
      title: 'Student Support Pillar Cards',
      type: 'array',
      fieldset: 'pillars',
      initialValue: [
        { icon: 'Briefcase', title: 'Internship Programs', desc: 'Real-world workplace experience & stipend exposure.' },
        { icon: 'Code', title: 'Live Projects', desc: 'Hands-on software application development.' },
        { icon: 'FileText', title: 'Academic Project Reports', desc: 'Comprehensive review & documentation assistance.' },
        { icon: 'Cpu', title: 'Final Year Project Guidance', desc: 'IEEE capstone guidance for B.Tech/M.Tech reviews.' },
        { icon: 'FileText', title: 'Resume Building', desc: 'ATS-friendly professional resume crafting.' },
        { icon: 'Target', title: 'Interview Preparation', desc: 'Technical testing & mock interview sessions.' },
        { icon: 'Award', title: 'Placement Assistance', desc: 'Direct job referrals to AP & MNC employer partners.' },
        { icon: 'Compass', title: 'Career Counseling', desc: '1-on-1 personalized career roadmap guidance.' },
      ],
      of: [
        {
          name: 'supportPillar',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              options: {
                list: [
                  { title: 'Briefcase / Jobs', value: 'Briefcase' },
                  { title: 'Code / Development', value: 'Code' },
                  { title: 'File Text / Report', value: 'FileText' },
                  { title: 'CPU / Technology', value: 'Cpu' },
                  { title: 'Target / Interview', value: 'Target' },
                  { title: 'Award / Placement', value: 'Award' },
                  { title: 'Compass / Career', value: 'Compass' },
                  { title: 'Heart Handshake', value: 'HeartHandshake' },
                  { title: 'Graduation Cap', value: 'GraduationCap' },
                  { title: 'Check Circle', value: 'CheckCircle2' },
                ],
              },
              initialValue: 'Briefcase',
            },
            { name: 'title', title: 'Pillar Title', type: 'string' },
            { name: 'desc', title: 'Pillar Description', type: 'string' },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'desc',
            },
          },
        },
      ],
    },

    // Hiring Partners
    {
      name: 'hiringPartnersTitle',
      title: 'Hiring Partners Section Title',
      type: 'string',
      fieldset: 'partners',
      initialValue: 'Our Alumni Work At Top IT & Enterprise Firms',
    },
    {
      name: 'hiringPartnersSubtitle',
      title: 'Hiring Partners Subtitle',
      type: 'string',
      fieldset: 'partners',
      initialValue: 'Direct placement referrals with 800+ recruiting enterprises and regional offices.',
    },
    {
      name: 'hiringPartners',
      title: 'Hiring Partner Companies & Logos',
      type: 'array',
      fieldset: 'partners',
      description: 'Add company names or upload company partner logos for the scrolling alumni partner marquee.',
      of: [
        {
          name: 'companyPartner',
          title: 'Company Partner with Logo',
          type: 'object',
          fields: [
            { name: 'name', title: 'Company Name', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'logo', title: 'Company Logo Image (Optional)', type: 'image', options: { hotspot: true } },
            { name: 'website', title: 'Website URL (Optional)', type: 'url' },
          ],
          preview: {
            select: {
              title: 'name',
              media: 'logo',
            },
          },
        },
      ],
      initialValue: [
        { name: 'TCS' },
        { name: 'Infosys' },
        { name: 'Wipro' },
        { name: 'Cognizant' },
        { name: 'Accenture' },
        { name: 'Tech Mahindra' },
        { name: 'HCL Tech' },
        { name: 'Local IT Solutions' },
        { name: 'Business Accounts Firms' },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page Content',
        subtitle: 'Headings, Support Pillars, Why BDPS & Partners',
      };
    },
  },
};
