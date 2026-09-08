import React, { useState, useEffect } from 'react';
import { 
  Card, Heading, Text, Button, Stack, Container, Flex, Badge, Dialog, Box, Spinner, TextInput, Select, Checkbox 
} from '@sanity/ui';
import { 
  DownloadIcon, TrashIcon, RefreshIcon, SearchIcon, CopyIcon, CheckmarkIcon, WarningOutlineIcon, ChevronLeftIcon, ChevronRightIcon 
} from '@sanity/icons';

type TabKey = 'leads' | 'stipends' | 'internships' | 'jobs' | 'courses' | 'jobPostings' | 'blogs' | 'certificates' | 'testimonials';

export default function LeadsSpreadsheetComponent() {
  const [activeTab, setActiveTab] = useState<TabKey>('leads');
  const [data, setData] = useState<{
    leads: any[];
    stipends: any[];
    internships: any[];
    jobs: any[];
    courses: any[];
    jobPostings: any[];
    blogs: any[];
    certificates: any[];
    testimonials: any[];
  }>({
    leads: [],
    stipends: [],
    internships: [],
    jobs: [],
    courses: [],
    jobPostings: [],
    blogs: [],
    certificates: [],
    testimonials: [],
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selection & Bulk Delete state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [deleteAllTarget, setDeleteAllTarget] = useState<TabKey | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedIds([]);
    try {
      const res = await fetch('/api/leads-data');
      const resData = await res.json();
      if (resData.success) {
        setData({
          leads: resData.leads || [],
          stipends: resData.stipends || [],
          internships: resData.internships || [],
          jobs: resData.jobs || [],
          courses: resData.courses || [],
          jobPostings: resData.jobPostings || [],
          blogs: resData.blogs || [],
          certificates: resData.certificates || [],
          testimonials: resData.testimonials || [],
        });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', text: 'Failed to fetch spreadsheet data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setSearchQuery('');
    setCurrentPage(1);
    setSelectedIds([]);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle Single Checkbox
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Select All Checkbox
  const handleSelectAll = (filteredItems: any[]) => {
    const allIds = filteredItems.map((item) => item._id).filter(Boolean);
    const areAllSelected = allIds.every((id) => selectedIds.includes(id));

    if (areAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  // Delete single row
  const handleSingleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads-data?id=${deleteTarget.id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        setFeedback({ type: 'success', text: `Deleted record "${deleteTarget.name}".` });
        fetchLeads();
      } else {
        setFeedback({ type: 'error', text: resData.error || 'Failed to delete record.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error deleting record.' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Bulk Delete Selected Checkboxes
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/leads-data', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const resData = await res.json();
      if (resData.success) {
        setFeedback({ type: 'success', text: `Successfully deleted ${selectedIds.length} selected items.` });
        setSelectedIds([]);
        fetchLeads();
      } else {
        setFeedback({ type: 'error', text: resData.error || 'Failed to delete selected items.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error executing bulk delete.' });
    } finally {
      setDeleting(false);
      setBulkDeleteModalOpen(false);
    }
  };

  // Delete All in current Tab
  const handleDeleteAll = async () => {
    if (!deleteAllTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/export-leads?type=${deleteAllTarget}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) {
        setFeedback({ type: 'success', text: `Successfully purged all records in this tab.` });
        fetchLeads();
      } else {
        setFeedback({ type: 'error', text: resData.error || 'Failed to purge tab.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Error purging tab.' });
    } finally {
      setDeleting(false);
      setDeleteAllTarget(null);
    }
  };

  const handleDownloadCsv = (type: TabKey) => {
    window.open(`/api/export-leads?type=${type}`, '_blank');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Current Active Tab Dataset
  const currentList = data[activeTab] || [];
  const filteredList = currentList.filter((item: any) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(item).some((val) =>
      typeof val === 'string' && val.toLowerCase().includes(query)
    );
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredList.length / rowsPerPage) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredList.length);
  const paginatedList = filteredList.slice(startIndex, endIndex);

  // Check if all visible items are selected
  const visibleIds = paginatedList.map((item: any) => item._id).filter(Boolean);
  const isAllVisibleSelected = visibleIds.length > 0 && visibleIds.every((id: string) => selectedIds.includes(id));

  const tabConfig: { key: TabKey; label: string; count: number }[] = [
    { key: 'leads', label: '📋 Contact Leads', count: data.leads.length },
    { key: 'stipends', label: '🎓 Stipends', count: data.stipends.length },
    { key: 'internships', label: '💼 Internships', count: data.internships.length },
    { key: 'jobs', label: '🚀 Job Applicants', count: data.jobs.length },
    { key: 'courses', label: '📚 Courses', count: data.courses.length },
    { key: 'jobPostings', label: '💼 Job Postings', count: data.jobPostings.length },
    { key: 'blogs', label: '📝 Blog Posts', count: data.blogs.length },
    { key: 'certificates', label: '🎓 Certificates', count: data.certificates.length },
    { key: 'testimonials', label: '💬 Testimonials', count: data.testimonials.length },
  ];

  return (
    <Card padding={4} height="fill" tone="inherit" style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <Stack space={4}>
        {/* Header Bar */}
        <Card padding={4} radius={3} shadow={1} border>
          <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
            <Stack space={2}>
              <Heading size={3}>📊 BDPS Universal Content & Leads Manager (Excel View)</Heading>
              <Text size={1} muted>
                Multi-select checkbox table view for Courses, Job Postings, Blogs, Certificates, and Lead Submissions.
              </Text>
            </Stack>

            <Flex align="center" gap={2}>
              {selectedIds.length > 0 && (
                <Button
                  icon={TrashIcon}
                  text={`Delete Selected (${selectedIds.length})`}
                  tone="critical"
                  padding={3}
                  onClick={() => setBulkDeleteModalOpen(true)}
                />
              )}
              <Button
                icon={DownloadIcon}
                text="Export CSV"
                tone="positive"
                padding={3}
                disabled={currentList.length === 0}
                onClick={() => handleDownloadCsv(activeTab)}
              />
              <Button
                icon={TrashIcon}
                text="Purge Tab"
                tone="critical"
                mode="ghost"
                padding={3}
                disabled={currentList.length === 0}
                onClick={() => setDeleteAllTarget(activeTab)}
              />
              <Button
                icon={RefreshIcon}
                text={loading ? 'Refreshing...' : 'Refresh'}
                tone="default"
                mode="ghost"
                padding={3}
                disabled={loading}
                onClick={fetchLeads}
              />
            </Flex>
          </Flex>
        </Card>

        {/* Feedback Alert */}
        {feedback && (
          <Card padding={3} radius={2} tone={feedback.type === 'success' ? 'positive' : 'critical'} border>
            <Text size={1} weight="semibold">
              {feedback.type === 'success' ? '✅ ' : '⚠️ '} {feedback.text}
            </Text>
          </Card>
        )}

        {/* Tab Switcher & Search Bar */}
        <Card padding={3} radius={3} border shadow={1}>
          <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
            {/* Tabs */}
            <Flex gap={2} wrap="wrap">
              {tabConfig.map((tab) => (
                <Button
                  key={tab.key}
                  mode={activeTab === tab.key ? 'default' : 'ghost'}
                  tone={activeTab === tab.key ? 'primary' : 'default'}
                  padding={2}
                  fontSize={1}
                  onClick={() => handleTabChange(tab.key)}
                  text={`${tab.label} (${tab.count})`}
                />
              ))}
            </Flex>

            {/* Search Input & Rows Selector */}
            <Flex align="center" gap={2} wrap="wrap">
              <Box style={{ width: '260px' }}>
                <TextInput
                  icon={SearchIcon}
                  placeholder="Search across all fields..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.currentTarget.value)}
                  fontSize={1}
                  padding={2}
                />
              </Box>

              <Box style={{ width: '135px' }}>
                <Select
                  fontSize={1}
                  padding={2}
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.currentTarget.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={25}>25 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </Select>
              </Box>
            </Flex>
          </Flex>
        </Card>

        {/* Spreadsheet Data Table */}
        <Card radius={3} border shadow={2} style={{ overflow: 'hidden' }}>
          {loading ? (
            <Flex align="center" justify="center" padding={6} gap={3}>
              <Spinner />
              <Text size={2}>Loading data...</Text>
            </Flex>
          ) : filteredList.length === 0 ? (
            <Box padding={6} style={{ textAlign: 'center' }}>
              <Text size={2} muted>
                {searchQuery ? 'No records match your search filter.' : 'No records found in this category.'}
              </Text>
            </Box>
          ) : (
            <>
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(189, 96, 28, 0.08)', borderBottom: '2px solid rgba(189, 96, 28, 0.2)' }}>
                      <th style={{ padding: '12px 14px', width: '40px', textAlign: 'center' }}>
                        <Checkbox
                          checked={isAllVisibleSelected}
                          onChange={() => handleSelectAll(paginatedList)}
                        />
                      </th>
                      <th style={{ padding: '12px 14px', fontWeight: '800', width: '50px', color: '#BD601C' }}>#</th>
                      
                      {/* Column headers by Tab */}
                      {activeTab === 'leads' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '150px' }}>Full Name</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Phone</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '180px' }}>Email</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '160px' }}>Course Interest</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '220px' }}>Message</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '90px' }}>Status</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Submitted At</th>
                        </>
                      )}

                      {activeTab === 'stipends' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '150px' }}>Student Name</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Phone</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '180px' }}>Email</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Qualification</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '110px' }}>Category</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '110px' }}>City</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Submitted At</th>
                        </>
                      )}

                      {activeTab === 'internships' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '150px' }}>Full Name</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Phone</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '180px' }}>Email</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '160px' }}>Applied Domain</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Qualification</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Submitted At</th>
                        </>
                      )}

                      {activeTab === 'jobs' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '150px' }}>Applicant Name</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Phone</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '180px' }}>Email</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '160px' }}>Target Role</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Company</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Submitted At</th>
                        </>
                      )}

                      {activeTab === 'courses' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '220px' }}>Course Title</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Category</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '120px' }}>Duration</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '100px' }}>Fee</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Instructor</th>
                        </>
                      )}

                      {activeTab === 'jobPostings' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '220px' }}>Job Title</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '150px' }}>Company</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Location</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '130px' }}>Category</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '120px' }}>Job Type</th>
                        </>
                      )}

                      {activeTab === 'blogs' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '240px' }}>Blog Title</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Author</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Category</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Published At</th>
                        </>
                      )}

                      {activeTab === 'certificates' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '160px' }}>Student Name</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Certificate No</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '180px' }}>Course Name</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '90px' }}>Grade</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Issued Date</th>
                        </>
                      )}

                      {activeTab === 'testimonials' && (
                        <>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '160px' }}>Student Name</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '140px' }}>Role / Company</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '160px' }}>Course</th>
                          <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '90px' }}>Rating</th>
                        </>
                      )}

                      <th style={{ padding: '12px 14px', fontWeight: '800', minWidth: '70px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.map((row: any, idx: number) => {
                      const isSelected = selectedIds.includes(row._id);
                      return (
                        <tr
                          key={row._id || idx}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            backgroundColor: isSelected ? 'rgba(189, 96, 28, 0.15)' : idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          {/* Row Checkbox */}
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleToggleSelect(row._id)}
                            />
                          </td>

                          {/* Index */}
                          <td style={{ padding: '12px 14px', color: '#786C65', fontWeight: '600' }}>
                            {startIndex + idx + 1}
                          </td>

                          {/* Tab specific columns */}
                          {activeTab === 'leads' && (
                            <>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#FF7518' }}>{row.fullName || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.phone || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.email || '—'}</td>
                              <td style={{ padding: '12px 14px', fontWeight: '600' }}>{row.course || '—'}</td>
                              <td style={{ padding: '12px 14px', color: '#94a3b8', maxWidth: '300px' }}>{row.message || '—'}</td>
                              <td style={{ padding: '12px 14px' }}><Badge tone="primary">{row.status || 'New'}</Badge></td>
                              <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '12px' }}>{formatDate(row.submittedAt)}</td>
                            </>
                          )}

                          {activeTab === 'stipends' && (
                            <>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#FF7518' }}>{row.fullName || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.phone || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.email || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.qualification || '—'}</td>
                              <td style={{ padding: '12px 14px' }}><Badge tone="primary">{row.category || 'General'}</Badge></td>
                              <td style={{ padding: '12px 14px' }}>{row.city || '—'}</td>
                              <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '12px' }}>{formatDate(row.submittedAt)}</td>
                            </>
                          )}

                          {activeTab === 'internships' && (
                            <>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#FF7518' }}>{row.fullName || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.phone || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.email || '—'}</td>
                              <td style={{ padding: '12px 14px', fontWeight: '600' }}>{row.course || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.qualification || '—'}</td>
                              <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '12px' }}>{formatDate(row.submittedAt)}</td>
                            </>
                          )}

                          {activeTab === 'jobs' && (
                            <>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#FF7518' }}>{row.fullName || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.phone || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.email || '—'}</td>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#38bdf8' }}>{row.jobTitle || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.company || '—'}</td>
                              <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '12px' }}>{formatDate(row.submittedAt)}</td>
                            </>
                          )}

                          {activeTab === 'courses' && (
                            <>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#FF7518' }}>{row.title || '—'}</td>
                              <td style={{ padding: '12px 14px' }}><Badge tone="primary">{row.category || 'Certification'}</Badge></td>
                              <td style={{ padding: '12px 14px' }}>{row.duration || '—'}</td>
                              <td style={{ padding: '12px 14px', fontWeight: '600' }}>₹{row.fee || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.instructor || '—'}</td>
                            </>
                          )}

                          {activeTab === 'jobPostings' && (
                            <>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#38bdf8' }}>{row.title || '—'}</td>
                              <td style={{ padding: '12px 14px', fontWeight: '600' }}>{row.company || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.location || '—'}</td>
                              <td style={{ padding: '12px 14px' }}><Badge tone="primary">{row.category || 'General'}</Badge></td>
                              <td style={{ padding: '12px 14px' }}>{row.jobType || 'Full Time'}</td>
                            </>
                          )}

                          {activeTab === 'blogs' && (
                            <>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#FF7518' }}>{row.title || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.author || '—'}</td>
                              <td style={{ padding: '12px 14px' }}><Badge tone="primary">{row.category || 'General'}</Badge></td>
                              <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '12px' }}>{formatDate(row.submittedAt)}</td>
                            </>
                          )}

                          {activeTab === 'certificates' && (
                            <>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#FF7518' }}>{row.fullName || row.studentName || '—'}</td>
                              <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: '700' }}>{row.regNumber || row.certificateNo || row.certificateId || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.courseName || '—'}</td>
                              <td style={{ padding: '12px 14px' }}><Badge tone="positive">{row.grade || 'Grade A+'}</Badge></td>
                              <td style={{ padding: '12px 14px', color: '#94a3b8', fontSize: '12px' }}>{formatDate(row.issueDate || row.submittedAt)}</td>
                            </>
                          )}

                          {activeTab === 'testimonials' && (
                            <>
                              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#FF7518' }}>{row.name || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.role || '—'}</td>
                              <td style={{ padding: '12px 14px' }}>{row.course || '—'}</td>
                              <td style={{ padding: '12px 14px' }}><Badge tone="positive">⭐ {row.rating || 5}</Badge></td>
                            </>
                          )}

                          {/* Row Action */}
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <Button
                              mode="bleed"
                              tone="critical"
                              padding={2}
                              icon={TrashIcon}
                              title="Delete item"
                              onClick={() => setDeleteTarget({ id: row._id, name: row.fullName || row.title || row.studentName || row.name || 'Record' })}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <Card padding={3} borderTop style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                  <Text size={1} muted>
                    Showing <strong>{startIndex + 1}</strong> – <strong>{endIndex}</strong> of <strong>{filteredList.length}</strong> items (Selected: {selectedIds.length})
                  </Text>

                  {totalPages > 1 && (
                    <Flex align="center" gap={1}>
                      <Button
                        mode="ghost"
                        icon={ChevronLeftIcon}
                        text="Prev"
                        fontSize={1}
                        padding={2}
                        disabled={safePage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      />

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = i + 1;
                        if (totalPages > 5 && safePage > 3) {
                          pageNum = safePage - 2 + i;
                          if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                        }
                        return (
                          <Button
                            key={pageNum}
                            mode={safePage === pageNum ? 'default' : 'bleed'}
                            tone={safePage === pageNum ? 'primary' : 'default'}
                            text={String(pageNum)}
                            fontSize={1}
                            padding={2}
                            onClick={() => setCurrentPage(pageNum)}
                          />
                        );
                      })}

                      <Button
                        mode="ghost"
                        icon={ChevronRightIcon}
                        text="Next"
                        fontSize={1}
                        padding={2}
                        disabled={safePage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      />
                    </Flex>
                  )}
                </Flex>
              </Card>
            </>
          )}
        </Card>
      </Stack>

      {/* Confirmation Dialog for Bulk Selected Deletion */}
      {bulkDeleteModalOpen && (
        <Dialog
          header="⚠️ Delete Selected Items"
          id="confirm-bulk-delete-dialog"
          onClose={() => !deleting && setBulkDeleteModalOpen(false)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Card padding={3} radius={2} tone="critical" border>
                <Flex align="flex-start" gap={3}>
                  <Box style={{ paddingTop: '2px' }}>
                    <WarningOutlineIcon style={{ fontSize: '20px' }} />
                  </Box>
                  <Stack space={2}>
                    <Text weight="bold" size={2}>
                      Delete {selectedIds.length} selected items permanently?
                    </Text>
                    <Text size={1} muted>
                      This will delete all {selectedIds.length} checked documents from Sanity CMS. This action cannot be undone.
                    </Text>
                  </Stack>
                </Flex>
              </Card>
              <Flex justify="flex-end" gap={2}>
                <Button mode="ghost" text="Cancel" padding={3} disabled={deleting} onClick={() => setBulkDeleteModalOpen(false)} />
                <Button tone="critical" icon={TrashIcon} loading={deleting} text={deleting ? 'Deleting...' : `Delete ${selectedIds.length} Items`} padding={3} disabled={deleting} onClick={handleBulkDelete} />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}

      {/* Confirmation Dialog for Single Row Deletion */}
      {deleteTarget && (
        <Dialog
          header="⚠️ Delete Item"
          id="confirm-single-delete-dialog"
          onClose={() => !deleting && setDeleteTarget(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={2}>
                Are you sure you want to delete <strong>"{deleteTarget.name}"</strong> from Sanity CMS? This cannot be undone.
              </Text>
              <Flex justify="flex-end" gap={2}>
                <Button mode="ghost" text="Cancel" padding={3} disabled={deleting} onClick={() => setDeleteTarget(null)} />
                <Button tone="critical" icon={TrashIcon} loading={deleting} text={deleting ? 'Deleting...' : 'Delete Item'} padding={3} disabled={deleting} onClick={handleSingleDelete} />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}

      {/* Confirmation Dialog for Purging Current Tab */}
      {deleteAllTarget && (
        <Dialog
          header="⚠️ Purge All Tab Records"
          id="confirm-purge-tab-dialog"
          onClose={() => !deleting && setDeleteAllTarget(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Card padding={3} radius={2} tone="critical" border>
                <Flex align="flex-start" gap={3}>
                  <Box style={{ paddingTop: '2px' }}>
                    <WarningOutlineIcon style={{ fontSize: '20px' }} />
                  </Box>
                  <Stack space={2}>
                    <Text weight="bold" size={2}>
                      Permanently delete ALL records in this tab?
                    </Text>
                    <Text size={1} muted>
                      This will erase all documents for this category from Sanity CMS.
                    </Text>
                  </Stack>
                </Flex>
              </Card>
              <Flex justify="flex-end" gap={2}>
                <Button mode="ghost" text="Cancel" padding={3} disabled={deleting} onClick={() => setDeleteAllTarget(null)} />
                <Button tone="critical" icon={TrashIcon} loading={deleting} text={deleting ? 'Purging...' : 'Yes, Delete All in Tab'} padding={3} disabled={deleting} onClick={handleDeleteAll} />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Card>
  );
}
