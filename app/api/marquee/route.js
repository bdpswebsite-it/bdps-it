import { NextResponse } from 'next/server';
import { getSanityMarqueeItems } from '@/lib/sanity.client';

export const revalidate = 60;

const DEFAULT_MARQUEE = [
  { badge: 'HOT OPENING', title: 'Special Placement Drive for Trained Freshers', subtitle: 'Hyderabad / Vizag' },
  { badge: 'BDPS ADMISSIONS', title: 'Admissions Open for Full Stack & Python AI Tracks', subtitle: 'Starting This Week' },
  { badge: 'CAREER CELL', title: '100+ Active IT & Commercial Accounting Vacancies', subtitle: 'Kakinada & AP' },
];

export async function GET() {
  try {
    const items = await getSanityMarqueeItems();
    return NextResponse.json(
      {
        success: true,
        items: (Array.isArray(items) && items.length > 0) ? items : DEFAULT_MARQUEE,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({
      success: true,
      items: DEFAULT_MARQUEE,
      warning: 'Fallback used',
    });
  }
}
