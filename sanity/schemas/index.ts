import { courseSchema } from './course';
import { courseCategorySchema } from './courseCategory';
import { siteSettingsSchema } from './siteSettings';
import { popupAdSchema } from './popupAd';
import { leadSubmissionSchema } from './leadSubmission';
import { stipendApplicationSchema } from './stipendApplication';
import { heroSlideSchema } from './heroSlide';
import { jobPostingSchema } from './jobPosting';
import { certificateSchema } from './certificate';
import { internshipApplicantSchema } from './internshipApplicant';
import { jobLeadSchema } from './jobLead';
import { homePageSchema } from './homePage';
import { aboutPageSchema } from './aboutPage';
import { contactPageSchema } from './contactPage';
import { testimonialSchema } from './testimonial';

import { blogSchema } from './blog';
import { homeMarqueeItemSchema } from './homeMarqueeItem';

export const schemaTypes = [
  // Global & Page Singletons
  siteSettingsSchema,
  homePageSchema,
  aboutPageSchema,
  contactPageSchema,

  // Collections & Catalog
  courseCategorySchema,
  courseSchema,
  blogSchema,
  testimonialSchema,
  heroSlideSchema,
  popupAdSchema,
  jobPostingSchema,
  certificateSchema,
  homeMarqueeItemSchema,

  // Applications & Leads
  leadSubmissionSchema,
  stipendApplicationSchema,
  internshipApplicantSchema,
  jobLeadSchema,
];


