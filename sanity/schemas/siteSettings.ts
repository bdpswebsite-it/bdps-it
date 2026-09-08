export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Global Site Settings & Header/Footer',
  type: 'document',
  fieldsets: [
    { name: 'header', title: '🔝 Header & Navbar Settings', options: { collapsible: true, collapsed: false } },
    { name: 'contact', title: '📞 Contact & Address Details', options: { collapsible: true, collapsed: false } },
    { name: 'social', title: '🌐 Social Media Handles', options: { collapsible: true, collapsed: false } },
    { name: 'footer', title: '🦶 Website Footer Customization', options: { collapsible: true, collapsed: false } },
    { name: 'internship', title: '💼 Internship Program (On/Off Toggle)', options: { collapsible: true, collapsed: false } },
    { name: 'stipend', title: '🎓 Stipend & Scholarship (On/Off Toggle)', options: { collapsible: true, collapsed: false } },
    { name: 'jobs', title: '💼 Job Portal & Cities Settings', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Header & Announcement
    { 
      name: 'announcementBanner', 
      title: 'Top Announcement Banner Text', 
      type: 'string',
      fieldset: 'header',
      initialValue: '🚀 New Batches Starting This Monday! Limited Seats in Full Stack & AI Tracks.',
      description: 'Optional top announcement banner shown at the very top of the visitor website.' 
    },
    {
      name: 'headerLogo',
      title: 'Main Brand Logo Image',
      type: 'image',
      fieldset: 'header',
      options: {
        hotspot: true,
      },
      description: 'Upload official logo (PNG / JPEG / WebP / SVG). If uploaded, it is rendered in the Header Navbar and Footer responsively.',
    },
    {
      name: 'headerBrandTitle',
      title: 'Brand Title (Logo)',
      type: 'string',
      fieldset: 'header',
      initialValue: 'BDPS Computer Education',
    },
    {
      name: 'headerBrandSubtitle',
      title: 'Brand Subtitle (Logo)',
      type: 'string',
      fieldset: 'header',
      initialValue: 'COMPUTER TRAINING INSTITUTE',
    },
    {
      name: 'headerLogoBadge',
      title: 'Logo Badge Text',
      type: 'string',
      fieldset: 'header',
      initialValue: 'BDPS',
    },
    {
      name: 'headerTopBarLegacyText',
      title: 'Top Bar Legacy Link Text',
      type: 'string',
      fieldset: 'header',
      initialValue: 'Our Legacy (Since 2006)',
    },
    {
      name: 'headerTopBarAlliancesText',
      title: 'Top Bar Alliances Link Text',
      type: 'string',
      fieldset: 'header',
      initialValue: 'Placement Alliances',
    },

    // Contact Info
    { 
      name: 'contactPhone', 
      title: 'Institute Contact Mobile / Phone', 
      type: 'string', 
      fieldset: 'contact',
      initialValue: '+91 85001 08016',
      description: 'Main mobile number displayed in Header, Footer, and Contact page.' 
    },
    { 
      name: 'contactEmail', 
      title: 'Institute Support Email', 
      type: 'string', 
      fieldset: 'contact',
      initialValue: 'bdpskkd@gmail.com',
      description: 'Official email address displayed in Header, Footer, and Contact page.' 
    },
    { 
      name: 'whatsappNumber', 
      title: 'WhatsApp Contact Number', 
      type: 'string', 
      fieldset: 'contact',
      initialValue: '+91 85001 08016',
      description: 'WhatsApp number for instant student chat inquiries.' 
    },
    { 
      name: 'address', 
      title: 'HQ Campus Address', 
      type: 'text', 
      fieldset: 'contact',
      initialValue: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003',
      description: 'Physical campus address shown on the website footer and contact page.' 
    },

    // Social Handles
    { 
      name: 'facebook', 
      title: 'Facebook Page URL', 
      type: 'url', 
      fieldset: 'social',
      initialValue: 'https://facebook.com/bdpscomputers',
      description: 'e.g. https://facebook.com/bdpscomputers' 
    },
    { 
      name: 'instagram', 
      title: 'Instagram Profile URL', 
      type: 'url', 
      fieldset: 'social',
      initialValue: 'https://instagram.com/bdpscomputers',
      description: 'e.g. https://instagram.com/bdpscomputers' 
    },
    { 
      name: 'linkedin', 
      title: 'LinkedIn Page / Profile URL', 
      type: 'url', 
      fieldset: 'social',
      initialValue: 'https://linkedin.com/company/bdps',
      description: 'e.g. https://linkedin.com/company/bdps' 
    },
    { 
      name: 'youtube', 
      title: 'YouTube Channel URL', 
      type: 'url', 
      fieldset: 'social',
      initialValue: 'https://youtube.com/@bdpscomputers',
      description: 'e.g. https://youtube.com/@bdpscomputers' 
    },
    { 
      name: 'twitter', 
      title: 'Twitter / X Profile URL', 
      type: 'url', 
      fieldset: 'social',
      initialValue: 'https://twitter.com/bdpscomputers',
      description: 'e.g. https://twitter.com/bdpscomputers' 
    },

    // Footer Settings
    {
      name: 'footerTagline',
      title: 'Footer Tagline / Motto',
      type: 'string',
      fieldset: 'footer',
      initialValue: 'Learn Today | 🚀 Lead Tomorrow | 🌍 Transform Tomorrow',
      description: 'Motto displayed beneath the logo in the footer.',
    },
    {
      name: 'footerShowCsr',
      title: 'Show Footer CSR Line',
      type: 'boolean',
      fieldset: 'footer',
      initialValue: true,
      description: 'Toggle ON to show the CSR Foundation partnership line in the footer.',
    },
    {
      name: 'footerCsrText',
      title: 'Footer CSR Line Text',
      type: 'string',
      fieldset: 'footer',
      initialValue: '🤝 CSR Initiatives in Collaboration with Embracing Humanity Foundation (EHF)',
    },
    {
      name: 'footerPopularCourses',
      title: 'Footer Popular Program Links',
      type: 'array',
      fieldset: 'footer',
      initialValue: [
        { label: 'PGDCA Diploma', href: '/courses' },
        { label: 'Core Java Certification', href: '/courses' },
        { label: 'Tally Prime Accounting', href: '/courses' },
        { label: 'C Language & Web Dev', href: '/courses' },
        { label: 'Academic Projects Lab', href: '/courses' },
      ],
      of: [
        {
          name: 'popularCourse',
          type: 'object',
          fields: [
            { name: 'label', title: 'Course Name / Link Text', type: 'string' },
            { name: 'href', title: 'Target URL Path', type: 'string', initialValue: '/courses' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    },
    {
      name: 'footerQuickLinks',
      title: 'Footer Quick Links',
      type: 'array',
      fieldset: 'footer',
      initialValue: [
        { label: 'Apply for Internship', href: '/courses', isModal: true },
        { label: 'Certificate Verification', href: '/verify-certificate', isModal: false },
        { label: 'Job Openings & Placements', href: '/jobs', isModal: false },
        { label: 'Upcoming Batches', href: '/courses', isModal: false },
        { label: 'About BDPS', href: '/about', isModal: false },
        { label: 'Services Offered', href: '/courses', isModal: false },
        { label: 'Student Reviews', href: '/', isModal: false },
        { label: 'Contact Us', href: '/contact', isModal: false },
      ],
      of: [
        {
          name: 'quickLink',
          type: 'object',
          fields: [
            { name: 'label', title: 'Link Label', type: 'string' },
            { name: 'href', title: 'Link URL', type: 'string' },
            { name: 'isModal', title: 'Opens Internship Modal Instead of URL', type: 'boolean', initialValue: false },
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    },
    {
      name: 'footerAccreditationText',
      title: 'Footer Accreditation Tag',
      type: 'string',
      fieldset: 'footer',
      initialValue: 'ISO 9001:2015 Accredited',
    },
    {
      name: 'footerCopyrightText',
      title: 'Footer Copyright Subtext',
      type: 'string',
      fieldset: 'footer',
      initialValue: 'All Rights Reserved.',
    },

    // Internship Settings
    { 
      name: 'internshipActive', 
      title: 'Enable / Toggle Apply for Internship', 
      type: 'boolean', 
      fieldset: 'internship',
      initialValue: true,
      description: 'Turn ON to accept internship applications. When turned OFF, the button shows "CLOSED" and displays the custom notice message.' 
    },
    { 
      name: 'internshipNoticeText', 
      title: 'Internship Closed Notice Message', 
      type: 'text', 
      fieldset: 'internship',
      initialValue: 'Internship applications for the current batch are currently closed. Please check back for upcoming cohort announcements.',
      description: 'Message shown when visitors click the Internship button while applications are toggled OFF.' 
    },
    {
      name: 'internshipCourses',
      title: 'Custom Internship Domains / Courses',
      type: 'array',
      fieldset: 'internship',
      initialValue: [
        'Python Full Stack',
        'Core Java & Spring Boot',
        'Web Development (MERN)',
        'Tally Prime & GST Accounting'
      ],
      of: [{ type: 'string' }],
      description: 'List of internship streams (e.g. Python Full Stack, Core Java, Web Development, Tally Prime). If empty, defaults to standard courses.',
    },

    // Stipend Settings
    { 
      name: 'stipendRegistrationActive', 
      title: 'Enable Stipend & Scholarship Registration', 
      type: 'boolean', 
      fieldset: 'stipend',
      initialValue: true,
      description: 'Turn ON to show and accept Stipend applications.' 
    },
    { 
      name: 'stipendNoticeText', 
      title: 'Stipend Closed Notice Message', 
      type: 'text', 
      fieldset: 'stipend',
      initialValue: 'Stipend registrations for the current batch are now closed. Please check back for upcoming cohort announcements.' 
    },

    // Job Portal & Cities Settings
    {
      name: 'jobCities',
      title: 'Searchable Indian Cities for Job Portal',
      type: 'array',
      fieldset: 'jobs',
      initialValue: [
        'Hyderabad',
        'Visakhapatnam',
        'Vijayawada',
        'Kakinada',
        'Bengaluru',
        'Chennai',
        'Mumbai',
        'Pune',
        'Delhi NCR'
      ],
      of: [{ type: 'string' }],
      description: 'List of cities available for filtering job listings in the Job Portal.',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Site Settings',
        subtitle: 'Header, Contact, Socials, Footer, Internship & Stipend Toggles',
      };
    },
  },
};
