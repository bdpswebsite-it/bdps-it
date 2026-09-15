import { Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import './visitor.css';
import PopupAdModal from '@/components/integrations/PopupAdModal';
import ScrollToTop from '@/components/ScrollToTop';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bdpsit.com';
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BDPS Computer Education | Top IT & Computer Training Institute Kakinada',
  description: 'Master Full Stack Development, Java, Python AI, Tally Prime, PGDCA, and Cybersecurity with BDPS Computer Education, Kakinada. 20+ Years of Academic Excellence & 100% Practical Labs.',
  keywords: [
    'BDPS Computer Education',
    'Computer Institute Kakinada',
    'Best IT Training Institute Kakinada',
    'PGDCA Diploma Kakinada',
    'Tally Prime GST Course Kakinada',
    'Java Training Kakinada',
    'Python AI Course Kakinada',
    'MERN Stack Development Kakinada',
    'Software Training Institute AP',
    'EHF Scholarship Kakinada',
    'Computer Coaching Near Me'
  ],
  authors: [{ name: 'BDPS Computer Education' }],
  creator: 'BDPS Computer Education',
  publisher: 'BDPS Computer Education',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: googleVerification || undefined,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'BDPS Computer Education | Top IT & Computer Training Institute',
    description: 'Empowering 20,000+ graduates with practical software skills, job placements, and stipend programs since 2006.',
    url: siteUrl,
    siteName: 'BDPS Computer Education',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BDPS Computer Education | Top IT Training Institute Kakinada',
    description: 'Practical computer lab training, PGDCA, Core Java, Python, and Tally Prime courses in Kakinada.',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// JSON-LD Structured Data for Google Rich Sitelinks & Knowledge Panel
const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'EducationalOrganization',
      '@id': `${siteUrl}/#organization`,
      name: 'BDPS Computer Education',
      alternateName: ['BDPS', 'BDPS Kakinada', 'BDPS Computer Training Institute'],
      url: siteUrl,
      logo: `${siteUrl}/icon.png`,
      description: 'Premier computer education and software programming training institute in Kakinada offering PGDCA, Java, Python AI, Tally Prime, and full stack courses.',
      telephone: '+918500108016',
      email: 'bdpskkd@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road',
        addressLocality: 'Kakinada',
        addressRegion: 'Andhra Pradesh',
        postalCode: '533003',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 16.98822,
        longitude: 82.25141,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '07:30',
          closes: '20:30',
        },
      ],
      priceRange: '₹₹',
      sameAs: [
        'https://facebook.com/bdpscomputers',
        'https://instagram.com/bdpscomputers',
        'https://linkedin.com/company/bdps',
        'https://youtube.com/@bdpscomputers',
        'https://twitter.com/bdpscomputers',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'BDPS Computer Education',
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/courses?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${siteUrl}/#sitelinks`,
      name: 'Explore BDPS',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'Courses Catalog',
          description: 'Browse all IT & software training programs including PGDCA, Java, Python AI & Tally.',
          url: `${siteUrl}/courses`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Contact & Counseling',
          description: 'Get batch timings, campus address, and admission counseling details.',
          url: `${siteUrl}/contact`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'About BDPS Legacy',
          description: '20+ years of software training excellence, 12,000+ graduates in Kakinada.',
          url: `${siteUrl}/about`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Job Openings & Placements',
          description: 'Explore live software job vacancies and campus placement opportunities.',
          url: `${siteUrl}/jobs`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Verify Certificate',
          description: 'Instant online verification for BDPS certified graduates.',
          url: `${siteUrl}/verify-certificate`,
        },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        {/* Preconnect to crucial CDNs for instant LCP delivery */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* Google Schema.org JSON-LD for Rich Sitelinks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className={outfit.className}>
        {/* Optional Google Analytics 4 (Only loaded if NEXT_PUBLIC_GA_MEASUREMENT_ID is configured) */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {children}
        <PopupAdModal />
        <ScrollToTop />
      </body>
    </html>
  );
}
