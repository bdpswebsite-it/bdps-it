'use client';

import { useState, useEffect } from 'react';
import { BookOpen, User, Phone, Mail, GraduationCap, Clock, CheckCircle2, Lock, X } from 'lucide-react';
import ResponsiveSelect from './ResponsiveSelect';

export default function CourseLeadGateModal({ course, isOpen, onSuccess, onClose }) {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [allCourseObjects, setAllCourseObjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(course?.title || '');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('Degree (B.Sc / B.Com / B.A)');
  const [preferredBatch, setPreferredBatch] = useState('Morning (9 AM - 11 AM)');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch only the live courses present on the website from Sanity CMS
  useEffect(() => {
    fetch('/api/courses', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          setAllCourseObjects(data.courses);
          const titles = data.courses
            .map(c => c.title || c.name || c.courseTitle)
            .filter(Boolean);
          if (titles.length > 0) {
            setAvailableCourses(titles);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Sync selected course when prop changes
  useEffect(() => {
    if (course?.title) {
      setSelectedCourse(course.title);
    }
  }, [course]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const chosenCourse = selectedCourse || course?.title || 'General Course Inquiry';
      const payload = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        course: chosenCourse,
        message: `Qualification: ${qualification} | Preferred Batch: ${preferredBatch}${notes.trim() ? ` | Notes: ${notes.trim()}` : ''}`
      };

      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined' && course?.id) {
          try {
            localStorage.setItem(`bdps_course_unlocked_${course.id}`, 'true');
            localStorage.setItem(`bdps_user_lead_${course.id}`, JSON.stringify({ fullName, email, phone, course: chosenCourse }));
          } catch (e) {
            console.warn('LocalStorage error:', e);
          }
        }
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(data.message || 'Failed to submit details. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Only list the actual courses from the website
  const allDropdownOptions = availableCourses.length > 0
    ? (course?.title && !availableCourses.includes(course.title) ? [course.title, ...availableCourses] : availableCourses)
    : (course?.title ? [course.title] : []);

  // Dynamically find active course object matching selected dropdown option to update logo
  const activeCourseObj = allCourseObjects.find(
    c => (c.title || c.name || c.courseTitle) === selectedCourse
  ) || course;

  const isLoading = !selectedCourse && (!course || course?.title === 'Loading Course...');
  const courseLogo = activeCourseObj?.image || activeCourseObj?.thumbnail || course?.image || course?.thumbnail;

  return (
    <div className="modal-backdrop course-gate-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content-card course-gate-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Banner */}
        <div className="course-gate-header" style={{ padding: '20px 24px 16px 24px' }}>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="modal-close-btn course-gate-close-btn"
              aria-label="Close modal"
              title="Close & return to courses"
            >
              <X size={18} />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left', marginBottom: '8px' }}>
            {/* 58px Logo or Loading Spinner */}
            {isLoading ? (
              <div 
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <span style={{ display: 'inline-block', width: '22px', height: '22px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FF7518', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              </div>
            ) : courseLogo ? (
              <img
                src={courseLogo}
                alt={course?.title || 'Course'}
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  backgroundColor: '#0b1329',
                  flexShrink: 0
                }}
              />
            ) : null}

            <div>
              <div className="course-gate-badge" style={{ margin: 0, display: 'inline-flex' }}>
                <Lock size={12} /> Course Access Required
              </div>
              <h2 className="course-gate-title" style={{ fontSize: '19px', marginTop: '4px', textAlign: 'left', fontWeight: '800' }}>
                Enroll & Unlock Full Syllabus Details
              </h2>
            </div>
          </div>

          <p className="course-gate-subtitle" style={{ textAlign: 'left', marginTop: '6px', fontSize: '13.5px', lineHeight: '1.45', opacity: 0.95 }}>
            Submit details to access full course curriculum, batch schedules, and fee breakdown for <strong>{isLoading ? 'this course' : (selectedCourse || course?.title || 'this course')}</strong>.
          </p>
        </div>

        {/* Modal Form Body */}
        <div className="modal-body course-gate-body">
          <form onSubmit={handleSubmit} className="form-block-column">
            {errorMessage && (
              <div className="form-error-alert">
                {errorMessage}
              </div>
            )}

            {/* Selected Course Dropdown with proper mobile responsive dropdown */}
            <div className="form-group-block">
              <label className="form-label-text">Select Course to Enroll *</label>
              <ResponsiveSelect
                value={selectedCourse}
                onChange={(val) => setSelectedCourse(val)}
                options={allDropdownOptions}
                icon={<BookOpen size={16} />}
                placeholder="Select Course to Enroll"
                required
              />
            </div>

            {/* Full Name & Phone */}
            <div className="form-row-2col">
              <div className="form-group-block">
                <label className="form-label-text">Full Name *</label>
                <div className="input-icon-wrapper">
                  <User size={15} className="input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="form-input-with-icon"
                  />
                </div>
              </div>

              <div className="form-group-block">
                <label className="form-label-text">Phone Number *</label>
                <div className="input-icon-wrapper">
                  <Phone size={15} className="input-icon" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input-with-icon"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="form-group-block">
              <label className="form-label-text">Email Address *</label>
              <div className="input-icon-wrapper">
                <Mail size={15} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input-with-icon"
                />
              </div>
            </div>

            {/* Qualification & Preferred Batch */}
            <div className="form-row-2col">
              <div className="form-group-block">
                <label className="form-label-text">Qualification</label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="form-select-plain"
                >
                  <option value="Intermediate / 10+2">Intermediate / 10+2</option>
                  <option value="Degree (B.Sc / B.Com / B.A)">Degree (B.Sc / B.Com / B.A)</option>
                  <option value="B.Tech / M.Tech">B.Tech / M.Tech</option>
                  <option value="Post Graduate (MCA / M.Sc)">Post Graduate (MCA / M.Sc)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group-block">
                <label className="form-label-text">Preferred Batch</label>
                <select
                  value={preferredBatch}
                  onChange={(e) => setPreferredBatch(e.target.value)}
                  className="form-select-plain"
                >
                  <option value="Morning (9 AM - 11 AM)">Morning (9 AM - 11 AM)</option>
                  <option value="Afternoon (2 PM - 4 PM)">Afternoon (2 PM - 4 PM)</option>
                  <option value="Evening (5 PM - 7 PM)">Evening (5 PM - 7 PM)</option>
                  <option value="Weekend Batch">Weekend Batch</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-enroll-submit course-gate-submit-btn"
            >
              {submitting ? 'Enrolling & Submitting...' : 'Enroll / Submit Registration'}
            </button>

            <p className="form-lock-subtext text-center">
              🔒 Form details are saved to BDPS Admissions database in Sanity CMS.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
