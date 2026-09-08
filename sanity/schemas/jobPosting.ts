export const jobPostingSchema = {
  name: 'jobPosting',
  title: 'Indian Job Listings',
  type: 'document',
  fields: [
    { name: 'isCustom', title: 'Custom Client Job?', type: 'boolean', initialValue: true, description: 'Set to true for jobs manually posted by BDPS' },
    { name: 'showInMarquee', title: 'Show in Homepage Job Marquee?', type: 'boolean', initialValue: true, description: 'Toggle ON to highlight/feature this job listing in the homepage scrolling marquee banner.' },
    { name: 'title', title: 'Job Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'company', title: 'Company Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'location', title: 'Location', type: 'string', description: 'e.g. Hyderabad, Visakhapatnam, Remote' },
    { name: 'category', title: 'Category', type: 'string', description: 'e.g. IT Jobs, Accounting, Engineering' },
    { 
      name: 'jobType', 
      title: 'Job Type', 
      type: 'string', 
      options: {
        list: [
          { title: 'Full Time', value: 'Full Time' },
          { title: 'Part Time', value: 'Part Time' },
          { title: 'Internship', value: 'Internship' },
          { title: 'Contract / Freelance', value: 'Contract' },
          { title: 'Hybrid / Remote', value: 'Hybrid' },
        ],
      },
      initialValue: 'Full Time'
    },
    { name: 'experienceRequired', title: 'Experience Required', type: 'string', description: 'e.g. Fresher (0-1 Year), 2-4 Years' },
    { name: 'description', title: 'Full Job Description', type: 'text', description: 'Detailed overview of the job role' },
    { 
      name: 'responsibilities', 
      title: 'Key Responsibilities', 
      type: 'array', 
      of: [{ type: 'string' }],
      description: 'List of main job duties and day-to-day responsibilities'
    },
    { 
      name: 'requirements', 
      title: 'Requirements & Qualifications', 
      type: 'array', 
      of: [{ type: 'string' }],
      description: 'Educational qualifications, certifications, or experience requirements'
    },
    { 
      name: 'skills', 
      title: 'Required Skills / Keywords', 
      type: 'array', 
      of: [{ type: 'string' }],
      description: 'Key skills (e.g. Java, Tally Prime, React, Communication)'
    },
    { name: 'salaryMin', title: 'Min Salary (₹)', type: 'number', description: 'Minimum annual salary or monthly stipend in ₹' },
    { name: 'salaryMax', title: 'Max Salary (₹)', type: 'number', description: 'Maximum annual salary or monthly stipend in ₹' },
    { name: 'redirectUrl', title: 'External Apply Link (Optional)', type: 'url', description: 'Optional link to official hiring page or company career page' },
    { name: 'contactEmail', title: 'HR Contact Email (Optional)', type: 'string' },
    { name: 'postedAt', title: 'Date Posted', type: 'datetime', initialValue: () => new Date().toISOString() },
    { name: 'adzunaId', title: 'Legacy Adzuna Job ID', type: 'string', readOnly: true },
    { name: 'syncedAt', title: 'Last Synced At', type: 'datetime', readOnly: true },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'company',
    },
  },
};

