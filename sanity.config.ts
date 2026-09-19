import { defineConfig, Tool } from 'sanity';
import { structureTool } from 'sanity/structure';
import { 
  DownloadIcon, RefreshIcon, PublishIcon, 
  CogIcon, HomeIcon, InfoOutlineIcon, EnvelopeIcon, 
  BookIcon, CommentIcon, ImageIcon, CaseIcon, UsersIcon, SparklesIcon, TagIcon, DocumentIcon
} from '@sanity/icons';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset } from './lib/sanity.client';
import LeadExportComponent from './sanity/tools/LeadExportComponent';
import LeadsSpreadsheetComponent from './sanity/tools/LeadsSpreadsheetComponent';
import CertificateImportTool from './sanity/tools/CertificateImportTool';
import SeedContentTool from './sanity/tools/SeedContentTool';
import GoogleAnalyticsTool from './sanity/tools/GoogleAnalyticsTool';
import { ActivityIcon } from '@sanity/icons';

const SINGLETON_TYPES = new Set(['siteSettings', 'homePage', 'aboutPage', 'contactPage']);

const leadsSpreadsheetTool: Tool = {
  name: 'leads-spreadsheet',
  title: '📊 Excel View & Bulk Delete',
  icon: UsersIcon,
  component: LeadsSpreadsheetComponent,
};

const seedContentTool: Tool = {
  name: 'seed-content',
  title: 'Pre-Fill Page Content',
  icon: SparklesIcon,
  component: SeedContentTool,
};

const leadExportTool: Tool = {
  name: 'lead-export',
  title: 'Export Leads (CSV)',
  icon: DownloadIcon,
  component: LeadExportComponent,
};


const certificateImportTool: Tool = {
  name: 'certificate-import',
  title: 'Import Certificates (CSV)',
  icon: PublishIcon,
  component: CertificateImportTool,
};

const googleAnalyticsTool: Tool = {
  name: 'google-analytics',
  title: '📈 Website Analytics',
  icon: ActivityIcon,
  component: GoogleAnalyticsTool,
};

export default defineConfig({
  name: 'default',
  title: 'BDPS Computers CMS & Lead Dashboard',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('BDPS Content Management')
          .items([
            // ⚙️ Global Settings (Locked Singleton)
            S.listItem()
              .title('Global Site Settings')
              .id('siteSettings')
              .icon(CogIcon)
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),

            S.divider(),

            // 📄 Page Singletons (Locked Singletons)
            S.listItem()
              .title('Pages & Content')
              .icon(HomeIcon)
              .child(
                S.list()
                  .title('Manage Page Contents')
                  .items([
                    S.listItem()
                      .title('Home Page Content')
                      .id('homePage')
                      .icon(HomeIcon)
                      .child(S.document().schemaType('homePage').documentId('homePage')),
                    S.listItem()
                      .title('About Us Page Content')
                      .id('aboutPage')
                      .icon(InfoOutlineIcon)
                      .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
                    S.listItem()
                      .title('Contact Us Page Content')
                      .id('contactPage')
                      .icon(EnvelopeIcon)
                      .child(S.document().schemaType('contactPage').documentId('contactPage')),
                  ])
              ),

            S.divider(),

            // 📦 Collections & Content
            S.listItem()
              .title('Courses Catalog')
              .icon(BookIcon)
              .schemaType('course')
              .child(S.documentTypeList('course').title('All Courses')),

            S.listItem()
              .title('Course Categories')
              .icon(TagIcon)
              .schemaType('courseCategory')
              .child(S.documentTypeList('courseCategory').title('Course Categories')),

            S.listItem()
              .title('Blog Posts')
              .icon(DocumentIcon)
              .schemaType('blog')
              .child(S.documentTypeList('blog').title('All Blog Posts')),

            S.listItem()
              .title('Student Testimonials')
              .icon(CommentIcon)
              .schemaType('testimonial')
              .child(S.documentTypeList('testimonial').title('Student Testimonials')),

            S.listItem()
              .title('Hero Carousel Slides')
              .icon(ImageIcon)
              .schemaType('heroSlide')
              .child(S.documentTypeList('heroSlide').title('Hero Carousel Slides')),

            S.listItem()
              .title('Popup Ad Banner')
              .icon(SparklesIcon)
              .schemaType('popupAd')
              .child(S.documentTypeList('popupAd').title('Popup Ads')),

            S.listItem()
              .title('Job Postings')
              .icon(CaseIcon)
              .schemaType('jobPosting')
              .child(S.documentTypeList('jobPosting').title('Job Postings')),

            S.listItem()
              .title('Certificates')
              .icon(PublishIcon)
              .schemaType('certificate')
              .child(S.documentTypeList('certificate').title('Student Certificates')),

            S.divider(),

            // 📥 Leads & Applications
            S.listItem()
              .title('Inquiries & Leads')
              .icon(UsersIcon)
              .child(
                S.list()
                  .title('Leads & Applications')
                  .items([
                    S.listItem()
                      .title('Contact & Course Leads')
                      .schemaType('leadSubmission')
                      .child(S.documentTypeList('leadSubmission').title('General Leads')),
                    S.listItem()
                      .title('Stipend Applications')
                      .schemaType('stipendApplication')
                      .child(S.documentTypeList('stipendApplication').title('Stipend Applications')),
                    S.listItem()
                      .title('Internship Applicants')
                      .schemaType('internshipApplicant')
                      .child(S.documentTypeList('internshipApplicant').title('Internship Applicants')),
                    S.listItem()
                      .title('Job Portal Leads / Applicants')
                      .schemaType('jobLead')
                      .child(S.documentTypeList('jobLead').title('Job Portal Applicants')),
                  ])
              ),

            S.divider(),

            // 📢 Homepage Marquee Ticker Entries
            S.listItem()
              .title('Homepage Marquee Entries')
              .icon(SparklesIcon)
              .schemaType('homeMarqueeItem')
              .child(S.documentTypeList('homeMarqueeItem').title('Homepage Marquee Entries')),
          ]),
    }),
  ],

  tools: (prev) => [...prev, googleAnalyticsTool, leadsSpreadsheetTool, leadExportTool, certificateImportTool, seedContentTool],

  schema: {
    types: schemaTypes,
    // Hide singletons from the global "+" (Create New) menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    // Prevent unpublishing or deleting singleton documents
    actions: (prev, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? prev.filter(({ action }) => action === 'publish' || action === 'discardChanges')
        : prev,
  },
});

