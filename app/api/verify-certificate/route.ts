import { NextResponse } from 'next/server';
import { sanityClient } from '../../../lib/sanity.client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const regNumber = searchParams.get('regNumber');

    if (!regNumber || !regNumber.trim()) {
      return NextResponse.json({ success: false, message: 'Registration number is required.' }, { status: 400 });
    }

    const cleanReg = regNumber.trim();

    // Optimized Single GROQ query for Sanity Free Tier
    const query = `*[_type == "certificate" && (lower(regNumber) == lower($cleanReg) || regNumber == $cleanReg)][0] {
      "_id": _id,
      regNumber,
      fullName,
      courseName,
      issueDate,
      issuedBy,
      grade,
      duration,
      certificateId,
      status
    }`;

    const certificate = await sanityClient.fetch(query, { cleanReg });

    if (!certificate) {
      return NextResponse.json(
        { success: false, found: false, message: `No official certificate record found for Registration Number: "${cleanReg}"` },
        { status: 404 }
      );
    }

    if (certificate.status === 'Revoked') {
      return NextResponse.json(
        { success: false, found: false, revoked: true, message: `Certificate for REG: "${cleanReg}" has been revoked or withheld.` },
        { status: 403 }
      );
    }

    // Set Edge & Browser Cache headers to save Sanity API requests
    const response = NextResponse.json({ success: true, found: true, certificate });
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return response;
  } catch (error: any) {
    console.error('Verify Certificate Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error during certificate verification.' }, { status: 500 });
  }
}
