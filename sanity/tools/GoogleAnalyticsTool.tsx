import React, { useState } from 'react';
import { Box, Flex, Heading, Button, Badge, Card, Text, Stack } from '@sanity/ui';
import { LaunchIcon, ActivityIcon, InfoOutlineIcon } from '@sanity/icons';

export default function GoogleAnalyticsTool() {
  const initialEmbedUrl = process.env.NEXT_PUBLIC_LOOKER_STUDIO_URL || '';
  const [embedUrl, setEmbedUrl] = useState(initialEmbedUrl);

  const analyticsDashboardUrl = `https://analytics.google.com/analytics/web/`;

  return (
    <Box
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0F1115',
        color: '#ffffff',
        padding: '8px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <style>{`
        .ga-tool-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 12px;
          margin-bottom: 8px;
          background-color: #1A1D24;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .ga-iframe-container {
          width: 100%;
          min-height: 1450px;
          height: 1450px;
          border-radius: 10px;
          overflow: hidden;
          background-color: #000000;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        @media (max-width: 640px) {
          .ga-tool-header {
            padding: 4px 8px;
            margin-bottom: 6px;
          }
          .ga-header-title {
            font-size: 13px !important;
          }
          .ga-header-badge {
            display: none !important;
          }
          .ga-iframe-container {
            min-height: 1600px;
            height: 1600px;
          }
        }
      `}</style>

      {/* Ultra Compact Responsive Header Bar */}
      <div className="ga-tool-header">
        <Flex align="center" gap={2}>
          <Heading size={1} className="ga-header-title" style={{ color: '#ffffff', margin: 0, fontWeight: 700 }}>
            📈 Website Analytics
          </Heading>
          <span className="ga-header-badge">
            <Badge tone="positive" fontSize={0} padding={1} radius={2}>
              Live GA4
            </Badge>
          </span>
        </Flex>

        <Button
          as="a"
          href={analyticsDashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          icon={LaunchIcon}
          text="Open GA4"
          tone="primary"
          padding={2}
          fontSize={0}
        />
      </div>

      {/* iFrame Container - Height expanded to 1450px (1600px mobile) to fit full long Page 1 */}
      <div className="ga-iframe-container">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{
              border: 0,
              width: '100%',
              height: '100%',
              display: 'block',
            }}
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            title="BDPS Google Analytics Dashboard"
          />
        ) : (
          <Card
            padding={4}
            radius={3}
            tone="inherit"
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              backgroundColor: '#161920',
            }}
          >
            <Box style={{ maxWidth: '600px', width: '100%' }}>
              <Stack space={4}>
                <Flex align="center" gap={2}>
                  <InfoOutlineIcon style={{ fontSize: '24px', color: '#3B82F6' }} />
                  <Heading size={2} style={{ color: '#ffffff' }}>
                    Connect Your Looker Studio Report
                  </Heading>
                </Flex>

                <Text size={1} style={{ color: '#94A3B8', lineHeight: '1.6' }}>
                  1. Open <a href="https://lookerstudio.google.com/" target="_blank" rel="noreferrer" style={{ color: '#60A5FA', textDecoration: 'underline' }}>Google Looker Studio</a> (100% Free).
                  <br />
                  2. Open your report and click <strong>File &gt; Embed report &gt; Enable embedding &gt; Embed URL</strong>.
                  <br />
                  3. Paste the URL below (or set <code>NEXT_PUBLIC_LOOKER_STUDIO_URL</code> in <code>.env</code>).
                </Text>

                <Flex gap={2} style={{ marginTop: '12px' }}>
                  <input
                    type="url"
                    placeholder="Paste Looker Studio Embed URL here..."
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #334155',
                      backgroundColor: '#0F172A',
                      color: '#ffffff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </Flex>

                <Flex gap={2} wrap="wrap" style={{ marginTop: '8px' }}>
                  <Button
                    as="a"
                    href="https://analytics.google.com/analytics/web/#/p/reports/realtime"
                    target="_blank"
                    rel="noreferrer"
                    icon={ActivityIcon}
                    text="Realtime Visitors"
                    tone="default"
                  />
                  <Button
                    as="a"
                    href="https://analytics.google.com/analytics/web/#/p/reports/conversions"
                    target="_blank"
                    rel="noreferrer"
                    icon={ActivityIcon}
                    text="Key Events (generate_lead)"
                    tone="positive"
                  />
                </Flex>
              </Stack>
            </Box>
          </Card>
        )}
      </div>
    </Box>
  );
}
