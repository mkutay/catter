# Catter Developer & Agent Guide

Welcome to the **Catter** codebase! This documentation is designed to quickly onboard developers and AI agents. It covers the core tech stack, codebase structure, toolchain, testing strategy, database schemas, and deployment workflows.

---

## Tech Stack Overview

- **Framework**: [Next.js 16](file:///Users/kutay/code/catter/package.json) (App Router, Standalone build mode, React 19).
- **Runtime & Package Manager**: [Bun](file:///Users/kutay/code/catter/bun.lock) (for fast execution, linting, testing, and dependency resolution).
- **Styling**: TailwindCSS v4 with [Shadcn UI](file:///Users/kutay/code/catter/src/components/ui/) (Catppuccin color scheme).
- **Database**: PostgreSQL with [Drizzle ORM](file:///Users/kutay/code/catter/src/lib/db/) and [Drizzle Kit](file:///Users/kutay/code/catter/drizzle.config.ts).
- **Cache & Key-Value Store**: Redis via [ioredis](file:///Users/kutay/code/catter/src/lib/redis.ts) for caching image placeholders and syntax-highlighted code blocks with native TTL.
- **Content Engine**: MDX powered by [next-mdx-remote-client](file:///Users/kutay/code/catter/package.json) with custom LaTeX, Table of Contents, and [CodeHike](file:///Users/kutay/code/catter/src/config/mdx-settings.tsx) syntax highlighting plugins.
- **Linting & Formatting**: [Biome](file:///Users/kutay/code/catter/biome.json) (replaces ESLint/Prettier with ultra-fast checks).
- **Testing**: [Vitest](file:///Users/kutay/code/catter/vitest.config.ts) for unit/integration tests and [Playwright](file:///Users/kutay/code/catter/playwright.config.ts) for E2E testing.
- **Error Handling**: Typesafe errors using the [neverthrow](file:///Users/kutay/code/catter/package.json) monadic library.

---

## Bun Commands Reference

The project is fully driven by **Bun**. Use the following commands for development, testing, schema management, and linting:

| Command                 | Action                                                                                                          |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `bun install`           | Installs project dependencies with frozen lockfile validation.                                                  |
| `bun run dev`           | Starts the Next.js development server at `http://localhost:3000`.                                               |
| `bun run build`         | Compiles the production build (emits optimized standalone outputs).                                             |
| `bun run start`         | Launches the production server locally using Node.js.                                                           |
| `bun run check`         | Runs [Biome](file:///Users/kutay/code/catter/biome.json) to lint, format, and optimize imports with auto-fixes. |
| `bun run typecheck`     | Validates TypeScript types across the codebase using `tsc --noEmit`.                                            |
| `bun run db:generate`   | Inspects schemas and generates migration SQL scripts under `./migrations`.                                      |
| `bun run db:migrate`    | Runs pending migration SQL scripts directly on the target PostgreSQL database.                                  |
| `bun run db:push`       | Directly pushes schema states to the database without generating migrations (ideal for dev/sandbox).            |
| `bun run db:studio`     | Launches Drizzle Studio GUI on `https://local.drizzle.studio` to inspect tables.                                |
| `bun run test`          | Executes unit and integration tests once using [Vitest](file:///Users/kutay/code/catter/vitest.config.ts).      |
| `bun run test:watch`    | Runs Vitest in watch mode (reruns on file changes).                                                             |
| `bun run test:coverage` | Computes test coverage using the `v8` provider and generates HTML/JSON reports.                                 |
| `bun run e2e`           | Runs E2E tests across WebKit, Firefox, and Chromium using Playwright.                                           |
| `bun run e2e:ui`        | Starts Playwright's interactive E2E UI runner for visual debugging.                                             |

---

## Project Structure

```
.
├── .env.development         # Environment variables for local development
├── .env.production          # Environment variables for production runs
├── .env.test                # Environment variables for testing
├── biome.json               # Biome linting and formatting configuration
├── Dockerfile               # Multi-stage production build blueprint
├── drizzle.config.ts        # Drizzle ORM generation settings
├── package.json             # Workspace dependencies & npm scripts
├── playwright.config.ts     # Playwright E2E settings
├── vitest.config.ts         # Vitest unit/integration settings
├── e2e/                     # Playwright spec test files
├── migrations/              # Generated Drizzle database SQL migrations
└── src/
    ├── app/                 # Next.js App Router Pages and APIs
    │   ├── api/             # API Endpoints (auth, comments, views, upload, etc.)
    │   │   ├── health/      # Health check API for container orchestrators
    │   │   └── [...image]/  # S3/MinIO image proxy endpoint
    │   ├── posts/           # Blog posts listing and dynamic pages
    │   ├── [shortened]/     # Slug-based URL redirection logic
    │   └── admin/           # Administrative console (moderating comments)
    ├── components/          # Reusable UI/Page components
    │   ├── ui/              # Radix UI and Shadcn primitives
    │   ├── comments/        # Interactive blog comments layout
    │   ├── side-toc.tsx     # Dynamic MDX Table of Contents component
    │   └── theme-changer.tsx# Catppuccin light/dark theme switch
    ├── config/              # Central site configuration, types, and MDX options
    │   ├── site.ts          # Metadata, routes, and admin email lists
    │   └── mdx-settings.tsx # KaTeX, GFM, CodeHike, and custom remark plugins
    ├── lib/                 # Core utilities, libraries, and database modules
    │   ├── db/              # Drizzle ORM client, schemas, and relation definitions
    │   ├── database-queries/# Read operations (Auth, comments, guestbook, views)
    │   ├── database-actions/# Write operations (Insert, update, delete comments/views)
    │   └── rendering.tsx    # MDX-to-React parsing and renderer methods
    └── test/                # Unit test specifications and testing configurations
```

### Key Architecture & Coding Patterns

1. **Explicit Error Handling (`neverthrow`)**
   - The application rejects typical `try/catch` and `async/await` flows that return raw objects or throw unexpected exceptions.
   - Operations in [database-queries](file:///Users/kutay/code/catter/src/lib/database-queries) and [database-actions](file:///Users/kutay/code/catter/src/lib/database-actions) return a `ResultAsync<Value, Error>` type. This forces callers to explicitly handle failures (using `.map()`, `.andThen()`, `.orElse()`, or `.match()`).
   - Example (from [views query](file:///Users/kutay/code/catter/src/lib/database-queries/views.ts)):
     ```typescript
     export const getViewCount = ({ slug }: { slug: string }) =>
       ResultAsync.fromPromise(
         db
           .select({ count: views.count })
           .from(views)
           .where(eq(views.slug, slug)),
         (err) => ({
           message: "Database query failed",
           code: "DATABASE_ERROR",
         }),
       ).map((res) => res[0]?.count ?? 0);
     ```

2. **Isolated Database Layers**
   - **Schema & Relations**: Defined inside [schema.ts](file:///Users/kutay/code/catter/src/lib/db/schema.ts) and [relations.ts](file:///Users/kutay/code/catter/src/lib/db/relations.ts) and exported via [drizzle.ts](file:///Users/kutay/code/catter/src/lib/db/drizzle.ts).
   - **Queries**: Read-only operations are consolidated under [database-queries](file:///Users/kutay/code/catter/src/lib/database-queries).
   - **Actions**: Writes, updates, and deletes are consolidated under [database-actions](file:///Users/kutay/code/catter/src/lib/database-actions).

3. **Type-Safe Environment Variables**
   - Variable schemas are strictly parsed on start in [src/env.ts](file:///Users/kutay/code/catter/src/env.ts) using `@t3-oss/env-nextjs` and `zod`. Any missing production environment variable fails the application immediately at build time rather than failing silently at runtime.

---

## MDX Rendering Pipeline

Catter uses a rich and customized MDX engine built on top of [next-mdx-remote-client](file:///Users/kutay/code/catter/package.json) to parse and render blog post bodies with premium typography, mathematical equations, and advanced code blocks.

### Parser Configurations & Custom Plugins

The rendering setup is housed in [mdx-settings.tsx](file:///Users/kutay/code/catter/src/config/mdx-settings.tsx) and [rendering.tsx](file:///Users/kutay/code/catter/src/lib/rendering.tsx). The pipeline executes several Remark, Rehype, and Recma plugins during evaluation:

- **Markdown Enhancements**:
  - `remarkGfm`: Adds support for GitHub Flavored Markdown (tables, autolinks, task lists, strikethrough).
  - `remarkSmartypants`: Enhances typography with curved quotes, em-dashes, and ellipses.
  - `remarkLint`: Runs structural checks on Markdown format.
- **LaTeX Math Support**:
  - `remarkMath` & `rehypeKatex`: Standard math equation block/inline syntax compiler.
  - Custom [rehypeKatexBlock](file:///Users/kutay/code/catter/src/lib/rehype-katex-block.ts) plugin wraps wide LaTeX block equations in an auto-scrolling container (`overflow-x-auto mx-auto max-w-full block`) to prevent layouts from breaking on narrow viewports.
- **Code Block Syntax Highlighting**:
  - `remarkCodeHike`: Integrates **CodeHike** (`codehike/mdx`) for interactive, styled source code blocks. Configured inside [mdx-settings.tsx](file:///Users/kutay/code/catter/src/config/mdx-settings.tsx) to map plain/untyped blocks gracefully to `txt` language.
- **Table of Contents Generation**:
  - `remarkFlexibleToc`: Traverses document nodes to compile heading indexes into `vfile` data, which is subsequently destructured into the React page scope to power the sticky, reactive [side-toc.tsx](file:///Users/kutay/code/catter/src/components/side-toc.tsx) sidebar.
- **Custom Syntax Resolution**:
  - Custom [remarkParentheses](file:///Users/kutay/code/catter/src/lib/remark-parentheses.ts) and [toggle-parentheses.tsx](file:///Users/kutay/code/catter/src/components/toggle-parentheses.tsx) allow dynamically expanding/collapsing bracketed details in post paragraphs.

### Modular Typography Mappings

All native HTML tag structures are overridden by premium components in the MDX scope:

- Headings are replaced with [headings.tsx](file:///Users/kutay/code/catter/src/components/typography/headings.tsx) components (`TypographyH1`, `TypographyH2`, etc.) with built-in anchor tag ids.
- Paragraphs use `TypographyParagraph` from [paragraph.tsx](file:///Users/kutay/code/catter/src/components/typography/paragraph.tsx).
- Lists, blockquotes, and dividers map to Catppuccin themed primitives inside [list.tsx](file:///Users/kutay/code/catter/src/components/typography/list.tsx) and [blockquote.tsx](file:///Users/kutay/code/catter/src/components/typography/blockquote.tsx).
- Custom inline image mapping ([image.tsx](file:///Users/kutay/code/catter/src/components/typography/image.tsx)) intercepts tags to utilize Next's `<Image>` tag with blur placeholder processing.

---

## Database & Drizzle ORM

The application connects to a **PostgreSQL** database using the `drizzle-orm/node-postgres` driver.

### Database Schema Summary

The database includes the following six main tables defined in [schema.ts](file:///Users/kutay/code/catter/src/lib/db/schema.ts):

1. **`posts`**: Core blog post storage. Slugs act as primary keys. Contains titles, MDX contents, cover images, dates, and excerpt data.
2. **`post_tags`**: Links posts to metadata tags (`slug` -> foreign key referencing `posts.slug`). Has Cascade updates and deletions.
3. **`post_keywords`**: Links posts to SEO keywords (`slug` -> foreign key referencing `posts.slug`). Has Cascade updates and deletions.
4. **`views`**: Maps post slugs to their read counts (`count` column). Used for sorting top-viewed items.
5. **`comments`**: Threaded/individual blog comments containing reader email, name (`createdBy`), body, timestamp, and target `slug`.
6. **`guestbook`**: Form responses representing user presence on the blog. Stores email, signature (`body`), date, and signature block theme (`color`).

---

## Testing Guidelines

Testing is divided cleanly into unit/integration tests and browser-driven end-to-end tests.

### Unit & Integration Tests (Vitest)

- **Settings**: Handled inside [vitest.config.ts](file:///Users/kutay/code/catter/vitest.config.ts) utilizing a `jsdom` sandbox env, `@testing-library/react`, and [setup.ts](file:///Users/kutay/code/catter/src/test/setup.ts).
- **Target Files**: All files named `*.test.ts` or `*.test.tsx` located inside [src/test/](file:///Users/kutay/code/catter/src/test/).
- **Coverage**: Uses `v8`. Ignores test files, mock databases, and App Router entry pages/layouts.
- **Execution**:
  ```bash
  bun run test          # Run once
  bun run test:watch    # Watch changes
  ```

### End-to-End Tests (Playwright)

- **Settings**: Programmed in [playwright.config.ts](file:///Users/kutay/code/catter/playwright.config.ts).
- **Target Files**: Specs located inside [e2e/](file:///Users/kutay/code/catter/e2e) (e.g., [about.spec.ts](file:///Users/kutay/code/catter/e2e/about.spec.ts), [projects.spec.ts](file:///Users/kutay/code/catter/e2e/projects.spec.ts), [guestbook.spec.ts](file:///Users/kutay/code/catter/e2e/guestbook.spec.ts)).
- **Mechanism**: Playwright launches a Next.js server locally under the test profile using `NODE_ENV=test bun run start`.
- > [!IMPORTANT]
  > Because Playwright boots the production server using the built static pages, **you must build the project first** before running E2E tests:
  >
  > ```bash
  > bun run build
  > bun run e2e
  > ```

---

## CI/CD & GitHub Workflows

The codebase maintains a robust validation lifecycle using GitHub Actions. The core CI definition is stored in [check.yml](file:///Users/kutay/code/catter/.github/workflows/check.yml):

- **Triggers**: Executed on any `pull_request` event, and on direct `push` events to the `main` branch.
- **Concurrency**: Integrates automatic job cancellation (`cancel-in-progress: true`) grouped by branch, saving workflow minutes.
- **CI Jobs**:
  1. **Lint & Format**: Runs on `ubuntu-latest`. Installs Bun using `oven-sh/setup-bun@v2`, restores dependency trees, runs linting checks/auto-fixes (`bun run check`), and runs TypeScript compiler validations (`bun run typecheck`).
  2. **Unit tests**: Installs dependencies and runs all Vitest tests using the `--reporter=verbose` flag to log clear, step-by-step suite completion logs.

---

## Static Page Generation & Obsidian CMS Integration

Catter is designed for maximum speed and performance by utilizing full **Static Page Generation (SSG)** combined with **On-Demand Incremental Static Regeneration (ISR)** triggered directly by an external writer client.

### Force Static Routing

Almost all critical user-facing routes (including `/`, `/posts`, `/posts/[slug]`, and `/tags`) enforce compile-time page creation via Next.js routing options:

```typescript
export const dynamic = "force-static";
```

Static page dynamic parameters for blog posts are compiled during building via [generateStaticParams](file:///Users/kutay/code/catter/src/app/posts/%5Bslug%5D/page.tsx#L149-L157) using database-extracted post slugs.

### Obsidian as CMS Client (`obsidian-as-cms`)

Publishing and updating articles is entirely powered by the custom Obsidian plugin located in `/Users/kutay/code/obsidian-as-cms`.

**Obsidian Workflow**:

1. **Asset Discovery**: The plugin scans active vaults and leverages Obsidian's direct metadata caches (`embeds`, `links`, and `frontmatterLinks`) to locate local attachments rather than using fragile regular expression searches.
2. **Deduplication & Normalization**: Vault files are resolved relative to the note's active location. Anchors are removed. Duplicate references are merged. Shared names trigger dynamic numeric suffix appending (e.g. `image-2.png`). Wikilink embeds (`![[image.png]]`) are automatically converted to standard Markdown syntax.
3. **Payload Transmission**: Note contents, basename slugs, and all binary attachment parts are packaged into `multipart/form-data` and posted to Catter's secure backend using a Bearer authorization token.

### API Processing & On-Demand Revalidation

Once the Obsidian client fires a payload, Catter intercepts it at secure API handlers:

- **Publish Endpoint**: [upload/route.ts](file:///Users/kutay/code/catter/src/app/api/upload/route.ts)
- **Unpublish Endpoint**: [unpublish/route.ts](file:///Users/kutay/code/catter/src/app/api/unpublish/route.ts)

Upon verifying the `Authorization: Bearer <UPLOAD_API_KEY>` header:

1. **Attachment Uploads**: Attached binary file buffers are pushed concurrently to MinIO/S3 using the S3 driver client in [images.ts](file:///Users/kutay/code/catter/src/lib/images.ts).
2. **Database Mutation**: Pushes posts, keywords, and tags to PostgreSQL using Drizzle ORM queries (`onConflictDoUpdate`).
3. **Instant Cache Revalidation (ISR)**: The API executes Next.js's `revalidatePath(...)` to flush cached statically generated outputs on the server.
   ```typescript
   revalidatePath("/projects");
   revalidatePath(`/posts/${slug}`);
   revalidatePath(`/${post.shortened}`);
   revalidatePath("/tags", "layout");
   revalidatePath("/posts/page/[id]", "page");
   revalidatePath("/", "page");
   revalidatePath("/feed.xml");
   ```
   This invalidates all current cached versions instantly, forcing the server to rebuild only the updated pages on the next hit. The website remains 100% statically fast while updating instantly when the author edits in Obsidian.

---

## ☁Deployment on Coolify

[Coolify](https://coolify.io) is a self-hosted Heroku/Vercel alternative. Because Catter utilizes Bun for installs/builds and exports Next.js standalone server bundles, it uses a custom multi-stage **Dockerfile** deployment.

### Deployment Engine: The Dockerfile

Coolify will automatically ingest and build using the root [Dockerfile](file:///Users/kutay/code/catter/Dockerfile). The process works as follows:

1. **`deps` Stage**: Launches on `oven/bun:latest`. Installs all development and production dependencies using `bun install --frozen-lockfile`.
2. **`builder` Stage**: Copies dependency caches and sources, sets variables (`NODE_ENV=production`, `BUILDING=true`, `NEXT_TELEMETRY_DISABLED=1`), and applies database schemas directly during build using `bun run db:push` if a `POSTGRES_URL` is detected. Then compiles Next.js via `bun run build`.
3. **`runner` Stage**: Transitions to a slim `node:20-slim` runtime. Creates a secure non-root OS user `nextjs`, extracts built output traces (`.next/standalone` and `.next/static`), opens port `3000`, and starts the server via:
   ```bash
   node server.js
   ```

### Coolify Configuration Checklist

To deploy Catter inside Coolify, create a new **Private Repository / Git Resource** and apply these specifications:

1. **Build Pack**: Set to `Dockerfile`.
2. **Health Check Endpoint**: Set the path to `/api/health` and port to `3000` (Coolify checks container statuses via this endpoint).
3. **Environment Variables**:
   Ensure the following environment variables are specified in Coolify's environment panel:

   | Variable                      | Description                                  | Example Value                                |
   | :---------------------------- | :------------------------------------------- | :------------------------------------------- |
   | `POSTGRES_URL`                | PostgreSQL connection endpoint               | `postgresql://user:password@pg-host:5432/db` |
   | `REDIS_URL`                   | Redis connection endpoint                    | `redis://user:password@redis-host:6379`      |
   | `SITE_URL`                    | Full address URL of the website              | `https://www.mkutay.dev`                     |
   | `AUTH_SECRET`                 | Secret key used by Auth.js to crypt sessions | _Generate a random base64 string_            |
   | `UPLOAD_API_KEY`              | Key allowed to push assets / write posts     | _A unique secret key of your choice_         |
   | `MINIO_ENDPOINT`              | Hostname of S3/MinIO service                 | `https://s3.eu-central.amazonaws.com`        |
   | `MINIO_ACCESS_KEY`            | Access key credentials                       | _Access Key ID_                              |
   | `MINIO_SECRET_KEY`            | Secret access key credentials                | _Secret Access Key_                          |
   | `MINIO_REGION`                | Geographic S3 deployment region              | `eu-central`                                 |
   | `S3_BUCKET_NAME`              | S3 asset folder container bucket             | `catter-assets`                              |
   | `GITHUB_OAUTH_CLIENT_ID`      | OAuth credentials for Github auth            | _Github App Client ID_                       |
   | `GITHUB_OAUTH_CLIENT_SECRET`  | OAuth secret for Github auth                 | _Github App Client Secret_                   |
   | `DISCORD_OAUTH_CLIENT_ID`     | OAuth credentials for Discord auth           | _Discord App Client ID_                      |
   | `DISCORD_OAUTH_CLIENT_SECRET` | OAuth secret for Discord auth                | _Discord App Client Secret_                  |
   | `SPOTIFY_OAUTH_CLIENT_ID`     | OAuth credentials for Spotify auth           | _Spotify App Client ID_                      |
   | `SPOTIFY_OAUTH_CLIENT_SECRET` | OAuth secret for Spotify auth                | _Spotify App Client Secret_                  |

---

_This guide is maintained continuously. If you introduce new packages or schemas, please keep this file updated._
