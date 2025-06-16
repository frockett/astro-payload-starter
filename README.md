# Astro and Payload CMS Starter with Live Preview

This starter is based on the default blank Payload template with basic collections and configuration added for demonstration purposes. The default database is SQLite to reduce external dependencies. Just clone the repo and start.

## Features

- Astro Frontend: SSG on primary routes and SSR on `/preview/` routes
- Payload CMS Backend: Headless CMS with admin panel for content management
- Live Reload: Live reload implementation. Eschews true live reload in favor of a simpler approach (see [Live Preview](#live-preview))
- Pre-built Components: Header and hero component that use Payload globals + blog template
- Use of Payload's REST API.
- Tailwind CSS + Typography plugin

```
├── backend/          # Payload CMS
│   ├── src/
│   │   ├── collections/  # Content collections (Posts, Media)
│   │   ├── globals/      # Global configs (Header, Landing Page)
│   │   └── payload.config.ts
│   ├── Dockerfile        # Default Payload Dockerfile
│   └── docker-compose.yml
│
├── frontend/         # Astro site
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   └── preview/ # Preview routes (SSR)
│   │   └── lib/
│   └── astro.config.mjs
```

## Motivation

This repo serves two purposes:

- Be usable as a template for projects that combine Payload and Astro.
- Offer an example of an unorthodox implementation of Live Reload that is highly flexible.

## Quick Start

1. **Use this template**
   ```bash
   # Create from template (if using GitHub template feature)
   # OR clone directly
   git clone https://github.com/frockett/astro-payload-starter.git my-project
   cd my-project
   ```
2. **Install Dependencies**
   ```bash
   cd frontend/ && npm install
   cd backend/ && npm install
   ```
3. Copy `env.example` files and set `PAYLOAD_SECRET`
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```
4. **Start development**

   ```bash
   # Use two terminals

   # Terminal 1
   cd frontend/ && npm run dev

   # Terminal 2
   cd backend/ && npm run dev
   ```

## Environment Variables

```bash
# frontend/.env
PAYLOAD_URI=http://localhost:3000

# backend/.env
DATABASE_URI=file:./testing-project.db
PAYLOAD_SECRET=YOUR_PAYLOAD_SECRET
CLIENT_URI=http://localhost:4321
```

## Live Preview

This starter uses the following implementation of Live Reload:

```ts
// Inside src/components/LivePreview.astro
<script is:inline>
  window.addEventListener(
    'message',
    (event) => {
      if (event.data.type === 'payload-document-event') {
        // reload the page whenever a document is saved in the admin panel to get the latest data
        location.reload()
      }
    },
    false, // Add false to ensure event bubbles up through iframes
  )
</script>
```

This approach **does not** make use of Payload's live preview hooks. Instead it listens for the payload event type that indicates an update has been saved, and then reloads the entire SSR route. This method is much simpler than the default implementation.

You can improve editing UX by decreasing the autosave interval. In this template it is set to 500ms.

_Credit for this implementation goes to [Jens](https://jhb.software/en) from the Payload Discord server._

### Alternative Live Preview

In `src/pages/preview/blog/[slug].astro` you can find an alternative implementation that does make use of Payload's hooks.

```js
<!-- ALTERNATIVE SCRIPT USING PAYLOAD LIVE PREVIEW HOOKS -->
<script>
  import { subscribe, ready } from "@payloadcms/live-preview";
  import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

  const serverUrl = "http://localhost:3000";

  subscribe({
    callback: (mergedData) => {

      if (mergedData.title) {
        const titleElement = document.querySelector(
          '[data-text-field="title"]',
        );
        if (titleElement) {
          titleElement.textContent = mergedData.title;
        }
      }

      if (mergedData.content) {
        const contentElement = document.querySelector(
          '[data-text-field="content"]',
        );
        if (contentElement) {
          try {
            const html = convertLexicalToHTML({ data: mergedData.content });
            contentElement.innerHTML = html;
          } catch (error) {
            console.error("Failed to convert rich text:", error);
            contentElement.innerHTML = "<p>[Error converting rich text]</p>";
          }
        }
      }
    },
    serverURL: serverUrl,
  });

  ready({
    serverURL: serverUrl,
  });
</script>
```

This approach offers "true" live preview but has the disadvantage of requiring implementation for every field type and layout change. The script has been preserved for reference.
