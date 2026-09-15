import PrivacyPolicyClient from './PrivacyPolicyClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bdpsit.com';

export const metadata = {
  title: 'Privacy Policy | BDPS Computer Education & IT Solutions Kakinada',
  description: 'Official Privacy Policy for BDPS Computer Education & IT Solutions (in collaboration with Embracing Humanity Foundation). Learn how we collect, protect, and handle student data and privacy rights.',
  keywords: [
    'BDPS Privacy Policy',
    'BDPS Computer Education Privacy',
    'EHF Collaboration Privacy Policy',
    'BDPS IT Privacy Protection Kakinada'
  ],
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
  openGraph: {
    title: 'Privacy Policy | BDPS Computer Education & IT Solutions',
    description: 'Learn how BDPS IT collects, protects, and handles personal data and student privacy.',
    url: `${siteUrl}/privacy-policy`,
    siteName: 'BDPS Computer Education',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | BDPS Computer Education Kakinada',
    description: 'Official Privacy Policy and data protection guidelines for BDPS IT students and visitors.',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
