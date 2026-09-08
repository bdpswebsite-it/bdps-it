import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.client';
import { sanityWriteClient } from '@/lib/sanity.write';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await sanityClient.fetch(`{
      "leads": *[_type == "leadSubmission"] | order(submittedAt desc) {
        _id,
        fullName,
        email,
        phone,
        course,
        message,
        status,
        submittedAt
      },
      "stipends": *[_type == "stipendApplication"] | order(submittedAt desc) {
        _id,
        "fullName": studentName,
        phone,
        email,
        qualification,
        category,
        city,
        status,
        submittedAt
      },
      "internships": *[_type == "internshipApplicant"] | order(submittedAt desc) {
        _id,
        fullName,
        phone,
        email,
        course,
        qualification,
        preferredBatch,
        notes,
        status,
        submittedAt
      },
      "jobs": *[_type == "jobLead"] | order(appliedAt desc) {
        _id,
        fullName,
        email,
        phone,
        jobTitle,
        company,
        qualification,
        experience,
        city,
        appliedJobUrl,
        status,
        adminNotes,
        "submittedAt": appliedAt
      },
      "courses": *[_type == "course"] | order(_createdAt desc) {
        _id,
        title,
        category,
        duration,
        fee,
        instructor,
        "submittedAt": _createdAt
      },
      "jobPostings": *[_type == "jobPosting" && !defined(adzunaId) && !(_id match "job_adzuna_*")] | order(postedAt desc) {
        _id,
        title,
        company,
        location,
        category,
        jobType,
        experienceRequired,
        "submittedAt": postedAt
      },
      "blogs": *[_type == "blog"] | order(publishedAt desc) {
        _id,
        title,
        author,
        category,
        "submittedAt": publishedAt
      },
      "certificates": *[_type == "certificate"] | order(_createdAt desc) {
        _id,
        "fullName": coalesce(fullName, studentName, "—"),
        "regNumber": coalesce(regNumber, certificateNo, certificateId, "—"),
        "studentName": coalesce(fullName, studentName, "—"),
        "certificateNo": coalesce(regNumber, certificateNo, certificateId, "—"),
        courseName,
        grade,
        "issueDate": coalesce(issueDate, issuedDate, _createdAt),
        "submittedAt": coalesce(issueDate, issuedDate, _createdAt)
      },
      "testimonials": *[_type == "testimonial"] | order(_createdAt desc) {
        _id,
        name,
        role,
        course,
        rating,
        "submittedAt": _createdAt
      }
    }`);

    return NextResponse.json({
      success: true,
      leads: data.leads || [],
      stipends: data.stipends || [],
      internships: data.internships || [],
      jobs: data.jobs || [],
      courses: data.courses || [],
      jobPostings: data.jobPostings || [],
      blogs: data.blogs || [],
      certificates: data.certificates || [],
      testimonials: data.testimonials || [],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Single or Bulk Record Deletion
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const idsParam = searchParams.get('ids');

    let idsToDelete: string[] = [];

    if (id) {
      idsToDelete = [id];
    } else if (idsParam) {
      idsToDelete = idsParam.split(',').filter(Boolean);
    } else {
      // Check JSON body for { ids: [...] }
      try {
        const body = await req.json();
        if (Array.isArray(body?.ids)) {
          idsToDelete = body.ids;
        }
      } catch (e) {
        // Body reading optional
      }
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json({ success: false, message: 'Document ID or array of IDs is required' }, { status: 400 });
    }

    const tx = sanityWriteClient.transaction();
    for (const docId of idsToDelete) {
      tx.delete(docId);
    }
    await tx.commit();

    return NextResponse.json({
      success: true,
      deletedCount: idsToDelete.length,
      message: `Successfully deleted ${idsToDelete.length} item(s)`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
