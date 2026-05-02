# Catter

This is a minimal and responsive blog created with [Next.js](https://nextjs.org), [MDX](https://github.com/ipikuka/next-mdx-remote-client), [TailwindCSS](https://tailwindcss.com/), [Shadcn's UI](https://ui.shadcn.com/) components, and [Drizzle ORM](https://orm.drizzle.team/). Catter

- is beautifully designed with colours from [Catppuccin](https://github.com/catppuccin/catppuccin),
- has support for Markdown and MDX,
- has a custom designed comment system,
- has view counter for every post,
- has a page where anyone on the internet can sign and mark their presence,
- has shortened URL support for every post,
- has an RSS feed,
- supports MinIO/S3 for image hosting,
- has LaTeX support in markdown,
- has a page for projects you do,
- has a system for tags for posts,
- uses [CodeHike](https://codehike.org/) for beautifully designed code blocks.

See my [blog](https://www.mkutay.dev) for a working example that is based on this repository.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Copy `.env.example` and populate `.env.local`. Use GitHub, Discord, and Spotify OAuth for guestbook and comments. Add your Postgres database URL, `AUTH_SECRET`, `AUTH_REDIRECT_PROXY_URL`, and `SITE_URL`. For image hosting, also fill in the MinIO/S3 variables (`MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_REGION`, `S3_BUCKET_NAME`, `UPLOAD_API_KEY`).

After setting up your database, run the migrations:

```bash
bun run db:migrate
```

Change the values in `src/config/site.ts` to change the config of your site. Importantly, add your email to `admins` to access the admin page on your site, where you can delete comments and guestbook entries.

## Deploying

You can fork this repository and add it to Vercel manually, or you can use the following button.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmkutay%2Fcatter)

## Contributing

Any and all contributions are welcome as a pull request. You can also open an issue if you have any questions or problems.
