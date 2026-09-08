export const aboutPageSchema = {
  name: 'aboutPage',
  title: 'About Us Page Content',
  type: 'document',
  fieldsets: [
    { name: 'banner', title: '🚩 Header Banner', options: { collapsible: true, collapsed: false } },
    { name: 'legacy', title: '🏛️ Legacy & Institute Story', options: { collapsible: true, collapsed: false } },
    { name: 'spotlight', title: '🌟 Trust Spotlight Card', options: { collapsible: true, collapsed: false } },
    { name: 'stats', title: '📊 4 Key Statistics', options: { collapsible: true, collapsed: false } },
    { name: 'beliefs', title: '💡 Core Beliefs / Values', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Banner Section
    {
      name: 'bannerBadge',
      title: 'Banner Tag / Badge',
      type: 'string',
      fieldset: 'banner',
      initialValue: 'Established 2006 • Kakinada HQ',
    },
    {
      name: 'bannerTitle',
      title: 'Banner Title',
      type: 'string',
      fieldset: 'banner',
      initialValue: 'About BDPS Computer Education',
    },
    {
      name: 'bannerDesc',
      title: 'Banner Subtitle / Description',
      type: 'text',
      rows: 2,
      fieldset: 'banner',
      initialValue: 'Empowering tech aspirants with practical computing skills, industry certifications, and career launchpads.',
    },

    // Legacy Story Section
    {
      name: 'legacyBadge',
      title: 'Legacy Header Badge',
      type: 'string',
      fieldset: 'legacy',
      initialValue: '20+ Years of Academic Trust',
    },
    {
      name: 'legacyHeading',
      title: 'Legacy Section Heading',
      type: 'string',
      fieldset: 'legacy',
      initialValue: 'Over 20 Years of Software Training Excellence',
    },
    {
      name: 'storyParagraphs',
      title: 'Institute Story Paragraphs',
      type: 'array',
      fieldset: 'legacy',
      of: [{ type: 'text', rows: 3 }],
      initialValue: [
        'BDPS Computer Education has grown to become Kakinada\'s premier training hub for computer applications, financial accounting, and software programming. We have successfully trained and graduated over 12,000 students into software engineering, office administration, and commercial accounting roles.',
        'Through structured interactive study plans, direct mentor guidance, and 100% practical lab practice, we deliver a learning platform that bridges the gap between college curricula and industry job requirements.',
      ],
    },
    {
      name: 'highlightsList',
      title: 'Checklist Highlights',
      type: 'array',
      fieldset: 'legacy',
      of: [{ type: 'string' }],
      initialValue: [
        'Government Recognized & Industry Certified Diplomas',
        '24/7 Access to BDPS AI Tutor for Instant Doubts Resolution',
        '100% Hands-on Desktop Lab Configurations for Every Student',
      ],
    },

    // Spotlight Box
    {
      name: 'spotlightBadge',
      title: 'Spotlight Box Badge',
      type: 'string',
      fieldset: 'spotlight',
      initialValue: 'Premier Institute',
    },
    {
      name: 'spotlightTitle',
      title: 'Spotlight Card Title',
      type: 'string',
      fieldset: 'spotlight',
      initialValue: 'Why Kakinada Trusts BDPS',
    },
    {
      name: 'spotlightDesc',
      title: 'Spotlight Card Description',
      type: 'text',
      rows: 3,
      fieldset: 'spotlight',
      initialValue: 'From high school graduates to degree students and working professionals, our flexible morning, afternoon, and evening batches fit every schedule.',
    },
    {
      name: 'spotlightPillars',
      title: 'Spotlight Mini-Cards',
      type: 'array',
      fieldset: 'spotlight',
      initialValue: [
        {
          icon: 'Cpu',
          title: 'Modern Computer Labs',
          desc: 'High-speed workstations with latest software',
        },
        {
          icon: 'Briefcase',
          title: 'Job Placement Desk',
          desc: 'Direct referrals to 800+ hiring partners',
        },
      ],
      of: [
        {
          name: 'spotlightPillar',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon Name',
              type: 'string',
              options: {
                list: [
                  { title: 'CPU / Labs', value: 'Cpu' },
                  { title: 'Briefcase / Placement', value: 'Briefcase' },
                  { title: 'Graduation Cap / Academic', value: 'GraduationCap' },
                  { title: 'Award / Certificate', value: 'Award' },
                ],
              },
              initialValue: 'Cpu',
            },
            { name: 'title', title: 'Pillar Title', type: 'string' },
            { name: 'desc', title: 'Pillar Description', type: 'string' },
          ],
        },
      ],
    },

    // Stats Section
    {
      name: 'stats',
      title: '4 Key Statistics Counter Cards',
      type: 'array',
      fieldset: 'stats',
      initialValue: [
        { 
          label: 'Years of Legacy', 
          value: '20', 
          suffix: '+', 
          description: 'Years of continuous IT education & academic trust in Kakinada.' 
        },
        { 
          label: 'Graduated Students', 
          value: '12,000', 
          suffix: '+', 
          description: 'Students trained in desktop software, diplomas & coding.' 
        },
        { 
          label: 'Hiring Partners', 
          value: '800', 
          suffix: '+', 
          description: 'Registered IT MNCs, banks & local enterprise partners.' 
        },
        { 
          label: 'Placement Success', 
          value: '94', 
          suffix: '%', 
          description: 'Career transition & job referral success rate.' 
        }
      ],
      of: [
        {
          name: 'statItem',
          type: 'object',
          fields: [
            { name: 'value', title: 'Stat Number (e.g. 20 or 12,000)', type: 'string' },
            { name: 'suffix', title: 'Suffix (e.g. + or %)', type: 'string', initialValue: '+' },
            { name: 'label', title: 'Stat Label', type: 'string' },
            { name: 'description', title: 'Stat Short Description', type: 'string' },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        },
      ],
    },

    // Core Beliefs Section
    {
      name: 'beliefsSubtitle',
      title: 'Beliefs Tagline / Subtitle',
      type: 'string',
      fieldset: 'beliefs',
      initialValue: 'OUR CORE BELIEFS',
    },
    {
      name: 'beliefsTitle',
      title: 'Beliefs Section Main Heading',
      type: 'string',
      fieldset: 'beliefs',
      initialValue: 'Why Students Choose BDPS',
    },
    {
      name: 'beliefs',
      title: 'Core Belief Cards',
      type: 'array',
      fieldset: 'beliefs',
      initialValue: [
        {
          title: 'Practical Lab-First Learning',
          desc: 'We focus heavily on hands-on desktop configurations, spreadsheets, data structures, and capstone project modules rather than mere syntax memorisation.',
          icon: 'GraduationCap',
        },
        {
          title: 'Industry Veteran Faculty',
          desc: 'Our senior mentors bring 10+ years of active technical training experience specialized in diplomas, web stack, database engines, and accounting systems.',
          icon: 'Users',
        },
        {
          title: 'Dedicated Placement Support',
          desc: 'We assist with technical resume building, mock viva-voce presentation preparation, and coordinate direct job referrals with hiring companies.',
          icon: 'Award',
        },
      ],
      of: [
        {
          name: 'beliefItem',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Graduation Cap', value: 'GraduationCap' },
                  { title: 'Users / Faculty', value: 'Users' },
                  { title: 'Award / Placement', value: 'Award' },
                  { title: 'Shield Check', value: 'ShieldCheck' },
                  { title: 'Target', value: 'Target' },
                ],
              },
              initialValue: 'GraduationCap',
            },
            { name: 'title', title: 'Belief Title', type: 'string' },
            { name: 'desc', title: 'Belief Description', type: 'text', rows: 3 },
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
  ],
  preview: {
    prepare() {
      return {
        title: 'About Us Page Content',
        subtitle: 'Hero Banner, Legacy Story, 4 Stats & Core Beliefs',
      };
    },
  },
};
