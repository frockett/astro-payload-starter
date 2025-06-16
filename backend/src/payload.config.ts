// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { LandingPage } from 'src/globals/landingPage'
import { Header } from './globals/header'
import {
  BlocksFeature,
  FixedToolbarFeature,
  LinkFeature,
  UploadFeature,
  defaultEditorFeatures,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import Posts from './collections/Posts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000', // Payload admin
    process.env.CLIENT_URI || 'http://localhost:4321', // Astro dev server
  ],
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.CLIENT_URI || 'http://localhost:4321',
  ],
  globals: [LandingPage, Header],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 380,
          height: 667,
        },
        {
          label: 'Laptop Lg',
          name: 'LaptopL',
          width: 1920,
          height: 1080,
        },
        {
          label: 'Laptop Sm',
          name: 'LaptopS',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections: [Users, Media, Posts],
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature({}),
      LinkFeature({
        // Example showing how to customize the built-in fields
        // of the Link feature
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'rel',
            label: 'Rel Attribute',
            type: 'select',
            hasMany: true,
            options: ['noopener', 'noreferrer', 'nofollow'],
            admin: {
              description:
                'The rel attribute defines the relationship between a linked resource and the current document. This is a custom link field.',
            },
          },
        ],
      }),
      UploadFeature({
        collections: {
          uploads: {
            // Example showing how to customize the built-in fields
            // of the Upload feature
            fields: [
              {
                name: 'caption',
                type: 'richText',
                editor: lexicalEditor(),
              },
            ],
          },
        },
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
    push: process.env.NODE_ENV === 'development',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    importExportPlugin({
      collections: ['posts', 'media'],
      overrideExportCollection: (collection) => {
        collection.admin.group = 'System'
        return collection
      },
      disableJobsQueue: true,
    }),
  ],
})
