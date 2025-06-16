// src/globals/header.ts
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    livePreview: {
      url: `${process.env.CLIENT_URI}/preview` || 'http://localhost:4321/preview',
    },
  },
  access: {
    read: () => true,
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'siteName',
      type: 'text',
      label: 'Site Name',
      defaultValue: 'My Site',
    },
    {
      name: 'navigation',
      type: 'array',
      label: 'Navigation Links',
      maxRows: 5, // Limit to 5 navigation links
      defaultValue: [
        {
          label: 'Blog',
          url: '/blog',
          external: false,
        },
      ],
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'external',
          type: 'checkbox',
          label: 'External Link',
          defaultValue: false,
        },
      ],
    },
  ],
}
