import TermsOfServiceClient from './TermsOfServiceClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bdpsit.com';

export const metadata = {
  title: 'Terms of Service | BDPS Computer Education & IT Solutions Kakinada',
  description: 'Official Terms of Service for BDPS Computer Education & IT Solutions (in collaboration with Embracing Humanity Foundation). Read course enrollment, placement disclaimers, and user terms.',
  keywords: [
    'BDPS Terms of Service',
    'BDPS Computer Education Terms',
    'EHF Collaboration Terms',
    'BDPS IT Placement Disclaimer Kakinada'
  ],
  alternates: {
    canonical: `${siteUrl}/terms-of-service`,
  },
  openGraph: {
    title: 'Terms of Service | BDPS Computer Education & IT Solutions',
    description: 'Official terms governing courses, certifications, placement assistance, and EHF initiatives.',
    url: `${siteUrl}/terms-of-service`,
    siteName: 'BDPS Computer Education',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | BDPS Computer Education Kakinada',
    description: 'Official terms and conditions for BDPS IT students and website users.',
  },
};

export default function TermsOfServicePage() {
  return <TermsOfServiceClient />;
}
