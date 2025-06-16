import type { GlobalConfig } from 'payload'

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  label: 'Landing Page',
  admin: {
    livePreview: {
      url: process.env.CLIENT_URI || 'http://localhost:4321/preview',
    },
  },
  access: {
    read: () => true, // Allow public read access
  },
  versions: {
    drafts: {
      autosave: {
        interval: 500,
      },
    },
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'Hero Header',
        },
        {
          name: 'subtitle',
          type: 'text',
          defaultValue: 'Hero subtitle text to describe your awesome site.',
        },
        {
          name: 'ctaText',
          type: 'text',
          defaultValue: 'Read Blog',
        },
        {
          name: 'ctaLink',
          type: 'text',
          defaultValue: '/blog',
        },
      ],
    },
  ],
}
