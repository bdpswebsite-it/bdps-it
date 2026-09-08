export const contactPageSchema = {
  name: 'contactPage',
  title: 'Contact Us Page Content',
  type: 'document',
  fieldsets: [
    { name: 'banners', title: '🚩 Page Banners', options: { collapsible: true, collapsed: false } },
    { name: 'branches', title: '📍 Campus Branches & Google Map', options: { collapsible: true, collapsed: false } },
    { name: 'forms', title: '📝 Form Options & Dropdowns', options: { collapsible: true, collapsed: false } },
    { name: 'itProjects', title: '💻 Upcoming IT Projects & Collaboration Showcase', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // Student banner
    {
      name: 'studentBannerTitle',
      title: 'Student Contact Banner Title',
      type: 'string',
      fieldset: 'banners',
      initialValue: 'Contact Our Advisors',
    },
    {
      name: 'studentBannerDesc',
      title: 'Student Contact Banner Description',
      type: 'text',
      rows: 2,
      fieldset: 'banners',
      initialValue: 'Get in touch to clear course doubts, check batch timings, or request custom syllabus modules.',
    },
    // Corporate banner
    {
      name: 'collabBannerTitle',
      title: 'Corporate Collaboration Banner Title',
      type: 'string',
      fieldset: 'banners',
      initialValue: 'Corporate & Institutional Collaboration',
    },
    {
      name: 'collabBannerDesc',
      title: 'Corporate Collaboration Banner Description',
      type: 'text',
      rows: 2,
      fieldset: 'banners',
      initialValue: 'Partner with BDPS to recruit skilled software talent, execute corporate training bootcamps, or sponsor academic project labs.',
    },

    // Branches
    {
      name: 'branches',
      title: 'Campus Locations & Maps',
      type: 'array',
      fieldset: 'branches',
      initialValue: [
        {
          name: 'Kakinada Campus (Corporate HQ)',
          description: 'Visit our primary campus in Kakinada to review lab setups, interact with faculty mentors, or request course counseling.',
          address: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003',
          phone: '+91 85001 08016',
          email: 'bdpskkd@gmail.com',
          timings: 'Mon - Sat: 7:30 AM - 8:30 PM IST',
          mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.7196022838426!2d82.25141071112674!3d16.988220084364417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3828414ca0cd97%3A0x88981e6992d9f2d1!2sNagamallithota%20Junction%2C%20Kakinada%2C%20Andhra%20Pradesh%20533003!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin',
        },
      ],
      of: [
        {
          name: 'branch',
          type: 'object',
          fields: [
            { name: 'name', title: 'Branch / Campus Name', type: 'string', initialValue: 'Kakinada Campus (Corporate HQ)' },
            { name: 'description', title: 'Campus Short Description', type: 'text', rows: 2 },
            { name: 'address', title: 'Campus Address', type: 'text', rows: 2 },
            { name: 'phone', title: 'Contact Phone', type: 'string' },
            { name: 'email', title: 'Contact Email', type: 'string' },
            { name: 'timings', title: 'Office Timings', type: 'string', initialValue: 'Mon - Sat: 7:30 AM - 8:30 PM IST' },
            { name: 'mapEmbedUrl', title: 'Google Map Iframe Embed URL', type: 'text', rows: 3 },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'address',
            },
          },
        },
      ],
    },

    // Form Dropdown Options
    {
      name: 'studentCourses',
      title: 'Student Inquiry - Course Options',
      type: 'array',
      fieldset: 'forms',
      of: [{ type: 'string' }],
      initialValue: [
        'General Counseling',
        'Software Development (Full Stack)',
        'Data Science & AI',
        'Tally Prime & GST',
        'PGDCA Diploma',
        'Core Java & Spring Boot',
        'Python & Django Development',
      ],
    },
    {
      name: 'collabTypes',
      title: 'Corporate Inquiry - Partnership Types',
      type: 'array',
      fieldset: 'forms',
      of: [{ type: 'string' }],
      initialValue: [
        'Campus Placement / Talent Recruitment',
        'Corporate Employee Upskilling',
        'Lab & Capstone Project Sponsorship',
        'Guest Lecture & IEEE Workshops',
      ],
    },

    // Upcoming IT Projects Showcase
    {
      name: 'upcomingITProjects',
      title: 'Upcoming IT Projects (Showcased under Collaboration)',
      type: 'array',
      fieldset: 'itProjects',
      of: [
        {
          name: 'itProject',
          type: 'object',
          fields: [
            { name: 'title', title: 'Project Title', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'category', title: 'Domain / Category (e.g. Enterprise ERP, AI & ML, Mobile App)', type: 'string' },
            { name: 'description', title: 'Project Overview & Scope', type: 'text', rows: 3 },
            { name: 'status', title: 'Project Status (e.g. Open for Collaboration, Planning, In Development)', type: 'string', initialValue: 'Open for Collaboration' },
            { name: 'techStack', title: 'Tech Stack Tags', type: 'array', of: [{ type: 'string' }] },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'category',
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Us Page Content',
        subtitle: 'Banners, Campus Locations, Map & Form Dropdowns',
      };
    },
  },
};
