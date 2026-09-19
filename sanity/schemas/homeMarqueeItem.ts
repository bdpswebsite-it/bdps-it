export const homeMarqueeItemSchema = {
  name: 'homeMarqueeItem',
  title: 'Homepage Marquee Entries',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Announcement / Ticker Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'Main text shown in the scrolling ticker (e.g. Special Off-Campus Drive for Trained Freshers).',
    },
    {
      name: 'badge',
      title: 'Badge / Highlight Tag',
      type: 'string',
      initialValue: 'ANNOUNCEMENT',
      description: 'Bold label tag (e.g. HOT, NEW, HIRING, TCS, BDPS, OFF-CAMPUS).',
    },
    {
      name: 'subtitle',
      title: 'Subtitle / Location (Optional)',
      type: 'string',
      description: 'Optional secondary text shown in parentheses (e.g. Hyderabad / Vizag, 100+ Openings).',
    },
    {
      name: 'link',
      title: 'Custom Link URL (Optional)',
      type: 'string',
      description: 'Optional URL (e.g. /courses, /contact, or external link). If left blank, this item will not be a link.',
    },
    {
      name: 'isActive',
      title: 'Active (Show in Marquee)',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle off to temporarily hide this entry from the homepage without deleting it.',
    },
    {
      name: 'order',
      title: 'Display Order Priority',
      type: 'number',
      initialValue: 1,
      description: 'Order priority (lower numbers appear first in the ticker sequence).',
    },
  ],
  preview: {
    select: {
      title: 'title',
      badge: 'badge',
      subtitle: 'subtitle',
      isActive: 'isActive',
    },
    prepare(selection: any) {
      const { title, badge, subtitle, isActive } = selection;
      const status = isActive === false ? ' [HIDDEN]' : '';
      const badgeText = badge ? `[${badge}] ` : '';
      return {
        title: `${badgeText}${title || 'Untitled Ticker Item'}${status}`,
        subtitle: subtitle || 'No subtitle',
      };
    },
  },
};
