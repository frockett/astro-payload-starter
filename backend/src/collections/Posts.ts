import { CollectionConfig } from 'payload/types'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    livePreview: {
      url: ({ data }) =>
        `${process.env.CLIENT_URI}/preview/blog/${data.slug}` ||
        `http://localhost:4321/preview/blog/${data.slug}`,
    },
    useAsTitle: 'title',
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
    },
  ],
}

export default Posts
